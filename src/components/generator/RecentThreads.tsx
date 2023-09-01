import Card from "../UI/Card";
import { UilBookmark, UilTrashAlt } from '@iconscout/react-unicons'


type ThreadProps = {
    threads: any[],
    className?: string | '',
    setConversation: any,
    setActive: any,
    setSaved: any,
    deleteThread: any,
}

const RecentThreads = ({ threads, className, setConversation, setActive, setSaved, deleteThread }: ThreadProps) => {

    const handleConversationChange = (messages: any[], saved: boolean) => {

        // filter objects inside messages to remove "createdAt" and "id" properties
        const filteredMessages = messages.map((message) => {
            const { createdAt, id, ...rest } = message;
            return rest;
        })
        setConversation(messages);
        setSaved(saved);
        setActive(true);
    }




    return (
        <Card className={`w-full bg-white ${className}`}>
            <h2 className="prose text-xl font-bold">Recent Generations</h2>
            <div className="flex flex-col gap-4 mt-4">
                {threads.map((thread) => {
                    return (
                        <div className="flex justify-between items-center hover:bg-white px-4 py-2 rounded-md gap-4">
                            <h3 className="prose text-lg font-semibold mr-auto">{thread.initial_prompt}</h3>
                            {!!thread.saved && (
                                <UilBookmark className="h-6 w-6 text-theme_primary" />
                            )}
                            <button
                                className="group w-max font-semibold flex items-center rounded-md bg-theme_primary hover:bg-theme_primary-600 py-0 px-4 text-white !mt-0"
                                onClick={() => handleConversationChange(thread.messages, thread.saved)}
                            >
                                Continue
                            </button>
                            <button
                                className="flex items-center text-red-700 !mt-0"
                                onClick={() => deleteThread(thread.initial_prompt, thread.created)} >
                                <UilTrashAlt className="h-6 w-6" />
                            </button>
                        </div>
                    )
                })}
            </div>
        </Card>
    )
}

export default RecentThreads;