'use server';
import { getMongoDB } from "@/utils/getMongo";
import { ObjectId } from "mongodb";

/**
 * Saves a thread to the database.
 * @param data - The data of the thread to be saved.
 * @returns The updated thread document from the database.
 */
export async function saveThread(data: any) {
    'use server';
    try {
        const db = await getMongoDB() as any;
        const threads = db.collection("threads");

        // ### 
        // ### Dynamic data
        const saved = data.saved ? data.saved : null;
        const messages = data.messages ? data.messages : null;
        const genThreads = data.threads ? data.threads : null;

        // ###
        // ### Init setup data
        const initial_prompt = data.initial_prompt ? data.initial_prompt : null;
        const created = data.created ? data.created : null;
        const _id = !!data._id ? new ObjectId(data._id) : null;

        // ###
        // ### Init payload
        const payload = {} as any;
        if (!!saved) saved == 'true' ? payload['saved'] = true : payload['saved'] = false;
        if (!!messages) payload['messages'] = messages;
        if (!!genThreads) payload['threads'] = genThreads;

        if (!!_id) {
            const response = await threads.updateOne(
                { _id: _id }, // filter
                { $set: payload }, // update
                { upsert: true } // options
            );
        } else {
            await threads.updateOne(
                { initial_prompt: initial_prompt, created: created }, // filter
                { $set: payload }, // update
                { upsert: true } // options
            );
        }
        // Retrieve the updated document from the database
        const updatedItem = await threads.findOne({ initial_prompt: initial_prompt, created: created });
        const cleanedId = updatedItem._id.toString();
        return { "_id": cleanedId };
    } catch (err) {
        console.error("Error in saveThread: ", err);
        return null;
    }
}