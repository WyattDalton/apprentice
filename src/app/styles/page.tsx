'use server'

import ViewTable from "@/components/_ui/ViewTable";
import AddStyle from "./_components/AddStyle";
import { deleteStyle } from "@/app/_actions/_styles/deleteStyle";
import structureTheData from "./_structureTheData";
import loadData from "../_actions/_utilities/loadViewTableData";

export default async function StyleOfVoiceLibrary() {

    const tableData = await loadData('styles');

    /* * * * * * * * ** * * * * * * *
    /* Render
    /* * * * * * * * ** * * * * * * */
    return (
        <section className="flex-grow inset-0 bg-[radial-gradient(#e2e2e2_1px,transparent_1px)] [background-size:16px_16px] px-[5%]">
            <ViewTable
                viewTitle="Styles"
                addItem={<AddStyle />}
                deleteItem={deleteStyle}
                headers={tableData.headers}
                data={tableData.body}
                viewItemRoutePrefix={'/styles'}
                structureTheData={structureTheData}
            />
        </section>
    );
}
