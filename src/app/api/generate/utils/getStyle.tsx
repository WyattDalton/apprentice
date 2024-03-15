
export async function getStyle(styleId: any, promptEmbeddingVectors: string, styles: any) {
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
        // Get style with an _id key that matches styleId from array of objects
        const style = styles.find((style: { _id: any; }) => style._id === styleId);
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
        console.log(error);
    }
}