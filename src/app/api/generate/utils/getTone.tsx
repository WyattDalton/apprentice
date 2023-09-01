import { random } from "lodash";



export async function getTone(toneId: any, promptEmbeddingVectors: string, tones: any) {
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

        const minCosine = 0.78;
        const examplePool = [] as any;
        // Get tone with an _id key that matches toneId from array of objects
        const tone = tones.find((tone: { _id: any; }) => tone._id === toneId);
        const examples = tone.examples;

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
        payload["instructions"] = tone.instructions;
        return payload;


    } catch (error) {
        console.log(error);
    }
}