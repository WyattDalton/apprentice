"use server";
import { getMongoDB } from "@/utils/getMongo";


/**
 * Retrieves sources from the database based on cosine similarity to prompt embedding.
 * @returns {Promise<Array<Object>>} The array of clean sources.
 */
export async function retrieveSources(sourcesData: any, embedding: any, percentageSimilarity: any, numReturn: any) {
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
        const sourcesToReturn = [] as any;

        await Promise.all(sourcesData.map(async (obj: { embeddings: any; }) => {
            const embeddings = obj.embeddings;
            await Promise.all(embeddings.map(async (chunk: { embedding: any; title: any; content: any; }) => {
                const cosine = cosineSimilarity(chunk.embedding, embedding);
                if (cosine > percentageSimilarity) {
                    sourcesToReturn.push({
                        "title": chunk.title,
                        "content": chunk.content,
                        "score": cosine,
                    });
                    sourcesToReturn.sort((a: { score: number; }, b: { score: number; }) => (a.score < b.score) ? 1 : -1);
                }
            }));
        }));

        const returnSources = sourcesToReturn.slice(0, numReturn);

        return returnSources;

        // const db = await getMongoDB() as any;
        // const sources = db.collection("sources");


        // Get the size of the embeddings.embedding array in the first document
        // const firstDocument = await sources.findOne();
        // const size = firstDocument?.embeddings[0]?.embedding?.length || 0;

        // // Trim or pad the embedding array to the correct size
        // embedding = embedding.slice(0, size);
        // while (embedding.length < size) {
        //     embedding.push(0);
        // }

        // const aggregation = sources.aggregate([
        //     {
        //         "$addFields": {
        //             "target_embedding": embedding
        //         }
        //     },
        //     {
        //         "$unwind": "$embeddings"
        //     },
        //     {
        //         "$addFields": {
        //             "cos_sim": {
        //                 "$divide": [
        //                     {
        //                         "$reduce": {
        //                             "input": { "$range": [0, { "$size": "$embeddings.embedding" }] },
        //                             "initialValue": 0,
        //                             "in": {
        //                                 "$let": {
        //                                     "vars": {
        //                                         "doc_elem": { "$arrayElemAt": ["$embeddings.embedding", "$$this"] },
        //                                         "target_elem": { "$arrayElemAt": ["$target_embedding", "$$this"] }
        //                                     },
        //                                     "in": {
        //                                         "$add": [
        //                                             "$$value",
        //                                             { "$multiply": ["$$doc_elem", "$$target_elem"] }
        //                                         ]
        //                                     }
        //                                 }
        //                             }
        //                         }
        //                     },
        //                     {
        //                         "$sqrt": {
        //                             "$multiply": [
        //                                 {
        //                                     "$reduce": {
        //                                         "input": { "$range": [0, { "$size": "$embeddings.embedding" }] },
        //                                         "initialValue": 0,
        //                                         "in": {
        //                                             "$add": [
        //                                                 "$$value",
        //                                                 { "$pow": [{ "$arrayElemAt": ["$embeddings.embedding", "$$this"] }, 2] }
        //                                             ]
        //                                         }
        //                                     }
        //                                 },
        //                                 {
        //                                     "$reduce": {
        //                                         "input": { "$range": [0, { "$size": "$target_embedding" }] },
        //                                         "initialValue": 0,
        //                                         "in": {
        //                                             "$add": [
        //                                                 "$$value",
        //                                                 { "$pow": [{ "$arrayElemAt": ["$target_embedding", "$$this"] }, 2] }
        //                                             ]
        //                                         }
        //                                     }
        //                                 }
        //                             ]
        //                         }
        //                     }
        //                 ]
        //             }
        //         }
        //     },
        //     {
        //         "$match": {
        //             "cos_sim": {
        //                 "$gte": percentageSimilarity
        //             }
        //         }
        //     },
        //     {
        //         "$sort": {
        //             "cos_sim": -1
        //         }
        //     },
        //     {
        //         "$group": {
        //             "_id": "$_id",
        //             "title": { "$first": "$embeddings.title" },
        //             "content": { "$first": "$embeddings.content" },
        //             "score": { "$first": "$cos_sim" }
        //         }
        //     },
        //     {
        //         "$limit": numReturn
        //     }
        // ]);

        // const sourcesToReturn = (await aggregation.toArray()).map((doc: any) => ({
        //     ...doc,
        //     _id: doc._id.toString(),
        // })) as any;

        // return sourcesToReturn;
    } catch (err) {
        console.error("Error in retrieveSources: ", err);
    }
}