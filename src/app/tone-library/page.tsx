'use server'

import TonesUi from "./_components/TonesUI";

export default async function ToneOfVoiceLibrary() {
    /* * * * * * * * ** * * * * * * *
    /* Get all tones on load
    /* * * * * * * * ** * * * * * * */
    const fetchTones = async () => {
        try {
            const api = process.env.API_URL ? process.env.API_URL : false;
            if (!!api) {

                const res = await fetch(`${process.env.API_URL}/tonesGetAll`, {
                    cache: 'no-store',
                });
                if (!res.ok) throw new Error('Error fetching tones');
                return await res.json();
            }
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
