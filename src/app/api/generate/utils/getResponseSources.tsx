

export async function getResponseSources(sources: any, embedding: string, numReturn: number, percentageSimilarity: any, category: string) {

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

        await Promise.all(sources.map(async (obj: { embeddings: any; }) => {
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
    } catch (error) {
        console.error(error);
    }

}
