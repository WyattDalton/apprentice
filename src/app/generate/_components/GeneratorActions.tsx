'use client';

import { useEffect, useState, useRef, useMemo, memo } from "react";
import { useChat } from 'ai/react'
import LoadingText from "@/components/LoadingText";

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
}: GeneratorActionsProps) => {

    /* * * * * * * * * * * * * * * * * * * */
    /* Init state for generator actions
    /* * * * * * * * * * * * * * * * * * * */
    const searchBarRef = useRef({} as any);
    const [lastUserMessageIndex, setLastUserMessageIndex] = useState<number>(0);
    const [sources, setSources] = useState<any[]>([]);
    const [toneLibrary, setToneLibrary] = useState([]);
    const [formulaLibrary, setFormulaLibrary] = useState([]);
    const [userMessages, setUserMessages] = useState<any[]>([]);

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
            console.log('start getTitle')
            const data = await fetch("/api/threads", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const response = await data.json();
            console.log('title got: ', response.title);

            if (response.success && !!response.title) {
                setMeta({ ...meta, title: response.title });
            }

            console.log('end getTitle: ', meta)
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
            if (!!settings.enabled) {
                setLastUserMessageIndex(messages.length);
            }
        },
        body: { settings, sources, toneLibrary, formulaLibrary },
        initialMessages: conversation,
    })

    const handleUserMessages = (input: any) => {
        const userMessage = {
            "content": input,
            "role": "user",
            "createdAt": new Date(),
            "settings": settings,
        }
        const messages = [...userMessages];
        messages.push(userMessage);
        setUserMessages(messages);
    }


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
    }, [messages])

    /* * * * * * * * * * * * * * * * * * * */
    /* Handle current response change
    /* * * * * * * * * * * * * * * * * * * */
    useEffect(() => {

        if (isLoading && !!messages.length) {

            try {

                const firstUserMessage = messages.find((message) => message.role === 'user');
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
                    console.log("fire title generation")
                    getTitle({
                        dataType: 'getTitle',
                        data: {
                            messages: messages,
                            _id: generation,
                        }
                    });
                }

                const firstUserMessage = messages.find((message) => message.role === 'user');
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
    /* Handle fetch data on load
    /* * * * * * * * * * * * * * * * * * * */


    // ###
    // ### Get all generator data
    const getGeneratorData = async () => {
        try {

            const data = await fetch("/api/data", {
                method: 'POST',
                body: JSON.stringify({ dataFor: 'generator' })
            });

            if (data.status === 200) {
                const res = await data.json();
                setSources(res.data.sources);
                setToneLibrary(res.data.tones);
                setFormulaLibrary(res.data.formulas);

            }
        } catch (error) {
            console.log(error);
        }
    }


    // ###
    // ### Get data on app load
    useEffect(() => {
        getGeneratorData();
    }, [])


    /* * * * * * * * * * * * * * * * * * * */
    /* Render Generator Actions
    /* * * * * * * * * * * * * * * * * * * */
    return (

        <>
            {userMessages.length > 0 && (
                <div className="flex flex-col items-start w-full mb-2">
                    <div className="flex flex-row items-center">
                        <span className="text-sm font-semibold text-gray-600 ml-2">{userMessages[userMessages.length - 1].content}</span>
                        {/* display all of the settings used to generate the message */}
                        {userMessages[userMessages.length - 1].settings.enabled && (
                            <div className="flex flex-row items-center ml-2">
                                <span className="text-sm font-semibold text-gray-600">|</span>
                                <span className="text-sm font-semibold text-gray-600 ml-2">Tone: {userMessages[userMessages.length - 1].settings.tone}</span>
                                <span className="text-sm font-semibold text-gray-600 ml-2">|</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <form
                className={`${className}`}
                onSubmit={(e) => {
                    handleSubmit(e)
                    handleUserMessages(input);
                }
                }
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        // trigger submit
                        e.preventDefault();
                        handleSubmit(e);
                        handleUserMessages(input);
                    }
                }}
            >
                <textarea
                    className={`block w-full outline-none break-words p-4 resize-none bg-gray-100 rounded-md transition-all transition-300}`}
                    placeholder="Enter your prompt..."
                    name="prompt"
                    rows={1}
                    value={input}
                    ref={searchBarRef}
                    onChange={
                        handleInputChange
                    }
                ></textarea>

                <button
                    className="px-6 py-2 w-full text-dark bg-secondary rounded-md mt-auto"
                    type="submit"
                >
                    {isLoading ? (
                        <LoadingText text="Loading" className={""} iconClassName={""} />
                    ) : (
                        'Generate'
                    )}
                </button>

            </form >
        </>
    )
}
export default memo(GeneratorActions);