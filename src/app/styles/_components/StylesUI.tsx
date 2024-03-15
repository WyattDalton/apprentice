'use client'

import Card from '@/components/_ui/Card';
import React, { Fragment, useState } from 'react';
import AddStyle from './AddStyle';
import { useRouter } from 'next/navigation';
import { Dialog, Transition } from '@headlessui/react';
import LoadingText from '@/components/_elements/LoadingText';
import { createStyle } from '../_actions';

type StylesUiProps = {
    stylesSource: any;
    deleteStyle: any;
    createStyle: any;
}

export default function StylesUi({ stylesSource, deleteStyle, createStyle }: StylesUiProps) {
    const router = useRouter();
    const [styles, setStyles] = useState(stylesSource);
    const [newStyle, setNewStyle] = useState({
        title: '',
        examples: [],
        summary: '',
    });

    const [openModal, setOpenModal] = useState(false);
    const [styleToDelete, setStyleToDelete] = useState({ id: '', title: '' });
    const [deleting, setDeleting] = useState(false);

    /* * * * * * * * ** * * * * * * *
    /* Add a new style
    /* * * * * * * * ** * * * * * * */
    const handleAddNewStyle = async () => {
        try {
            const style = await createStyle(newStyle);
            router.push(`/styles/${style.insertedId}`);
        }
        catch (error) {
            console.log(error);
        }
    }

    /* * * * * * * * ** * * * * * * *
    /* Delete a style
    /* * * * * * * * ** * * * * * * */
    const handleDeleteStyle = async () => {
        try {
            setDeleting(true)
            const styles = await deleteStyle(styleToDelete.id);
            setStyles(styles);
            setOpenModal(false);
            setDeleting(false);
        }
        catch (error) {
            console.log(error);
        }
    }

    /* * * * * * * * ** * * * * * * *
    /* Edit a style
    /* * * * * * * * ** * * * * * * */
    const handleEditStyle = (_id: string) => {
        try {
            router.push(`/styles/${_id}`);
        } catch (error) {
            console.log(error);
        }
    }

    /* * * * * * * * ** * * * * * * *
    /* Open and close modal
    /* * * * * * * * ** * * * * * * */
    const handleOpenModal = (id: any, title: any) => {
        const payload = {} as any;
        payload.id = id;
        payload.title = !!title ? title : false;

        setStyleToDelete({ id, title });
        setOpenModal(true);
    }

    const handleCloseModal = () => {
        setOpenModal(false);
    }

    /* * * * * * * * ** * * * * * * *
    /* Render
    /* * * * * * * * ** * * * * * * */
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
                                            Are you sure you want to delete <span className="font-semibold">{!!styleToDelete.title ? styleToDelete.title : ('this style')}</span>? This cannot be undone.
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
                                            onClick={handleDeleteStyle}
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
            <section className='w-[90%] mx-auto flex flex-col gap-4 h-full flex-grow'>

                <AddStyle handleAddStyle={handleAddNewStyle} />

                {!!styles && (
                    <div className="flex-grow grid grid-col-1 md:grid-cols-2 gap-8 auto-rows-min inset-0 bg-[radial-gradient(#e2e2e2_1px,transparent_1px)] [background-size:13px_13px] py-[5%] px-[2.5%]">

                        {!!styles.length && styles.map((style: any, index: number) => (
                            <Card key={index} className='flex flex-col gap-4 prose'>
                                <div className='flex items-center justify-start gap-4 text-sm'>
                                    <h2 className="mt-0 mb-0 capitalize">{style.title || 'Default Title'}</h2>
                                </div>

                                {/* Style processed information */}
                                {!!style.sample && (
                                    <div className="flex flex-col gap-4">
                                        <p className="m-0">
                                            <span className="font-semibold">Sample:</span> {style.sample}
                                        </p>
                                    </div>
                                )}

                                {/* Style keywords and description */}
                                {!!style.keywords && !!style.description && !style.sample ? (
                                    <div className="flex flex-col gap-4">

                                        {/* Style words */}
                                        {
                                            style.keywords ? (
                                                <div className="flex flex-wrap gap-2 w-full">
                                                    {style.keywords.map((word: any, index: number) => (
                                                        <div key={index} className="bg-gray-200 text-gray-500 px-4 rounded-full">
                                                            {word}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : null
                                        }

                                        {/* Style description */}
                                        {
                                            style.description ? (

                                                <p className="m-0">
                                                    {style.description}
                                                </p>

                                            ) : null
                                        }

                                    </div>
                                ) : null}

                                <div className="flex items-center justify-end gap-4 w-full">
                                    <button className="border border-gray-700 text-gray-700 px-4 rounded-md" onClick={() => handleEditStyle(style._id)}>Edit</button>
                                    <button className="text-red-500" onClick={() => handleOpenModal(style._id, style.title)}>Delete</button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}
