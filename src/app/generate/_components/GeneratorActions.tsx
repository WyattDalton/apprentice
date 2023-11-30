'use client';

import { useEffect, useState, useRef, useMemo, memo } from "react";
import { useChat } from 'ai/react'
import LoadingText from "@/components/LoadingText";
import { GeneratorArrowIcon, InfoIcon, ListIcon, SettingsIcon } from "@/components/icons";
import { Transition } from "@headlessui/react";

type GeneratorActionsProps = {
    className?: string | '';
    settings: any;
    conversation: any[];
    handleConversationChange: any;
    currentResponse: any;
    handleCurrentResponseChange: any;
    saved: boolean | false;
    setSaved: any;
    meta: any;
    setMeta: any;
    generation: any;
    setGeneration: any;
    changeActivePanel: any;
    scrollToBottom: any;
    sources: any[];
    toneLibrary: any[];
    formulaLibrary: any[];
};

const GeneratorActions = ({
    className,
    saved,
    setSaved,
    settings,
    conversation,
    handleConversationChange,
    meta,
    setMeta,
    generation,
    setGeneration,
    changeActivePanel,
    scrollToBottom,
    sources,
    toneLibrary,
    formulaLibrary,
}: GeneratorActionsProps) => {

    /* * * * * * * * * * * * * * * * * * * */
    /* Init state for generator actions
    /* * * * * * * * * * * * * * * * * * * */
    const searchBarRef = useRef({} as any);
    const [lastUserMessageIndex, setLastUserMessageIndex] = useState<number>(0);
    const [generatorError, setGeneratorError] = useState<any>(false);

    /* * * * * * * * * * * * * * * * * * */
    /* Preserve thread as it is generated, generate title if needed
    /* * * * * * * * * * * * * * * * * * */
    const preserveThread = async (payload: any) => {
        try {

            const data = await fetch("/api/saveThread", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const response = await data.json();

            if (generation != response.item._id && window.location.pathname !== `/generate/${generation}`) {
                setGeneration(await response.item._id);
                window.history.pushState({ page: 1 }, response.item.initial_prompt, `/generate/${response.item._id}`);
            }

        } catch (error) {
            console.log(error);
        }
    }

    const getTitle = async (payload: any) => {
        try {
            const data = await fetch("/api/threads", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const response = await data.json();

            if (response.success && !!response.title) {
                setMeta({ ...meta, title: response.title });
            }
        } catch (error) {
            console.log(error);
        }
    }

    /* * * * * * * * * * * * * * * * * */
    /* Generate a response to the prompt
    /* * * * * * * * * * * * * * * * * */
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: '/api/generate',
        onResponse: async (res) => {
            changeActivePanel('manual', false);
            scrollToBottom('action');
        },
        onFinish: async (res) => {
        },
        onError: async (err) => {
            setGeneratorError('Something went wrong. Please try again.')
        },
        body: { settings, sources, toneLibrary, formulaLibrary },
        initialMessages: conversation,
    })

    /* * * * * * * * * * * * * * * * * * * */
    /* Adjust textarea height and width as user types
    /* * * * * * * * * * * * * * * * * * * */
    useEffect(() => {
        if (searchBarRef.current) {
            const field = searchBarRef.current as any;
            field.style.height = '0px';
            const scrollHeight = field.scrollHeight;
            field.style.height = scrollHeight + 'px';
        }
    }, [searchBarRef, input]);

    /* * * * * * * * * * * * * * * * * * * */
    /* Handle conversation change
    /* * * * * * * * * * * * * * * * * * * */
    useEffect(() => {
        if (JSON.stringify(messages) !== JSON.stringify(conversation)) {
            handleConversationChange(messages)
        }
        scrollToBottom('content');
    }, [messages])

    /* * * * * * * * * * * * * * * * * * * */
    /* Handle current response change
    /* * * * * * * * * * * * * * * * * * * */
    useEffect(() => {

        if (isLoading && !!messages.length) {

            try {

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
                } as any;

                !!generation ? payload['generation'] = generation : null;

                preserveThread(payload);

            } catch (error) {
                console.log('Error while loading: ', error)
            }
        } else if (!isLoading && !!messages.length) {
            try {
                if (messages.length > 5 && !meta.title) {
                    getTitle({
                        dataType: 'getTitle',
                        data: {
                            messages: messages,
                            _id: generation,
                        }
                    });
                }

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
                }

                preserveThread(payload);

            } catch (error) {
                console.log('Error when finished: ', error)
            }
        }

    }, [isLoading])

    /* * * * * * * * * * * * * * * * * * * */
    /* Handle save thread to database
    /* * * * * * * * * * * * * * * * * * * */
    const saveThread = async () => {
        try {
            setSaved(!saved)
            const firstUserMessage = messages.find((message) => message.role === 'user');
            const payload = {
                "_id": generation,
                "saved": saved.toString(),
            }
            const response = await fetch("/api/saveThread", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
        } catch (error) {
            console.log(error);
        }
    }

    /* * * * * * * * * * * * * * * * * * * */
    /* Render Generator Actions
    /* * * * * * * * * * * * * * * * * * * */
    return (

        <>

            <form
                className={`${className}`}
                onSubmit={(e) => {
                    if (!!input) {
                        handleSubmit(e)
                    } else {
                        e.preventDefault();
                        setGeneratorError('Please enter your instructions.')
                        setTimeout(() => {
                            setGeneratorError(false);
                        }, 3000)
                    }
                }
                }
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        if (!!input) {
                            // trigger submit
                            e.preventDefault();
                            handleSubmit(e);
                        } else {
                            e.preventDefault();
                            setGeneratorError('Please enter your instructions.')
                            setTimeout(() => {
                                setGeneratorError(false);
                            }, 3000)
                        }
                    }
                }}
            >
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
                <textarea
                    className={`block w-full outline-none break-words p-4 resize-none bg-gray-200 rounded-md transition-all transition-300}`}
                    placeholder="Enter your instructions..."
                    name="prompt"
                    rows={1}
                    value={input}
                    ref={searchBarRef}
                    onChange={
                        handleInputChange
                    }
                ></textarea>

                <div className="flex gap-2">
                    <button
                        className={'panel-switch group flex flex-col justify-center items-center gap-2 p-2 rounded-xl text-sm font-bold text-gray-500 data-[active=true]:bg-gray-200 data-[active=true]:text-gray-600'}
                        onClick={(e) => changeActivePanel(e, 'settings')}
                        data-active="false"
                    >
                        <span className="icon w-6 aspect-square flex justify-center items-center rounded-xl">
                            <SettingsIcon className={'h-6 w-6'} />
                        </span>
                    </button>

                    <button
                        className={'panel-switch group flex flex-col justify-center items-center gap-2 p-2 rounded-xl text-sm font-bold text-gray-500 data-[active=true]:bg-gray-200 data-[active=true]:text-gray-600'}
                        onClick={(e) => changeActivePanel(e, 'info')}
                        data-active="false"
                    >
                        <span className="icon w-6 aspect-square flex justify-center items-center rounded-xl">
                            <InfoIcon className="h-6 w-6" />
                        </span>
                    </button>
                </div>

                <button
                    className="ml-auto"
                    type="submit"
                >
                    {isLoading ? (
                        <LoadingText text="Loading" className={""} iconClassName={""} />
                    ) : (
                            <span className="flex gap-2 items-center border border-gray-700 rounded-md bg-gray-700 text-white p-2 ml-auto lg:px-6 lg:py-2 lg:mt-auto">
                                <span className="hidden lg:inline-block">Generate</span>
                                <GeneratorArrowIcon className="h-4 w-4 inline-block" />
                            </span>
                    )}
                </button>

            </form >
        </>
    )
}
export default memo(GeneratorActions);