'use server';

import ThreadsList from "@/components/_ui/ThreadsList";
import { fetchThreads } from "../_actions/_threads/fetchThreads";
import { deleteThread } from "../_actions/_threads/deleteThread";
import ViewTable from "@/components/_ui/ViewTable";
import AddThread from "./AddThread"
import structureTheData from "./_structureTheData";


/**
 * Renders the page component for displaying threads.
 * @returns A JSX element representing the page component.
 */
export default async function Page() {

    const threads = await fetchThreads();
    const tableData = await structureTheData(threads);

    return (
        <ViewTable
            viewTitle="Threads"
            addItem={<AddThread />}
            deleteItem={deleteThread}
            headers={tableData.headers}
            data={tableData.body}
            viewItemRoutePrefix="/g"
            structureTheData={structureTheData}
        />
    )
}