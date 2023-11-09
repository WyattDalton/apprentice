'use server'

import { getUserData } from "@/components/utils/getUserData";
import TonesUi from "./_components/TonesUI";
import { getAllTones } from "../api/tonesGetAll/route";

export default async function ToneOfVoiceLibrary() {
    /* * * * * * * * ** * * * * * * *
    /* Get all tones on load
    /* * * * * * * * ** * * * * * * */
    const tonesSource = await getAllTones();

    /* * * * * * * * ** * * * * * * *
    /* Render
    /* * * * * * * * ** * * * * * * */
    return (
        <TonesUi tonesSource={tonesSource} />
    );
}
