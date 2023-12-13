'use client'

import Card from "@/components/UI/Card";
import { FileIcon, LinkIcon } from "@/components/icons";
import { useRouter, usePathname } from 'next/navigation'
import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import LoadingText from "@/components/LoadingText";

type Props = {
    data: any;
}
function SourcesGrid({ data }: Props) {
    const router = useRouter();
    const currentUrl = usePathname();

    const [sources, setSources] = useState(data || [])
    const [openModal, setOpenModal] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [sourceToDelete, setSourceToDelete] = useState<any>({})

    useEffect(() => {
        if (data) {
            setSources(data)
        }
    }, [data])

    if (!sources) {
        return <p>Loading...</p>
    }

    const handleEdit = (id: string) => {
        router.push(`${currentUrl}/${id}`)
    }

    /* * * * * * * * ** * * * * * * *
    /* Handle delete source
    /* * * * * * * * ** * * * * * * */
    const handleDeleteSource = async (id: string) => {
        setDeleting(true)
        const res = await fetch(`/api/sourcesDelete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "id": id }),
        });
        if (!res.ok) {
            throw new Error('Failed to fetch data')
        }
        const data = await res.json();
        if (data.success) {
            setSources(sources.filter((source: any) => source._id !== id));
            setOpenModal(false);
            setDeleting(false);
        }
    }

    /* * * * * * * * ** * * * * * * *
    /* Open and close modal
    /* * * * * * * * ** * * * * * * */
    const handleOpenModal = (id: any, title: any) => {
        const payload = {} as any;
        payload.id = id;
        payload.title = !!title ? title : false;

        setSourceToDelete({ id, title });
        setOpenModal(true);
    }

    const handleCloseModal = () => {
        setSourceToDelete({ id: '', title: '' });
        setOpenModal(false);
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
                                            Are you sure you want to delete <span className="font-semibold">{!!sourceToDelete.title ? sourceToDelete.title : ''}</span>? This cannot be undone.
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
                                            onClick={() => handleDeleteSource(sourceToDelete.id)}
                                        >
                                            {!deleting ? ('Delete') : (<LoadingText text={'Deleting...'} className={''} iconClassName={''} />)}
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <div className="flex-grow grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-min inset-0 bg-[radial-gradient(#e2e2e2_1px,transparent_1px)] [background-size:13px_13px] py-[5%] px-[2.5%]">
                {
                    !!sources.length && (
                        sources.map((source: any) => (
                            <Card key={source._id} className="col-span-1 !m-0 prose">

                                <div className="flex items-center justify-start gap-4 text-sm">
                                    {source.type == 'file' ? <FileIcon className="w-6 h-6 p-2 rounded-md bg-gray-700 text-white" /> : <LinkIcon className="w-6 h-6 p-2 rounded-md bg-gray-700 text-white" />}
                                    <h3 className="mt-0 mb-0 line-clamp-2">{source.title}</h3>
                                </div>

                                <p className="line-clamp-3 text-xs">{source.text}</p>

                                <div className="flex items-center justify-end gap-4 w-full">
                                    <button className="border border-gray-700 text-gray-700 px-4 rounded-md" onClick={() => handleEdit(source._id)}>Edit</button>
                                    <button className="text-red-500" onClick={() => handleOpenModal(source._id, source.title)}>Delete</button>
                                </div>

                            </Card>
                        ))
                    )
                }
            </div >
        </>
    )
}

export default SourcesGrid