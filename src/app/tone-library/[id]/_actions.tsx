import { getMongoDB } from "@/utils/getMongo";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    organization: "org-B0x5nwrSR31e5bkeQuwEKeyY",
    apiKey: process.env.OPENAI_API_KEY,
});
const openAIApi = new OpenAIApi(configuration);

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

        const instructions = await await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
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
 * Processes the instructions by combining them into a single set of instructions.
 * 
 * @param instructions - The array of instructions to be processed.
 * @param openai - The OpenAI instance used for creating chat completions.
 * @returns A Promise that resolves to a string representing the combined instructions.
 */
export async function processInstructions(instructions: any, openai = openAIApi as any) {
    'use server'
    try {
        // Combine the instructions into a single string
        const instructionString = instructions.reduce((acc: string, instruction: string) => {
            return `${acc}### Start new instruction ###\n${instruction}\n### End of instruction ###\n`
        }, "");

        // Create the messages array for the chat completion
        const messages = [
            {
                "role": "system",
                "content": `You are very good an analyzing similarities in text and combining mutiple examples into one set of instructions. \n\n
            % START OF INSTRUCTIONS\n ${instructionString} \n% END OF INSTRUCTIONS\n\n
            Respond with a single set of instructions that combines the shared elements of the example instructions. YOU MUST start YOUR RESPONSE AS FOLLOWS: \n\n
            %%% The following are instructions on the style and tone of voice to use in your response: %%% YOU MUST FOLLOW THIS WITH JUST THE INSTRUCTIONS. DO NOT PROVIDE ANY COMENTARY ON THE EXAMPLES OR REFER TO THE EXAMPLES IN YOUR RESPONSE. \n\n`
            }
        ];

        // Create the chat completion
        const instruction = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: messages,
            max_tokens: 400,
        });

        // Return the combined instructions
        const response = instruction.data.choices[0].message.content;
        return response;
    } catch (error) {
        console.log("error in processInstructions: ", error);
    }
}

/**
 * Generates a sample sentence using the provided tone and OpenAI API.
 * @param tone - The tone object containing instructions and example.
 * @param openai - The OpenAI API object.
 * @returns The generated sentence.
 */
export async function generateSample(tone: any, openai = openAIApi as any) {
    'use server'
    try {
        const promptEmbeddingVectors = await getEmbedding('Generate a sentence about how an apprentice helps a business owner achieve their goals');

        const toneForPrompt = await getToneForPrompt(tone, promptEmbeddingVectors);

        console.log('tone: ', toneForPrompt)

        let toneString = `### Use the following notes to guide the tone of voice for the response ###\n
            %%% Instructions for the tone you should use: %%%\n${toneForPrompt.instructions} \n\n`;
        if (!!toneForPrompt.example) {
            toneString += `%%% Example of a response with the appropriate style: %%%\n
            ${toneForPrompt.example} \n\n`;
        }
        toneString += `### End of tone ###\n\n`;

        const messages = [
            {
                "role": "user",
                "content": `${toneString}\n\n Generate a sentence about how an apprentice helps a business owner achieve their goals.`
            }
        ];

        console.log('messages: ', messages)

        // Create the chat completion
        const instruction = await openai.createChatCompletion({
            model: 'gpt-4-turbo-preview',
            messages: messages,
            max_tokens: 400,
        });

        // Return the combined instructions
        const response = instruction.data.choices[0].message.content;
        console.log('response: ', response)
        return response
    } catch (error) {
        console.log('Error getting sample: ', error);
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
export async function getEmbedding(chunk: string, openai = openAIApi as any) {
    'use server'
    try {
        const embeddingResponse = await openai.createEmbedding({
            model: "text-embedding-3-small",
            input: chunk,
        });
        const embedding = embeddingResponse.data.data[0].embedding;
        return embedding;
    } catch (error) {
        console.error("Error getting embedding:", error);
        return null;
    }
}


/**
 * Retrieves the tone for a given prompt.
 * @param tone - The tone object.
 * @param promptEmbeddingVectors - The embedding vectors of the prompt.
 * @returns An object containing the example and instructions for the tone.
 */
export async function getToneForPrompt(tone: any, promptEmbeddingVectors: string) {
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
        console.log('Error getting tone from DB: ', error);
    }
}