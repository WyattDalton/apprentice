"use server";
import { getMongoDB } from "@/utils/getMongo";
import { ObjectId } from "mongodb";

/**
 * Fetches metadata for a thread.
 * @param threadId - The ID of the thread.
 * @returns A promise that resolves to the clean thread metadata.
 */
export async function fetchMetaData(threadId: string) {
    "use server";
    try {
        const db = await getMongoDB() as any;
        const threads = db.collection("threads");
        const _id = new ObjectId(threadId);
        const thread = await threads.findOne({ _id: _id });
        const threadMeta = {} as any;
        thread.title ? threadMeta['title'] = thread.title : null;
        if (!threadMeta) return null;
        const cleanThreadMeta = { _id: thread._id.toString(), ...threadMeta };
        return cleanThreadMeta;
    } catch (err) {
        console.error("Error in fetchMetaData: ", err);
    }
}