"use server";
import OpenAI from "openai";
const openAIApi = new OpenAI({
    organization: "org-B0x5nwrSR31e5bkeQuwEKeyY",
    apiKey: process.env.OPENAI_API_KEY,
});
export async function getEmbedding(chunk: any) {
    'use server'
    try {

        const embeddingResponse = await openAIApi.embeddings.create({
            model: `${process.env.SMALL_EMBEDDING_MODEL}`,
            input: chunk,
        });
        const embedding = embeddingResponse.data[0].embedding;

        return embedding;
    } catch (error) {
        return {
            "success": false,
            "message": "Error getting embedding",
            "error": error
        }
    }
}