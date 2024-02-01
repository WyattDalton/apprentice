"use server";
import { getMongoDB } from "@/utils/getMongo";
import { ObjectId } from "mongodb";

/**
 * Updates a thread in the database.
 * @param data - The data object containing the thread ID and update.
 * @returns An object with the success status, updated thread, and all threads.
 */
export async function updateThread(data: any) {
    "use server";
    try {
        const { _id, update } = data;
        const db = await getMongoDB() as any;
        const collection = db.collection("threads");
        const res = await collection.updateOne({ _id: new ObjectId(_id) }, { $set: update }, { upsert: true });
        const threads = await collection.find({}).toArray();
        const cleanThreads = threads.map(({ _id, ...rest }: any) => ({ _id: _id.toString(), ...rest }));
        const cleanThread = { _id: _id.toString(), ...update };
        return ({
            'success': true,
            'thread': cleanThread,
            'threads': cleanThreads,
        });
    } catch (err) {
        console.error("Error in updateThread: ", err);
    }
}