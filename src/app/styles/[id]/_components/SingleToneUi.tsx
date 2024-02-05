'use client';

import { Fragment, useState } from "react";
import { useRouter } from 'next/navigation';
import { Dialog, Transition } from '@headlessui/react';
import LoadingText from "@/components/_elements/LoadingText";

import Content from "./Content";
import Sidebar from "./Sidebar";

type UiProps = {
    titleData: any,
    examplesData: any,
    descriptionData: any,
    keywordsData: any,
    sampleData: any,
    instructionsData: any,
    deleteTone: any,
    id: any,
    getEmbedding: any,
    getInstructions: any,
    processInstructions: any,
    generateSample: any,
    updateTone: any
}

function SingleToneUi({
    titleData,
    examplesData,
    descriptionData,
    keywordsData,
    sampleData,
    instructionsData,
    deleteTone,
    id,
    getEmbedding,
    getInstructions,
    processInstructions,
    generateSample,
    updateTone
}: UiProps) {
    const router = useRouter();

    const [title, setTitle] = useState(titleData || '');
    const [examples, setExamples] = useState(examplesData || []);
    const [description, setDescription] = useState(descriptionData || '');
    const [keywords, setKeywords] = useState(keywordsData || []);
    const [instructions, setInstructions] = useState(instructionsData || '');
    const [sample, setSample] = useState(sampleData || '');

    const [newExample, setNewExample] = useState('');
    const [displayAddExample, setDisplayAddExample] = useState(false);
    const [loading, setLoading] = useState<any>(false);
    const [progress, setProgress] = useState<any>('Initializing...');

    const [openModal, setOpenModal] = useState(false);
    const [deleting, setDeleting] = useState(false);


    const processTone = async (tone: any) => {
        try {

            const { examples, title } = tone;

            // ###
            // Get embeddings for each example
            setProgress('Breaking down each example...');
            const examplesWithEmbeddings = await Promise.all(examples.map(async (example: any) => {
                const text = example.text;
                const embedding = await getEmbedding(example.text);
                return { text: text, embedding: embedding };
            }));

            // ###
            // Split examples into chunks of 5 and add to array for processing
            setProgress('Processing examples...');
            const examplesToProcess: string[] = [];
            let string = "";
            examplesWithEmbeddings.forEach((example: any, index: number) => {
                if (index % 10 === 0 && index !== 0) {
                    examplesToProcess.push(string);
                    string = "";
                }
                string += `### Start new example ###\n${example.text}\n### End of example ###\n`;
            }
            );
            examplesToProcess.push(string);

            // ###
            // Instructions
            setProgress('Generating tone blueprint (this can take a minute or two)');
            let instructionsList: any[] = [];
            await Promise.all(examplesToProcess.map(async (example: string) => {
                const instructions = await getInstructions(example);
                instructionsList.push(instructions);
            }
            ));

            const instructions = await processInstructions(instructionsList) as any;

            // // ###
            // // Format newTone
            const newTone = {
                title: title,
                examples: examplesWithEmbeddings,
                instructions: instructions
            }

            setProgress('Done!');

            return newTone;
        } catch (error) {
            console.log(error);
            setProgress('Error processing tone');
        }
    }


    /* * * * * * * * * * * * * * * * *
        /* Update the tone
        /* * * * * * * * * * * * * * * * */
    const handleUpdateTone = async () => {
        try {
            setLoading(true);
            const newTone = await processTone({ title: title, examples: examples }) as any;
            // ###
            // Generate sample
            setProgress('Generating sample...');
            const sampleResponse = await generateSample(newTone)
            newTone.sample = sampleResponse;
            setSample(sampleResponse);

            const payload = {
                id: id,
                update: newTone
            }
            const data = await updateTone(payload);

            if (!data.success) throw new Error('Error updating tone of voice');

            setLoading(false);
            setProgress('Initializing...');

        } catch (error) {
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

    /* * * * * * * * * * * * * * * * *
    /* Delete the tone
    /* * * * * * * * * * * * * * * * */
    const handleDeleteTone = async () => {
        try {
            setDeleting(true)
            const res = await deleteTone(id);
            setOpenModal(false);
            setDeleting(false);
            router.push('/styles');

        }
        catch (error) {
            console.log(error);
        }
    }

    /* * * * * * * * * * * * * * * * *
    /* Add an example
    /* * * * * * * * * * * * * * * * */
    const handleAddExample = (example: any) => {
        if (!example) return;
        const newExamples = [...examples] as any;
        newExamples.push({ "text": example });
        setNewExample('');
        setExamples(newExamples);
    }

    /* * * * * * * * * * * * * * * * * */
    /* Update an example
    /* * * * * * * * * * * * * * * * * */
    const handleUpdateExample = (index: number, example: any) => {
        if (!example) return;
        const newExamples = [...examples] as any;
        newExamples[index] = example;
        setExamples(newExamples);
    }

    /* * * * * * * * * * * * * * * * * */
    /* Delete an example
    /* * * * * * * * * * * * * * * * * */
    const handleDeleteExample = (index: number) => {
        const newExamples = [...examples];
        newExamples.splice(index, 1);
        setExamples(newExamples);
    }

    /* * * * * * * * * * * * * * * * * */
    /* Render
    /* * * * * * * * * * * * * * * * * */
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
                                            Are you sure you want to delete <span className="font-semibold">{!!title ? title : ('this tone')}</span>? This cannot be undone.
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
                                            onClick={() => { handleDeleteTone() }}
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
                    sample={sample}
                    examples={examples}
                    setExamples={setExamples}
                    newExample={newExample}
                    setNewExample={setNewExample}
                    displayAddExample={displayAddExample}
                    setDisplayAddExample={setDisplayAddExample}
                    handleAddExample={handleAddExample}
                    handleUpdateExample={handleUpdateExample}
                    handleDeleteExample={handleDeleteExample}
                />

                <Sidebar
                    className={'col-span-6 lg:col-span-2 gap-4 rounded-lg sticky bottom-0 lg:flex lg:flex-col lg:justify-end lg:flex-grow p-0 lg:p-4 bg-transparent lg:bg-neutral-50'}
                    description={description}
                    setDescription={setDescription}
                    keywords={keywords}
                    setKeywords={setKeywords}
                    instructions={instructions}
                    setInstructions={setInstructions}
                    title={title}
                    handleUpdateTone={handleUpdateTone}
                    handleOpenModal={handleOpenModal}
                    loading={loading}
                    progress={progress}
                />
            </section>
        </>
    )
}

export default SingleToneUi;