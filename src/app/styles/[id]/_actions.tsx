import OpenAI from "openai";
const openAIApi = new OpenAI({
    organization: "org-B0x5nwrSR31e5bkeQuwEKeyY",
    apiKey: process.env.OPENAI_API_KEY,
});

/* * * * * * * * * * * * * * * * */
/* Handle instructions processing
/* * * * * * * * * * * * * * * * */

/**
 * Retrieves instructions for generating writing in a similar tone as examples.
 * @param string - The examples of writing style and tone.
 * @param openai - The OpenAI instance.
 * @returns The generated instructions for replicating the writing style and tone.
 */
export async function getInstructions(string: string, openai = openAIApi as any) {
    'use server'
    try {
        const instructionMessages = [
            {
                "role": "system",
                "content": `You are very good at describing the style, sentence structure, and tone of voice used in writing samples supplied by the user. Your purpose is to describe the elements of style demonstrated in these examples well enough that an AI writer can mimic the style, sentence structure, and tone of voice perfectly. You even use examples inside your instructions to show how text should formatted. 
                \n\nThese are the elements of style that you are concerned with copying from the examples: sentence structure, word choice, emotion (or lack of emotion), penmanship (how does the author treat capitalizations, hyphens, dashes, etc... Pay attention to any deviations from standard) and diction, creative language or lack of creative language\n\n
                % START OF EXAMPLES\n ${string} \n% END OF EXAMPLES\n\n
                Use the information you've been given on the elements of style to generate instructions for yourself on replicating the writing style and tone of voice in the examples.Your response should only contain instructions for replicating the writing style and tone of voice in the examples. DO NOT PROVIDE ANY COMENTARY ON THE EXAMPLES OR REFER TO THE EXAMPLES IN YOUR RESPONSE.`
            }
        ]

        const instructions = await await openai.chat.completions.create({
            model: `${process.env.PROCESSING_MODEL}`,
            messages: instructionMessages,
            max_tokens: 400,
        })

        const response = instructions.data.choices[0].message.content;
        return response;
    } catch (error) {
        console.log("error in getInstructions: ", error);
    }
}



/**
 * Processes a blueprint by generating instructions for mimicking or replicating the style of the examples in the provided iteration.
 * @param iteration - The iteration containing the examples and previous notes.
 * @param openai - The OpenAI API object.
 * @returns The generated instructions for replicating the style.
 */
export async function generateBlueprint(iteration: any, openai = openAIApi as any) {
    'use server'
    try {
        // Create the messages array for the chat completion
        const messages = [
            ...iteration,
            {
                "role": "user",
                "content": `Create a set of instructions for yourself on mimicing or replicating the style of the examples in the previous messages. Keep your previous notes in mind. You should be able to replicate the style eve without seeing examples based on the instructions you create here. Respond with a single set of instructions. YOU MUST RESPOND WITH JUST THE INSTRUCTIONS. DO NOT PROVIDE ANY COMENTARY ON THE EXAMPLES OR REFER TO THE EXAMPLES IN YOUR RESPONSE.`
            }
        ];

        // Create the chat completion
        const bluePrint = await openAIApi.chat.completions.create({
            model: `${process.env.PROCESSING_MODEL}`,
            messages: messages,
        });

        // Return the blueprint
        const response = bluePrint.choices[0].message.content;
        return response;
    } catch (error) {
        console.log("error in processBluePrint: ", error);
    }
}

/**
 * Generates a sample sentence using the provided style and OpenAI API.
 * @param style - The style object containing instructions and example.
 * @param openai - The OpenAI API object.
 * @returns The generated sentence.
 */
export async function generateSample(style: any, prompt = 'Generate a sample of the style' as any, openai = openAIApi as any) {
    'use server'
    try {
        const promptEmbeddingVectors = await getEmbedding('Generate a sentence about how an apprentice helps a business owner achieve their goals');

        const styleForPrompt = await getStyleForPrompt(style, promptEmbeddingVectors);

        let styleString = `### Use the following notes to guide the style of your response ###\n
            %%% Instructions for the style you should use: %%%\n${styleForPrompt.bluePrint} \n\n`;

        if (!!styleForPrompt.example) {
            styleString += `%%% Example of a response with the appropriate style: %%%\n
            ${styleForPrompt.example} \n\n`;
        }
        styleString += `### End of style ###\n\n`;

        const messages = [
            {
                "role": "user",
                "content": `${styleString}\n\n ${prompt}`
            }
        ];

        // Create the chat completion
        const sample = await openai.chat.completions.create({
            model: `${process.env.PROCESSING_MODEL}`,
            messages: messages,
        });

        // Return the combined instructions
        const response = sample.choices[0].message.content;

        return response
    } catch (error) {
        console.log('Error getting sample: ', error);
    }
}

/**
 * Generates a comparison using OpenAI chat completions.
 * @param messages - The messages to use for generating the comparison.
 * @param openai - The OpenAI API object.
 * @returns The generated comparison response.
 */
export async function generateComparison(messages: any, openai = openAIApi as any) {
    'use server'
    try {
        const comparison = await openai.chat.completions.create({
            model: `${process.env.PROCESSING_MODEL}`,
            messages: messages,
        });
        const response = comparison.choices[0].message.content;
        return response;
    } catch (error) {
        console.log('Error getting comparison: ', error);
    }
}

/* * * * * * * * * * * * * * * * */
/* Get text embedding
/* * * * * * * * * * * * * * * * */

/**
 * Retrieves the embedding for a given chunk of text using OpenAI.
 * @param chunk - The text chunk to retrieve the embedding for.
 * @param openai - The OpenAI instance.
 * @returns The embedding for the given text chunk, or null if an error occurs.
 */
export async function getEmbedding(chunk: string) {
    'use server'
    try {

        const embeddingResponse = await openAIApi.embeddings.create({
            model: `${process.env.SMALL_EMBEDDING_MODEL}`,
            input: chunk,
        });
        const embedding = embeddingResponse.data[0].embedding;
        return embedding;
    } catch (error) {
        console.error("Error getting embedding:", error);
        return null;
    }
}


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