'use client';

import Generator from '../../_components/Generator';
import { useState } from "react";

type Props = {
    messagesData: any;
}

export default function Page({ messagesData }: Props) {
    const [messages, setMessages] = useState(messagesData || []);
    return <Generator initConversation={messages} />;
}

