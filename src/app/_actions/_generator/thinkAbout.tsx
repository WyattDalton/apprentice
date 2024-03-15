"use client"
import { useChat } from 'ai/react';

export default async function (prompt: string) {
    "use client"
    useChat({
        api: '/api/generate',
        initialInput: prompt,
    })
}