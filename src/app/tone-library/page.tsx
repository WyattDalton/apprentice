'use server'

import TonesUi from "./_components/TonesUI";
import { getMongoDB } from "@/components/utils/getMongo";

export default async function ToneOfVoiceLibrary() {
    /* * * * * * * * ** * * * * * * *
    /* Get all tones on load
    /* * * * * * * * ** * * * * * * */
    async function getAllTones() {
        try {
            const db = await getMongoDB() as any;
            const tones = await db.collection("tones").find({}).toArray();
            const plainTones = tones.map(({ _id, ...rest }: any) => ({ _id: _id.toString(), ...rest }));
            return plainTones;
        } catch (error: any) {
            console.error('Error in GET:', error.message);
        }
    }
    const tonesSource = await getAllTones();

    /* * * * * * * * ** * * * * * * *
    /* Render
    /* * * * * * * * ** * * * * * * */
    return (
        <TonesUi tonesSource={tonesSource} />
    );
}
