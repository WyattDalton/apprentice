'use client'

import Card from '@/components/_ui/Card';
import React, { Fragment, useEffect, useState } from 'react';
import AddFormula from './AddFormula';
import { useRouter } from 'next/navigation';
import { Dialog, Transition } from '@headlessui/react';
import LoadingText from '@/components/_elements/LoadingText';

type FormulaLibraryProps = {
    formulasData: any
}

export default function FormulasUi({ formulasData }: FormulaLibraryProps) {

    const router = useRouter();
    const [formulas, setFormulas] = useState(formulasData || []);
    const [newFormula, setNewFormula] = useState({
        title: '',
        instructions: [],
        formula: '',
    });

    const [openModal, setOpenModal] = useState(false);
    const [formulaToDelete, setFormulaToDelete] = useState({ id: '', title: '' });
    const [deleting, setDeleting] = useState(false);

    /* * * * * * * * ** * * * * * * *
    /* Add a new formula
    /* * * * * * * * ** * * * * * * */
    const handleAddNewFormula = async () => {
        try {
            const payload = {
                'dataType': 'create',
                'data': newFormula
            }
            const res = await fetch('/api/formulas', {
                method: 'POST',
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error('Error creating formula of voice');
            const data = await res.json();
            router.push(`/formulas/${data.formula}`);
        }
        catch (error) {
            console.log(error);
        }
    }

    /* * * * * * * * ** * * * * * * *
    /* Delete a formula
    /* * * * * * * * ** * * * * * * */
    const handleDeleteFormula = async (_id: string) => {
        try {
            setDeleting(true);

            const payload = {
                'dataType': 'delete',
                'data': { _id: _id },
            }
            const res = await fetch('/api/formulas', {
                method: 'POST',
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error('Error deleting formula of voice');
            const data = await res.json();
            setFormulas(data.formulas);
            setDeleting(false);
            handleCloseModal();
        }
        catch (error) {
            console.log(error);
        }
    }

    /* * * * * * * * ** * * * * * * *
    /* Edit a formula
    /* * * * * * * * ** * * * * * * */
    const handleEditFormula = (_id: string) => {
        try {
            router.push(`/formulas/${_id}`);
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

        setFormulaToDelete({ id, title });
        setOpenModal(true);
    }

    const handleCloseModal = () => {
        setFormulaToDelete({ id: '', title: '' });
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
                                            Are you sure you want to delete <span className="font-semibold">{!!formulaToDelete.title ? formulaToDelete.title : ''}</span>? This cannot be undone.
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
                                            onClick={() => handleDeleteFormula(formulaToDelete.id)}
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

            <section className='flex flex-col gap-4 h-full flex-grow rounded-2xl bg-white p-6'>

                <button onClick={() => router.back} className="text-gray-700">Back</button>
                <AddFormula handleAddFormula={handleAddNewFormula} type="create" />
                <button onClick={() => router.push('/')} className="text-gray-700">Close</button>

                {!!formulas.length && (
                    <div className="flex-grow grid grid-col-1 md:grid-cols-2 gap-8 auto-rows-min inset-0 bg-[radial-gradient(#e2e2e2_1px,transparent_1px)] [background-size:13px_13px] py-[5%] px-[2.5%]">
                        {formulas.map((formula: any, index: number) => (
                            <Card key={index} className='flex flex-col gap-4 prose'>

                                <div className='flex items-center justify-start gap-4 text-sm'>
                                    <h2 className="mt-0 mb-0 capitalize">{formula.title || 'Default Title'}</h2>
                                </div>

                                {!!formula.instructions.length && (
                                    <div className="flex flex-col gap-4">
                                        <div className="flex flex-col gap-2 divide-y divide-gray-200">
                                            {formula.instructions.map((instruction: any, index: number) => (
                                                <div className="flex gap-2 justify-start items-start pt-4" key={index}><span className='bg-gray-700 aspect-square w-8 p-0 flex justify-center items-center text-white rounded-md'>{(index + 1)}</span>{instruction.title}</div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-end gap-4 w-full">
                                    <button className="border border-gray-700 text-gray-700 px-4 rounded-md" onClick={() => handleEditFormula(formula._id)}>Edit</button>
                                    <button className="text-red-500" onClick={() => handleOpenModal(formula._id, formula.title)}>Delete</button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

            </section>
        </>
    );
}
