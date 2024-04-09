'use server'

import ViewTable from "@/components/_ui/ViewTable";
import AddStyle from "./_components/AddStyle";
import { fetchStyles } from "@/app/_actions/_styles/fetchStyles";
import { deleteStyle } from "@/app/_actions/_styles/deleteStyle";
import { createStyle } from "@/app/_actions/_styles/createStyle";
import StylesUi from "./_components/StylesUI";
import structureTheData from "./_structureTheData";

export default async function StyleOfVoiceLibrary() {


    const stylesSource = await fetchStyles();
    const tableData = await structureTheData(stylesSource);

    /* * * * * * * * ** * * * * * * *
    /* Render
    /* * * * * * * * ** * * * * * * */
    return (
        <>
            <ViewTable
                viewTitle="Styles"
                addItem={<AddStyle />}
                deleteItem={deleteStyle}
                headers={tableData.headers}
                data={tableData.body}
                viewItemRoutePrefix={'/styles'}
                structureTheData={structureTheData}
            />
            {/* <StylesUi stylesSource={stylesSource} deleteStyle={deleteStyle} createStyle={createStyle} /> */}
        </>
    );
}
