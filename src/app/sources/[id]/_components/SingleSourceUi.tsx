'use client'

import { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, Transition } from '@headlessui/react';
import LoadingText from '@/components/LoadingText';
import Content from './Content';
import Sidebar from './Sidebar';

type SourceData = {
    _id: string,
    sourceData: any;
    deleteSource: any;
    updateSource: any;
}

function SingleSourceUi({ _id, sourceData, deleteSource, updateSource }: SourceData) {
    const router = useRouter();

    const [updating, setUpdating] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [source, setSource] = useState({
        _id: _id || "",
        name: sourceData?.name || "",
        title: sourceData?.title || "",
        type: sourceData?.type || "",
        text: sourceData?.text || "",
    });

    const handleUpdate = async () => {
        try {
            setUpdating(true)
            const res = await updateSource(_id, source);
            setUpdating(false);
            return;

        } catch (error) {
            console.log(error);
        }
    }

    /* * * * * * * * ** * * * * * * *
    /* Delete the source
    /* * * * * * * * ** * * * * * * */
    const handleDeleteSource = async () => {
        try {
            setDeleting(true)
            const res = await deleteSource(_id);
            setOpenModal(false);
            setDeleting(false);
            router.push('/sources');

        }
        catch (error) {
            console.log(error);
        }
    }

    /* * * * * * * * ** * * * * * * *
    /* Open and close modal
    /* * * * * * * * ** * * * * * * */
    const handleOpenModal = () => {
        try {
            setOpenModal(true);
        } catch (error) {
            console.log(error);
        }
    }

    const handleCloseModal = () => {
        setOpenModal(false);
    }

    return (
        <>
            {/* <button onClick={() => { handleOpenModal() }}>Open</button> */}
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
                                            Are you sure you want to delete <span className="font-semibold">{!!source?.title ? source?.title : ('this source')}</span>? This cannot be undone.
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
                                            onClick={handleDeleteSource}
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

            <section className="
            relative 
            grow 
            h-full 
            grid 
            grid-cols-6
            w-[90%] 
            mx-auto
            gap-4 
        ">

                <Content
                    className={'col-span-6 lg:col-span-4 min-h-full flex flex-col items-center gap-4 bg-[radial-gradient(#e2e2e2_1px,transparent_1px)] [background-size:13px_13px] py-[5%] px-[2.5%]'}
                    source={source}
                    setSource={setSource} />

                <Sidebar
                    className={'col-span-6 lg:col-span-2 gap-4 rounded-lg sticky bottom-0 lg:flex lg:flex-col lg:justify-end lg:flex-grow p-0 lg:p-4 bg-transparent lg:bg-neutral-50'}
                    handleUpdate={handleUpdate}
                    source={source}
                    updating={updating}
                    handleOpenModal={handleOpenModal}
                />

            </section>
        </>
    )

}

export default SingleSourceUi