'use client';

import Generator from '../../_components/Generator';
import { useState } from "react";

type Props = {
    messagesData: any;
    generationId: string;
    savedData: any;
    threads: any,
    styles: any,
    formulas: any,
    sourcesData: any,
    meta: any
    fetchMetaData: any;
    saveThread: any;
}

export default function Page({ messagesData, generationId, savedData, threads, styles, formulas, sourcesData, meta, fetchMetaData, saveThread }: Props) {
    const [messages, setMessages] = useState(messagesData || []);
    return <Generator
        initConversation={messages}
        savedData={savedData}
        generationId={generationId}
        threadsData={threads}
        stylesData={styles}
        formulasData={formulas}
        sourcesData={sourcesData}
        fetchMetaData={fetchMetaData}
        saveThread={saveThread}
    />;
}

