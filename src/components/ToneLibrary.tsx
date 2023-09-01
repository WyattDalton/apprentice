import Card from './UI/Card';
import { SERVER_ADDRESS } from '@/types/constants';
import { PlusIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const MAX_EXAMPLES = 10;

type ToneOfVoiceLibraryProps = {
	toneLibrary: any;
};

export default function ToneOfVoiceLibrary({
	toneLibrary,
}: ToneOfVoiceLibraryProps) {
	const [tones, setTones] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const [newTone, setNewTone] = useState({
		title: '',
		examples: [],
	});
	const [editingTone, setEditingTone] = useState(null);

	useEffect(() => {
		setTones(toneLibrary);
	}, [toneLibrary]);

	const handleInputChange = (e: any) => {
		setNewTone((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}));
	};

	const handleAddExample = () => {
		if (newTone.examples.length < MAX_EXAMPLES) {
			setNewTone((prevState: any) => ({
				...prevState,
				examples: [...prevState.examples, ''],
			}));
		}
	};

	const handleEditExample = (index: number, value: any) => {
		setNewTone((prevState) => {
			const examples = [...prevState.examples] as any;
			examples[index] = value;
			return {
				...prevState,
				examples,
			};
		});
	};

	const handleDeleteExample = (index: number) => {
		setNewTone((prevState) => {
			const examples = [...prevState.examples];
			examples.splice(index, 1);
			return {
				...prevState,
				examples,
			};
		});
	};

	const handleSubmitTone = async (e: any) => {
		e.preventDefault();

		if (newTone.title.trim() !== '') {
			const updatedTone = { ...newTone } as any;

			if (editingTone !== null) {
				// Editing an existing tone
				setShowForm(false);

				try {
					const response = await axios.post(`${SERVER_ADDRESS}/generate_tone`, {
						title: updatedTone.title,
						examples: updatedTone.examples,
					});

					if (response.status === 200) {
						updatedTone.description = response.data.description;
						setTones((prevState) => {
							const updatedTones = [...prevState] as any;
							updatedTones[editingTone] = updatedTone;
							return updatedTones;
						});
						setEditingTone(null);
					}
				} catch (err) {
					console.log(err);
				}
			} else {
				try {
					// Adding a new tone
					const response = await axios.post(`${SERVER_ADDRESS}/generate_tone`, {
						title: updatedTone.title,
						examples: updatedTone.examples,
					});

					if (response.status === 200) {
						updatedTone.description = response.data.description;
						setTones((prevState) => [...prevState, updatedTone] as any);
					}
				} catch (err) {
					console.log(err);
				}
			}

			setNewTone({ title: '', examples: [] });
			setShowForm(false);
			setEditingTone(null);
		}
	};

	const handleEditTone = (index: any) => {
		setEditingTone(index);
		setNewTone(tones[index]);
		setShowForm(true);
	};

	const handleCancelEdit = () => {
		setEditingTone(null);
		setShowForm(false);
	};

	const handleDeleteTone = (index: any) => {
		try {
			setTones((prevState) => {
				const item = prevState[index] as any;
				axios.post(`${SERVER_ADDRESS}/delete_tone`, { title: item.title });
				const updatedTones = [...prevState];
				updatedTones.splice(index, 1);
				return updatedTones;
			});
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className="w-full p-4 bg-gray-100 rounded-lg shadow-sm">
			{showForm ? (
				<div>
					<h2 className="text-xl font-semibold text-gray-700">
						{editingTone !== null ? 'Edit Tone' : 'Add New Tone'}
					</h2>
					<form className="mt-4" onSubmit={handleSubmitTone}>
						<label htmlFor="title" className="block font-semibold mb-2">
							Title:
						</label>
						<input
							type="text"
							id="title"
							name="title"
							value={newTone.title}
							onChange={handleInputChange}
							className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>

						{newTone.examples.map((example, index) => (
							<div key={index} className="mb-6">
								<label
									htmlFor={`example-${index + 1}`}
									className="block font-semibold mb-2"
								>
									Example {index + 1}:
								</label>
								<textarea
									id={`example-${index + 1}`}
									name={`example-${index + 1}`}
									value={example}
									onChange={(e) => handleEditExample(index, e.target.value)}
									rows={10}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
								<button
									type="button"
									onClick={() => handleDeleteExample(index)}
									className="text-red-500 bg-transparent focus:outline-none"
								>
									Delete Example
								</button>
							</div>
						))}

						<div className="flex justify-between items-center gap-4 flex-wrap">
							{newTone.examples.length < MAX_EXAMPLES && (
								<button
									type="button"
									onClick={handleAddExample}
									className="font-semibold text-theme_primary-700 focus:outline-none w-full p-4 mb-4 rounded-lg bg-transparent border border-theme_primary-700 hover:border-theme_primary-600 hover:text-theme_primary-600 shadow-sm"
								>
									<PlusIcon className="inline-block w-5 h-5 mr-2" />
									{newTone.examples.length === 0
										? 'Add an Example'
										: 'Add Another Example'}
								</button>
							)}
							<button
								type="button"
								onClick={() => handleCancelEdit()}
								className=" px-4 py-2 text-rose-700 border-2 border-rose-700 bg-transparent rounded-md focus:outline-none shadow-sm"
							>
								Cancel
							</button>

							<button
								type="submit"
								className=" px-4 py-2 text-white bg-theme_primary-700 rounded-md focus:outline-none shadow-sm hover:bg-theme_primary-600"
							>
								{editingTone !== null ? 'Save' : 'Generate Tone of Voice'}
							</button>
						</div>
					</form>
				</div>
			) : (
				<div>
					<h2 className="text-2xl font-bold text-gray-700 mb-4">
						Tone of Voice Library
					</h2>
					{tones.length === 0 ? (
						<p className="mt-4">No tones of voice available.</p>
					) : (
						tones.map((tone: any, index: number) => (
							<div key={index} className="mt-4">
								<Card>
									<h3 className="text-lg font-semibold">{tone.title}</h3>
									<div className="font-xs">
										<p>{tone.description}</p>
									</div>
									<button
										type="button"
										onClick={() => handleEditTone(index)}
										className="bg-transparent p-2 text-theme_primary-700 hover:text-theme_primary-600 hover:border-theme_primary-600 focus:outline-none"
									>
										Edit
									</button>
									<button
										type="button"
										onClick={() => handleDeleteTone(index)}
										className="bg-transparent p-2 text-rose-700 hover:text-rose-600 focus:outline-none ml-1"
									>
										Delete
									</button>
								</Card>
							</div>
						))
					)}
					<button
						type="button"
						onClick={() => setShowForm(true)}
						className="mt-4 px-4 py-2 text-white bg-theme_primary-700 hover:bg-theme_primary-600 rounded-md focus:outline-none"
					>
						Add Tone
					</button>
				</div>
			)}
		</div>
	);
}
