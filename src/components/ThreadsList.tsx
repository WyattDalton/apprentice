'use client'

import { constants } from "fs";
import { useRouter } from "next/navigation";

type Props = {
    threads: any;
}

// ###
// ### Build recent threads component
export default function ThreadsList({ threads }: Props) {
    const router = useRouter();

    const handleOpenThread = async (threadId: string) => {
        router.push(`/generate/${threadId}`)
    }

    return (
        <div className="flex flex-col gap-2" >

            {threads.map((thread: any, i: number) => {

                const createdDate = new Date(thread.created);
                const localCreatedDate = createdDate.toLocaleDateString();

                return (
                    <div className="flex gap-2" key={i}>
                        <div className="group bg-white/50 rounded-full hover:bg-white p-1" >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white group-hover:text-gray-700 " viewBox="0 0 20 20" fill="currentColor" >
                                <path fillRule="evenodd" d="M15.293 5.293a1 1 0 00-1.414 0L10 8.586 6.707 5.293a1 1 0 00-1.414 1.414L8.586 10l-3.293 3.293a1 1 0 001.414 1.414L10 11.414l3.293 3.293a1 1 0 001.414-1.414L11.414 10l3.293-3.293a1 1 0 000-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <button
                            key={i}
                            className="flex gap-2 py-4 px-2 hover:bg-white/20 rounded-md items-center group/thread flex-grow"
                            onClick={() => { handleOpenThread(thread._id) }}
                        >

                            <span className="text-sm font-semibold truncate" > {thread.title ? thread.title : thread._id} </span>
                            <span className="text-xs ml-auto" > {localCreatedDate} </span>


                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 transform -rotate-90 group-hover/thread:translate-x-1 transition duration-150" viewBox="0 0 25 25" fill="currentColor" >
                                <path fillRule="evenodd" d="M7.293 7.293a1 1 0 011.414 0L14 12.586l4.293-4.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                )
            })}

        </div>
    );
}