
type SavedThreadProps = {
    threads: any,
    className?: string | '',
    handleActivateThread: any,
    saveThread: any,
    deleteThread: any,
}

const SavedThreads = ({ threads, className, handleActivateThread, saveThread, deleteThread }: SavedThreadProps) => {

    return (
        <div className={`flex flex-col gap-4 mt-4  ${className}`}>
            {threads.map((thread: any, index: number) => {
                return (
                    <div key={index} className="flex justify-between items-center hover:bg-white px-4 py-2 rounded-md gap-4">
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
                            Save                        </button>
                        <button
                            className="flex items-center text-red-700 !mt-0"
                            onClick={() => deleteThread(thread._id)} >
                            Delete                        </button>
                    </div>
                )
            })}
        </div>
    )
}

export default SavedThreads;