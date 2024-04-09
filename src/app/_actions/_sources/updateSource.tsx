"use server"

import { getMongoDB } from "@/utils/getMongo";
import { ObjectId } from "mongodb";
import { createChunks, getEmbedding } from "./utilities";

/**
 * Updates a source in the MongoDB collection.
 * @param id The ID of the source to be updated.
 * @param update The updated data for the source.
 * @returns A Promise that resolves to the updated source.
 */
export async function updateSource(id: any, update: any) {
    "use server"
    try {
        const db = await getMongoDB() as any;
        const sourcesCollection = db.collection("sources");
        let newSource;

        /* * * * * * * * * * * * * */
        /* Try to find the document
        /* * * * * * * * * * * * * */
        const source = update;
        const _id = new ObjectId(id);

        const sourceDocument = await sourcesCollection.findOne({ _id: _id });
        if (!sourceDocument) throw new Error('source not found');
        const sourcePayload = {} as any;

        const title = source.title !== sourceDocument.title ? source.title : null;
        const text = source.text !== sourceDocument.text ? source.text : null;

        let chunks, embeddings;

        if (!!text && text !== sourceDocument.text) {
            chunks = await createChunks(text) || [];
            embeddings = await Promise.all(chunks.map((chunk, index) => getEmbedding(chunk, title, index)));
        } else {
            chunks = null;
            embeddings = null;
        }

        if (!!title) sourcePayload.title = title;
        if (!!text) sourcePayload.text = text;
        if (!!embeddings) sourcePayload.embeddings = embeddings;
        if (!!chunks) sourcePayload.chunks = chunks;

        // Search for an existing document with the same "name" and "type"
        newSource = await sourcesCollection.updateOne(
            { _id: _id },
            { $set: sourcePayload },
            { upsert: true }
        );

        /* * * * * * * * * * * * * */
        /* Return new source
        /* * * * * * * * * * * * * */
        const returnSource = await sourcesCollection.findOne({ _id: _id });
        const cleanSource = { ...returnSource, _id: returnSource._id.toString() };
        return { success: true, source: cleanSource };
    } catch (error) {
        return { success: false, message: error };
    }
}