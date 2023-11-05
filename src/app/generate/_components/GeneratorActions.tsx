'use client';

import { useEffect, useState, useRef, useMemo } from "react";
import { useChat } from 'ai/react'
import Card from "@/components/UI/Card";
import LoadingSpinner from "@/components/LoadingSpinner";
import LoadingText from "@/components/LoadingText";
import { getUserData } from "@/components/utils/getUserData";
import { Transition } from "@headlessui/react";
import GeneratorInformation from "./GeneratorInformation";

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

    const [focused, setFocused] = useState<boolean>(false);
    const [inputHeight, setInputHeight] = useState<string>('px');
    const [inputWidth, setInputWidth] = useState<string>('px');

    const [informationActive, setInformationActive] = useState<boolean>(false);

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
            className={`${className} ${!focused ? `!p-0 !bg-transparent !shadow-none` : ``}`}
            onSubmit={(e) => handleSubmit(e)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    // trigger submit
                    e.preventDefault();
                    handleSubmit(e);

                }
            }}
        >

            <Card className={`!shadow-md !mb-0 !p-0 w-full overflow-hidden flex justify-between items-center gap-2 !bg-gray-100 ${!focused ? 'm-4' : 'm-0'}`}>
                <textarea
                    className={`block w-full outline-none break-words p-4 resize-none bg-transparent transition-all transition-300 ${!focused ? `line-clamp-1 truncate !h-auto bg-white` : ``}`}
                    placeholder="Enter your prompt..."
                    name="prompt"
                    rows={1}
                    value={input}
                    ref={searchBarRef}
                    onFocus={(e) => {
                        setFocused(true);
                        setTimeout(() => {
                            const length = e.target.value.length;
                            e.target.setSelectionRange(length, length);
                        }, 0);
                    }}
                    onBlur={() => setFocused(false)}
                    onChange={
                        handleInputChange
                    }
                ></textarea>
            </Card>

            <Transition
                className="flex gap-2 items-center justify-between w-full"
                show={focused}
                enter="transition-all duration-300"
                enterFrom="translate-y-10 opacity-0"
                enterTo="translate-y-0 opacity-100"
                leave="transition-all duration-300"
                leaveFrom="translate-y-0 opacity-100"
                leaveTo="translate-y-10 opacity-0"
                unmount={true}
                appear={true}

            >

                <button
                    className="px-2 py-2 text-dark bg-secondary rounded-md mt-auto"
                    title="Generator Information"
                    onClick={() => setInformationActive(true)}
                >
                    In
                    ({informationActive ? 'true' : 'false'})
                </button>
                <button
                    className="px-2 py-2 text-dark bg-secondary rounded-md mt-auto"
                    title="Generator settings"
                    onClick={() => handleActivateSettings()}
                >
                    Se
                </button>
                <button
                    className="px-2 py-2 text-dark bg-secondary rounded-md mt-auto"
                    title="Save generation"
                    onClick={() => saveThread()}
                >
                    Sa
                </button>
                <button
                    className="px-6 py-2 ml-auto text-dark bg-secondary rounded-md mt-auto"
                    type="submit"
                >
                    {isLoading ? (
                        <LoadingText text="Loading" className={""} iconClassName={""} />
                    ) : (
                        'Generate'
                    )}
                </button>
            </Transition>

            <GeneratorInformation active={informationActive} setActive={setInformationActive} placeholder="..." />

        </form >
    )
}
export default GeneratorActions;