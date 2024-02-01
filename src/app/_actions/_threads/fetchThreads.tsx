"use server";
import { getMongoDB } from "@/utils/getMongo";

/**
 * Fetches threads from the server.
 * @returns {Promise<Array<any>>} A promise that resolves to an array of clean threads.
 */
export async function fetchThreads() {
    "use server";
    try {
        const db = await getMongoDB() as any;
        const threads = db.collection("threads");
        const allThreads = await threads.find({}).sort({ created: -1 }).toArray();
        const cleanThreads = allThreads.map(({ _id, ...rest }: any) => ({ _id: _id.toString(), ...rest }));
        return cleanThreads;
    } catch (err) {
        console.error("Error in fetchThreads: ", err);
    }
}