"use server";

/**
 * Retrieves the style for a given prompt.
 * @param style - The style object.
 * @param promptEmbeddingVectors - The embedding vectors of the prompt.
 * @returns An object containing the example and instructions for the style.
 */
export async function getStyleForPrompt(style: any, promptEmbeddingVectors: string) {
    'use server'

    /**
     * Calculates the dot product of two vectors.
     * @param vecA - The first vector.
     * @param vecB - The second vector.
     * @returns The dot product of the two vectors.
     */
    function dotProduct(vecA: any, vecB: any) {
        return vecA.reduce((acc: any, val: any, i: any) => acc + val * vecB[i], 0);
    }

    /**
     * Calculates the magnitude of a vector.
     * @param vec - The vector.
     * @returns The magnitude of the vector.
     */
    function magnitude(vec: any) {
        return Math.sqrt(vec.reduce((acc: any, val: any) => acc + val * val, 0));
    }

    /**
     * Calculates the cosine similarity between two vectors.
     * @param vecA - The first vector.
     * @param vecB - The second vector.
     * @returns The cosine similarity between the two vectors.
     */
    function cosineSimilarity(vecA: any, vecB: any) {
        return dotProduct(vecA, vecB) / (magnitude(vecA) * magnitude(vecB));
    }

    try {
        const minCosine = 0.78;
        const examplePool = [] as any;
        const examples = style.examples;

        examples.forEach((obj: any, index: number) => {
            try {
                const embedding = obj.embedding;
                const text = obj.text;
                const cosine = cosineSimilarity(embedding, promptEmbeddingVectors);

                if (cosine > minCosine) {
                    examplePool.push({
                        "content": text,
                        "score": cosine,
                    });
                    examplePool.sort((a: { score: number; }, b: { score: number; }) => (a.score < b.score) ? 1 : -1);
                }
            } catch (error) {
                console.log('error in example cos loop: ', error)
            }
        });

        const payload = {} as any;
        payload["example"] = !!examplePool[0] ? examplePool[0].content : null;
        payload["bluePrint"] = style.bluePrint;

        return payload;
    } catch (error) {
        console.log('Error getting style from DB: ', error);
    }
}