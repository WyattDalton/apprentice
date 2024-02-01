"use client"

import GeneratorActions from "./GeneratorActions";
import GeneratorContent from "./GeneratorContent";
import GeneratorSettings from "./GeneratorSettings";
import { useEffect, useState } from "react";
import { Disclosure, Tab, Transition } from "@headlessui/react";
import Card from "@/components/UI/Card";
import GeneratorInformation from "./GeneratorInformation";
import { useRouter } from "next/navigation";
import { ArrowDownIcon, ArrowUpIcon } from "@/components/icons";
import ThreadsList from "@/components/ThreadsList";
import GeneratorContentSkeleton from "../[id]/_components/GeneratorContentSkeleton";

type GeneratorProps = {
    initConversation?: any | null;
    className?: string | '';
    launcher?: any;
    generationId?: string;
    savedData?: any;
    sources?: any;
    metaData?: any;
    fetchMetaData?: any;
    threadsData?: any;
    tonesData?: any;
    formulasData?: any;
    saveThread?: any;
    getTitle?: any;
    updateThread?: any;
    deleteThread?: any;
}

export default function Generator({ initConversation, savedData, className, launcher, threadsData, tonesData, formulasData, generationId, sources, metaData, fetchMetaData, saveThread, getTitle, updateThread, deleteThread }: GeneratorProps) {
    const router = useRouter();
    const [saved, setSaved] = useState(savedData || false);

    const [generation, setGeneration] = useState<any>(generationId || '');
    const [conversation, setConversation] = useState<any[]>([]);
    const [currentResponse, setcurrentResponse] = useState({});

    const [meta, setMeta] = useState<any>(metaData || {});
    const [threads, setThreads] = useState<any>(threadsData || []);
    const [toneLibrary, setToneLibrary] = useState<any>(tonesData || []);
    const [formulaLibrary, setFormulaLibrary] = useState<any>(formulasData || []);

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

    const [activePanel, setActivePanel] = useState<any>(false);

    // ###
    // ### CHANGE ACTIVE PANEL
    const changeActivePanel = (e: any, panel: any) => {

        if (e == 'manual' && !panel) {
            document.querySelectorAll('.panel-switch').forEach((el: any) => {
                el.dataset.active = false;
            });
            setActivePanel(false);
            return
        }

        e.preventDefault();
        const $this = e.target.closest('button');

        const siblings = $this.closest('div').querySelectorAll('button');
        for (let i = 0; i < siblings.length; i++) {
            const $item = siblings[i];
            if ($item !== $this) {
                $item.dataset.active = false;
            }
        }

        $this.dataset.active = true;

        if (panel === activePanel) {
            setActivePanel(false);
            return
        }

        setActivePanel(false);
        setTimeout(() => {
            setActivePanel(panel);
            scrollToBottom('action');
            return;
        }, 200);
    }

    // ###
    // ### Scroll on generate / activate panel
    const scrollToBottom = (type: any) => {
        setTimeout(() => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollPosition = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

            if (documentHeight - scrollPosition - windowHeight <= 50 && type === 'content') {
                window.scrollTo({
                    top: documentHeight,
                    behavior: 'smooth'
                });
            } else if (type === 'action') {
                window.scrollTo({
                    top: documentHeight,
                    behavior: 'smooth'
                });
            }
        }, 10);
    }

    // ###
    // ### INIT CONVERSATION
    useEffect(() => {
        !!initConversation ? setConversation(initConversation) : setConversation([]);
    }, [initConversation])


    // ###
    // ### Get the meta data for the current thread
    const getMeta = async (threadId: string) => {
        if (!threadId) return;
        const res = await fetchMetaData(threadId);
        setMeta(res);
    }
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
    // ### Render Generator
    return (
        <>
            <section className={`transition-all duration-300 relative flex-grow flex flex-col lg:grid lg:grid-cols-6 lg:auto-rows-auto gap-4 p-4`}>
                <div className="col-span-6 lg:col-span-4 inset-0 bg-[radial-gradient(#e2e2e2_1px,transparent_1px)] [background-size:16px_16px] flex flex-col flex-grow px-[5%]">
                    <div className="w-full mx-auto max-w-[800px] py-4 relative">
                        <Disclosure>
                            {({ open }) => (
                                <>
                                    <Disclosure.Button className={'bg-transparent text-gray-700 py-2 px-6 rounded-xl border border-gray-700 flex gap-4 items-center max-w-full'}>
                                        <span className="truncate">{!!meta && meta.title ? meta.title : 'New content'}</span>
                                        {!!open ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
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

                                            {!threads ? `Loading...` : null}
                                            {!!threads && threads.length === 0 ? <p className="text-gray-400">No recent content</p> : <ThreadsList threads={threads} deleteThread={deleteThread} />}


                                        </Disclosure.Panel>
                                    </Transition>
                                </>
                            )}
                        </Disclosure>
                    </div>
                    <Card className="flex-grow w-full max-w-[800px] p-4 mx-auto !overflow-visible !mb-0 !bg-neutral-50">
                        {!!initConversation && conversation.length === 0 ? <GeneratorContentSkeleton /> : <GeneratorContent conversation={conversation} className="" />}
                    </Card>
                </div>

                <div className="col-span-6 lg:col-span-2 lg:h-full flex flex-col gap-4 justify-end relative lg:bg-neutral-50 rounded-lg">
                    <div>

                        <Transition
                            className={'flex flex-col p-4 bg-gray-700 rounded-lg'}
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
                                className={`flex flex-wrap w-full gap-4 transition-all duration-300`}
                                handleSetGeneratorSettings={setSettings}
                                generatorSettings={settings}
                                toneLibrary={toneLibrary}
                                formulaLibrary={formulaLibrary}
                            />
                        </Transition>

                        <Transition
                            className={'flex flex-col p-4 bg-gray-700 rounded-lg'}
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
                                className={`flex flex-wrap w-full gap-4 transition-all duration-300`}
                                placeholder="New content"
                                meta={meta}
                                setMeta={setMeta}
                                _id={generation}
                                updateThread={updateThread}
                            />
                        </Transition>
                    </div>


                        {/* Control switches and generator actions */}
                    <div className="hidden lg:flex flex-col gap-4 sticky bottom-2 bg-white rounded-lg p-4 shadow-lg z-30">
                        <GeneratorActions
                            className={`flex flex-wrap w-full gap-4 transition-all duration-300`}
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
                            changeActivePanel={changeActivePanel}
                            scrollToBottom={scrollToBottom}
                            sources={sources}
                            toneLibrary={tonesData}
                            formulaLibrary={formulasData}
                            saveThread={saveThread}
                            getTitle={getTitle}
                            updateThread={updateThread}
                        />
                    </div>
                </div>
                <div className="lg:hidden flex flex-col gap-4 sticky bottom-0 bg-white rounded-t-lg p-4 shadow-lg z-30">
                    <GeneratorActions
                        className={`flex flex-wrap w-full gap-4 transition-all duration-300`}
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
                        changeActivePanel={changeActivePanel}
                        scrollToBottom={scrollToBottom}
                        sources={sources}
                        toneLibrary={tonesData}
                        formulaLibrary={formulasData}
                        saveThread={saveThread}
                        getTitle={getTitle}
                        updateThread={updateThread}
                    />
                </div>
            </section>
        </>
    );
} 