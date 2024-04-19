'use client';

import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import Examples from "./Examples";
import { CloseIcon, GeneratorArrowIcon, RefreshIcon } from "@/components/_elements/icons";
import TextareaAutosize from "./TextAreaAutosize";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { DeleteModal } from "./DeleteModal";

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
    generateComparison: any,
    handleCloseViewModal: any
}

function SingleViewStyleUi({
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
    generateComparison,
    handleCloseViewModal
}: UiProps) {
    const router = useRouter();

    // Style data
    const [title, setTitle] = useState(titleData || 'Default title');
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
            setLoading(false);
            setProgress('');
        } catch (error) {
            console.log('error in handleUpdate: ', error);
        }
    }

    const bluePrintTimerRef = useRef<NodeJS.Timeout | undefined>();
    const handleUpdateBluePrint = async (newBluePrint: any) => {
        try {
            setLoading(true);
            setProgress('Updating blueprint...');

            setBluePrint(newBluePrint);

            // Clear the previous timeout
            if (bluePrintTimerRef.current) {
                clearTimeout(bluePrintTimerRef.current);
            }

            // Set a new timeout
            bluePrintTimerRef.current = setTimeout(async () => {
                const payload = { "bluePrint": newBluePrint };
                const data = await updateStyle(id, payload);

                setLoading(false);
                setProgress('');
                setRefinedBlueprint('');
                setEditBlueprint(false);
            }, 1000);
        } catch (error) {
            console.log('error in handleRefineBlueprint: ', error);
        }
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

    const titleTimerRef = useRef<NodeJS.Timeout | undefined>();
    const handleUpdateTitle = async (title: string) => {
        try {

            setLoading(true);
            setProgress('Updating title...');
            setTitle(title);

            if (titleTimerRef.current) {
                clearTimeout(titleTimerRef.current);
            }

            titleTimerRef.current = setTimeout(async () => {
                const data = await updateStyle(id, { 'title': title });

                window.dispatchEvent(new CustomEvent("updateViewTable", {
                    detail: {
                        _id: id,
                        data: {
                            "title": title
                        }
                    }
                }));

                setProgress('');
                setLoading(false);
            }, 1000);
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
    const exampleTimerRef = useRef<NodeJS.Timeout | undefined>();
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
            if (exampleTimerRef.current) {
                clearTimeout(exampleTimerRef.current);
            }
            exampleTimerRef.current = setTimeout(async () => {
                try {
                    const embedding = await getEmbedding(example);
                    payload.embedding = embedding;
                    newExamples[index] = payload;

                    setExamples(newExamples);

                    const data = await updateStyle(id, { 'examples': newExamples });

                    setProgress('');
                    setLoading(false);
                } catch (error) {
                    console.log('error saving example to db: ', error);
                }
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
            <section className="flex flex-col flex-grow p-4 h-screen overflow-y-scroll">
                <div className="w-full max-w-[800px] mx-auto bg-white rounded-lg p-4 flex flex-col gap-4 shadow-lg relative z-10">

                    <button className="ml-auto flex justify-center items-center gap-2 border border-gray-500 px-2 rounded-md" onClick={() => handleCloseViewModal()}>Close <CloseIcon className="w-4 h-4" /></button>

                    <div className="flex flex-col-reverse md:flex-row justify-between gap-4 mb-4">
                        <input type="text" className="text-gray-800 text-2xl font-bold p-2 bg-transparent border-b border-b-gray-800 border-dashed w-full max-w-max truncate" value={title === 'Default title a.' ? '' : title} placeholder="Click here to edit the title" onChange={(e) => {
                            handleUpdateTitle(e.target.value)
                        }} />
                        <DeleteModal title={title} deleting={deleting} handleDeleteStyle={handleDeleteStyle} />
                    </div>
                    {!!sample.length && (
                        <div className="flex flex-col gap-4 text-lg p-4 mb-4 inset-0 bg-[radial-gradient(#e2e2e2_1px,transparent_1px)] [background-size:16px_16px] text-gray-500">
                            <h2 className="text-xl font-semibold">Sample</h2>
                            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{sample}</ReactMarkdown>
                        </div>
                    )}
                    {!!bluePrint && (
                        <div className="flex flex-col gap-4 p-4 mb-4 text-gray-500">
                            <div className="flex justify-between items-center gap-4">
                                <h2 className="text-xl font-semibold">Blueprint</h2>
                                <button className="flex items-center gap-2" onClick={() => handleUpdateStyle()}>
                                    <span>Regenerate style blueprint</span>
                                    <RefreshIcon className="w-4 h-4" />
                                </button>
                            </div>
                            <TextareaAutosize
                                className="text-gray-800 bg-transparent text-lg pb-4 border-b border-gray-800 border-dashed resize-none transition-all duration-300 ease-in-out focus:border-gray-300 focus:ring-0"
                                value={refinedBlueprint || bluePrint}
                                onChange={(e: any) => handleUpdateBluePrint(e.target.value)}
                                placeholder="Type here to change the blueprint..."
                            />
                        </div>
                    )}
                    {(!!examples.length && !bluePrint) && (
                        <div className="flex flex-col gap-4 p-4 bg-neutral-100 rounded-lg justify-center items-center text-gray-500">
                            <h2 className="text-xl font-semibold">Generate the style blueprint</h2>
                            <p>Now that you&rsquo;ve given Apprentice some examples, it has everything it needs to do a deep stylistic analysis and generate a style blueprint. The style blueprint makes it possible for apprentice to replicate the desired style when generating content!</p>
                            <button className="flex justify-center items-center gap-2 border border-gray-500 rounded-lg text-lg px-4 py-2" onClick={() => handleUpdateStyle()}>
                                <span>Generate style blueprint</span>
                                <GeneratorArrowIcon className={'h-4 w-4'} />
                            </button>
                        </div>
                    )}
                    <Examples
                        examples={examples}
                        newExample={newExample}
                        setNewExample={setNewExample}
                        handleAddExample={handleAddExample}
                        handleUpdateExample={handleUpdateExample}
                        handleDeleteExample={handleDeleteExample}
                    />

                    {!!loading ? (
                        <div className="sticky bottom-4 w-full max-w-max bg-white mx-auto rounded-lg flex flex-col justify-between items-center gap-4 p-4 shadow-lg z-30">
                            <span className="w-full text-center text-gray-500">{progress}</span>
                        </div>
                    ) : ''}

                </div>
            </section>
        </>
    )
}

export default SingleViewStyleUi;