'use server'

import { getAllTones, deleteTone, createTone } from "./_actions";
import TonesUi from "./_components/TonesUI";

export default async function ToneOfVoiceLibrary() {


    const tonesSource = await getAllTones();

    /* * * * * * * * ** * * * * * * *
    /* Render
    /* * * * * * * * ** * * * * * * */
    return (
        <TonesUi tonesSource={tonesSource} deleteTone={deleteTone} createTone={createTone} />
    );
}
