'use client'

import { Dialog, Transition } from '@headlessui/react'
import { useRouter } from "next/navigation";
import { CloseIcon, GeneratorArrowIcon } from "./icons";
import { useState, Fragment, use, useEffect } from "react";
import LoadingText from './LoadingText';

type Props = {
    threads: any;
}

// ###
// ### Build recent threads component
export default function ThreadsList({ threads }: Props) {
    const router = useRouter();
    const [allThreads, setAllThreads] = useState<any>(threads || []);
    const [openModal, setOpenModal] = useState(false);
    const [threadToDelete, setThreadToDelete] = useState<any>({
        id: '',
        title: ''
    });
    const [deleting, setDeleting] = useState(false);

    const handleOpenThread = async (threadId: string) => {
        router.push(`/generate/${threadId}`)
    }

    const handleOpenModal = (id: any, title: any) => {

        const payload = {} as any;
        payload.id = id;
        payload.title = !!title ? title : false;

        setThreadToDelete({ id, title });
        console.log('threadToDelete:', threadToDelete);
        setOpenModal(true);
    }
    const handleCloseModal = () => {
        setThreadToDelete({ id: '', title: '' });
        setOpenModal(false);
    }

    const handleDeleteThread = async (threadId: string) => {
        setDeleting(true);
        const payload = {
            dataType: 'delete',
            data: { _id: threadId }
        }
        const res = await fetch(`/api/threads`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        const newThreads = data.threads;
        setAllThreads(newThreads);
        setDeleting(false);
        handleCloseModal();
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
                                        Permanently Delete
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Are you sure you want to delete the thread titled: <span className="font-semibold">{!!threadToDelete.title ? threadToDelete.title : threadToDelete.id}</span>? This cannot be undone.
                                        </p>
                                    </div>

                                    <div className="mt-4">
                                        {!deleting && (
                                            <button
                                                type="button"
                                                className="inline-flex justify-center rounded-md border border-transparent bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-shade-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                onClick={handleCloseModal}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 ml-2"
                                            onClick={() => handleDeleteThread(threadToDelete.id)}
                                        >
                                            {!deleting ? ('Delete') : (<LoadingText text={'Deleting...'} className={''} iconClassName={'w-4 h-4'} />)}
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>


            <div className="flex flex-col gap-2" >

                {allThreads.map((thread: any, i: number) => {

                    const createdDate = new Date(thread.created);
                    const localCreatedDate = createdDate.toLocaleString('en-US', { month: 'short', day: 'numeric' });

                    return (
                        <div className="flex items-center justify-center gap-2 max-w-full w-full" key={i}>

                            <button
                                onClick={() => handleOpenModal(thread._id, thread.title)}
                                className="group bg-white/50 rounded-md hover:bg-white p-1 w-6 h-6 aspect-ratio-square flex justify-center items-center transition duration-150 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                            >
                                <CloseIcon className="h-4 w-4 text-white group-hover:text-gray-700" />
                            </button>

                            <button
                                key={i}
                                className="flex flex-grow gap-2 py-4 px-6 hover:bg-white/20 rounded-md items-center truncate group/thread"
                                onClick={() => { handleOpenThread(thread._id) }}
                            >
                                <span className="text-sm font-semibold truncate"> {thread.title ? thread.title : thread._id} </span>
                                <GeneratorArrowIcon className="h-4 w-4 text-gray-400 group-hover/thread:translate-x-1 transition duration-150" />
                            </button>

                            <span className="text-xs ml-auto">{localCreatedDate}</span>

                        </div>
                    )
                })}

            </div>
        </>
    );
}