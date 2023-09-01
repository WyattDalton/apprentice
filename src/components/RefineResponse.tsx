import Card from './UI/Card';
import { SERVER_ADDRESS } from '@/types/constants';
import { Transition } from '@headlessui/react';
import { ArrowUpCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useCallback, useEffect, useRef, useState } from 'react';
import LoadingText from './LoadingText';

type RefineResponseProps = {
	index: number;
	setConversation: any;
	conversation: any[];
	settings: any;
	handleDisplay: any;
	tokens: number;
	handleTokensChange: any;
};

const RefineResponse = ({
	index,
	conversation,
	setConversation,
	settings,
	handleDisplay,
	tokens,
	handleTokensChange
}: RefineResponseProps) => {
	const refineBar = useRef(null);
	const [history, setHistory] = useState<any[]>([]);
	const [refinedSettings, setRefinedSettings] = useState(settings);
	const [prompt, setPrompt] = useState('');
	const [error, setError] = useState('');
	const [refining, setRefining] = useState<boolean>(false);

	const handleRefineResponse = useCallback(async () => {
		try {
			if (!prompt) {
				setError('How should I change the response?');
				return;
			} else {
				setError('');
			}
			setRefining(true);

			// Get current conversation data
			const current = conversation[index];
			const currentMessage = current.answer;

			// Set response history
			setHistory([...history, currentMessage]);
			current.messages = [
				...current.messages,
				{ content: `${currentMessage}`, role: 'assistant' },
			];

			// Format prompt for API
			let refineMessage = {
				content: `Use this as your source text: ${currentMessage} \n\n Refine the with the following notes: ${prompt}`,
				role: 'user',
			};

			setPrompt('');

			const response = await fetch(`${SERVER_ADDRESS}/refine_response`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					prompt: refineMessage,
					messages: current.messages,
					settings: refinedSettings,
				}),
			});

			if (!response.ok) {
				throw new Error('Something went wrong!');
			}

			const body = response.body as any;
			const reader = body.getReader();

			const readChunks = async () => {
				while (true) {
					const { done, value } = await reader.read();
					const c = [...conversation];
					if (done) {
						c[index].history.push(c[index].answer);
						setConversation(c);
						break;
					}

					// get the string value of the chunk
					const decodedValue = new TextDecoder('utf-8').decode(value);

					try {
						const parsedChunk = JSON.parse(decodedValue);

						if (!!parsedChunk.partial) {
							current.partial = (current.partial || '') + parsedChunk.partial;
							current.answer = (current.partial || '') + parsedChunk.partial;
						}
						if (
							!!parsedChunk.usage
						) {
							const remainingTokens = tokens - parsedChunk.usage;
							handleTokensChange(remainingTokens as number);
						}
						if (!!parsedChunk.answer) {
							current.answer = parsedChunk.answer;
							current.partial = '';
						}

						c[index] = current;

						setConversation(c);
						handleDisplay(index, false);
						setRefining(false);
					} catch (error) {
						// console.error('Error parsing JSON chunk:', error);
					}
				}
			};

			readChunks();

			// Non-streaming code below
			// Send prompt to API
			// const response = await axios.post(`${SERVER_ADDRESS}/refine_response`, {
			//   prompt: refineMessage,
			//   messages: current.messages,
			//   settings: refinedSettings,
			// });

			// Set response data
			// if (response.status === 200) {
			//   current.answer = response.data.answer;
			//   // Set conversation with response
			//   const c = [...conversation];
			//   c[index] = current;
			//   setConversation(c);
			//   setDisplay(!display);
			//   setTimeout(() => {
			//     setEnableRefineResponse(!enableRefineResponse);
			//   }, 300);
			//   setRefining(false);
			// } else {
			//   setError('Sorry, something went wrong!');
			//   setRefining(false);
			// }
		} catch (err: any) {
			setError('Sorry, something went wrong!');
			setRefining(false);
		}
	}, [
		conversation,
		index,
		refinedSettings,
		setConversation,
		handleDisplay,
		prompt,
		history,
	]);

	// Handle enter key press
	const handleEnter = useCallback(
		async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
			if (event.key === 'Enter' && !event.shiftKey) {
				event.preventDefault();
				await handleRefineResponse(); // Updated function name
			}
		},
		[handleRefineResponse]
	);

	// Handle prompt change
	useEffect(() => {
		if (refineBar.current) {
			const field = refineBar.current as any;
			// We need to reset the height momentarily to get the correct scrollHeight for the textarea
			field.style.height = '0px';
			const scrollHeight = field.scrollHeight;

			// We then set the height directly, outside of the render loop
			// Trying to set this with state or a ref will produce an incorrect value.
			field.style.height = scrollHeight + 'px';
		}
	}, [refineBar, prompt]);

	// Render
	return (
		<>
			<Transition
				as={'div'}
				enter="transition ease-out duration-200"
				enterFrom="opacity-0 -translate-y-1"
				enterTo="opacity-100 translate-y-0"
				leave="transition ease-in duration-150"
				leaveFrom="opacity-100 translate-y-0"
				leaveTo="opacity-0 -translate-y-1"
				show={!![...conversation][index]['refine'] ? true : false}
			>
				<div className="flex flex-col prose w-full my-4 gap-2">
					<div className="flex flex-col gap-2 w-full">
						<Card className="prose p-0 mb-0 ">
							<textarea
								className="w-full px-2 py-1 mb-0 rounded-lg outline-none break-words resize-none"
								placeholder="How should I change the response?"
								name="search"
								onChange={(e) => setPrompt(e.target.value)}
								rows={1}
								value={prompt}
								ref={refineBar}
								onKeyDown={(e) => handleEnter(e)}
							></textarea>
						</Card>
						{!!error && (
							<p className="m-0 text-red-500 text-lg font-semibold">{error}</p>
						)}
					</div>
					<div className="flex flex-row-reverse items-end gap-2">
						<button
							onClick={() => handleRefineResponse()}
							className="group w-max h-max font-semibold text-sm flex items-center gap-2 rounded-lg bg-theme_primary-700 hover:bg-theme_primary-600 py-1 px-2 text-white !mt-0 border-2 border-theme_primary-700 hover:border-theme_primary-600"
						>
							{refining ? (
								<LoadingText
									text="Refining"
									className="!text-white gap-2"
									iconClassName="!text-white order-last !mr-0"
								/>
							) : (
								<>
									Regenerate{' '}
									<ArrowUpCircleIcon className="w-5 h-5 stroke-white stroke-2" />
								</>
							)}
						</button>
						<button
							onClick={() => handleDisplay(index, false)}
							className="group text-sm w-max flex gap-2 items-center justify-center h-max py-1 px-2 !mt-0 bg-transparent border-gray-700 rounded-lg border-2"
						>
							Cancel{''}
							<XMarkIcon className="w-5 h-5 stroke-gray-700 stroke-2" />
						</button>
					</div>
				</div>
			</Transition>
		</>
	);
};

export default RefineResponse;
