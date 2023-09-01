import { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import {
	ChevronDownIcon,
	PhoneIcon,
	PlayCircleIcon,
} from '@heroicons/react/20/solid';
import {
	GlobeAltIcon,
	FolderIcon,
	BookOpenIcon,
} from '@heroicons/react/24/outline';
import Dropdown from '../Dropdown';
import Modal from '../Modal';
import Card from './UI/Card';

type SourceDisplayProps = {
	name: string;
	sources: any;
};

export default function SourceDisplay({ name, sources }: SourceDisplayProps) {
	return (
		<Modal
			icon="book"
			text={name}
			footer={false}
			className="group flex items-center rounded-md !bg-theme_primary-700 hover:bg-theme_primary-600 !py-2 !px-4 shadow-sm text-white"
			iconClassName="ml-1 h-6 w-6 stroke-2 group-hover:stroke-white stroke-white"
		>
			<div className="p-4 bg-gray-100 rounded-lg">
				<h2 className="text-2xl font-bold text-gray-700 mb-4">
					Sources for this Response
				</h2>
				{Object.entries(sources ?? {}).map(
					([filename, { id, score, text }]: any) => (
						<Card key={filename}>
							<Dropdown
								filename={filename}
								content={{ id, score, text }}
								icon={<FolderIcon className="stroke-theme_primary-700" />}
							/>
						</Card>
					)
				)}
			</div>
		</Modal>
	);
}
