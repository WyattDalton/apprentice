'use client';

import Generator from '../../_components/Generator';
import { useState } from "react";

type Props = {
    messagesData: any;
    generationId: string;
}

export default function Page({ messagesData, generationId }: Props) {
    const [messages, setMessages] = useState(messagesData || []);
    return <Generator initConversation={messages} generationId={generationId} />;
}

