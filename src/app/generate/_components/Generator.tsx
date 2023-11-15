"use client"

import GeneratorActions from "./GeneratorActions";
import GeneratorContent from "./GeneratorContent";
import GeneratorSettings from "./GeneratorSettings";
import { useEffect, useState } from "react";
import { Disclosure, Tab, Transition } from "@headlessui/react";
import Card from "@/components/UI/Card";
import GeneratorInformation from "./GeneratorInformation";

type GeneratorProps = {
    initConversation?: any | null;
    className?: string | '';
    launcher?: any;
    threadsData?: any;
    tonesData?: any;
    formulasData?: any;
}


export default function Generator({ initConversation, className, launcher, threadsData, tonesData, formulasData }: GeneratorProps) {
    const [saved, setSaved] = useState(false);

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
    // ### Trigger data fetches
    useEffect(() => {
        getTones();
        getFormulas();
    }, []);

    // ###
    // ### Render Generator
    return (
        <section className={`transition-all duration-300 realative grid flex-grow grid-cols-6 auto-rows-auto gap-4 p-4`}>

            <div className="
                col-span-6
                md:col-span-4
                inset-0 
                bg-[radial-gradient(#e2e2e2_1px,transparent_1px)] 
                [background-size:16px_16px]
                flex
                flex-col">

                <div className="w-full max-w-[800px] mx-auto py-4 relative">

                    <Disclosure>
                        {({ open }) => (
                            <>
                                <Disclosure.Button className={'bg-dark text-white py-2 px-6 rounded-xl'}>Conversation</Disclosure.Button>
                                <Transition
                                    className={'bg-dark text-white py-2 px-6 rounded-xl absolute left-0 top-full'}
                                    show={open}
                                    enter="transition duration-100 ease-out"
                                    enterFrom="transform -translate-y-1/2 opacity-0"
                                    enterTo="transform translate-y-0 opacity-100"
                                    leave="transition duration-75 ease-out"
                                    leaveFrom="transform translate-y-0 opacity-100"
                                    leaveTo="transform -translate-y-1/2 opacity-0"
                                >
                                    <Disclosure.Panel static>
                                        Yes! You can purchase a license that you can share with your
                                        entire team.
                                    </Disclosure.Panel>
                                </Transition>
                            </>
                        )}
                    </Disclosure>
                </div>
                <Card className="flex-grow w-full max-w-[800px] p-4 mx-auto !mb-0">
                    <GeneratorContent conversation={conversation} />
                </Card>
            </div>

            {/* Generator actions */}
            <div className="col-span-6 md:col-span-2 h-full bg-white rounded-lg p-4 flex flex-col" >

                <div className="grid grid-cols-4 gap-2 border-b-[1px] border-gray-100 pb-2 mb-2">
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
                        <GeneratorInformation placeholder="..." />
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
    );
} 