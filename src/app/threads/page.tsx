'use server';

import { deleteThread } from "../_actions/_threads/deleteThread";
import ViewTable from "@/components/_ui/ViewTable";
import AddThread from "./AddThread"
import structureTheData from "./_structureTheData";
import loadData from '../_actions/_utilities/loadViewTableData';



/**
 * Renders the page component for displaying threads.
 * @returns A JSX element representing the page component.
 */
export default async function Page() {

    const tableData = await loadData('threads');

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