'use client';

import LoadingSpinner from "@/components/_elements/LoadingSpinner";
import { FileIcon, LinkIcon, PlusIcon } from "@/components/_elements/icons";
import TextareaAutosize from "./TextAreaAutosize";
import { useEffect, useState } from "react";
import { Transition } from "@headlessui/react";

type ActionsProps = {
    className?: string,
    title: string,
    sample?: string,
    iteration?: any,
    handleRefinement: any,
    handleUpdateStyle: any,
    handleOpenModal: any,
    loading: boolean,
    progress: any,
    description: string,
    setDescription: any,
    keywords: string[],
    setKeywords: any,
    bluePrint: string[],
    setBluePrint: any,
    handleAddExample: any,
}
function Actions({
    className,
    title,
    sample,
    iteration,
    handleRefinement,
    handleUpdateStyle,
    handleOpenModal,
    loading,
    progress,
    description,
    setDescription,
    keywords,
    setKeywords,
    bluePrint,
    setBluePrint,
    handleAddExample,
}: ActionsProps) {

    const [refinement, setRefinement] = useState<string>(sample || "");
    const [activateRefinement, setActivateRefinement] = useState<boolean>(false);

    useEffect(() => {
        setRefinement(sample || "");
    }, [sample]);

    return (
        <div className={className}>
            <div className="w-full bg-white rounded-lg flex flex-wrap justify-between items-center gap-4 p-4 shadow-[0_-5px_15px_-15px_rgba(0,0,0,0.6)]">

                {!!loading ? <span className="w-full text-center text-gray-500">{progress}</span> : ''}

                <h3 className="mt-0 mb-0 flex-grow text-center text-lg">{title}</h3>

                <div className="flex items-center justify-center gap-4 flex-wrap flex-grow">
                    <button className="border border-gray-700 text-gray-700 px-4 py-2 rounded-md flex gap-2 justify-center items-center flex-grow" onClick={handleUpdateStyle}>Update and Regenerate{loading ? <LoadingSpinner /> : ''}</button>
                    <button className="text-red-500" onClick={handleOpenModal}>Delete</button>
                </div>

            </div>
        </div>
    )
}

export default Actions