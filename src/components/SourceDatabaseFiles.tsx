import React, { useState } from 'react';
import { FolderIcon } from '@heroicons/react/24/outline';
import SourceItemActions from './SourceItemActions';
import { SERVER_ADDRESS } from '@/types/constants';
import axios from 'axios';
import Card from './UI/Card';

type SourceFilesProps = {
	data: any[];
	updateDB: (items: any[]) => void;
};

const SourceFiles = ({ data, updateDB }: SourceFilesProps) => {
	const [items, setItems] = useState(data);
	const [searchQuery, setSearchQuery] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5; // Number of items to display per page

	const handleDelete = async (itemId: any) => {
		try {
			const confirmed = window.confirm(
				'Are you sure you want to delete this item?'
			);
			if (confirmed) {
				// Perform deletion from pineconeindex and MongoDB here

				// Remove the item from the list
				const updatedItems = items.filter((item) => item._id !== itemId);
				setItems(updatedItems);
				updateDB(updatedItems);

				// send delete post to server with item id
				const response = await axios.post(`${SERVER_ADDRESS}/delete_source`, {
					id: itemId,
				});
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleSearch = (event: any) => {
		setCurrentPage(1);
		setSearchQuery(event.target.value);
	};

	const groupAndSortItems = (items: any) => {
		// Group files with shared titles
		const groupedItems = {} as any;
		items.forEach((item: any) => {
			const { title } = item;
			if (!groupedItems[title]) {
				groupedItems[title] = [];
			}
			groupedItems[title].push(item);
		});

		// Sort items within each group by id
		for (const key in groupedItems) {
			groupedItems[key].sort((a: any, b: any) => {
				const numberA = parseInt(a._id.split('--')[1]);
				const numberB = parseInt(b._id.split('--')[1]);
				return numberA - numberB;
			});
		}

		return groupedItems;
	};

	let groupedItems = groupAndSortItems(items);

	const filteredItems = Object.keys(groupedItems).reduce((acc, title): any => {
		if (title.toLowerCase().includes(searchQuery.toLowerCase())) {
			return [...acc, ...groupedItems[title]];
		}
		return acc;
	}, []);

	if (filteredItems.length > 0) {
		groupedItems = groupAndSortItems(filteredItems);
	}

	// Pagination logic
	const totalPages = Math.ceil(Object.keys(groupedItems).length / itemsPerPage);
	const visiblePages = 5; // Number of visible pages (including current page)
	const halfVisiblePages = Math.floor(visiblePages / 2);
	let startPage: number;
	let endPage: number;

	if (totalPages <= visiblePages) {
		// Display all pages if total pages are less than or equal to visiblePages
		startPage = 1;
		endPage = totalPages;
	} else if (currentPage <= halfVisiblePages) {
		// Display the first visiblePages pages if current page is within the first half
		startPage = 1;
		endPage = visiblePages;
	} else if (currentPage > totalPages - halfVisiblePages) {
		// Display the last visiblePages pages if current page is within the last half
		startPage = totalPages - visiblePages + 1;
		endPage = totalPages;
	} else {
		// Display halfVisiblePages pages before and after the current page
		startPage = currentPage - halfVisiblePages;
		endPage = currentPage + halfVisiblePages;
	}

	const changePage = (page: number) => {
		setCurrentPage(page);
	};

	const paginatedKeys = Object.keys(groupedItems).slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	return (
		<div className="max-w-full">
			<h2 className="text-2xl font-bold text-gray-700 mb-4">Manage Sources</h2>
			<div className="mb-6">
				<Card className="!p-0 !mb-2">
					<input
						type="text"
						placeholder="Search..."
						className="p-2 rounded-lg w-full"
						value={searchQuery}
						onChange={handleSearch}
					/>
				</Card>
				<div className="flex justify-start items-center gap-2">
					<p className="px-2 border-theme_primary-700 border-2 text-theme_primary-700 text-sm rounded-full inline-block">
						{searchQuery !== '' ? 'Filtered' : ''} Sources:{' '}
						{Object.keys(groupedItems).length}
					</p>
					<p className="px-2 border-theme_primary-700 border-2 text-theme_primary-700 text-sm rounded-full inline-block">
						{searchQuery !== '' ? 'Filtered' : ''} Chunks:{' '}
						{filteredItems.length}
					</p>
				</div>
			</div>

			{paginatedKeys.length === 0 ? (
				<p>No matching items found.</p>
			) : (
				<>
					{paginatedKeys.map((title) => (
						<div key={title}>
							<Card>
								<div className="flex justify-between items-top gap-5">
									<h3 className="text-xl font-semibold text-theme_primary-700">
										{title}
									</h3>
									<FolderIcon className="w-6 h-6 stroke-theme_primary-700" />
								</div>

								<ul>
									{groupedItems[title].map((item: any) => (
										<li
											key={item._id}
											className="flex justify-start items-start gap-2 my-2 p-2 transition duration-150 ease-in-out hover:bg-white rounded-lg group flex-wrap focus-within:bg-white"
										>
											<small className="mr-auto w-8/12">{item._id}</small>

											<SourceItemActions
												className="flex items-center justify-end"
												item={item}
												handleDelete={handleDelete}
											/>
										</li>
									))}
								</ul>
							</Card>
						</div>
					))}

					{/* Pagination */}
					<div className="mt-4">
						{currentPage > 1 && (
							<button
								className="mx-1 px-2 py-1 rounded-lg bg-gray-300 text-gray-700"
								onClick={() => changePage(1)}
							>
								First
							</button>
						)}

						{currentPage > halfVisiblePages + 1 && (
							<span className="mx-1 px-2 py-1 rounded-lg">...</span>
						)}

						{Array.from({ length: endPage - startPage + 1 }, (_, index) => {
							const page = startPage + index;
							return (
								<button
									key={page}
									className={`mx-1 px-2 py-1 rounded-md ${currentPage === page
										? 'bg-theme_primary-700 text-white'
										: 'bg-gray-300 text-gray-700'
										}`}
									onClick={() => changePage(page)}
								>
									{page}
								</button>
							);
						})}

						{currentPage < totalPages - halfVisiblePages && (
							<span className="mx-1 px-2 py-1 rounded-md">...</span>
						)}

						{currentPage < totalPages && (
							<button
								className="mx-1 px-2 py-1 rounded-md bg-gray-300 text-gray-700"
								onClick={() => changePage(totalPages)}
							>
								Last
							</button>
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default SourceFiles;
