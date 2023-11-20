'use client';

import Generator from '../../_components/Generator';
import { useState } from "react";

type Props = {
    messagesData: any;
    generationId: string;
    savedData: any;
    userMessageData: any;
}

export default function Page({ messagesData, generationId, savedData, userMessageData }: Props) {
    const [messages, setMessages] = useState(messagesData || []);
    return <Generator initConversation={messages} userMessageData={userMessageData} savedData={savedData} generationId={generationId} />;
}

