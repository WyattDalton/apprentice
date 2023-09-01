import { SERVER_ADDRESS } from '@/types/constants';
import {
	AdjustmentsHorizontalIcon,
	ForwardIcon,
	ClipboardDocumentIcon,
	ArrowPathIcon,
	BeakerIcon,
	XMarkIcon,
} from '@heroicons/react/24/outline';
import axios from 'axios';
import EditResponse from './SaveResponseAsSource';
import SourceDisplay from './SourceDisplay';
import { Fragment, useState } from 'react';
import SaveResponseAsSource from './SaveResponseAsSource';
import { Transition } from '@headlessui/react';
import { add } from 'lodash';
import ResponseHistory from './ResponseHistory';

type ResponseActionsProps = {
	question: string;
	answer: string;
	sources: string[];
	messages: any;
	index: number;
	conversation: any;
	setConversation: any;
	history: any;
	setHistory: any;
	handleRefineDisplay: any;
	tokens: number;
	handleTokensChange: any;
};

const ResponseActions = ({
	question,
	answer,
	sources,
	messages,
	index,
	conversation,
	setConversation,
	history,
	setHistory,
	handleRefineDisplay,
	tokens,
	handleTokensChange
}: ResponseActionsProps) => {
	const [copySuccess, setCopySuccess] = useState(false);
	const [enable, setEnable] = useState(false);

	// function to handle the continue generating button
	const handleContinueGenerating = async (
		answer: any,
		messages: any,
		index: number
	) => {
		const response = await fetch(`${SERVER_ADDRESS}/continue_generating`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				continue_prompt: answer,
				messages: JSON.stringify(messages),
			}),
		});

		if (!response.ok) {
			throw new Error('Something went wrong!');
		}
		const body = response.body as any;
		const reader = body.getReader();

		const newConversation = [...conversation];
		const baseResponse = newConversation[index].answer;

		const readChunks = async () => {
			while (true) {
				const { done, value } = await reader.read();
				if (done) {
					const historyIndex =
						Object.keys(newConversation[index].history).length - 1;

					newConversation[index].history[historyIndex] =
						newConversation[index].answer;
					setConversation([...newConversation]);

					break;
				}

				const decodedValue = new TextDecoder('utf-8').decode(value);

				try {
					const parsedChunk = JSON.parse(decodedValue);

					if (!!parsedChunk.usage) {
						const remainingTokens = tokens - parsedChunk.usage;
						handleTokensChange(remainingTokens as number);
					}

					const updatedAnswer = baseResponse + parsedChunk.answer;
					newConversation[index].answer = updatedAnswer;

					newConversation[index].messages = parsedChunk.messages;

					setConversation([...newConversation]);
				} catch (error) {
					// console.error('Error parsing JSON chunk:', error);
				}
			}
		};

		readChunks();
	};

	// function to handle the copy response button
	const handleCopyResponse = (index: number) => {
		const newConversation = [...conversation];

		navigator.clipboard
			.writeText(newConversation[index].answer)
			.then(() => {
				setCopySuccess(true);
				setTimeout(() => {
					setCopySuccess(false);
				}, 3000); // Reset the copy success message after 3 seconds
			})
			.catch((error) => {
				console.error('Error copying text:', error);
			});
	};

	return (
		<div className="transition-all duration-300 ease-in-out opacity-0 group-hover/actions:opacity-100 rounded-lg p-2 absolute bottom-0 right-0 flex flex-col justify-end items-end gap-2">
			<Transition
				as={'div'}
				enter="transition ease-out duration-200"
				enterFrom="opacity-0 translate-y-1"
				enterTo="opacity-100 translate-y-0"
				leave="transition ease-in duration-150"
				leaveFrom="opacity-100 translate-y-0"
				leaveTo="opacity-0 translate-y-1"
				show={enable}
			>
				<div className="flex flex-col justify-end items-end gap-2">
					{/* Response History */}
					<ResponseHistory
						history={history}
						setHistory={setHistory}
						conversation={conversation}
						setConversation={setConversation}
						conversationIndex={index}
					/>

					{/* Refine button */}
					<button
						onClick={() => handleRefineDisplay(index)}
						className="group flex items-center rounded-md bg-theme_primary-700 hover:bg-theme_primary-600 px-2 py-2 px-4 shadow-sm text-white"
					>
						<span>Refine</span>
						<ArrowPathIcon className="ml-1 h-6 w-6 stroke-2 group-hover:stroke-white stroke-white" />
					</button>

					{/* Continue generating button */}
					<button
						onClick={() => handleContinueGenerating(answer, messages, index)}
						className="group flex items-center rounded-md bg-theme_primary-700 hover:bg-theme_primary-600 px-2 py-2 px-4 shadow-sm text-white"
					>
						<span>Continue Generating</span>
						<ForwardIcon className="ml-1 h-6 w-6 stroke-2 group-hover:stroke-white stroke-white" />
					</button>

					{/* Save response as source button */}
					<SaveResponseAsSource question={question} answer={answer} />

					{/* Show sources if there are any */}
					{!!sources && <SourceDisplay name="Sources" sources={sources} />}

					{/* Copy button */}
					<button
						onClick={() => handleCopyResponse(index)}
						className="group flex items-center rounded-md bg-theme_primary-700 hover:bg-theme_primary-600 px-2 py-2 px-4 shadow-sm text-white"
					>
						<span>{copySuccess ? 'Copied!' : 'Copy'}</span>
						<ClipboardDocumentIcon className="ml-1 h-6 w-6 stroke-2 group-hover:stroke-white stroke-white" />
					</button>

					{/* Create Campaign button */}
					{/* <button className="group flex items-center rounded-md bg-theme_primary-700 hover:bg-theme_primary-600 px-2 py-2 px-4 shadow-sm text-white">
                        <span>Create Campaign</span>
                        <BeakerIcon className="ml-1 h-6 w-6 stroke-2 group-hover:stroke-white stroke-white" />
                    </button> */}
				</div>
			</Transition>

			{!enable && (
				<button className="bg-transparent" onClick={() => setEnable(true)}>
					<AdjustmentsHorizontalIcon className="h-6 w-6 text-gray-700 hover:text-gray-900" />
				</button>
			)}
			{enable && (
				<button onClick={() => setEnable(false)} className="bg-transparent">
					<XMarkIcon className="h-6 w-6 stroke-2 stroke-gray-700" />
				</button>
			)}
		</div>
	);
};

export default ResponseActions;
