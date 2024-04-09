"use server"

import OpenAI from "openai";
const openAIApi = new OpenAI({
    organization: "org-B0x5nwrSR31e5bkeQuwEKeyY",
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Splits a given text into chunks based on a specified chunk size and overlap size.
 * @param text - The text to be split into chunks.
 * @returns An array of chunks.
 */
export async function createChunks(text: string) {
    "use server"
    try {
        const words = text.split(/\s+/);
        const chunkSize = 215;
        const overlapSize = Math.floor(chunkSize * 0.2);
        const chunks = [];

        for (let i = 0; i < words.length; i += chunkSize - overlapSize) {
            chunks.push(words.slice(i, i + chunkSize).join(' '));
        }

        return chunks;
    } catch (error) {
        console.error('Error creating chunks:', error);
        return null;
    }
}


/**
 * Retrieves the embedding for a given chunk of text.
 * @param chunk - The text chunk to retrieve the embedding for.
 * @param title - The title associated with the chunk.
 * @param index - The index of the chunk.
 * @returns An object containing the content, title, and embedding of the chunk, or null if an error occurs.
 */
export async function getEmbedding(chunk: string, title: string, index: number) {
    "use server"
    try {
        const embeddingResponse = await openAIApi.embeddings.create({
            model: `${process.env.SMALL_EMBEDDING_MODEL}`,
            input: chunk,
        });
        const embedding = embeddingResponse.data[0].embedding;
        return {
            content: chunk,
            title: `${title}-${index}`,
            embedding: embedding,
        };
    } catch (error) {
        console.error('Error getting embedding:', error);
        return null;
    }
}