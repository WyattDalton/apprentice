'use client'

import { useState, useRef } from "react";
import Card from "@/components/UI/Card";
import { Tab } from "@headlessui/react";
import LoadingText from "@/components/LoadingText";



function AddSource() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [files, setFiles] = useState([]);
    const [url, setUrl] = useState("");
    const fileInputRef = useRef(null) as any;

    const handleFileChange = (event: any) => {
        setFiles(event.target.files);
        // Submit the form once files are selected
        onSubmitFiles(event.target.files);
    };

    const handleDragOver = (event: any) => {
        event.preventDefault();
    };

    const handleDrop = (event: any) => {
        event.preventDefault();
        setFiles(event.dataTransfer.files);
        // Submit the form once files are dropped
        onSubmitFiles(event.dataTransfer.files);
    };

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

    const onSubmitFiles = async (files: FileList) => {
        const processedFiles = [];

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

        const data = await fetch("/api/sourcesUpdate", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "dataType": "file", "data": processedFiles })
        });

        if (!data.ok) {
            setError('Failed to fetch data');
            throw new Error('Failed to fetch data')
        }
    }

    const onSubmitUrl = async (url: string) => {
        try {

            // ###
            // ### Check that url is a valid url
            const urlObject = new URL(url);
            if (urlObject.protocol !== 'http:' && urlObject.protocol !== 'https:') {
                setError('Invalid url');
                throw new Error('Invalid url');
            }

            // ###
            // ### Set Loading to true
            setLoading(true);

            // ###
            // ### Fetch the url
            const data = await fetch("/api/sourcesUpdate", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "dataType": "url", "data": [{ "url": url }] })
            });

            // ###
            // ### Check if the fetch was successful
            if (!data.ok) {
                setError('Failed to fetch data');
                throw new Error('Failed to fetch data')
            }

            // ###
            // ### Reset after success
            setLoading(false);
            setUrl("");

        } catch (error) {
            console.error(error);
            setError("Failed to add url to sources");
            setLoading(false);
        }
    }




    return (
        <Card className="w-full">
            <Tab.Group>
                <div className="flex items-center justify-between mb-2">
                    <h2>Add a Source</h2>
                    <Tab.List className="flex bg-gray-100 px-4 py-2 rounded-full gap-2">
                        <Tab className="ui-selected:bg-theme_primary">Files</Tab>
                        <Tab>Urls</Tab>
                    </Tab.List>
                </div>
                <Tab.Panels>
                    <Tab.Panel>
                        <div
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-md"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            <div className="flex flex-col items-center justify-center w-full h-full">
                                <p className="text-gray-500">Drag and drop a file here</p>
                                <p className="text-gray-500">or</p>
                                <button
                                    className="px-4 py-2 text-white bg-theme_primary-500 rounded-md"
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
                        </div>
                    </Tab.Panel>
                    <Tab.Panel>
                        <div
                            className="flex flex-col gap-4 p-4 items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-md"
                        >
                            <input type="text" className="w-full rounded-md bg-gray-100 px-4 py-2" value={url} onChange={(e) => setUrl(e.target.value)} />

                            <button onClick={() => onSubmitUrl(url)} className="ml-auto px-4 py-2 text-white bg-theme_primary-500 rounded-md">{!!loading ? <LoadingText text="Getting URL Content" className={""} iconClassName={""} /> : "Add URL to Sources"}</button>
                        </div>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </Card>
    );
}

export default AddSource;