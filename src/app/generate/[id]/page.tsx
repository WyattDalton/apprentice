'use client';

import Generator from '../_components/Generator';
import { useParams } from 'next/navigation'
import { useEffect, useState } from "react";

export default function Page() {
    const [messages, setMessages] = useState([]);
    const params = useParams()
    const id = params.id;

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`/api/getSingleThread`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "id": id }),
            });

            if (!res.ok) {
                // This will activate the closest `error.js` Error Boundary
                throw new Error('Failed to fetch data')
            }

            const data = await res.json();
            setMessages(data.data.messages);
        }

        fetchData();
    }, [id]);

    return <Generator initConversation={messages} />;
}

