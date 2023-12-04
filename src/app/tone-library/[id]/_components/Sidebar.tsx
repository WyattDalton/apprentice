'use client';

import LoadingSpinner from "@/components/LoadingSpinner";
import { FileIcon, LinkIcon } from "@/components/icons";

type SidebarProps = {
    className?: string,
    title: string,
    handleUpdateTone: any,
    handleDeleteTone: any,
    loading: boolean,
    description: string,
    setDescription: any,
    keywords: string[],
    setKeywords: any,
    instructions: string[],
    setInstructions: any,

}
function Sidebar({
    className,
    title,
    handleUpdateTone,
    handleDeleteTone,
    loading,
    description,
    setDescription,
    keywords,
    setKeywords,
    instructions,
    setInstructions
}: SidebarProps) {

    return (
        <div className={className}>
            <div className="sticky bottom-4 w-full bg-white rounded-lg flex flex-wrap justify-between items-center gap-4 p-4 shadow-[0_-5px_15px_-15px_rgba(0,0,0,0.6)]">

                <h3 className="mt-0 mb-0 flex-grow lg:text-center lg:flex-grow-0">{title}</h3>

                <div className="flex items-center justify-center gap-4 flex-wrap flex-grow lg:flex-grow-0">
                    <button className="border border-gray-700 text-gray-700 px-4 py-2 rounded-md flex gap-2 justify-center items-center" onClick={handleUpdateTone}>Update {loading ? <LoadingSpinner /> : ''}</button>
                    <button className="text-red-500" onClick={handleDeleteTone}>Delete</button>
                </div>

            </div>
        </div>
    )
}

export default Sidebar