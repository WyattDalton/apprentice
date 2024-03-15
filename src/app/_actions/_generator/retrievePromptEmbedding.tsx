"use server";
import { Configuration, OpenAIApi } from 'openai-edge'
const apiConfig = new Configuration({
    apiKey: process.env.OPENAI_API_KEY!
})
const openai = new OpenAIApi(apiConfig)

export async function retrievePromptEmbedding(prompt: any) {
    "use server";
    try {

        const promptEmbeddingRaw = await openai.createEmbedding({
            model: `${process.env.SMALL_EMBEDDING_MODEL}`,
            input: prompt,
        })
        const promptEmbedding = await promptEmbeddingRaw.json();
        const promptEmbeddingVectors = await promptEmbedding.data[0].embedding;
        return promptEmbeddingVectors;

    } catch (error) {
        console.log(error);
    }
}