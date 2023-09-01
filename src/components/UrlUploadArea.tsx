import { SERVER_ADDRESS } from '@/types/constants';
import axios from 'axios';
import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import {
	CheckCircleIcon,
	ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

type UrlUploaderProps = {
	handleUploadUrls: (urls: string[]) => void;
};

function UrlUploader({ handleUploadUrls }: UrlUploaderProps) {
	const [urlInput, setUrlInput] = useState('');
	const [error, setError] = useState('');
	const [rootDomain, setRootDomain] = useState(false);
	const [streamedUrls, setStreamedUrls] = useState<string[]>([]);
	const [status, setStatus] = useState<string>('');
	const [inputDisabled, setInputDisabled] = useState<boolean>(false);
	const [uploaded, setUploaded] = useState([]);

	const handleRootDomainChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setRootDomain(event.target.checked);
	};

	const handleUrlInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUrlInput(event.target.value);
	};

	const handleUrlSubmit = (event: React.FormEvent) => {
		event.preventDefault();

		if (urlInput.trim() === '') {
			setError('Please enter a valid URL.');
			return;
		}

		let endpoint = '';
		rootDomain ? (endpoint = 'process_website') : (endpoint = 'process_url');
		setError('');
		setStatus('Uploading...');
		setInputDisabled(true);

		axios
			.post(`${SERVER_ADDRESS}/${endpoint}`, { url: urlInput.trim() })
			.then((response) => {
				if (response.data.Error) {
					setStatus('Error!');
					setError(response.data.Error);
					const newUrl = {
						url: urlInput.trim(),
						status: 'Error!',
						error: response.data.Error,
					};
					const urls = [...uploaded] as any;
					urls.push(newUrl);
					setUploaded(urls);
					return;
				} else {
					handleUploadUrls([urlInput.trim()]);
					setStatus('Done!');
					setUrlInput('');
					setError('');
					const newUrl = {
						url: urlInput.trim(),
						status: 'Done!',
						error: false,
					};
					const urls = [...uploaded] as any;
					urls.push(newUrl);
					setUploaded(urls);
				}
			})
			.catch((error) => {
				setStatus('Error!');
				setError('Please enter a valid URL.');
			})
			.finally(() => {
				setInputDisabled(false);
			});
	};

	return (
		<div className="mb-4">
			<div className="w-full flex justify-start items-center gap-3 p-2">
				<span
					onClick={() => {
						setRootDomain(false);
					}}
					className={`cursor-pointer text-md font-semibold ${!rootDomain ? 'text-theme_primary-700 ' : 'text-gray-300'
						}`}
				>
					Single URL
				</span>
				<div className="inline-block w-8 relative">
					<input
						type="checkbox"
						name="rootDomain"
						id="rootDomain"
						checked={rootDomain}
						onChange={handleRootDomainChange}
						className={`toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-2 appearance-none cursor-pointer ${rootDomain
							? 'left-full -translate-x-full border-theme_primary-500'
							: 'left-0 border-theme_primary-700'
							}`}
					/>
					<label
						htmlFor="rootDomain"
						className={`toggle-label block overflow-hidden h-4 rounded-full cursor-pointer border-2 ${rootDomain
							? 'bg-theme_primary-500 border-theme_primary-500'
							: 'bg-theme_primary-700 border-theme_primary-700'
							}`}
					></label>
				</div>
				<span
					onClick={() => {
						setRootDomain(true);
					}}
					className={`text-md font-semibold cursor-pointer ${rootDomain ? 'text-theme_primary-500' : 'text-gray-300'
						}`}
				>
					Full Website
				</span>
			</div>

			<form className="w-full flex" onSubmit={handleUrlSubmit}>
				<input
					disabled={inputDisabled}
					className="flex-grow p-2 border border-gray-300 rounded-lg disabled:text-gray-300 disabled:cursor-not-allowed"
					type="text"
					value={urlInput}
					onChange={handleUrlInputChange}
					placeholder="Enter a URL"
				/>
				<button
					className="ml-2 px-4 py-2 bg-theme_primary-700 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
					type="submit"
					disabled={inputDisabled}
				>
					Upload
				</button>
			</form>

			<div className="mt-4">
				{/* Add a spinner loading icon when the URL is being uploaded */}
				{/* loop through "uploaded" and display the status of each URL */}
				<div className="flex flex-col gap-2">
					{uploaded.length > 0 &&
						uploaded.map((item, index) => {
							const { url, status, error } = item;
							return (
								<React.Fragment key={index}>
									{status === 'Done!' && (
										<div className="flex flex-col gap-2 bg-gray-100 rounded-lg p-2">
											<div className="flex justify-start items-center gap-2">
												<CheckCircleIcon className="h-6 w-6 stroke-theme_primary-700" />
												<p className="font-semibold text-theme_primary-700">{status}</p>
											</div>
											<p className="text-gray-500 font-xs w-full">{url}</p>
										</div>
									)}
									{status === 'Error!' && (
										<div className="flex flex-col gap-2 bg-gray-100 rounded-lg p-2">
											<div className="flex justify-start items-center gap-2">
												<ExclamationCircleIcon className="h-6 w-6 stroke-rose-700" />
												<p className="font-semibold text-rose-700">{status}</p>
											</div>
											<p className="text-gray-500 font-xs">{url}</p>
										</div>
									)}
								</React.Fragment>
							);
						})}
					{status === 'Uploading...' && (
						<div className="flex flex-col gap-2 bg-gray-100 rounded-lg p-2">
							<div className="flex justify-start items-center gap-2">
								<LoadingSpinner />
								<p>{status}</p>{' '}
							</div>
							<p className="text-gray-500 font-xs">{urlInput.trim()}</p>
						</div>
					)}
					{error && <p className="p-2 font-semibold text-rose-700">{error}</p>}
				</div>
			</div>
		</div>
	);
}

export default UrlUploader;
