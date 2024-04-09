"use server";

import { getMongoDB } from "@/utils/getMongo";

/**
 * Fetches sources from the database.
 * @returns {Promise<Array<Object>>} The array of clean sources.
 */
export async function fetchSources() {
    "use server"
    try {
        const db = await getMongoDB() as any;
        const sources = db.collection("sources");
        const allSources = await sources.find({}).toArray();
        const cleanSources = allSources.map(({ _id, ...rest }: any) => ({ _id: _id.toString(), ...rest }));
        return cleanSources;
    } catch (err) {
        console.error("Error in fetchSources: ", err);
    }
}