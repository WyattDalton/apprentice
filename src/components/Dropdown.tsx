import React, { useEffect, useState } from 'react';
import { memo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw';

type DropdownProps = {
	filename: string;
	content: any;
	icon: any;
};

const Dropdown = ({ filename, content, icon }: DropdownProps) => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleDropdown = () => {
		setIsOpen((prevState) => !prevState);
	};

	return (
		<div key={filename} className="group relative flex flex-col gap-x-6 ">
			<div className="mt-1 flex gap-4 justify-start items-center rounded-lg cursor-pointer">
				<div className="border-2 border-gray-200 rounded-lg p-1">
					<div className=" h-11 w-11 rounded-lg">{icon}</div>
					<span className="font-semibold text-xs inline-block">
						{content.score + '%'}
					</span>
				</div>
				<div className="flex flex-col justify-start items-start">
					<span
						className="font-semibold text-gray-900"
						onClick={toggleDropdown}
					>
						{filename}

						<span className="absolute inset-0" />
					</span>
					<p className="text-gray-500 text-xs">
						<span className="font-semibold inline-block">ID:</span>
						{' ' + content.id}
					</p>
				</div>
			</div>

			{isOpen && (
				<div>
					<hr className="border-gray-300 my-4 px-4" />

					<ReactMarkdown className="prose px-4" rehypePlugins={[rehypeRaw]}>
						{content.text}
					</ReactMarkdown>
				</div>
			)}
		</div>
	);
};

// export the component
export default memo(Dropdown);