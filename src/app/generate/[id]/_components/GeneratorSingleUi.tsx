'use client';

import Generator from '../../_components/Generator';
import { useState } from "react";

type Props = {
    messagesData: any;
    generationId: string;
    savedData: any;
    threads: any,
    tones: any,
    formulas: any,
    sources: any,
    meta: any
}

export default function Page({ messagesData, generationId, savedData, threads, tones, formulas, sources, meta }: Props) {
    const [messages, setMessages] = useState(messagesData || []);
    return <Generator
        initConversation={messages}
        savedData={savedData}
        generationId={generationId}
        threadsData={threads}
        tonesData={tones}
        formulasData={formulas}
        sources={sources}
        metaData={meta}
    />;
}

