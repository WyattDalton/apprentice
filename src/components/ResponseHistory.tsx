import { Fragment, useEffect, useRef, useState } from 'react';
import Modal from '../Modal';

import Card from './UI/Card';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Transition } from '@headlessui/react';

type ResponseHistoryProps = {
	history: any[];
	setHistory: any;
	conversation: any;
	setConversation: any;
	conversationIndex: number;
};

export default function ResponseHistory({
	history,
	setHistory,
	conversation,
	setConversation,
	conversationIndex,
}: ResponseHistoryProps) {
	// Set the item at the history index as the "answer" of the conversation
	const handleRollback = (historyIndex: number) => {
		const updatedHistory = [...history];
		const selectedHistory = updatedHistory.splice(historyIndex, 1);
		updatedHistory.push(selectedHistory[0]);

		setHistory(updatedHistory);

		const newConversation = [...conversation];
		newConversation[conversationIndex].answer = selectedHistory[0];
		newConversation[conversationIndex].history = updatedHistory;
		setConversation(newConversation);
	};

	return (
		<Modal
			icon="edit"
			text="History"
			className="group flex items-center rounded-md bg-theme_primary-700 hover:bg-theme_primary-600 py-2 px-4 shadow-sm text-white"
			iconClassName="ml-1 h-6 w-6 stroke-2 group-hover:stroke-white stroke-white"
		>
			<div className="p-4 bg-gray-100 rounded-lg">
				<h2 className="text-2xl font-bold text-gray-700 mb-4">
					Response History
				</h2>
				{!!history &&
					history.map((item, index) => (
						<div key={index}>
							<Card className="p-0">
								<div className="p-4 flex flex-col gap-4 relative">
									<span className="absolute top-1 right-1 w-6 h-6 flex justify-center items-center text-xs font-semibold text-white bg-theme_primary-700 rounded-lg">
										{index + 1}
									</span>
									<ReactMarkdown
										className="mt-2"
										linkTarget="_blank"
										transformLinkUri={null} // Disable link transformation
										skipHtml={false}
										rehypePlugins={[rehypeRaw]}
									>
										{item}
									</ReactMarkdown>

									{/* if the item is last in the array */}
									{index === history.length - 1 && (
										<span className="text-gray-500 border-2 border-gray-500 font-semibold flex items-center justify-center rounded-md py-2">
											Current Item
										</span>
									)}
									{index !== history.length - 1 && (
										<button
											onClick={() => handleRollback(index)}
											className="flex items-center justify-center rounded-md bg-theme_primary-700 hover:bg-theme_primary-600 py-2 px-4 shadow-sm text-white"
										>
											Restore Response
										</button>
									)}
								</div>
							</Card>
						</div>
					))}
			</div>
		</Modal>
	);
}
