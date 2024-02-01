'use server';
import { getMongoDB } from "@/utils/getMongo";

/**
 * Fetches tones from the database.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of tones.
 */
export async function fetchTones() {
    'use server';
    try {
        const db = await getMongoDB() as any;
        const tones = db.collection("tones");
        const allTones = await tones.find({}).toArray();
        const cleanTones = allTones.map(({ _id, ...rest }: any) => ({ _id: _id.toString(), ...rest }));
        return cleanTones;
    } catch (err) {
        console.error("Error in fetchTones: ", err);
    }
}