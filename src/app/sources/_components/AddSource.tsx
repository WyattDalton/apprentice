'use client'

import { useState, useRef, Fragment } from "react";
import Card from "@/components/_ui/Card";
import { Dialog, Tab, Transition } from "@headlessui/react";
import LoadingText from "@/components/_elements/LoadingText";
import { PlusIcon } from "@/components/_elements/icons";

import { addUrl, processHtmlFromUrl, fetchHtmlFromUrl } from "@/app/_actions/_sources/addUrl";
import { addRaw } from "@/app/_actions/_sources/addRaw";
import { addFile } from "@/app/_actions/_sources/addFile";
import { useRouter } from "next/navigation";



function AddSource() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");
    const [error, setError] = useState("");
    const [files, setFiles] = useState([]);
    const [url, setUrl] = useState("");
    const fileInputRef = useRef(null) as any;

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [rawName, setRawName] = useState("");
    const [rawText, setRawText] = useState("");

    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = () => {
        setOpenModal(true);
    }
    const handleCloseModal = () => {
        setOpenModal(false);
    }


    /**
     * Handles the submission of raw data to the server.
     * @param e - The event object.
     */
    const handelRawSubmit = async (e: any) => {
        e.preventDefault();
        try {
            setLoading(true);
            const data = await addRaw({ "name": rawName, "text": rawText }) as any;
            if (!data.success) {
                setError('Failed to add raw text to sources');
                setLoading(false);
                throw new Error('Failed to add raw text to sources');
            }

            // ###
            // ### Reset after success
            setLoading(false);
            setRawName("");
            setRawText("");

            // ###
            // ### Update sources with new source
            router.refresh();
            handleCloseModal();

        } catch (error) {
            console.error(error);
            setError("Failed to add raw text to sources");
            setLoading(false);
        }
    }

    /**
     * Handles the change event for the file input element.
     * @param event - The change event object.
     */
    const handleFileChange = (event: any) => {
        setFiles(event.target.files);
        onSubmitFiles(event.target.files);
    };

    /**
     * Handles the drag over event for the component.
     * @param event - The drag event.
     */
    const handleDragOver = (event: any) => {
        event.preventDefault();
    };

    /**
     * Handles the drop event when files are dropped onto the component.
     * @param event - The drop event.
     */
    const handleDrop = (event: any) => {
        event.preventDefault();
        setFiles(event.dataTransfer.files);
        // Submit the form once files are dropped
        onSubmitFiles(event.dataTransfer.files);
    };

    /**
     * Reads a file as a base64-encoded string.
     * @param file - The file to read.
     * @returns A Promise that resolves with the base64-encoded string.
     */
    const readFileAsBase64 = (file: Blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target!.result as string;
                const base64 = result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    /**
     * Handles the submission of files to be processed and uploaded to the server.
     * @param files - The list of files to be processed and uploaded.
     */
    const onSubmitFiles = async (files: FileList) => {
        try {
            const processedFiles = [];

            // ### Process files
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const base64 = await readFileAsBase64(file);
                processedFiles.push({
                    buffer: base64,
                    type: file.type,
                    name: file.name,
                    size: file.size,
                });
            }

            // ### Send new source to API
            const data = await addFile(processedFiles);

            // ###
            // ### Update sources with new source
            router.refresh();
            handleCloseModal();

        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Handles the submission of a URL to be added as a source.
     * @param url - The URL to be added as a source.
     */
    const onSubmitUrl = async (url: string) => {
        try {

            // ###
            // ### Set Loading to true
            setLoading(true);

            // ###
            // ### Check that url is a valid url
            const urlObject = new URL(url);
            if (!urlObject.protocol.includes('http')) {
                setError('Invalid url');
                setTimeout(() => {
                    setLoading(false);
                    throw new Error('Failed to add url to sources')
                }, 1000);
            }

            // ###
            // ### Fetch the url
            setLoadingMessage("Getting content from url");
            const data = await fetchHtmlFromUrl(url);
            if (!data.success) {
                setError('Failed to fetch data');
                setTimeout(() => {
                    setLoading(false);
                    throw new Error('Failed to add url to sources')
                }, 1000);
            }

            // ###
            // ### Process the data
            setLoadingMessage("Processing content from url");
            const processedData = await processHtmlFromUrl(data);
            if (!processedData.success) {
                setError('Failed to process data');
                setTimeout(() => {
                    setLoading(false);
                    throw new Error('Failed to add url to sources')
                }, 1000);
            }

            /*/
            After data is processed, a modal should open to display the data and allow the user to edit it before submitting to the database. At this point they should be able to approve or reject the data and stop the process
            /*/

            // ###
            // ### Send new source to DB
            setLoadingMessage("Adding URL to sources");
            const newSource = await addUrl(processedData);
            if (!newSource.success) {
                setError('Failed to add url to sources');
                setTimeout(() => {
                    setLoading(false);
                    throw new Error('Failed to add url to sources')
                }, 1000);

            }

            // ###
            // ### Reset after success
            setUrl("");
            setLoadingMessage("Success!");
            setTimeout(() => {
                setLoading(false);
                setLoadingMessage("");
            }, 1000);

            // ###
            // ### Update sources with new source
            router.refresh();
            handleCloseModal();

        } catch (error) {
            setError("Failed to add url to sources");
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    }


    return (
        <>
            <Transition appear show={openModal} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={handleCloseModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Add a source
                                    </Dialog.Title>


                                    <Tab.Group>
                                        <div className="flex flex-col md:flex-row gap-2 items-center justify-between mb-2 mx-auto">
                                            <h2 className="m-0">Add a Source</h2>
                                            <Tab.List className="flex bg-gray-100 px-4 py-2 rounded-full gap-2">
                                                <Tab className="ui-selected:bg-gray-700 px-4 py-2 rounded-full text-gray-500 ui-selected:text-white">Raw Text</Tab>
                                                <Tab className="ui-selected:bg-gray-700 px-4 py-2 rounded-full text-gray-500 ui-selected:text-white">Files</Tab>
                                                <Tab className="ui-selected:bg-gray-700 px-4 py-2 rounded-full text-gray-500 ui-selected:text-white">Urls</Tab>
                                            </Tab.List>
                                        </div>
                                        <Tab.Panels>
                                            <Tab.Panel>
                                                <div
                                                    className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 p-4 rounded-md"
                                                    onSubmit={(e) => handelRawSubmit(e)}
                                                >
                                                    <form className="flex flex-col gap-4 prose w-full">
                                                        <input
                                                            className="px-2 py-1 text-2xl font-bold rounded-md bg-neutral-50"
                                                            type="text"
                                                            placeholder="Title"
                                                            value={rawName}
                                                            onChange={(e) => {
                                                                setRawName(e.target.value);
                                                            }}
                                                        />
                                                        <textarea
                                                            ref={textareaRef}
                                                            className="px-2 py-1 grow rounded-md resize-none  bg-neutral-50"
                                                            placeholder="Content"
                                                            value={rawText}
                                                            onChange={(e) => {
                                                                setRawText(e.target.value);

                                                                // Adjust textarea height to fit content
                                                                if (textareaRef.current) {
                                                                    const field = textareaRef.current;
                                                                    field.style.height = "0px";
                                                                    const scrollHeight = field.scrollHeight;
                                                                    field.style.height = scrollHeight + "px";
                                                                }
                                                            }}
                                                        />
                                                        <button type="submit" className="px-4 py-2 text-white bg-gray-700 rounded-md">Add Raw Text to Sources</button>
                                                    </form>

                                                    <Transition
                                                        show={loading}
                                                        enter="transition-opacity duration-300"
                                                        enterFrom="opacity-0"
                                                        enterTo="opacity-100"
                                                        leave="transition-opacity duration-300"
                                                        leaveFrom="opacity-100"
                                                        leaveTo="opacity-0"
                                                    >
                                                        <LoadingText text={"Adding content to sources"} className={""} iconClassName={""} />
                                                    </Transition>
                                                </div>
                                            </Tab.Panel>
                                            <Tab.Panel>
                                                <div
                                                    className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 p-4 rounded-md"
                                                    onDragOver={handleDragOver}
                                                    onDrop={handleDrop}
                                                >
                                                    <div className="flex flex-col items-center justify-center w-full h-full">
                                                        <p className="text-gray-500">Drag and drop a file here</p>
                                                        <p className="text-gray-500">or</p>
                                                        <button
                                                            className="px-4 py-2 text-white bg-gray-700 rounded-md"
                                                            onClick={() => fileInputRef.current!.click()}
                                                        >
                                                            Select a file
                                                        </button>
                                                        <input
                                                            type="file"
                                                            ref={fileInputRef}
                                                            style={{ display: "none" }}
                                                            onChange={handleFileChange}
                                                            multiple
                                                        />
                                                    </div>

                                                    <Transition
                                                        show={loading}
                                                        enter="transition-opacity duration-300"
                                                        enterFrom="opacity-0"
                                                        enterTo="opacity-100"
                                                        leave="transition-opacity duration-300"
                                                        leaveFrom="opacity-100"
                                                        leaveTo="opacity-0"
                                                    >
                                                        <LoadingText text="Adding content to sources" className={""} iconClassName={""} />
                                                    </Transition>
                                                </div>
                                            </Tab.Panel>
                                            <Tab.Panel>
                                                <div
                                                    className="flex flex-col gap-4 p-4 items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 p-4 rounded-md"
                                                >
                                                    <input type="text" className="w-full rounded-md bg-gray-100 px-4 py-2" value={url} onChange={(e) => setUrl(e.target.value)} />

                                                    <button onClick={() => onSubmitUrl(url)} className="px-4 py-2 text-white bg-gray-700 rounded-md">Add URL to Sources</button>
                                                    <Transition
                                                        show={loading}
                                                        enter="transition-opacity duration-300"
                                                        enterFrom="opacity-0"
                                                        enterTo="opacity-100"
                                                        leave="transition-opacity duration-300"
                                                        leaveFrom="opacity-100"
                                                        leaveTo="opacity-0"
                                                    >
                                                        {!!error ? (<span>{error}</span>) : <LoadingText text={loadingMessage} className={""} iconClassName={""} />}
                                                    </Transition>
                                                </div>
                                            </Tab.Panel>
                                        </Tab.Panels>
                                    </Tab.Group>


                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            <button onClick={handleOpenModal} className="px-4 py-1 text-gray-700 border border-gray-700 rounded-full flex gap-2 justify-center items-center"><PlusIcon className={'w-4 h-4 text-gray-700'} /> Add</button>
        </>

    );
}

export default AddSource;