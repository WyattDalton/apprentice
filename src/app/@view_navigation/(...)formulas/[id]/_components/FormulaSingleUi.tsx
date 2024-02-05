'use client'

import LoadingText from "@/components/_elements/LoadingText";
import Sidebar from "./Sidebar";
import { useState, useEffect, useMemo } from "react";
import Content from "./Content";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from 'next/navigation';
import { Fragment } from "react";


type FormulaProps = {
    _id: string,
    titleData: string,
    instructionsData: any,
    formulaData: string,
}

export default function FormulaSingleUi({ _id, titleData, instructionsData, formulaData }: FormulaProps) {

    const router = useRouter();

    /* * * * * * * * * * */
    // Use State
    /* * * * * * * * * * */
    const [editing, setEditing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [newFormula, setNewFormula] = useState({});
    const [title, setTitle] = useState(titleData || '');
    const [instructions, setInstructions] = useState(instructionsData || []);
    const [format, setFormat] = useState(formulaData || '');

    const [openModal, setOpenModal] = useState(false);
    const [formulaToDelete, setFormulaToDelete] = useState({ id: '', title: '' });
    const [deleting, setDeleting] = useState(false);

    /* * * * * * * * * * */
    // Update Formula on data change
    /* * * * * * * * * * */
    useEffect(() => {
        setNewFormula({
            title,
            instructions,
            format,
        });
    }, [title, instructions, format]);

    /* * * * * * * * ** * * * * * * *
    /* Delete a formula
    /* * * * * * * * ** * * * * * * */
    const handleDeleteFormula = async () => {
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
            setDeleting(false);
            handleCloseModal();
            router.push('/formulas');
        }
        catch (error) {
            console.log(error);
        }
    }

    /* * * * * * * * ** * * * * * * *
    /* Open and close modal
    /* * * * * * * * ** * * * * * * */
    const handleOpenModal = (id: any, title: any) => {
        setOpenModal(true);
    }

    const handleCloseModal = () => {
        setOpenModal(false);
    }

    /* * * * * * * * * * */
    // Handle Functions
    /* * * * * * * * * * */
    // Hook for handline instruction actions
    const handleUpdateInstructions = (e: any, index: number) => {
        const action = e.target.dataset.action;
        let newInstructions = [...instructions] as any;

        switch (action) {
            case 'add-instruction':
                newInstructions = [
                    ...newInstructions,
                    { title: '', instruction: '', example: '' },
                ];
                break;
            case 'remove-instruction':
                newInstructions = [
                    ...newInstructions.slice(0, index),
                    ...newInstructions.slice(index + 1),
                ];
                break;
            case 'update-instruction-title':
                newInstructions = newInstructions.map((instr: any, idx: any) =>
                    idx === index ? { ...instr, title: e.target.value } : instr
                );
                break;
            case 'update-instruction-text':
                newInstructions = newInstructions.map((instr: any, idx: any) =>
                    idx === index ? { ...instr, instruction: e.target.value } : instr
                );
                break;
            case 'update-instruction-example':
                newInstructions = newInstructions.map((instr: any, idx: any) =>
                    idx === index ? { ...instr, example: e.target.value } : instr
                );
                break;
            default:
                break;
        }
        setInstructions(newInstructions);
    };

    // Handle instruction insert into formula
    const handleInsertInstruction = (instructionIndex: any) => {
        setNewFormula((prevFormula: any) => {
            const updatedInstructions = [...prevFormula.instructions];

            let updatedFormula = prevFormula.formula;

            const instruction = `<${updatedInstructions[instructionIndex].title}>`;

            // Check if the instruction is already present in the formula
            const isInstructionPresent = updatedFormula.includes(instruction);

            // Add or remove the instruction from the formula based on its presence
            if (isInstructionPresent) {
                // Remove the instruction from the formula
                updatedFormula = updatedFormula.replace(instruction, '');
            } else {
                // Add the instruction to the formula at the current cursor position
                const textarea = document.getElementById('formula') as any;
                const { selectionStart, selectionEnd } = textarea;

                updatedFormula =
                    updatedFormula.slice(0, selectionStart) +
                    instruction +
                    updatedFormula.slice(selectionEnd);
            }

            return {
                ...prevFormula,
                instructions: updatedInstructions,
                formula: updatedFormula,
            };
        });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setUploading(true);

        const payload = {
            dataType: 'update',
            data: {
                _id: _id,
                update: newFormula,
            },
        }
        const res = await fetch('/api/formulas', {
            method: 'POST',
            body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error('Error updating formula');

        const data = await res.json();

        setUploading(false);

    };

    /* * * * * * * * * * */
    // Render
    /* * * * * * * * * * */
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
                                            Are you sure you want to delete <span className="font-semibold">{!!title ? title : ('this formula')}</span>? This cannot be undone.
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
                                            onClick={handleDeleteFormula}
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
            flex-grow 
            h-full 
            grid 
            grid-cols-6
            w-[90%] 
            mx-auto
            gap-4 
        ">
                <Content
                    className="col-span-6 lg:col-span-4 flex flex-col items-center gap-4 bg-[radial-gradient(#e2e2e2_1px,transparent_1px)] [background-size:13px_13px] py-[5%] px-[2.5%]"
                    title={title}
                    setTitle={setTitle}
                    instructions={instructions}
                    setInstructions={setInstructions}
                    newFormula={newFormula}
                    setNewFormula={setNewFormula}
                    handleUpdateInstructions={handleUpdateInstructions}
                    format={format}
                    setFormat={setFormat}
                    handleInsertInstruction={handleInsertInstruction}
                />
                <Sidebar
                    className="col-span-6 mlg:col-span-2 gap-4 rounded-lg sticky bottom-0 lg:flex lg:flex-col lg:justify-end lg:flex-grow p-0 lg:p-4 bg-transparent lg:bg-neutral-50"
                    title={title}
                    handleSubmit={handleSubmit}
                    handleOpenModal={handleOpenModal}
                    uploading={uploading}
                />
            </section>
        </>
    );
};
