"use client"

import GeneratorActions from "./GeneratorActions";
import GeneratorContent from "./GeneratorContent";
import GeneratorSettings from "./GeneratorSettings";
import { useEffect, useState } from "react";
import { Transition } from "@headlessui/react";

type GeneratorProps = {
    initConversation?: any | null;
    className?: string | '';
    launcher?: any;
}


export default function Generator({ initConversation, className, launcher }: GeneratorProps) {
    const [active, setActive] = useState(false);
    const [threads, setThreads] = useState([]);
    const [saved, setSaved] = useState(false);
    const [conversation, setConversation] = useState<any[]>([]);
    const [currentResponse, setcurrentResponse] = useState({});
    const [activateSettings, setActivateSettings] = useState(false);
    const [toneLibrary, setToneLibrary] = useState([]);
    const [formulaLibrary, setFormulaLibrary] = useState([]);

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

    // ###
    // ### INIT CONVERSATION
    useEffect(() => {
        !!initConversation ? setConversation(initConversation) : setConversation([]);
        if (!!initConversation) {
            setActive(true);
        }
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
        <section className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
            <div className={`transition-all duration-300 flex-col flex flex-col h-full grow-1 w-full min-h-screen max-w-[90%] mx-auto bg-gray-200/50 rounded-t-3xl p-4 ${!!activateSettings ? 'lg:col-span-3' : 'lg:col-span-full'} ${className}`}>
                <Transition
                    show={active}
                    enter="transition-opacity duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    unmount={true}
                    appear={true}
                >
                    <GeneratorContent
                        conversation={conversation}
                    />
                </Transition>

                {/* Generator actions */}
                <GeneratorActions
                    className={`flex-col mt-auto`}
                    settings={settings}
                    conversation={conversation}
                    handleConversationChange={setConversation}
                    currentResponse={currentResponse}
                    handleCurrentResponseChange={setcurrentResponse}
                    saved={saved}
                    setSaved={setSaved}
                    setActive={setActive}
                    active={active}
                    activateSettings={activateSettings}
                    setActivateSettings={setActivateSettings}
                    launcher={launcher}
                />
            </div>

            {/* Generator settings and help panel */}
            <GeneratorSettings
                className={`transition-all duration-300 ${!!activateSettings ? 'lg:col-span-2' : 'lg:col-span-full'}`}
                handleSetGeneratorSettings={setSettings}
                generatorSettings={settings}
                toneLibrary={toneLibrary}
                formulaLibrary={formulaLibrary}
                activateSettings={activateSettings}
                setActivateSettings={setActivateSettings}
            />
        </section>
    );
} 