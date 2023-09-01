import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import LoadingText from './LoadingText';
import {
	ArrowRightCircleIcon,
	UserCircleIcon,
} from '@heroicons/react/24/outline';
import Card from './UI/Card';
import Modal from './Modal';
import ResponseActions from './ResponseActions';
import RefineResponse from './RefineResponse';
import PromptSettings from './GeneratorSettings';
import rehypeRaw from 'rehype-raw';

type PromptAndResponseProps = {
	settings: any;
	handleSetPromptSettings: (settings: any) => void;
	toneLibrary: any[];
	formulaLibrary: any[];
	tokens: number;
	handleTokensChange: (tokens: number) => void;
};

function PromptAndResponse(props: PromptAndResponseProps) {
	const searchBarRef = useRef({} as any);
	const [prompt, setPrompt] = useState('');
	const [answerError, setAnswerError] = useState('');
	const [searchResultsLoading, setSearchResultsLoading] =
		useState<boolean>(false);
	const [conversation, setConversation] = useState([]);
	const [enableRefineResponse, setEnableRefineResponse] = useState(false);
	const [history, setHistory] = useState<any[]>([]);


	useEffect(() => {
		if (searchBarRef.current) {
			const field = searchBarRef.current as any;
			field.style.height = '0px';
			const scrollHeight = field.scrollHeight;
			field.style.height = scrollHeight + 'px';
		}
	}, [searchBarRef, prompt]);

	// function to handle the search bar input
	const handleSearch = useCallback(
		async (data: any) => {
			if (searchResultsLoading) {
				return;
			}

			const question = searchBarRef.current?.value.trim();

			if (!question) {
				setAnswerError('Provide a prompt!');
				return;
			}

			setSearchResultsLoading(true);
			setAnswerError('');
			searchBarRef.current.value = '' as any;
			setPrompt(searchBarRef.current.value as any);

			try {
				const response = await fetch(`/api/generate_response`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						question,
						settings: data,
					}),
				});

				if (!response.ok) {
					throw new Error('Something went wrong!');
				}

				const body = response.body as any;
				const reader = body.getReader();
				let newConversation = {} as any;

				const processChunk = async (chunk: Uint8Array) => {
					const decodedValue = new TextDecoder('utf-8').decode(chunk);
					try {
						const parsedChunk = JSON.parse(decodedValue);
						const updateConversation = [...conversation] as any;
						const index = conversation.length;

						if (!!parsedChunk.usage) {
							const remainingTokens = props.tokens - parsedChunk.usage;
							props.handleTokensChange(remainingTokens as number);
						}

						if (!!parsedChunk.question && parsedChunk.question !== newConversation.question)
							newConversation['question'] = parsedChunk.question;

						if (!!parsedChunk.partial) {
							const partial = (newConversation['partial'] || '') + parsedChunk.partial;
							newConversation['partial'] = partial;
							newConversation['answer'] = partial;
						}
						if (!!parsedChunk.answer && parsedChunk.answer !== newConversation.answer) {
							newConversation['answer'] = parsedChunk.answer;
							newConversation['partial'] = '';
						}

						if (!!parsedChunk.sources && parsedChunk.sources !== newConversation.sources)
							newConversation['sources'] = parsedChunk.sources;

						if (!!parsedChunk.messages && parsedChunk.messages !== newConversation.messages)
							newConversation['messages'] = parsedChunk.messages;

						newConversation['refine'] = false;

						updateConversation[index] = newConversation;
						setConversation(updateConversation);
					} catch (error) { }
				};

				const readChunks = async () => {
					while (true) {
						const { done, value } = await reader.read();

						if (!done) {
							await processChunk(value);  // Process each chunk as it's read
						} else {
							const updateConversation = [...conversation] as any;
							const index = conversation.length;
							newConversation['partial'] = ''
							newConversation['history'] = [newConversation.answer];
							updateConversation[index] = newConversation;
							setConversation(updateConversation);
							break;
						}
					}
				};

				await readChunks();  // Wait for all chunks to be read and processed
			} catch (error) {
				console.error('Error:', error);
			}

			setSearchResultsLoading(false);
		},
		[searchResultsLoading, conversation]
	);

	// Dislpay or hide the refinement textarea
	const handleRefineDisplay = (index: number, forceClose = true) => {
		setConversation((prevConversation) => {
			const con = [...prevConversation];
			const element = con[index] as any;

			if (!forceClose) {
				element.refine = false;
				return con;
			}

			if (!element.hasOwnProperty('refine')) {
				element.refine = true;
			} else {
				element.refine = !element.refine;
			}

			return con;
		});
	};

	const handleEnterInSearchBar = useCallback(
		async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
			if (event.key === 'Enter' && !event.shiftKey) {
				event.preventDefault();
				await handleSearch(props.settings);
			}
		},
		[handleSearch, props.settings]
	);

	return (
		<div className="space-y-8 text-gray-800 ">
			{conversation.map(
				(
					{ question, answer, sources, messages, history, refine }: any,
					index
				) => (
					<div
						key={index}
						className="relative m-y-8 mx-auto shadow-lg rounded-lg bg-gray-50 hover:bg-gray-50 p-4"
					>
						<div className="flex flex-col md:flex-row justify-start items-center rounded-lg gap-5 p-2 mb-5 bg-theme_primary-700/10 prose mx-auto">
							<UserCircleIcon className="h-12 w-12 min-w-100 text-gray-700" />
							{/* limit question to 20 words. after 20 words, add ... */}
							{!!question && question.split(' ').length > 20 ? (
								<div className="flex flex-col">
									<ReactMarkdown className="mt-0 prose">
										{question.split(' ').slice(0, 20).join(' ').concat('...')}
									</ReactMarkdown>
									<Modal
										text="Show Full Prompt"
										className="!bg-transparent text-left shadow-none block w-max"
									>
										<ReactMarkdown className="mt-0 prose">
											{question}
										</ReactMarkdown>
									</Modal>
								</div>
							) : (
								<ReactMarkdown className="mt-0 prose">{question}</ReactMarkdown>
							)}
						</div>

						<div className="flex flex-col prose mx-auto relative group/actions">
							<ReactMarkdown
								className="mt-0"
								linkTarget="_blank"
								transformLinkUri={null}
								skipHtml={false}
								rehypePlugins={[rehypeRaw]}
							>
								{answer}
							</ReactMarkdown>

							{!!refine && (
								<RefineResponse
									index={index}
									conversation={conversation}
									setConversation={setConversation}
									handleDisplay={handleRefineDisplay}
									settings={props.settings}
									tokens={props.tokens}
									handleTokensChange={props.handleTokensChange}
								/>
							)}

							{!refine && (
								<ResponseActions
									sources={sources}
									messages={messages}
									question={question}
									answer={answer}
									conversation={conversation}
									setConversation={setConversation}
									index={index}
									history={history}
									setHistory={setHistory}
									handleRefineDisplay={handleRefineDisplay}
									tokens={props.tokens}
									handleTokensChange={props.handleTokensChange}
								/>
							)}
						</div>
					</div>
				)
			)}

			<div className="space-y-4 flex flex-col items-end gap-2 align-start jus">
				<Card className="!shadow-md !mb-0 w-full border border-2 border-gray-200 p-2 overflow-hidden">
					<textarea
						className="w-full outline-none break-words resize-none"
						placeholder="What should we create today?"
						name="prompt"
						onChange={(e) => setPrompt(e.target.value)}
						ref={searchBarRef}
						rows={1}
						value={prompt}
						onKeyDown={handleEnterInSearchBar}

					></textarea>
				</Card>
				<div className='flex flex-row justify-between items-center text-gray-400'>
					<p className='text-sm'>Available tokens: {props.tokens}</p>
				</div>

				<div className="flex flex-row items-start gap-2 justify-between w-full">
					<PromptSettings
						handleSetPromptSettings={props.handleSetPromptSettings}
						promptSettings={props.settings}
						toneLibrary={props.toneLibrary}
						formulaLibrary={props.formulaLibrary}
					/>

					<button
						className="group w-max font-semibold flex items-center rounded-lg bg-theme_primary-700 hover:bg-theme_primary-600 px-2 py-2 px-4 text-white !mt-0"
						onClick={() => handleSearch(props.settings)}
					>
						{searchResultsLoading ? (
							<LoadingText
								text="Fetching"
								className="!text-white gap-2"
								iconClassName="!text-white order-last !mr-0"
							/>
						) : (
							<>
								Generate{' '}
								<ArrowRightCircleIcon className="h-6 w-6 ml-1 stroke-2" />
							</>
						)}
					</button>
				</div>
			</div>

			{answerError && (
				<div className="font-semibold !mt-2 text-rose-700 text-lg">
					{answerError}
				</div>
			)}
		</div>
	);
}

export default memo(PromptAndResponse);
