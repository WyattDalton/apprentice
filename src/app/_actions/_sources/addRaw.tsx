"use server"

import { getMongoDB } from "@/utils/getMongo";
import { createChunks, getEmbedding } from "./utilities";

/**
 * Adds raw sources to the MongoDB collection.
 * @param sources - The array of sources to be added.
 * @returns A Promise that resolves to an array of objects containing the success status and the cleaned source.
 */
export async function addRaw(source: any) {
    "use server"
    const db = await getMongoDB() as any;
    const sourcesCollection = db.collection("sources");

    const sourcePayload = {} as any;

    const text = source.text;
    const title = source.title;
    const name = source.name;
    const chunks = await createChunks(text) as any;
    const embeddings = await Promise.all(chunks.map((chunk: any, index: number) => getEmbedding(chunk, name, index)));

    sourcePayload.name = name;
    sourcePayload.title = title;
    sourcePayload.type = 'raw';
    sourcePayload.text = text;
    sourcePayload.embeddings = embeddings;
    sourcePayload.category = 'general';

    /* * * * * * * * * * * * * */
    /* Add to MongoDB
    /* * * * * * * * * * * * * */
    const newSourceawait = await sourcesCollection.updateOne(
        { name: name, type: 'raw' }, // Filter
        { $set: sourcePayload },     // Update
        { upsert: true }             // Options: if no match is found, create a new document
    );

    /* * * * * * * * * * * * * */
    /* Return new source
    /* * * * * * * * * * * * * */
    const returnSource = await sourcesCollection.findOne({
        _id: newSourceawait.upsertedId,
        type: 'raw'
    },
        {
            projection: { category: 1, name: 1, text: 1, title: 1, type: 1, _id: 1 }
        });
    const cleanedSource = { ...returnSource, _id: returnSource._id.toString() };
    return { success: true, source: cleanedSource };
}