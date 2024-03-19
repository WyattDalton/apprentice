'use server';

import ThreadsList from "@/components/_ui/ThreadsList";
import { fetchThreads } from "../_actions/_threads/fetchThreads";
import ViewTable from "@/components/_ui/ViewTable";

/**
 * Renders the page component for displaying threads.
 * @returns A JSX element representing the page component.
 */
export default async function Page() {
    const threads = await fetchThreads();
    return (

        <>


            <ViewTable
                viewTitle="Threads"
                addItem={undefined}
                deleteItem={undefined}
                editItem={undefined}
                data={threads}
            />

            <ThreadsList threads={threads} deleteThread={undefined} />
        </>
    )
}