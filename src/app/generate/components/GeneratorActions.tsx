import { useEffect, useState, useRef, useMemo } from "react";
import { useChat } from 'ai/react'
import Card from "@/components/UI/Card";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getUserData } from "@/components/utils/getUserData";

type GeneratorActionsProps = {
    className?: string | '';
    settings: any;
    conversation: any[];
    handleConversationChange: any;
    currentResponse: any;
    handleCurrentResponseChange: any;
    saved: boolean | false;
    setSaved: any;
    active: boolean | false;
    setActive: any;
    activateSettings: boolean | false;
    setActivateSettings: any;
    launcher?: any;
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
    setActivateSettings,
    launcher,
}: GeneratorActionsProps) => {

    /* * * * * * * * * * * * * * * * * * * */
    /* Init state for generator actions
    /* * * * * * * * * * * * * * * * * * * */
    const searchBarRef = useRef({} as any);
    const [generation, setGeneration] = useState<any>('');
    const [lastUserMessageIndex, setLastUserMessageIndex] = useState<number>(0);
    const [sources, setSources] = useState<any[]>([]);
    const [toneLibrary, setToneLibrary] = useState([]);
    const [formulaLibrary, setFormulaLibrary] = useState([]);
    const [available_words_count, setAvailableWordsCount] = useState(null);


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
        onFinish: async (res) => {
            await getAvailableWordsCount();
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
    // ### Get available words count
    const getAvailableWordsCount = async () => {
        try {
            const userdata = await getUserData();
            const userId = userdata.userId;

            const res = await fetch('/api/users', {
                method: 'POST',
                body: JSON.stringify({ dataType: 'get', data: { userId: userId } })
            })
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            const userRes = await res.json();
            setAvailableWordsCount(userRes.user.available_words);
            console.log(available_words_count)

        } catch (error) {
            console.log(error);
        }
    }

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
                setAvailableWordsCount(res.data.user.available_words);

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
                            'Submit'
                    )}
                </button>
            </Card>

            <div className="flex flex-row justify-end items-center gap-2">
                <div className="flex gap-2">
                    {available_words_count !== null ? (
                        <span className="text-gray-500 py-2 px-4 rounded-3xl border-gray-500">{available_words_count} Words Available</span>
                    ) : ('')}
                    {!launcher && (
                        <button className={`rounded-md text-theme_primary-700 p-2 ${saved ? 'bg-theme_primary-700 text-white' : ''}`}
                            onClick={saveThread}>
                            Save
                        </button>
                    )}
                    <button className="rounded-md text-theme_primary-700 p-2" onClick={handleActivateSettings}>
                        Generator Settings
                    </button>

                </div>
            </div>
        </form >
    )
}
export default GeneratorActions;