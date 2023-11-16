"use client"

import GeneratorActions from "./GeneratorActions";
import GeneratorContent from "./GeneratorContent";
import GeneratorSettings from "./GeneratorSettings";
import { useEffect, useState } from "react";
import { Disclosure, Tab, Transition } from "@headlessui/react";
import Card from "@/components/UI/Card";
import GeneratorInformation from "./GeneratorInformation";
import { useRouter } from "next/navigation";

type GeneratorProps = {
    initConversation?: any | null;
    className?: string | '';
    launcher?: any;
    threadsData?: any;
    tonesData?: any;
    formulasData?: any;
    generationId?: string;
}


export default function Generator({ initConversation, className, launcher, threadsData, tonesData, formulasData, generationId }: GeneratorProps) {
    const router = useRouter();
    const [saved, setSaved] = useState(false);

    const [generation, setGeneration] = useState<any>(generationId || '');
    const [meta, setMeta] = useState<any>({});
    const [conversation, setConversation] = useState<any[]>([]);
    const [currentResponse, setcurrentResponse] = useState({});

    const [threads, setThreads] = useState(threadsData || []);
    const [toneLibrary, setToneLibrary] = useState(tonesData || []);
    const [formulaLibrary, setFormulaLibrary] = useState(formulasData || []);

    const [settings, setSettings] = useState({
        enabled: false,
        contentType: '',
        tone: '',
        intention: '',
        length: 0,
        details: '',
        formula: '',
        useSources: false,
    });

    const [activePanel, setActivePanel] = useState<any>('generate');

    // ###
    // ### CHANGE ACTIVE PANEL
    const changeActivePanel = (e: any, panel: string) => {
        e.preventDefault();
        if (panel === activePanel) return;

        const $this = e.target.closest('button');

        const siblings = $this.closest('div').querySelectorAll('button');
        for (let i = 0; i < siblings.length; i++) {
            const $item = siblings[i];
            if ($item !== $this) {
                $item.dataset.active = false;
            }
        }

        $this.dataset.active = true;

        setActivePanel(false);
        setTimeout(() => {
            setActivePanel(panel);
        }, 200);
    }

    // ###
    // ### INIT CONVERSATION
    useEffect(() => {
        !!initConversation ? setConversation(initConversation) : setConversation([]);
    }, [initConversation])

    // ###
    // ### GET TONES
    const getTones = async () => {
        const res = await fetch('/api/tonesGetAll');
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        const tonesRes = await res.json();
        setToneLibrary(tonesRes.tones);
    };


    // ###
    // ### GET FORMULAS
    const getFormulas = async () => {
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
    };

    // ###
    // ### GET THREADS
    const getThreads = async () => {
        const res = await fetch('/api/threads', {
            method: 'POST',
            body: JSON.stringify({
                dataType: 'get',
                data: { _id: false },
            }),
        });
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        const threadsRes = await res.json();
        setThreads(threadsRes.threads);
    }

    // ###
    // ### Get the meta data for the current thread
    const getMeta = async (threadId: string) => {
        console.log('fire');
        if (!threadId) return;
        const res = await fetch('/api/threads', {
            method: 'POST',
            body: JSON.stringify({
                dataType: 'get',
                data: { _id: threadId },
            }),
        });
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        const threadRes = await res.json();
        const threadMeta = {} as any;

        threadRes.thread.title ? threadMeta['title'] = threadRes.thread.title : null;

        if (!threadMeta) return;

        setMeta(threadMeta);
    }

    // ###
    // ### Trigger data fetches
    useEffect(() => {
        getTones();
        getFormulas();
        getThreads();
    }, []);

    useEffect(() => {
        getMeta(generation);
    }, [generation]);

    // ###
    // ### Open a new thread in the generator
    const handleOpenThread = async (threadId: string) => {
        router.push(`/generate/${threadId}`)
    }

    // ###
    // ### Open a new thread in the generator
    const handleNewThread = async () => {
        router.push(`/generate`)
    }

    // ###
    // ### Build recent threads component
    const ThreadList = ({ threads, handleOpenThread }: any) => {
        if (!threads) return;
        return (
            <div className="flex flex-col gap-2">
                {threads.map((thread: any, i: number) => {

                    const createdDate = new Date(thread.created);
                    const localCreatedDate = createdDate.toLocaleDateString();

                    return (
                        <button
                            key={i}
                            className="flex gap-2 py-4 px-2 hover:bg-white/20 rounded-md items-center group/thread"
                            onClick={() => { handleOpenThread(thread._id) }}
                        >
                            <button className="group bg-white/50 rounded-full hover:bg-white p-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white group-hover:text-gray-700 " viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M15.293 5.293a1 1 0 00-1.414 0L10 8.586 6.707 5.293a1 1 0 00-1.414 1.414L8.586 10l-3.293 3.293a1 1 0 001.414 1.414L10 11.414l3.293 3.293a1 1 0 001.414-1.414L11.414 10l3.293-3.293a1 1 0 000-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>

                            <span className="text-sm font-semibold truncate">{thread.title ? thread.title : thread._id}</span>
                            <span className="text-xs ml-auto">{localCreatedDate}</span>


                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 transform -rotate-90 group-hover/thread:translate-x-1 transition duration-150" viewBox="0 0 25 25" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 7.293a1 1 0 011.414 0L14 12.586l4.293-4.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    )
                })}
            </div>
        );
    }

    // ###
    // ### Render Generator
    return (
        <>
            <section className={`transition-all duration-300 relative grid flex-grow grid-cols-6 auto-rows-auto gap-4 p-4`}>

                <div className="col-span-6 md:col-span-4 inset-0 bg-[radial-gradient(#e2e2e2_1px,transparent_1px)] [background-size:16px_16px] flex flex-col">

                    <div className="w-full max-w-[800px] mx-auto py-4 relative">

                        <Disclosure>
                            {({ open }) => (
                                <>
                                    <Disclosure.Button className={'bg-transparent text-gray-700 py-2 px-6 rounded-xl border border-gray-700 flex gap-4'}>
                                        {!!meta && meta.title ? meta.title : 'New content'}
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 transform -rotate-45 transition duration-150" viewBox="0 0 25 25" fill="currentColor">
                                            <path fillRule="evenodd" d="M7.293 7.293a1 1 0 011.414 0L14 12.586l4.293-4.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </Disclosure.Button>
                                    <Transition
                                        className={'bg-gray-700 text-white p-6 rounded-xl absolute left-0 top-full w-full shadow-lg max-h-[70vh] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 z-50'}
                                        show={open}
                                        enter="transition duration-100 ease-out"
                                        enterFrom="transform -translate-y-6 opacity-0"
                                        enterTo="transform translate-y-0 opacity-100"
                                        leave="transition duration-75 ease-out"
                                        leaveFrom="transform translate-y-0 opacity-100"
                                        leaveTo="transform -translate-y-6 opacity-0"
                                    >
                                        <Disclosure.Panel static>

                                            <div className="flex gap-4 justify-between items-center flex-wrap border-b border-gray-800 mb-4 pb-4">
                                                <h2 className="text-2xl font-medium text-stone-50">Recently generated content</h2>
                                                <button
                                                    className="bg-gray-800 hover:bg-gray-600 text-white py-2 px-6 rounded-xl flex gap-2 items-center justify-center"
                                                    onClick={handleNewThread}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white transform rotate-45" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M15.293 5.293a1 1 0 00-1.414 0L10 8.586 6.707 5.293a1 1 0 00-1.414 1.414L8.586 10l-3.293 3.293a1 1 0 001.414 1.414L10 11.414l3.293 3.293a1 1 0 001.414-1.414L11.414 10l3.293-3.293a1 1 0 000-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                    New content</button>
                                            </div>

                                            <ThreadList threads={threads} handleOpenThread={handleOpenThread} />

                                        </Disclosure.Panel>
                                    </Transition>
                                </>
                            )}
                        </Disclosure>
                    </div>
                    <Card className="flex-grow w-full max-w-[800px] p-4 mx-auto !mb-0 bg-neutral-50">
                        <GeneratorContent conversation={conversation} />
                    </Card>
                </div>

                {/* Generator actions */}
                <div className="col-span-6 md:col-span-2 h-full bg-neutral-50 rounded-lg p-4 flex flex-col" >
                    <div className="grid grid-cols-4 gap-2 border-b-[1px] border-gray-100 pb-2 mb-2 sticky top-0 left-0">
                        <button
                            className={'group flex flex-col justify-center items-center gap-2 w-full p-2 rounded-xl text-sm font-bold text-gray-500 data-[active=true]:bg-gray-200 data-[active=true]:text-gray-600'}
                            onClick={(e) => changeActivePanel(e, 'generate')}
                        >
                            <span className="icon w-5/6 aspect-square flex justify-center items-center rounded-xl bg-gray-200 group-data-[active=true]:bg-white">
                                Ge
                            </span>
                            Generate
                        </button>
                        <button
                            className={'group flex flex-col justify-center items-center gap-2 w-full p-2 rounded-xl text-sm font-bold text-gray-500 data-[active=true]:bg-gray-200 data-[active=true]:text-gray-600'}
                            onClick={(e) => changeActivePanel(e, 'settings')}
                        >
                            <span className="icon w-5/6 aspect-square flex justify-center items-center rounded-xl bg-gray-200 group-data-[active=true]:bg-white">
                                Se
                            </span>
                            Settings
                        </button>
                        <button
                            className={'group flex flex-col justify-center items-center gap-2 w-full p-2 rounded-xl text-sm font-bold text-gray-500 data-[active=true]:bg-gray-200 data-[active=true]:text-gray-600'}
                            onClick={(e) => changeActivePanel(e, 'info')}
                        >
                            <span className="icon w-5/6 aspect-square flex justify-center items-center rounded-xl bg-gray-200 group-data-[active=true]:bg-white">
                                In
                            </span>
                            Info
                        </button>
                    </div>
                    <div className={'flex flex-col flex-grow'}>

                        <Transition
                            className={'flex flex-col justify-end flex-grow'}
                            show={activePanel === 'generate'}
                            enter="transition duration-200 ease-out"
                            enterFrom="transform translate-y-10 opacity-0"
                            enterTo="transform translate-y-0 opacity-100"
                            leave="transition duration-200 ease-out"
                            leaveFrom="transform translate-y-0 opacity-100"
                            leaveTo="transform translate-y-10 opacity-0"
                            unmount={false}
                        >
                            <GeneratorActions
                                className={`flex flex-wrap w-full gap-4 transition-all duration-300 z-40 sticky bottom-2`}
                                settings={settings}
                                conversation={conversation}
                                handleConversationChange={setConversation}
                                currentResponse={currentResponse}
                                handleCurrentResponseChange={setcurrentResponse}
                                saved={saved}
                                setSaved={setSaved}
                                setMeta={setMeta}
                                meta={meta}
                                generation={generation}
                                setGeneration={setGeneration}
                            />
                        </Transition>

                        <Transition
                            className={'flex flex-col justify-end flex-grow'}
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
                                className={`flex flex-wrap w-full gap-4 transition-all duration-300 z-40 sticky bottom-2`}
                                handleSetGeneratorSettings={setSettings}
                                generatorSettings={settings}
                                toneLibrary={toneLibrary}
                                formulaLibrary={formulaLibrary}
                            />
                        </Transition>

                        <Transition
                            className={'flex flex-col justify-end flex-grow'}
                            show={activePanel === 'info'}
                            enter="transition duration-200 ease-out"
                            enterFrom="transform translate-y-10 opacity-0"
                            enterTo="transform translate-y-0 opacity-100"
                            leave="transition duration-200 ease-out"
                            leaveFrom="transform translate-y-0 opacity-100"
                            leaveTo="transform translate-y-10 opacity-0"
                            unmount={false}
                        >
                            <GeneratorInformation
                                className={`flex flex-wrap w-full gap-4 transition-all duration-300 z-40 sticky bottom-2`}
                                placeholder="New content"
                                meta={meta}
                                setMeta={setMeta} />
                        </Transition>
                    </div>



                    {/* <Tab.Group>
                    <Tab.List className="grid grid-cols-4 gap-2 border-b-[1px] border-gray-100 pb-2 mb-2">
                        <Tab className={'group flex flex-col justify-center items-center gap-2 w-full p-2 rounded-xl ui-selected:bg-gray-200 text-sm font-bold text-gray-500 ui-selected:text-gray-600'}>
                            <span className="bg-gray-200 w-5/6 aspect-square flex justify-center items-center rounded-xl ui-selected:bg-white">
                                Ge
                            </span>
                            Generate
                        </Tab>
                        <Tab className={'group flex flex-col justify-center items-center gap-2 w-full p-2 rounded-xl ui-selected:bg-gray-200 text-sm font-bold text-gray-500 ui-selected:text-gray-600'}>
                            <span className="bg-gray-200 w-5/6 aspect-square flex justify-center items-center rounded-xl ui-selected:bg-white">
                                Se
                            </span>
                            Settings
                        </Tab>
                        <Tab className={'group flex flex-col justify-center items-center gap-2 w-full p-2 rounded-xl ui-selected:bg-gray-200 text-sm font-bold text-gray-500 ui-selected:text-gray-600'}>
                            <span className="bg-gray-200 w-5/6 aspect-square flex justify-center items-center rounded-xl ui-selected:bg-white">
                                In
                            </span>
                            Info
                        </Tab>
                    </Tab.List>
                    <Tab.Panels className={'flex flex-col flex-grow'}>
                        <Tab.Panel className={'flex flex-col justify-end flex-grow'}>
                            <GeneratorActions
                                className={`flex flex-wrap w-full gap-4 transition-all duration-300 z-40 sticky bottom-2`}
                                settings={settings}
                                conversation={conversation}
                                handleConversationChange={setConversation}
                                currentResponse={currentResponse}
                                handleCurrentResponseChange={setcurrentResponse}
                                saved={saved}
                                setSaved={setSaved}
                            />
                        </Tab.Panel>
                        <Tab.Panel>
                            <GeneratorSettings
                                className={`transition-all duration-300 p-4 bg-white rounded-t-3xl shadow-lg overflow-y-scroll w-full max-w-[90%] mx-auto`}
                                handleSetGeneratorSettings={setSettings}
                                generatorSettings={settings}
                                toneLibrary={toneLibrary}
                                formulaLibrary={formulaLibrary}
                            />
                        </Tab.Panel>
                        <Tab.Panel>
                            <GeneratorInformation placeholder="..." />
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group> */}



                </div>
            </section>
        </>
    );
} 