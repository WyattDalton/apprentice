

export async function getResponseSources(sources: any, promptEmbeddingVectors: string, numReturn: number, minCosine: any, category: string) {

    const sourcesToReturn = [] as any;

    function dotProduct(vecA: any, vecB: any) {
        return vecA.reduce((acc: any, val: any, i: any) => acc + val * vecB[i], 0);
    }

    function magnitude(vec: any) {
        return Math.sqrt(vec.reduce((acc: any, val: any) => acc + val * val, 0));
    }

    function cosineSimilarity(vecA: any, vecB: any) {
        return dotProduct(vecA, vecB) / (magnitude(vecA) * magnitude(vecB));
    }

    sources.forEach((obj: { embeddings: any; }) => {
        const embeddings = obj.embeddings;
        embeddings.forEach((chunk: { embedding: any; title: any; content: any; }) => {
            const cosine = cosineSimilarity(chunk.embedding, promptEmbeddingVectors);
            if (cosine > minCosine) {
                sourcesToReturn.push({
                    "title": chunk.title,
                    "content": chunk.content,
                    "score": cosine,
                });
                sourcesToReturn.sort((a: { score: number; }, b: { score: number; }) => (a.score < b.score) ? 1 : -1);
            }
        });
    });

    return sourcesToReturn.slice(0, numReturn);

}