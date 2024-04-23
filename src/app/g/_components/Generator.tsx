"use client"

// ### React imports
import { Fragment, useEffect, useRef, useState } from "react";

// ### Next imports
import { useRouter } from "next/navigation";

// ### Headless UI imports
import { Transition } from "@headlessui/react";

// ### AI imports
import { useChat } from 'ai/react';

// ### App imports
import { GeneratorGrid } from "@/components/_ui/GeneratorGrid";
import GeneratorContent from "./GeneratorContent";
import GeneratorSettings from "./GeneratorSettings";
import { GeneratorArrowIcon, InfoIcon, PlusIcon, SettingsIcon } from "@/components/_elements/icons";
import LoadingSpinner from "@/components/_elements/LoadingSpinner";
import { set } from "lodash";


// ### Generator Prop types
type GeneratorProps = {
    // Display props
    className?: any;
    launcher?: any;

    // Initial data props
    initConversation?: any;
    threadsData?: any;
    metaData?: any;
    stylesData?: any;
    formulasData?: any;
    generationId?: any;
    savedData?: any;
    sourcesData?: any;

    // Action props
    fetchMetaData?: any;
    saveThread?: any;
    getTitle?: any;
    updateThread?: any;
    deleteThread?: any;

    // Generator props
    retrieveSources?: any;
    retrievePromptEmbedding?: any;
}

// ###
// ### Generator component
export default function Generator({
    // Display props
    className,
    launcher,

    // Initial data props
    initConversation,
    threadsData,
    metaData,
    stylesData,
    formulasData,
    generationId,
    savedData,
    sourcesData,

    // Action props
    fetchMetaData,
    saveThread,
    getTitle,
    updateThread,
    deleteThread,

    // Generator props
    retrieveSources,
    retrievePromptEmbedding
}: GeneratorProps) {

// ###
// ### React functions
    const router = useRouter();
    const user_prompt_ref = useRef({} as any);

    // ###
    // ### Generator state
    const [generation, setGeneration] = useState<any>(generationId || '');
    const [meta, setMeta] = useState<any>(threadsData || []);
    const [conversation, setConversation] = useState<any[]>([]);
    const [styleLibrary, setStyleLibrary] = useState<any>(stylesData || []);
    const [formulaLibrary, setFormulaLibrary] = useState<any>(formulasData || []);
    const [settings, setSettings] = useState({
        enabled: false,
        contentType: '',
        style: '',
        intention: '',
        length: 0,
        details: '',
        formula: '',
        useSources: false,
    });
    const [activePanel, setActivePanel] = useState<any>(false);
    const [headThread, setHeadThread] = useState<any>([]);
    const [splitThreads, setSplitThreads] = useState<any>([]);
    const [knotIndex, setKnotIndex] = useState<any>(0);
    const [lastUserMessageIndex, setLastUserMessageIndex] = useState<number>(0);

    const [loading, setLoading] = useState<any>(false);
    const [progress, setProgress] = useState<any>('');
    const [generatorError, setGeneratorError] = useState<any>(false);

    const [sources, setSources] = useState<any>(null);
    let inputSources = [] as any;
    const [thinkAbout, setThinkAbout] = useState<any>(null);
    const [outline, setOutline] = useState<any>(null);
    const [formulaInstructions, setFormulaInstructions] = useState<any>(null);

    const [submitPrompt, setSubmitPrompt] = useState<any>(false);
    const [processing, setProcessing] = useState<any>(false);

    useEffect(() => {
        setMeta(metaData);
    }, [metaData])

    useEffect(() => {
        !!initConversation ? setConversation(initConversation) : setConversation([]);
    }, [initConversation])

    useEffect(() => {
        !!threadsData?.headThread ? setHeadThread(threadsData.headThread) : setHeadThread([]);
    }, [threadsData])

    // Disable scroll when panel is open
    useEffect(() => {
        if (activePanel === 'settings') {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [activePanel]);

    useEffect(() => {
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    /**
     * Generate step 1: Process the prompt
     * - Format settings
     * - Retrieve the prompt embedding
     * - Retrieve sources if sources are requested
     * - Preform "thinking" actions
     * - Preform "planning" actions
     * 
     * Handles the processing of a prompt.
     * 
     * @param input - The input prompt to process.
     */
    const handleProcessPrompt = async (event: any, input: string) => {
        try {
            setLoading(true);


            const currentThread = [...headThread];
            const knotIndex = currentThread.length;
            const knotPayload = {} as any;

            // Add user prompt to knot payload
            knotPayload['user_prompt'] = input;
            currentThread[knotIndex] = knotPayload;
            setHeadThread(currentThread);

            // Add settings to kot payload
            let knot_settings = !!settings ? settings : null;
            knotPayload['settings'] = knot_settings;
            currentThread[knotIndex] = knotPayload;
            setHeadThread(currentThread);


            // Get prompt embedding
            const promptEmbedding = await retrievePromptEmbedding(input);

            // Get sources if sources are requested
            if (!!settings.useSources) {

                setProgress('Retrieving sources...')

                const raw_sources = await retrieveSources(sourcesData, promptEmbedding, 0.3, 5);
                setSources(raw_sources);

                let knot_sources = !!raw_sources ? raw_sources : null;

                knotPayload['sources'] = knot_sources;

                currentThread[knotIndex] = knotPayload;

                setHeadThread(currentThread);

                inputSources = knot_sources;


            } else {
                let knot_sources = null;
                knotPayload['sources'] = knot_sources;
                currentThread[knotIndex] = knotPayload;
                setHeadThread(currentThread);
                inputSources = knot_sources;
            }

            // Get formula from formula library
            const formula = formulaLibrary.find((formula: any) => formula._id.toString() === settings.formula);
            const thinkAbout = !!formula?.thinkAbout ? formula.thinkAbout : null;
            const outline = !!formula?.outline ? formula.outline : null;
            setFormulaInstructions(formula?.instructions);

            // ### 
            // ### Perform thinking action if requested
            if (!!thinkAbout) {

                setProgress('Thinking...')
                const thinkData = await fetch('/api/think_about', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ prompt: thinkAbout }),
                });

                const thinkDataReader = thinkData.body?.getReader();
                while (true) {
                    const { done, value }: any = await thinkDataReader?.read();
                    if (done) {
                        break;
                    }
                    const decodedValue = new TextDecoder().decode(value);

                    const thinkAboutResponse = decodedValue;
                    const previousThinkAboutResponse = !!currentThread[knotIndex]['thinkAbout'] ? currentThread[knotIndex]['thinkAbout'] : '';
                    const fullThinkAboutResponse = previousThinkAboutResponse + thinkAboutResponse;

                    knotPayload['thinkAbout'] = fullThinkAboutResponse;
                    setThinkAbout(fullThinkAboutResponse);

                    currentThread[knotIndex] = knotPayload;

                    setHeadThread(currentThread);
                }


            } else {
                const thinkAboutResponse = null;
                knotPayload['thinkAbout'] = thinkAboutResponse;
                currentThread[knotIndex] = knotPayload;
                setHeadThread(currentThread);
            }


            // ### 
            // ### Perform outlining action if requested
            if (!!outline) {

                setProgress('Outlining the response...')
                let outlinePrompt = `create an outline for your response for the following prompt: ${input} `;

                // If length setting sellected
                !!knotPayload['settings']['length'] ? outlinePrompt = `${outlinePrompt} ### Keep in mind that the content you are creating an outline for should be ${knotPayload['settings']['length']} words long.` : outlinePrompt = `${outlinePrompt}`;

                !!knotPayload['settings']['details'] ? outlinePrompt = `${outlinePrompt} ### Keep in mind that the content you are creating an outline for should include these details ${knotPayload['settings']['details']}.` : outlinePrompt = `${outlinePrompt}`;

                !!knotPayload['sources'] ? outlinePrompt = `${outlinePrompt} ### Use the following source material in your response: ${knotPayload['sources']}` : outlinePrompt = `${outlinePrompt}`;

                !!thinkAbout ? outlinePrompt = `${currentThread[knotIndex]['thinkAbout']} ${outlinePrompt}` : outlinePrompt = `${outlinePrompt}`;

                const outlineData = await fetch('/api/outline', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ prompt: outlinePrompt }),
                });

                const outlineDataReader = outlineData.body?.getReader();
                while (true) {
                    const { done, value }: any = await outlineDataReader?.read();
                    if (done) {
                        break;
                    }
                    const decodedValue = new TextDecoder().decode(value);

                    const outlineResponse = decodedValue;
                    const previousThinkAboutResponse = !!currentThread[knotIndex]['outline'] ? currentThread[knotIndex]['outline'] : '';
                    const fullOutlineResponse = previousThinkAboutResponse + outlineResponse;

                    knotPayload['outline'] = fullOutlineResponse;
                    setOutline(fullOutlineResponse);

                    currentThread[knotIndex] = knotPayload;

                    setHeadThread(currentThread);
                }



            } else {
                const outline = null;
                knotPayload['outline'] = outline;
                currentThread[knotIndex] = knotPayload;
                setHeadThread(currentThread);
            }

            return {
                "sources": knotPayload.sources,
                "outline": knotPayload.outline,
                "formulaInstructions": !!formula?.instructions ? formula.instructions : null,
                "thinkAbout": knotPayload.thinkAbout,
            };
        } catch (error) {
            console.log(error);
        }
    }


    /**
     * Generate step 2: Submit the prompt
     * - Controls timing of prompt submission steps
     * 
     * Triggers the submit prompt based on the provided input.
     * 
     * @param e - The event object.
     * @param input - The input string.
     */
    let responseSources, responseThinkAbout, responseOutline, responseFormulaInstructions;
    const triggerSubmitPrompt = async (e: any, input: string) => {
        if (!!input) {
            e.preventDefault();

            setActivePanel(false);

            const promptData = await handleProcessPrompt(e, input) as any;

            responseSources = promptData.sources;
            responseThinkAbout = promptData.thinkAbout;
            responseOutline = promptData.outline;
            responseFormulaInstructions = promptData.formulaInstructions;

            handleSubmit(e);

        } else {
            e.preventDefault();
            setGeneratorError('Please enter your instructions.')
            setTimeout(() => {
                setGeneratorError(false);
            }, 3000)
        }
    }


    const handleGetTitle = async (messages: any, generation: any) => {
        try {
            const data = await getTitle(messages, generation);
            if (!!data.title) {
                setMeta({ ...meta, title: data.title });
            }
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Generate step 3: Generate a response
     */
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: '/api/generate',
        onError: async (err) => {
            setGeneratorError('Something went wrong. Please try again.')
        },
        onFinish: async (res) => {
            setProgress('')
            setLoading(false);
            if (messages.length > 4 && !meta?.title) {
                await handleGetTitle(messages, generation);
            }
        },
        body: {
            settings,
            styleLibrary,
            "sources": sourcesData,
            outline,
            thinkAbout,
            formulaInstructions
        },
        initialMessages: conversation,
    })

    // Update the conversation state when the messages change
    useEffect(() => {
        try {
            if (JSON.stringify(messages) !== JSON.stringify(conversation)) {
                setProgress('Generating response...')
                setConversation(messages)


                const currentThread = [...headThread];
                const knotIndex = currentThread.length - 1;
                const knotPayload = !!currentThread[knotIndex] ? currentThread[knotIndex] : {} as any;

                if (messages[messages.length - 1]?.role === 'assistant') {
                    knotPayload['response'] = messages[messages.length - 1].content;
                    currentThread[knotIndex] = knotPayload;
                    setHeadThread(currentThread);
                }

                // const payload = {
                //     "threads": { headThread, splitThreads }
                // } as any;
                // !!generation ? payload['generation'] = generation : null;
                // preserveThread(payload);
            }
        } catch (error) {
            console.log('Error in conversation update: ', error)
        }
    }, [messages])

    /**
     * Generate step 4: Preserve the thread as it is generated
     * 
     * Saves the thread and updates the generation state and URL.
     * 
     * @param payload - The data to save the thread.
     */
    const preserveThread = async (payload: any) => {
        try {
            // Save the thread
            const data = await saveThread(payload);

            // On the initial save of the thread, a mongoDB _id is returned. This id is assigned to the generation state & the url is updated.
            if (generation != data._id && window.location.pathname !== `/g/${generation}`) {
                window.history.pushState({ page: 1 }, data.initial_prompt, `/g/${data._id}`);
                setGeneration(await data._id);
            }

        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Generate step 5: Save the thread after generation is finished
     * 
     * Handles the generation finish event.
     * 
     * @param messages - The array of messages.
     * @param generation - The generation object.
     */
    const preserveOnGenerateFinish = async (messages: any, generation: any) => {
        try {
            setProgress('Done! Saving thread!')
            const firstUserMessage = messages.find((message: any) => message.role === 'user');
            const lastUserMessageIndex = messages.map((message: any) => message.role).lastIndexOf('user');

            if (!!settings.enabled) {
                messages[lastUserMessageIndex] = {
                    ...messages[lastUserMessageIndex],
                    settings: settings,
                } as any;
            } else {
                messages[lastUserMessageIndex] = {
                    ...messages[lastUserMessageIndex],
                    settings: false,
                } as any;
        }


            const payload = {
                "initial_prompt": firstUserMessage?.content,
                "created": firstUserMessage?.createdAt,
                "messages": messages,
                "threads": { headThread, splitThreads }
            }

            preserveThread(payload);

            setProgress('');

        } catch (error) {
            console.log('Error when finished: ', error)
        }
    }

    /* * * * * * * * * * * * * * * * * * * */
    /* Utility functions for the generator
    /* * * * * * * * * * * * * * * * * * * */
    /**
     * Adjusts the height of the dynamic prompt field based on its content.
     */
    useEffect(() => {
        const field = user_prompt_ref.current;
        if (field) {
            const handleInput = () => {
                handleDynamicPromptFieldHeight();
            };

            field.addEventListener('input', handleInput);

            // Clean up the event listener when the component unmounts
            return () => {
                field.removeEventListener('input', handleInput);
            };
        }
    }, [user_prompt_ref]);

    const handleDynamicPromptFieldHeight = () => {
        if (user_prompt_ref.current) {
            const field = user_prompt_ref.current as any;
            field.style.height = '0px';

            if (input === '') {
                // Set the height to 'unset' when the input is empty
                field.style.height = 'unset';
            } else {
                const scrollHeight = field.scrollHeight;
                field.style.height = `${scrollHeight}px`;
            }
        }
    }

    useEffect(() => {
        handleDynamicPromptFieldHeight();
    }, [user_prompt_ref, input]);


    /* * * * * * * * * * * * * * * * * * * */
    /* Handle current response change
    /* * * * * * * * * * * * * * * * * * * */
    useEffect(() => {
        if (isLoading && !!messages.length) {
            try {
                setLoading(true);
                const firstUserMessage = messages.find((message) => message.role === 'user');
                const lastUserMessageIndex = messages.map((message) => message.role).lastIndexOf('user');
                if (!!settings.enabled) {

                    if (!!settings.style) {
                        const style = styleLibrary.find((style: any) => style._id.toString() === settings.style);
                        settings.style = style.title;
                    }
                    if (!!settings.formula) {
                        const formula = formulaLibrary.find((formula: any) => formula._id.toString() === settings.formula);
                        settings.formula = !!formula.title ? formula.title : 'Unknown fomula';
                    }

                    messages[lastUserMessageIndex] = {
                        ...messages[lastUserMessageIndex],
                        settings: settings,
                    } as any;
                } else {
                    messages[lastUserMessageIndex] = {
                        ...messages[lastUserMessageIndex],
                        settings: false,
                    } as any;
                }

                const payload = {
                    "initial_prompt": firstUserMessage?.content,
                    "created": firstUserMessage?.createdAt,
                    "messages": messages,
                    "threads": { headThread, splitThreads }
                } as any;

                !!generation ? payload['generation'] = generation : null;

                preserveThread(payload);

            } catch (error) {
                console.log('Error while loading: ', error)
            }

            // Saves the thread when the generator is finished loading
        } else if (!isLoading && !!messages.length) {
            try {
                setLoading(false);
                const firstUserMessage = messages.find((message) => message.role === 'user');
                const lastUserMessageIndex = messages.map((message) => message.role).lastIndexOf('user');

                if (!!settings.enabled) {
                    messages[lastUserMessageIndex] = {
                        ...messages[lastUserMessageIndex],
                        settings: settings,
                    } as any;
                } else {
                    messages[lastUserMessageIndex] = {
                        ...messages[lastUserMessageIndex],
                        settings: false,
                    } as any;
                }
                const payload = {
                    "initial_prompt": firstUserMessage?.content,
                    "created": firstUserMessage?.createdAt,
                    "messages": messages,
                    "threads": { headThread, splitThreads }
                }
                preserveThread(payload);
            } catch (error) {
                console.log('Error when finished: ', error)
            }
        }
    }, [isLoading])



    // ###
    // ### Render Generator
    return (
        <>
            <section className={` relative flex-grow flex flex-col gap-4 p-4`}>
                <div className="inset-0 bg-[radial-gradient(#e2e2e2_1px,transparent_1px)] [background-size:16px_16px] flex flex-col flex-grow px-[5%]">
                    <div className={`flex-grow w-full max-w-[800px] lg:p-4 mx-auto !overflow-visible !mb-0 flex flex-col${!!threadsData?.headThread || !!headThread.length ? '' : ' place-content-center'}`}>

                        <Transition
                            className="text-2xl font-bold text-gray-800 p-2 mb-4 border-b border-b-gray-800 border-dashed w-full max-w-max truncate"
                            as="h1"
                            show={!!meta?.title}
                            enter="transition-opacity transition-transform duration-300"
                            enterFrom="opacity-0 transform -translate-y-4"
                            enterTo="opacity-100 transform translate-y-0"
                            leave="transition-opacity transition-transform duration-300"
                            leaveFrom="opacity-100 transform translate-y-0"
                            leaveTo="opacity-0 transform -translate-y-4"
                            unmount={true}
                            appear={true}
                        >
                            {meta?.title}
                        </Transition>

                        {!threadsData?.headThread ? (
                            !headThread.length ? (<GeneratorGrid />) : (<GeneratorContent thread={headThread} className="" />)
                        ) : (<GeneratorContent thread={headThread} className="" />)}
                    </div>
                </div>

                <div className="w-full max-w-[800px] mx-auto flex flex-col gap-4 sticky bottom-0 lg:p-4 z-30">

                    <Transition
                        as={Fragment}
                        show={activePanel === 'settings'}
                        enter="transition duration-200 ease-out"
                        enterFrom="transform opacity-0"
                        enterTo="transform opacity-100"
                        leave="transition duration-200 ease-out"
                        leaveFrom="transform opacity-100"
                        leaveTo="transform opacity-0"
                        unmount={false}
                    >
                        <div className="block fixed w-screen h-screen top-0 left-0 bg-white bg-opacity-20 backdrop-blur-sm cursor-pointer" onClick={(e) => setActivePanel(false)}></div>
                    </Transition>

                    <Transition
                        className={'flex flex-col p-4 bg-white bg-opacity-50 backdrop-blur-sm rounded-lg w-full max-w-max'}
                        show={activePanel === 'settings'}
                        enter="transition duration-200 ease-out"
                        enterFrom="transform translate-y-10 opacity-0"
                        enterTo="transform translate-y-0 opacity-100"
                        leave="transition duration-200 ease-out"
                        leaveFrom="transform translate-y-0 opacity-100"
                        leaveTo="transform translate-y-10 opacity-0"
                        unmount={false}
                    >
                        <GeneratorSettings
                            className={``}
                            handleSetGeneratorSettings={setSettings}
                            generatorSettings={settings}
                            styleLibrary={styleLibrary}
                            formulaLibrary={formulaLibrary}
                        />
                    </Transition>

                    {/* Error display */}
                    <Transition
                        show={!!generatorError}
                        enter="transition-opacity duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        unmount={true}
                        appear={true}
                    >
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Error</strong>
                            <span className="block sm:inline">{generatorError}</span>
                            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                                <svg className="fill-current h-6 w-6 text-red-500" role="button" onClick={() => setGeneratorError(false)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 5.652a1 1 0 010 1.414L6.414 14.348a1 1 0 11-1.414-1.414L12.93 4.93a1 1 0 011.414 0z"></path><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16z"></path></svg>
                            </span>
                        </div>
                    </Transition>

                    {/* Progress display */}
                    <Transition
                        show={!!progress.length}
                        enter="transition-opacity duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        unmount={true}
                        appear={true}
                    >
                        <div className="bg-gray-100 border text-gray-700 px-4 py-3 rounded relative flex gap-2 items-center" role="alert">
                            <strong className="font-bold">Progress</strong>
                            <span className="block sm:inline">{progress}</span>
                        </div>
                    </Transition>

                    {/* Form display */}
                    <form
                        className={`${className} bg-white rounded-lg shadow-lg p-2 lg:p-4 z-30`}
                        onSubmit={(e) => {
                            triggerSubmitPrompt(e, input);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                triggerSubmitPrompt(e, input);
                            }
                        }}
                    >



                        <div className="flex gap-2">
                            <div className="flex flex-col justify-end align-center">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        { activePanel === 'settings' ? setActivePanel(false) : setActivePanel('settings') }
                                    }}
                                ><PlusIcon className={`h-6 w-6 p-2 rounded-full text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-300  ${activePanel === 'settings' ? (' rotate-45') : ('transform-none')}`} /></button>
                            </div>

                            {/* User prompt input */}
                            <div className="flex justify-end items-end gap-2 bg-gray-100 border border-gray-200 p-2 rounded-md w-full">

                                <textarea
                                    className={`block w-full outline-none break-words resize-none transition-all transition-300 bg-transparent p-2`}
                                    placeholder="Enter your instructions..."
                                    name="prompt"
                                    rows={1}
                                    value={input}
                                    ref={user_prompt_ref}
                                    onChange={handleInputChange}
                                ></textarea>

                                {/* Submit button */}
                                <button
                                    className="ml-auto"
                                    type="submit"
                                >
                                    {!!loading ? (
                                        <LoadingSpinner />
                                    ) : (
                                        <span className="flex gap-2 items-center border border-gray-700 rounded-full bg-gray-700 text-white p-2 ml-auto">
                                            <span className="hidden">Generate</span>
                                            <GeneratorArrowIcon className="h-4 w-4 inline-block" />
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form >
                </div>
            </section>
        </>
    );
} 