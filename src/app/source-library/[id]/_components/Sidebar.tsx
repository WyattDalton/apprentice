'use client';

import LoadingSpinner from "@/components/LoadingSpinner";
import LoadingText from "@/components/LoadingText";
import { FileIcon, LinkIcon } from "@/components/icons";
import { useEffect } from "react";

type SidebarProps = {
    className?: string,
    updating: any;
    handleUpdate: any
    source: any;
    handleOpenModal?: any;
}
function Sidebar({ className, updating, handleUpdate, source, handleOpenModal }: SidebarProps) {

    return (
        <div className={className}>
            <div className="sticky bottom-4 w-full bg-white rounded-lg flex flex-wrap gap-4 p-4 shadow-[0_-5px_15px_-15px_rgba(0,0,0,0.6)]">
                <div className="flex items-center justify-start gap-4">
                    {source?.type === 'file' ? <FileIcon className="w-6 h-6 p-2 rounded-md bg-gray-700 text-white" /> : <LinkIcon className="w-6 h-6 p-2 rounded-md bg-gray-700 text-white" />}
                    <h3 className="mt-0 mb-0 mr-auto">{source?.name}</h3>
                </div>
                <div className="flex items-center justify-end gap-4 w-full flex-wrap">
                    <button className="border border-gray-700 text-gray-700 px-4 rounded-md max-w-full" onClick={() => { handleUpdate() }}>{!!updating ? <LoadingText text={"Updating..."} className={""} iconClassName={""} /> : 'Update'}</button>
                    <button
                        onClick={handleOpenModal}
                        className="text-red-500 max-w-full"
                    >Delete</button>
                </div>
            </div>
        </div>
    )
}

export default Sidebar