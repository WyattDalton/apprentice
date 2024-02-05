'use server';

import ThreadsList from "@/components/_ui/ThreadsList";
import { fetchThreads } from "../_actions/_threads/fetchThreads";

/**
 * Renders the page component for displaying threads.
 * @returns A JSX element representing the page component.
 */
export default async function Page() {
    const threads = await fetchThreads();
    return (
        <ThreadsList threads={threads} deleteThread={undefined} />
    )
}