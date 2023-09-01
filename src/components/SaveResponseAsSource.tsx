import { Fragment, useRef, useState } from 'react';
import Modal from '../Modal';
import { SERVER_ADDRESS } from '@/types/constants';
import axios from 'axios';
import Card from './UI/Card';

type SaveResponseAsSourceProps = {
	question: string;
	answer: string;
};
export default function SaveResponseAsSource({
	question,
	answer,
}: SaveResponseAsSourceProps) {
	const [prompt, setPrompt] = useState(question);
	const [response, setResponse] = useState(answer);
	const [saveStatus, setSaveStatus] = useState(0);

	const handleSubmit = async () => {
		setSaveStatus(1);
		try {
			const post = await axios.post(`${SERVER_ADDRESS}/process_qa`, {
				prompt,
				response,
			});
			if (post.status === 200) {
				setSaveStatus(2);
			}
		} catch (error) {
			console.error('Error saving data:', error);
		}
		setTimeout(() => {
			setSaveStatus(0);
		}, 2000);
	};

	return (
		<Modal
			icon="edit"
			text="Add to database"
			className="group flex items-center rounded-md !bg-theme_primary-700 hover:bg-theme_primary-600 !py-2 !px-4 shadow-sm text-white"
			iconClassName="ml-1 h-6 w-6 stroke-2 group-hover:stroke-white stroke-white"
		>
			<div className="p-4 bg-gray-100 rounded-lg">
				<h2 className="text-2xl font-bold text-gray-700 mb-4">
					Save as New Source
				</h2>
				<Card className="!p-0">
					<input
						type="text"
						name="question"
						id="question"
						className="p-2 prose block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
						placeholder="Question"
						onChange={(e) => setPrompt(e.target.value)}
						value={prompt}
					/>
				</Card>

				<Card className="!p-0 ">
					<textarea
						name="answer"
						id="answer"
						className="prose p-2 block w-full shadow-sm sm:text-sm border-transparent rounded-md"
						rows={10}
						placeholder="Answer"
						value={response}
						onChange={(e) => setResponse(e.target.value)}
					></textarea>
				</Card>

				<button
					className={`mt-4 px-4 py-2 text-white rounded-md focus:outline-none ${saveStatus === 0
						? 'bg-theme_primary-700 hover:bg-theme_primary-600'
						: saveStatus === 1
							? 'bg-theme_primary-700 hover:bg-theme_primary-600'
							: saveStatus === 2
								? 'bg-theme_primary-700 hover:bg-theme_primary-600'
								: 'bg-rose-700 hover:bg-rose-600'
						}`}
					onClick={() => handleSubmit()}
				>
					{saveStatus === 0 && 'Add Source to Database'}
					{saveStatus === 1 && 'Saving...'}
					{saveStatus === 2 && 'Saved!'}
				</button>
			</div>
		</Modal>
	);
}
