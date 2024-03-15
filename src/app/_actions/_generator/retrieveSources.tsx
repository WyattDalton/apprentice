"use server";
import { getMongoDB } from "@/utils/getMongo";


/**
 * Retrieves sources from the database based on cosine similarity to prompt embedding.
 * @returns {Promise<Array<Object>>} The array of clean sources.
 */
export async function retrieveSources(embedding: any, percentageSimilarity: any, numReturn: any) {
    "use server";

    function dotProduct(vecA: any, vecB: any) {
        return vecA.reduce((acc: any, val: any, i: any) => acc + val * vecB[i], 0);
    }

    function magnitude(vec: any) {
        return Math.sqrt(vec.reduce((acc: any, val: any) => acc + val * val, 0));
    }

    function cosineSimilarity(vecA: any, vecB: any) {
        return dotProduct(vecA, vecB) / (magnitude(vecA) * magnitude(vecB));
    }

    try {
        const db = await getMongoDB() as any;
        const sources = db.collection("sources");
        const allSources = await sources.find({}).toArray();

        const sourcePool = [] as any;

        allSources.forEach((obj: { embeddings: any; }) => {
            const embeddings = obj.embeddings;
            embeddings.forEach((chunk: { embedding: any; title: any; content: any; }) => {
                const cosine = cosineSimilarity(chunk.embedding, embedding);
                if (cosine > percentageSimilarity) {
                    sourcePool.push({
                        "title": chunk.title,
                        "content": chunk.content,
                        "score": cosine,
                    });
                    sourcePool.sort((a: { score: number; }, b: { score: number; }) => (a.score < b.score) ? 1 : -1);
                }
            });
        });

        const sourcesToReturn = sourcePool.slice(0, numReturn);
        return sourcesToReturn;
    } catch (err) {
        console.error("Error in retrieveSources: ", err);
    }
}