'use server'

import { getUserData } from "@/components/utils/getUserData";
import TonesUi from "./_components/TonesUI";

export default async function ToneOfVoiceLibrary() {
    /* * * * * * * * ** * * * * * * *
    /* Get all tones on load
    /* * * * * * * * ** * * * * * * */
    const fetchTones = async () => {
        try {

            const api = process.env.API_URL;

            const res = await fetch(`${api}/tonesGetAll`, {
                cache: 'no-store',
                next: { revalidate: 0 }
            });

            if (!res.ok) throw new Error('Error fetching tones');

            return await res.json();

        } catch (error) {
            console.log(error);
        }
    }

    /* * * * * * * * ** * * * * * * *
    /* Render
    /* * * * * * * * ** * * * * * * */
    const tonesSource = fetchTones();
    return (
        <TonesUi tonesSource={tonesSource} />
    );
}
