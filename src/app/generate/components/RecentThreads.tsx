import Card from "@/components/UI/Card";
import { UilBookmark, UilTrashAlt } from '@iconscout/react-unicons'


type ThreadProps = {
    threads: any,
    className?: string | '',
    handleActivateThread: any,
    saveThread: any,
    deleteThread: any,
}

const RecentThreads = ({ threads, className, handleActivateThread, saveThread, deleteThread }: ThreadProps) => {


    return (

        <div className={`flex flex-col gap-4 mt-4 ${className}`}>
            {threads.map((thread: any) => {
                    return (
                        <div className="flex justify-between items-center hover:bg-white px-4 py-2 rounded-md gap-4">
                            <h3 className="prose text-lg font-semibold mr-auto">{thread.initial_prompt}</h3>
                            <button
                                className="group w-max font-semibold flex items-center rounded-md bg-theme_primary hover:bg-theme_primary-600 py-0 px-4 text-white !mt-0"
                                onClick={() => handleActivateThread(thread._id)}
                            >
                                Continue
                            </button>
                            <button
                                className={`flex items-center text-theme_primary !mt-0 ${thread.saved ? 'text-white bg-theme_primary-500 rounded-md' : ''} $ }`}
                                onClick={() => saveThread(thread._id, !thread.saved)} >
                                <UilBookmark className="h-6 w-6" />
                            </button>
                            <button
                                className="flex items-center text-red-700 !mt-0"
                                onClick={() => deleteThread(thread._id)} >
                                <UilTrashAlt className="h-6 w-6" />
                            </button>
                        </div>
                    )
                })}
        </div>
    )
}

export default RecentThreads;