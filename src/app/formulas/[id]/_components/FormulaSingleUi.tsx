'use client'

import LoadingText from "@/components/_elements/LoadingText";
import Sidebar from "./Sidebar";
import { useState, useEffect, useMemo, use } from "react";
import Content from "./Content";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from 'next/navigation';
import { Fragment } from "react";
import { set } from "lodash";



type FormulaProps = {
    _id: string,
    titleData: string,
    instructionsData: any,
    formulaData?: string,
    thinkAboutData?: string,
    outlineData?: string,
    deleteFormula: any,
    updateFormula: any,
}

export default function FormulaSingleUi({
    _id,
    titleData,
    instructionsData,
    formulaData,
    thinkAboutData,
    outlineData,
    deleteFormula,
    updateFormula
}: FormulaProps) {



    /*
    It needs to work this way:
    - Steps can bve one of 3 types: Think about, outline, and generate
    - Steps follow a first, then, then, finally structure
    - In the generator, all processing happens first to engeneer a prompt
    Formulas are meant to generate a very speicifc response like an outline for a blog post or a particular tyope of email
    */

    const router = useRouter();

    /* * * * * * * * * * */
    // Use State
    /* * * * * * * * * * */
    const [editing, setEditing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [newFormula, setNewFormula] = useState({});

    const [title, setTitle] = useState(titleData || '');
    const [thinkAbout, setThinkAbout] = useState(thinkAboutData || '');
    const [outline, setOutline] = useState(outlineData || false);
    const [instructions, setInstructions] = useState<any>(instructionsData || '');


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
            thinkAbout,
            outline
        });
    }, [title, instructions, thinkAbout, outline]);

    /* * * * * * * * ** * * * * * * *
    /* Delete a formula
    /* * * * * * * * ** * * * * * * */
    const handleDeleteFormula = async () => {
        try {
            setDeleting(true);
            const data = await deleteFormula(_id);
            if (!data.success) throw new Error('Error deleting formula');
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
    const handleUpdateInstructions = (data: any) => {
        try {
            setInstructions(data);
        } catch (error) {
            console.log(error);
        }
    };
    const handleUpdateThinkAbout = (data: any) => {
        try {
            setThinkAbout(data);
        } catch (error) {
            console.log(error);
        }
    }
    const handleUpdateOutline = (data: any) => {
        try {
            setOutline(data);
        } catch (error) {
            console.log(error);
        }
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setUploading(true);
        const res = await updateFormula(_id, newFormula);
        if (!res.success) throw new Error('Error updating formula');
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
                    newFormula={newFormula}
                    setNewFormula={setNewFormula}
                    title={title}
                    setTitle={setTitle}
                    instructions={instructions}
                    handleUpdateInstructions={handleUpdateInstructions}
                    thinkAbout={thinkAbout}
                    handleUpdateThinkAbout={handleUpdateThinkAbout}
                    outline={outline}
                    handleUpdateOutline={handleUpdateOutline}
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
