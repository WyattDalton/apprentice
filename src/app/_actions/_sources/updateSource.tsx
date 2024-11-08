"use server"

import { createChunks, getEmbedding } from "./utilities";
import prisma from "@/utils/getPrisma";

/**
 * Updates a source in the DB.
 * @param id The ID of the source to be updated.
 * @param update The updated data for the source.
 * @returns A Promise that resolves to the updated source.
 */
export async function updateSource(id: any, update: any) {
    "use server"
    try {
        let newSource;

        /* * * * * * * * * * * * * */
        /* Try to find the document
        /* * * * * * * * * * * * * */
        const source = update;
        const sourceDocument = await prisma.source.findUnique({
            where: {
                id: id
            }
        });
        if (!sourceDocument) throw new Error('source not found');

        let title = sourceDocument.title;
        let text = sourceDocument.text;
        let chunks, embeddings;

        if (!!source.title && source.title !== sourceDocument.title) {
            title = source.title;
        } else {
            title = null;
        }

        if (!!source.text && source.text !== sourceDocument.text) {
            text = source.text;
            chunks = await createChunks(text) || [];
            embeddings = await Promise.all(chunks.map((chunk, index) => getEmbedding(chunk, title, index)));
        } else {
            text = null;
            chunks = null;
            embeddings = null;
        }

        const sourcePayload = {} as any;
        if (!!title) sourcePayload.title = title;
        if (!!text) sourcePayload.text = text;
        if (!!embeddings) sourcePayload.embeddings = embeddings;

        newSource = await prisma.source.update({
            where: {
                id: id
            },
            data: sourcePayload,
        });

        /* * * * * * * * * * * * * */
        /* Return new source
        /* * * * * * * * * * * * * */
        return { success: true, source: newSource };
    } catch (error) {
        return { success: false, message: error };
    }
}