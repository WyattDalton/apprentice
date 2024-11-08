"use server"

import prisma from "@/utils/getPrisma";
import { createChunks, getEmbedding } from "./utilities";
import getLoggedInUser from "@/utils/getLoggedInUser";

/**
 * Adds raw sources to the db.
 * @param sources - The array of sources to be added.
 * @returns A Promise that resolves to an array of objects containing the success status and the cleaned source.
 */
export async function addRaw(source: any) {
    "use server"


    const user = await getLoggedInUser();
    const userId = user.id.toString();

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
    sourcePayload.userId = userId;


    /* * * * * * * * * * * * * */
    /* Add to Prisma
    /* * * * * * * * * * * * * */
    const newSourceawait = await prisma.source.create({
        data: sourcePayload
    });

    console.log('newSourceawait: ', newSourceawait);

    /* * * * * * * * * * * * * */
    /* Return new source
    /* * * * * * * * * * * * * */
    return { success: true, source: newSourceawait };
}