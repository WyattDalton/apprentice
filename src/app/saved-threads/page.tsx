'use client';

import Card from "@/components/UI/Card";
import SearchBar from "@/components/UI/SearchBar";
import { useEffect, useState } from "react";
import { UilTrashAlt } from '@iconscout/react-unicons'

export default function SavedThreads() {
    const [query, setQuery] = useState<string>('');
    const [threads, setThreads] = useState<any[]>([]);

    const fetchSavedThreads = async () => {
        try {
            const response = await fetch("/api/getThreads");
            if (response.ok) {
                const data = await response.json();
                const filteredThreads = data.data.filter((thread) => thread.saved);
                setThreads(filteredThreads);
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchSavedThreads();
    }, [])

    return (
        <section>
            <h1 className="prose text-3xl font-bold">Saved Threads</h1>
            <SearchBar
                query={query}
                setQuery={setQuery}
            />

            {threads.map((thread) => (
                <Card className="max-w-30 flex justify-start items-center gap-4">
                    <h2 className="prose text-xl font-bold mr-auto">{thread.initial_prompt}</h2>
                    <button
                        className="group w-max font-semibold flex items-center rounded-md bg-theme_primary hover:bg-theme_primary-600 py-0 px-4 text-white !mt-0"
                    >
                        Continue
                    </button>
                    <button
                        className="flex items-center text-red-700 !mt-0"
                    >
                        <UilTrashAlt className="h-6 w-6" />
                    </button>
                </Card>
            ))}

        </section>
    )
}