'use client';

import { Fragment, useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import { Dialog, Disclosure, Tab, Transition } from '@headlessui/react';
import LoadingText from "@/components/_elements/LoadingText";

import Examples from "./Examples";
import Actions from "./Actions";
import LoadingSpinner from "@/components/_elements/LoadingSpinner";
import Card from "@/components/_ui/Card";
import { CheckIcon, EditIcon, GeneratorArrowIcon } from "@/components/_elements/icons";
import TextareaAutosize from "./TextAreaAutosize";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { set } from "lodash";

type UiProps = {
    titleData: any,
    examplesData: any,
    descriptionData: any,
    keywordsData: any,
    sampleData: any,
    iterationData: any,
    bluePrintData: any,
    deleteStyle: any,
    id: any,
    getEmbedding: any,
    getInstructions: any,
    generateBlueprint: any,
    generateSample: any,
    updateStyle: any,
    generateComparison: any
}

function SingleStyleUi({
    titleData,
    examplesData,
    descriptionData,
    keywordsData,
    sampleData,
    iterationData,
    bluePrintData,
    deleteStyle,
    id,
    getEmbedding,
    getInstructions,
    generateBlueprint,
    generateSample,
    updateStyle,
    generateComparison
}: UiProps) {
    const router = useRouter();
    const updateEmbedding = useRef<NodeJS.Timeout | null>(null);

    // Style data
    const [title, setTitle] = useState(titleData || '');
    const [examples, setExamples] = useState(examplesData || []);
    const [description, setDescription] = useState(descriptionData || '');
    const [keywords, setKeywords] = useState(keywordsData || []);
    const [bluePrint, setBluePrint] = useState(bluePrintData || '');
    const [iteration, setIteration] = useState(iterationData || []);
    const [sample, setSample] = useState(sampleData || '');

    // Refinement state
    const [refinedBlueprint, setRefinedBlueprint] = useState('');
    const [refinedSample, setRefinedSample] = useState('');
    const [refinedSampleComparison, setRefinedSampleComparison] = useState('');

    // Functional state
    const [newExample, setNewExample] = useState('');
    const [displayAddExample, setDisplayAddExample] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openRegenModal, setOpenRegenModal] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [editingTitle, setEditingTitle] = useState(false);
    const [editBlueprint, setEditBlueprint] = useState(false);
    const [editStyleRefinement, setEditStyleRefinement] = useState(false);
    const [StyleRefinementSubmitted, setStyleRefinementSubmitted] = useState(false);

    // Loading state
    const [loading, setLoading] = useState<any>(false);
    const [progress, setProgress] = useState<any>('Initializing...');


    useEffect(() => {
        if (!titleData) {
            setEditingTitle(true);
        } else {
            setEditingTitle(false);
        }
    }, [titleData])

    /**
     * Processes an array of examples asynchronously.
     * 
     * @param examplesArray - The array of examples to process.
     * @returns A Promise that resolves to the processed examples.
     */
    const processExamples = async (examplesArray = examples as any) => {
        const processedExamples = await Promise.all(
            examplesArray.map(async (example: any) => {
                try {
                    if (!example.embedding || !example.text) setProgress('Analyzing new examples');
                    const newExample = {} as any;
                    newExample.text = example.text ? example.text : example;
                    newExample.embedding = example.embedding ? example.embedding : await getEmbedding(newExample.text);
                    return newExample;
                } catch (err) {
                    console.log(err);
                }
            })
        );
        setExamples(processedExamples);
        return processedExamples;
    }

    /**
     * Processes the iteration and examples arrays.
     * If the iteration array is empty, it adds an initial iteration message and examples to the iteration.
     * @param iterationArray - The iteration array to process.
     * @param examplesArray - The examples array to process.
     * @returns An object containing the processed iteration and examples arrays.
     */
    const processIterationInit = async (iterationArray = iteration as any, examplesArray = examples as any) => {
        try {
            // If iteration does not have a length, create the initial structure
            setProgress('Generating style blueprint');

            if (!iterationArray.length) {
                // ###
                // ### Add initial iteration message that sets the stage for the style
                const initIterationMessage = {
                    "role": "system",
                    "content": "You are very good at describing the style, sentence structure, and tone of voice used in writing samples supplied by the user. Your purpose is to describe the elements of style demonstrated in these examples well enough that an AI writer can mimic the style, sentence structure, and tone of voice perfectly. You even use examples inside your instructions to show how text should formatted.\n\nThese are the elements of style that you are concerned with copying from the examples: sentence structure, word choice, emotion(or lack of emotion), penmanship(how does the author treat capitalizations, hyphens, dashes, etc... Pay attention to any deviations from standard) and diction, creative language or lack of creative language",
                };
                iterationArray.push(initIterationMessage);

                // ###
                // ### Add initial examples to iteration
                examplesArray.forEach((example: any, index: any) => {
                    const newIterationMessage = {
                        "role": "user",
                        "content": `Initial example ${index + 1}: ${example.text}.`
                    }
                    iterationArray.push(newIterationMessage);
                });
            }
            setIteration(iterationArray);
            return iterationArray;
        } catch (error) {
            console.log('error in processIterationInit: ', error);
        }
    }

    /**
     * Processes the blueprint and adds it to the iteration.
     * @param iterationArray - The array of iterations.
     * @returns An object containing the processed blueprint and updated iteration array.
     */
    const processBlueprint = async (iterationArray = iteration as any) => {
        try {
            // ###
            // ### Process blueprint
            let bluePrintString = await generateBlueprint(iterationArray) as any;
            setBluePrint(bluePrintString);

            // ###
            // ### Add initial blueprint to iteration
            const bluePrintMessage = {
                "role": "system",
                "content": bluePrint
            }

            // ###
            // ### Set the initial iteration messages
            iterationArray.push(bluePrintMessage);
            setIteration(iterationArray);
            return bluePrintString;
        } catch (error) {
            console.log('error in processBlueprint: ', error);
        }
    }

    /**
     * Processes a sample by generating it, adding it to the iteration, and returning the sample and iteration.
     * @param bluePrintString - The blue print string.
     * @param examplesArray - The examples array.
     * @param iterationArray - The iteration array.
     * @returns An object containing the generated sample and the updated iteration array.
     */
    const processSample = async (
        bluePrintString = bluePrint as any,
        examplesArray = examples as any,
        iterationArray = iteration as any
    ) => {
        try {
            // ###
            // Generate sample
            setProgress('Generating sample...');
            const sampleResponse = await generateSample(
                { "examples": examplesArray, "bluePrint": bluePrintString },
                'Generate a sample of the style'
            )
            setSample(sampleResponse);

            // ###
            // ### Add sample to iteration
            const sampleMessage = {
                "role": "assistant",
                "content": `This is a sample of the style: ${sampleResponse}`
            }
            const iterations = iterationArray;
            iterations.push(sampleMessage);
            setIteration(iterations);

            return sampleResponse;
        } catch (error) {
            console.log('error in processSample: ', error);
        }
    }

    /**
     * Handles the regeneration of a sample for the style.
     * @param prompt The prompt for generating the sample.
     * @returns The regenerated sample response.
     */
    const handleRegenerateSample = async (prompt = 'Generate a sample of the style' as string) => {
        try {
            setLoading(true);
            setProgress('Regenerating sample...');

            const sampleResponse = await generateSample(
                { "examples": examples, "bluePrint": bluePrint },
                prompt
            )

            setSample(sampleResponse);
            setLoading(false);
            setProgress('');

            return sampleResponse;
        } catch (err) {
            console.log(err);
        }
    }

    /* * * * * * * * * * * * * * * * *
    /* Style updating functions
    /* * * * * * * * * * * * * * * * */

    /**
    * Processes the style data and returns a new style object.
    * @param titleData - The title data for the style.
    * @param examplesData - The examples data for the style.
    * @returns A new style object.
    */
    const processStyle = async (
        titleData = title as any,
        examplesData = examples as any,
    ) => {
        try {
            setProgress('Processing style...');

            // ###
            // Init newStyle
            const newStyle = {} as any;
            newStyle['title'] = titleData;

            const examplesArray = await processExamples(examplesData);
            if (!!examplesArray) {
                newStyle['examples'] = examplesArray;
            } else {
                setProgress('Error processing examples');
                return;
            }

            const iterationArray = await processIterationInit(iteration, examplesArray);
            if (!!iterationArray) {
                newStyle['iteration'] = iterationArray.iteration;
            } else {
                setProgress('Error processing iteration');
                return;
            }

            setProgress('Generating blueprint...');
            const bluePrintString = await processBlueprint(iterationArray.iteration);
            if (!!bluePrintString) {
                newStyle['bluePrint'] = bluePrintString;
            } else {
                setProgress('Error processing blueprint');
                return;
            }

            // ###
            // ### If sample does not exist, generate a new sample
            setProgress('Generating sample...');
            const sampleString = await processSample(bluePrintString, examplesArray, iterationArray.iteration);
            if (!!sampleString) {
                newStyle['sample'] = sampleString;
            } else {
                setProgress('Error processing sample');
                return;
            }

            setProgress('Done!');

            return newStyle;

        } catch (error) {
            console.log('error in processStyle: ', error);
            setProgress('Error processing style');
        }
    }

    /**
     * Handles the update of a style.
     * @returns {Promise<void>} A promise that resolves when the style is updated.
     */
    const handleUpdateStyle = async () => {
        try {
            setLoading(true);
            const newStyle = await processStyle(title, examples) as any;
            const payload = newStyle;
            const data = await updateStyle(id, payload);

            if (!data.success) throw new Error('Error updating style');

            setLoading(false);
            setProgress('Initializing...');

        } catch (error) {
            console.log('error in handleUpdate: ', error);
        }
    }


    /**
     * Handles the refinement of a style.
     * 
     * @param refinement - The refinement to be applied to the style.
     * @returns {Promise<void>} - A promise that resolves when the refinement is complete.
     */
    const handleRefineSample = async (): Promise<void> => {
        try {

            setLoading(true);
            setProgress('Refining style...');
            if (!refinedSample || refinedSample === sample) {
                setProgress('No refinement submitted. Change the sample and resubmit.');
                setTimeout(() => {
                    setProgress('');
                    setLoading(false);
                }, 3000);
                return;
            }

            const iterationMessages = iteration;
            const refinement = refinedSample;

            // ###
            // ### If an iteration refinement is submitted, have the AI analyze the differences between the sample and the refinement...
            const comparisionMessage = {
                "role": "user",
                "content": `This is how the sample should look in order to mimic the correct style: ${refinement} \n\n Compare the sample you provided to the refinement and describe the differences. How would you change the sample to make it more like the refinement?`
            }
            iterationMessages.push(comparisionMessage);

            // ###
            // ### Then get the comparison
            const comparisionResponse = await generateComparison(iterationMessages);
            setStyleRefinementSubmitted(true);

            // ###
            // ### Set the comparison in the state
            setRefinedSampleComparison(comparisionResponse);

            // ###
            // ### Add the comparison to the iteration
            iterationMessages.push({
                "role": "assistant",
                "content": comparisionResponse
            });

            // ###
            // ### Generate a new sample
            setProgress('Generating new sample...');
            const newSample = await generateSample(
                { "examples": examples, "bluePrint": bluePrint },
                'Generate a sample of the style that matches the other examples'
            );

            setProgress('Done!');
            setSample(newSample);

            const payload = { "sample": newSample, "iteration": iterationMessages };
            const data = await updateStyle(id, payload);
            if (!data.success) throw new Error('Error updating style');

            setLoading(false);
            setProgress('');
            setRefinedSample('');
            setEditStyleRefinement(false);

        } catch (error) {
            console.log('error in handleStyleIteration: ', error);
        }
    }

    const handleRefineBlueprint = async () => {
        try {

            setLoading(true);
            setProgress('Refining blueprint...');

            if (!refinedBlueprint || refinedBlueprint === bluePrint) {
                setProgress('No refinement submitted. Change the blueprint and resubmit.');
                setTimeout(() => {
                    setProgress('');
                    setLoading(false);
                }, 3000);
                return;
            }

            setBluePrint(refinedBlueprint);

            const payload = { "bluePrint": refinedBlueprint };
            const data = await updateStyle(id, payload);
            if (!data.success) throw new Error('Error updating style');

            setLoading(false);
            setProgress('');
            setRefinedBlueprint('');
            setEditBlueprint(false);

        } catch (error) {
            console.log('error in handleRefineBlueprint: ', error);
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
    const handleOpenRegenModal = () => {
        try {
            setOpenRegenModal(true);
        } catch (error) {
            console.log(error);
        }
    }

    const handleCloseModal = () => {
        setOpenModal(false);
        setOpenRegenModal(false);
    }


    /* * * * * * * * * * * * * * * * *
    /* Delete the style
    /* * * * * * * * * * * * * * * * */
    const handleDeleteStyle = async () => {
        try {
            setDeleting(true)
            const res = await deleteStyle(id);
            setOpenModal(false);
            setDeleting(false);
            router.push('/styles');
        }
        catch (error) {
            console.log(error);
        }
    }

    const handleUpdateTitle = async (title: string) => {
        try {
            if (!title) return;
            setLoading(true);
            setProgress('Updating title...');
            setTitle(title);
            const data = await updateStyle(id, { 'title': title });
            if (!data.success) {
                setProgress('Error updating title');
                throw new Error('Error updating style')
            }
            setProgress('');
            setLoading(false);
        } catch (err) {
            setProgress('Error updating title');
            console.log(err);
        }
    }

    /* * * * * * * * * * * * * * * * *
    /* Add an example
    /* * * * * * * * * * * * * * * * */
    const handleAddExample = async (example: any) => {
        try {
            if (!example) return;
            setLoading(true);
            setProgress('Adding example...');
            const payload = {} as any;
            payload['text'] = example;
            payload['embedding'] = await getEmbedding(example);
            const newExamples = [...examples] as any;
            newExamples.push(payload);
            setNewExample('');
            setExamples(newExamples);

            const data = await updateStyle(id, { 'examples': newExamples });
            if (!data.success) {
                setProgress('Error updating example');
                throw new Error('Error updating style')
            }

            setProgress('');
            setLoading(false);
        } catch (err) {
            setProgress('Error adding example');
            console.log(err);
        }
    }

    /* * * * * * * * * * * * * * * * * */
    /* Update an example
    /* * * * * * * * * * * * * * * * * */
    const handleUpdateExample = async (index: number, example: any) => {
        try {
            if (!example) return;
            setLoading(true);
            setProgress('Updating example...');

            const payload = {} as any;
            payload['text'] = example;
            payload['embedding'] = [];
            const newExamples = [...examples] as any;
            newExamples[index] = payload;
            setExamples(newExamples);

            // If the example has not changed in 500ms, get the embedding and update the example
            if (updateEmbedding.current) {
                clearTimeout(updateEmbedding.current);
            }
            updateEmbedding.current = setTimeout(async () => {

                payload.embedding = await getEmbedding(example);
                newExamples[index] = payload;
                setExamples(newExamples);

                const data = await updateStyle(id, { 'examples': newExamples });
                if (!data.success) {
                    setProgress('Error updating example');
                    throw new Error('Error updating style')
                }

                setProgress('');
                setLoading(false);
            }, 1000);
        } catch (err) {
            setProgress('Error updating example');
            console.log(err);
        }
    }

    /* * * * * * * * * * * * * * * * * */
    /* Delete an example
    /* * * * * * * * * * * * * * * * * */
    const handleDeleteExample = (index: number) => {
        try {
            setLoading(true);
            setProgress('Deleting example...');
            const newExamples = [...examples];
            newExamples.splice(index, 1);
            setExamples(newExamples);
            const data = updateStyle(id, { 'examples': newExamples });
            if (!data.success) {
                setProgress('Error updating example');
            }
            setProgress('');
            setLoading(false);
        } catch (err) {
            setProgress('Error deleting example');
            console.log(err);
        }
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
                                            Are you sure you want to delete <span className="font-semibold">{!!title ? title : ('this style')}</span>? This cannot be undone.
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
                                            onClick={() => { handleDeleteStyle() }}
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

            <Transition appear show={openRegenModal} as={Fragment}>
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
                                        Overwrite style?
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Are you sure you want to regenerate <span className="font-semibold">{!!title ? title : ('this style')}</span>? This will overwrite your current blueprint, sample, and refinements. This cannot be undone.
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
                                            className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 ml-2"
                                            onClick={() => {
                                                setIteration([]);
                                                setBluePrint('');
                                                setSample('');
                                                handleUpdateStyle();
                                                handleCloseModal();
                                            }}
                                        >
                                            Regenerate
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <section className="inset-0 bg-[radial-gradient(#e2e2e2_1px,transparent_1px)] [background-size:16px_16px] flex flex-col flex-grow px-[5%]">
                <div className="w-full max-w-[800px] p-4 mx-auto flex flex-col">
                    <div className="flex items-center gap-4 justify-end gap-2 mb-4">
                        {
                            !!bluePrint.length ? (
                                <button className="text-gray-700 px-2 lg:px-4 py-2 flex gap-2 justify-center items-center border-gray-500 border rounded-md max-w-max" onClick={() => { handleOpenRegenModal() }}>Regenerate <GeneratorArrowIcon className="w-4 h-4" /></button>
                            ) : ('')
                        }
                        <button className="text-red-700" onClick={handleOpenModal}>Delete style</button>
                    </div>
                    <div className="flex items-center w-full flex-grow items-center gap-4">
                        {!!editingTitle ? (
                            <Card className="!p-0 !mb-0 flex-grow">
                                <input type="text" className="w-full text-gray-500 text-2xl font-bold p-2 bg-neutral-50" value={title} placeholder="Give the style a title" onChange={(e) => setTitle(e.target.value)} />
                            </Card>
                        ) : (
                            <h1 className="text-2xl font-bold !m-0 !mb-0 flex-grow"><span className="block text-gray-500 text-sm">Style title</span>{title}</h1>
                        )}
                        {!!editingTitle ? (
                            <button className="bg-gray-700 text-white rounded-md flex gap-2 justify-center items-center px-4 py-2 h-full" onClick={() => {
                                setEditingTitle(!editingTitle)
                                handleUpdateTitle(title)
                            }
                            }>
                                <CheckIcon className="w-6 h-6" />
                                <span className="text-lg hide lg:block">Save Title</span>
                            </button>
                        ) : (
                            <button className="w-8 aspect-square text-gray-700 flex justify-center items-center" onClick={() => setEditingTitle(!editingTitle)}>
                                <EditIcon className="w-6 h-6" />
                            </button>
                        )}
                    </div>
                </div>
                <Tab.Group>
                    <Tab.Panels
                        className={`flex-grow w-full max-w-[800px] p-4 mx-auto`}
                    >
                        <Tab.Panel className={`flex-grow`}>
                            <Examples
                                className="flex-grow w-full !overflow-visible !mb-0"
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
                        </Tab.Panel>

                        <Tab.Panel className={`flex-grow`}>
                            {!!sample && (
                                <Card className="flex flex-col gap-4 !bg-neutral-50 mb-6">
                                    <div className="pb-2 border-b border-gray-400">
                                        <h3 className="text-gray-500 text-lg font-bold !m-0">Sample</h3>
                                        <p>This is a sample of the style. To refine the style, type directly into the field below to change the sample. Apprentice will learn from the changes you make!</p>
                                    </div>
                                    {!!StyleRefinementSubmitted && (
                                        <Disclosure>
                                            {({ open }) => (
                                                <>
                                                    <Disclosure.Button className={`py-2 px-4 rounded-md max-w-full w-max mr-auto flex justify-center items-center gap-2 bg-gray-700 text-white`}>
                                                        {!!refinedSampleComparison.length ? ('Refinement details') : ('Analyzing difference...')}
                                                    </Disclosure.Button>
                                                    <Transition
                                                        className={'bg-gray-700 text-white p-6 rounded-xl left-0 top-full w-full shadow-lg max-h-[70vh] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200'}
                                                        show={open}
                                                        enter="transition duration-150 ease-out"
                                                        enterFrom="transform -translate-y-6 opacity-0"
                                                        enterTo="transform translate-y-0 opacity-100"
                                                        leave="transition duration-150 ease-out"
                                                        leaveFrom="transform translate-y-0 opacity-100"
                                                        leaveTo="transform -translate-y-6 opacity-0"
                                                    >
                                                        <Disclosure.Panel static>
                                                            <ReactMarkdown
                                                                className="mt-0"
                                                                linkTarget="_blank"
                                                                transformLinkUri={null}
                                                                skipHtml={false}
                                                                rehypePlugins={[rehypeRaw]}
                                                            >
                                                                {(refinedSampleComparison || '') as string}
                                                            </ReactMarkdown>
                                                        </Disclosure.Panel>
                                                    </Transition>
                                                </>
                                            )}
                                        </Disclosure>
                                    )}

                                    {!!editStyleRefinement ? (
                                        <TextareaAutosize
                                            className="w-full text-gray-500 text-lg border-2 border-gray-200 border-dashed rounded-md p-4 resize-none transition-all duration-300 ease-in-out focus:border-gray-300 focus:ring-0"
                                            value={refinedSample || sample}
                                            onChange={(e: any) => setRefinedSample(e.target.value)}
                                            placeholder="Type here to refine the style..."
                                        />
                                    ) : (
                                        <ReactMarkdown
                                            className="mt-0 text-lg prose"
                                            linkTarget="_blank"
                                            transformLinkUri={null}
                                            skipHtml={false}
                                            rehypePlugins={[rehypeRaw]}
                                        >
                                            {(sample || '') as string}
                                        </ReactMarkdown>
                                    )}

                                    <div className="flex items-center justify-end gap-4">
                                        {!editStyleRefinement ? (
                                            <>
                                                <button onClick={() => setEditStyleRefinement(true)}>Refine sample</button>
                                                <button onClick={() => handleRegenerateSample()}>Regenerate sample</button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => handleRefineSample()}>Submit</button>
                                                <button onClick={() => setEditStyleRefinement(false)}>Cancel</button>
                                            </>
                                        )}
                                    </div>
                                </Card>
                            )}

                            {!!bluePrint && (
                                <div className="flex flex-col gap-2 mb-6">
                                    <div className="pb-2 border-b border-gray-200">
                                        <h3 className="text-gray-500 text-lg font-bold !m-0">Blueprint</h3>
                                        <p>The blueprint is a set of instructions that Apprentice can use to recreate this style in regular generations.</p>
                                    </div>
                                    {!!editBlueprint ? (
                                        <TextareaAutosize
                                            className="w-full text-gray-500 text-lg border-2 border-gray-200 border-dashed rounded-md p-4 resize-none transition-all duration-300 ease-in-out focus:border-gray-300 focus:ring-0"
                                            value={refinedBlueprint || bluePrint}
                                            onChange={(e: any) => setRefinedBlueprint(e.target.value)}
                                            placeholder="Type here to change the blueprint..."
                                        />
                                    ) : (
                                        <ReactMarkdown
                                            className="mt-0 text-lg prose"
                                            linkTarget="_blank"
                                            transformLinkUri={null}
                                            skipHtml={false}
                                            rehypePlugins={[rehypeRaw]}
                                        >
                                            {(bluePrint || '') as string}
                                        </ReactMarkdown>
                                    )}

                                    <div className="flex items-center justify-end gap-4">
                                        {!editBlueprint ? (
                                            <button className="" onClick={() => setEditBlueprint(true)}>Edit blueprint</button>
                                        ) : (
                                            <>
                                                <button onClick={() => handleRefineBlueprint()}>Submit</button>
                                                <button onClick={() => setEditBlueprint(false)}>Cancel</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </Tab.Panel>
                    </Tab.Panels>

                    <div className="sticky bottom-4 w-full max-w-max bg-white mx-auto rounded-lg flex flex-col justify-between items-center gap-4 p-4 shadow-lg z-30">

                        {!!loading ? <span className="w-full text-center text-gray-500">{progress}</span> : ''}

                        <div className="flex items-center gap-4 flex-wrap flex-grow w-full max-w-max">
                            {!!bluePrint.length && (
                                <Tab.List className={'flex items-center gap-4'}>
                                    <Tab className={"px-2 lg:px-4 py-2 rounded-md bg-gray-700 text-white"}>Examples</Tab>
                                    <Tab className={"px-2 lg:px-4 py-2 rounded-md bg-gray-700 text-white"}>Refine style</Tab>
                                </Tab.List>
                            )}
                            {
                                !bluePrint.length ? (
                                    <button className="text-gray-700 px-2 lg:px-4 py-2 flex gap-2  justify-center items-center" onClick={() => { handleOpenRegenModal() }}>Generate style from examples {loading ? <LoadingSpinner /> : <GeneratorArrowIcon className="w-4 h-4" />}</button>
                                ) : ('')
                            }
                        </div>

                    </div>

                </Tab.Group>
            </section>
        </>
    )
}

export default SingleStyleUi;