import { useEffect, useCallback, useState, useRef, useMemo } from "react";
import Card from "../UI/Card";
import { UilSlidersV, UilAngleDoubleRight, UilQuestionCircle, UilBookmark } from '@iconscout/react-unicons'
import LoadingText from "../LoadingText";
import { useChat } from 'ai/react'
import LoadingSpinner from "../LoadingSpinner";

type GeneratorActionsProps = {
    className?: string | '';
    settings: any;
    conversation: any[];
    handleConversationChange: (conversation: any[]) => void;
    currentResponse: any;
    handleCurrentResponseChange: (currentResponse: any) => void;
    saved: boolean | false;
    setSaved: any;
    active: boolean | false;
    setActive: any;
    activateSettings: boolean | false;
    setActivateSettings: any;
};

const GeneratorActions = ({
    className,
    saved,
    setSaved,
    settings,
    conversation,
    handleConversationChange,
    currentResponse,
    handleCurrentResponseChange,
    active,
    setActive,
    activateSettings,
    setActivateSettings
}: GeneratorActionsProps) => {

    /* * * * * * * * * * * * * * * * * * * */
    /* Init state for generator actions
    /* * * * * * * * * * * * * * * * * * * */
    const searchBarRef = useRef({} as any);
    const [generation, setGeneration] = useState<any>('');
    const [prompt, setPrompt] = useState<string>('');
    const [promptResponseLoading, setPromptResponseLoading] =
        useState<boolean>(false);
    const [response, setResponse] = useState([]);
    const [lastUserMessageIndex, setLastUserMessageIndex] = useState<number>(0);
    const [sources, setSources] = useState<any[]>([]);
    const [toneLibrary, setToneLibrary] = useState([]);
    const [formulaLibrary, setFormulaLibrary] = useState([]);

    /* * * * * * * * * * * * * * * * * * */
    /* Preserve thread as it is generated
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
                setGeneration(await response.item._id)
                setActive(true);
                window.history.pushState({ page: 1 }, response.item.initial_prompt, `/generate/${response.item._id}`);
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
            if (!!settings.enabled) {
                setLastUserMessageIndex(messages.length);
            }
        },
        body: { settings, sources, toneLibrary, formulaLibrary },
        initialMessages: conversation,
    })

    /* * * * * * * * * * * * * * * * * * * */
    /* Adjust textarea height as user types
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
    /* Activate settings panel on click
    /* * * * * * * * * * * * * * * * * * * */
    const handleActivateSettings = () => {
        setActivateSettings(!activateSettings);
    }

    /* * * * * * * * * * * * * * * * * * * */
    /* Handle fetch data on load
    /* * * * * * * * * * * * * * * * * * * */
    // ###
    // ### Fetch sources from API
    const getSources = async () => {
        try {
            const data = await fetch("/api/sourcesGetAll", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            if (data.status === 200) {
                const response = await data.json();
                setSources(response.sources);
            }
        } catch (error) {
            console.log(error);
        }
    }


    // ###
    // ### Fetch tones from API
    const getTones = async () => {
        try {
            const data = await fetch("/api/tonesGetAll", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            if (data.status === 200) {
                const response = await data.json();
                setToneLibrary(response.tones);
            }
        } catch (error) {
            console.log(error);
        }
    }


    // ###
    // ### Fetch formulas from API
    const getFormulas = async () => {
        try {
            const payload = {
                'dataType': 'get',
                'data': { "_id": false },
            }

            const res = await fetch('/api/formulas', {
                method: 'POST',
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error(res.statusText);
            }
            const formulaRes = await res.json();
            setFormulaLibrary(formulaRes.formulas);

        } catch (error) {
            console.log(error);
        }
    }

    // ###
    // ### Get all gnerator data
    const getGeneratorData = async () => {
        try {
            const data = await fetch("/api/data", {
                method: 'POST',
                body: JSON.stringify({ dataFor: 'generator' })
            });
            if (data.status === 200) {
                const res = await data.json();
                console.log(res);
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

        <form
            className={className}
            onSubmit={(e) => handleSubmit(e)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    // trigger submit
                    e.preventDefault();
                    handleSubmit(e);

                }
            }}
        >

            <Card className={`!shadow-md !mb-0 !p-0 w-full overflow-hidden flex justify-between items-center gap-2 !bg-gray-100`}>
                <textarea
                    className="w-full outline-none break-words p-4 resize-none bg-transparent"
                    placeholder="What should we create today?"
                    name="prompt"
                    rows={1}
                    value={input}
                    ref={searchBarRef}
                    onChange={
                        handleInputChange
                    }
                ></textarea>
                <button
                    className="px-2 text-theme_primary mt-auto"
                    type="submit"
                >
                    {isLoading ? (
                        <LoadingSpinner
                            className="h-10 w-10"
                        />
                    ) : (
                        <>
                            <UilAngleDoubleRight className="h-10 w-10 stroke-2" />
                        </>
                    )}
                </button>
            </Card>

            <div className="flex flex-row justify-end items-center gap-2">
                <div className="flex gap-2">
                    <button className={`rounded-md text-theme_primary-700 p-2 ${saved ? 'bg-theme_primary-700 text-white' : ''}`}
                        onClick={saveThread}>
                        <UilBookmark className="h-6 w-6" />
                    </button>
                    <button className="rounded-md text-theme_primary-700 p-2" onClick={handleActivateSettings}>
                        <UilSlidersV className="h-6 w-6" />
                    </button>
                    <button className="rounded-md text-theme_primary-700 p-2">
                        <UilQuestionCircle className="h-6 w-6" />
                    </button>
                </div>
            </div>
        </form >
    )
}
export default GeneratorActions;