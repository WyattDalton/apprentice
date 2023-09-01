import { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
	ExclamationTriangleIcon,
	BookOpenIcon,
	MagnifyingGlassIcon,
	PlusIcon,
	PencilSquareIcon,
	MegaphoneIcon,
	SparklesIcon,
	AcademicCapIcon,
} from '@heroicons/react/24/outline';

type ModalProps = {
	children: React.ReactNode;
	icon?: string;
	className?: string;
	iconClassName?: string;
	text?: string;
	footer?: boolean;
};

export default function Modal({
	children,
	icon,
	className,
	iconClassName,
	text,
	footer = false,
}: ModalProps) {
	const [open, setOpen] = useState(false);
	const cancelButtonRef = useRef(null);

	// if icon = 'plus' then use PlusIcon, if icon = 'edit' then use PencilSquareIcon, if icon = 'search' then use MagnifyingGlassIcon, if icon = 'template' then use SparklesIcon, if icon = 'tone' then use MegaphoneIcon, if icon = 'warning' then use ExclamationTriangleIcon
	const IconComponent =
		icon === 'plus'
			? PlusIcon
			: icon === 'edit'
				? PencilSquareIcon
				: icon === 'source'
					? AcademicCapIcon
					: icon === 'template'
						? SparklesIcon
						: icon === 'tone'
							? MegaphoneIcon
							: icon === 'warning'
								? ExclamationTriangleIcon
								: icon === 'book'
									? BookOpenIcon
									: false;
	return (
		<>
			<button
				type="button"
				className={`group flex justify-center items-center rounded-md bg-gray-100 hover:bg-theme_primary-700 px-2 py-0 shadow-sm ${className}`}
				onClick={() => setOpen(true)}
			>
				{text ? text : ''}
				{!!IconComponent && (
					<IconComponent
						className={`h-6 w-6 stroke-theme_primary-700 stroke-2 group-hover:stroke-white ${iconClassName}`}
					/>
				)}
			</button>

			<Transition.Root show={open} as={Fragment}>
				<Dialog
					as="div"
					className="relative z-10"
					initialFocus={cancelButtonRef}
					onClose={setOpen}
				>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
					</Transition.Child>

					<div className="fixed inset-0 z-10 overflow-y-auto">
						<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
								enterTo="opacity-100 translate-y-0 sm:scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 translate-y-0 sm:scale-100"
								leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							>
								<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
									<div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
										{children}
										{!footer && (
											<button
												type="button"
												className="block bg-white mt-2 ml-auto p-2 text-sm font-semibold text-rose-700 border-0"
												onClick={() => setOpen(false)}
												ref={cancelButtonRef}
											>
												close
											</button>
										)}
									</div>

									{footer && (
										<div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
											<button
												type="button"
												className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
												onClick={() => setOpen(false)}
												ref={cancelButtonRef}
											>
												close
											</button>
										</div>
									)}
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
		</>
	);
}
