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
        <section className={`transition-all duration-300 flex-col flex flex-grow gap-2`}>
            <GeneratorContent
                conversation={conversation}
                className="flex-grow block w-full max-w-[90%] mx-auto bg-gray-200/30 rounded-3xl p-4 ${className}"
            />

            {/* Generator actions */}
            <GeneratorActions
                className={`flex flex-wrap sticky bottom-2 mt-auto mx-auto max-w-[90%] w-full bg-white rounded-3xl shadow-lg p-4 gap-4 transition-all duration-300 z-40`}
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

            <GeneratorSettings
                className={`transition-all duration-300 p-4 bg-white rounded-t-3xl shadow-lg h-[80vh] overflow-y-scroll fixed bottom-0 w-full max-w-[90%] mx-auto z-50 -translate-x-1/2 left-1/2`}
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