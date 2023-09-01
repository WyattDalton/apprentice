import { TrashIcon, PencilSquareIcon, XMarkIcon } from '@heroicons/react/24/outline';
import SourceItemEditButton from './SourceItemEditButton';
import SourceItemDeleteButton from './SourceItemDeleteButton';
import { SERVER_ADDRESS } from '@/types/constants';
import axios from 'axios';
import { useState } from 'react';
import { type } from 'os';

type SourceItemActionsProps = {
	className?: string;
	item: any;
	handleDelete: (id: string) => void;
};

const SourceItemActions = ({
	className,
	item,
	handleDelete,
}: SourceItemActionsProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [value, setValue] = useState(item.text);
	const [saveStatus, setSaveStatus] = useState(0);

	const toggleEditItem = () => {
		setIsOpen((prevState) => !prevState);
	};

	const handleChange = (event: any) => {
		setValue(event.target.value);
	};

	const handleEditItem = async () => {
		try {
			setSaveStatus(1);
			const response = await axios.post(`${SERVER_ADDRESS}/edit_source`, {
				id: item._id,
				value: value,
			});
			if (response.status === 200) {
				setSaveStatus(2);
			}
			setTimeout(() => {
				setSaveStatus(0);
			}, 1000);
		} catch (error) {
			console.log(error);
			setSaveStatus(3);
		}
	};

	return (
		<>
			<div className={className}>
				<SourceItemEditButton
					className=" bg-transparent opacity-0 group-hover:opacity-100 ml-2"
					openIcon={<PencilSquareIcon className="w-4 h-4 stroke-theme_primary-700" />}
					closeIcon={<XMarkIcon className="w-4 h-4 stroke-gray-700" />}
					toggleOpen={toggleEditItem}
					isOpen={isOpen}
				/>

				<SourceItemDeleteButton
					className=" ml-2"
					item={item}
					handleDelete={handleDelete}
					icon={<TrashIcon className="w-4 h-4 stroke-theme_primary-700" />}
				/>
			</div>
			{isOpen && (
				<div className="order-last w-full gap-3 flex flex-wrap justify-end">
					<textarea
						className="prose px-4 py-2 bg-white rounded-lg border-2 border-gray-300 w-full"
						value={value}
						onChange={handleChange}
						rows={12}
					></textarea>

					<button
						className="bg-transparent border-2 text-sm rounded-lg px-2 py-2 border-transparent text-gray-700 hover:text-rose-700"
						onClick={toggleEditItem}
					>
						Close
					</button>
					<button
						className={`bg-transparent border-2 text-sm rounded-lg px-4 py-2 ml-2 ${saveStatus === 0
							? 'border-theme_primary-700 text-theme_primary-700'
							: saveStatus === 1
								? 'border-theme_primary-700 text-theme_primary-700'
								: saveStatus === 2
									? 'border-green-700 text-green-700'
									: saveStatus === 3
										? 'border-rose-700 text-rose-700'
										: 'border-rose-700 text-rose-700'
							}`}
						onClick={handleEditItem}
					>
						{saveStatus === 0
							? 'Save'
							: saveStatus === 1
								? 'Saving...'
								: saveStatus === 2
									? 'Saved!'
									: 'Error'}
					</button>
				</div>
			)}
		</>
	);
};

export default SourceItemActions;
