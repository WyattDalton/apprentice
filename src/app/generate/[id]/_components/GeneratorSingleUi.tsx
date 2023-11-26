'use client';

import Generator from '../../_components/Generator';
import { useState } from "react";

type Props = {
    messagesData: any;
    generationId: string;
    savedData: any;
}

export default function Page({ messagesData, generationId, savedData }: Props) {
    const [messages, setMessages] = useState(messagesData || []);
    return <Generator initConversation={messages} savedData={savedData} generationId={generationId} />;
}

