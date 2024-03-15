'use server'

import { getAllStyles, deleteStyle, createStyle } from "./_actions";
import StylesUi from "./_components/StylesUI";

export default async function StyleOfVoiceLibrary() {


    const stylesSource = await getAllStyles();

    /* * * * * * * * ** * * * * * * *
    /* Render
    /* * * * * * * * ** * * * * * * */
    return (
        <StylesUi stylesSource={stylesSource} deleteStyle={deleteStyle} createStyle={createStyle} />
    );
}
