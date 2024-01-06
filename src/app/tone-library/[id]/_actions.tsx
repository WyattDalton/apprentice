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
 * @param template - The elements that go into describing tone.
 * @param string - The examples of writing style and tone.
 * @param openai - The OpenAI instance.
 * @returns The generated instructions for replicating the writing style and tone.
 */
export async function getInstructions(template: string, string: string, openai = openAIApi as any) {
    'use server'
    try {
        const instructionMessages = [
            {
                "role": "system",
                "content": `You are an AI Bot that is very good at generating writing in a similar tone as examples. Be opinionated and have an active voice. Take a strong stance with your response. These are the elements that go into describing tone. \n\n
            % HOW TO DESCRIBE TONE\n${template}\n\n
            % START OF EXAMPLES\n ${string} \n% END OF EXAMPLES\n\n
            Use the elements of tone to generate instructions for yourself on replicating the writing style and tone of voice in the examples.`
            }
        ]

        const instructions = await await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: instructionMessages,
            max_tokens: 400,
        })

        return instructions.data.choices[0].message.content;
    } catch (error) {
        console.log(error)
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
            Respond with a single set of instructions that combines the shared elements of the example instructions. It is very important to maintain the same structure as the example instructions. Your final response must only be the list of instructions and nothing else. It must look like this: \n\n
            1. Pace: Instruction 1\n
            2. Mood: Instruction 2\n
            3. Tone: Instruction 3\n
            ... \n`
            }
        ];

        // Create the chat completion
        const instruction = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: messages,
            max_tokens: 400,
        });

        // Return the combined instructions
        return instruction.data.choices[0].message.content;
    } catch (error) {
        console.log(error);
    }
}


/* * * * * * * * * * * * * * * * */
/* Handle keywords processing
/* * * * * * * * * * * * * * * * */

/**
 * Retrieves the top 5 keywords that summarize the tone of voice in the examples.
 * 
 * @param template - The description of the tone.
 * @param string - The examples of the tone.
 * @param openai - The OpenAI instance.
 * @returns A promise that resolves to a string array of the top 5 keywords.
 */
export async function getKeywords(template: string, string: string, openai = openAIApi as any): Promise<string[]> {
    'use server'
    const keywordsMessages = [
        {
            "role": "system",
            "content": `You are an AI Bot that is very good at generating writing in a similar tone as examples. \n\n
            % HOW TO DESCRIBE TONE\n${template}\n\n
            % START OF EXAMPLES\n ${string} \n% END OF EXAMPLES\n\n
            Respond with a javascript array of the 5 top keywords that summarizes the tone of voice in the examples.`
        }
    ]

    const keywords = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: keywordsMessages,
        max_tokens: 100,
    })

    return keywords.data.choices[0].message.content;
}


/**
 * Processes the keywords using OpenAI.
 * 
 * @param keywords - The array of keywords to be processed.
 * @param openai - The OpenAI instance.
 * @returns An array of keywords that combines the best shared elements of the example keywords.
 */
export async function processKeywords(keywords: any, openai = openAIApi as any) {
    'use server'
    const keywordsString = keywords.reduce((acc: string, description: string) => {
        return `${acc}### Start new keywords ###\n${keywords}\n### End of keywords ###\n`
    }, "");
    const messages = [
        {
            "role": "system",
            "content": `You are very good an analyzing similarities in data and combining mutiple examples together. \n\n
            % START OF KEYWORDS\n ${keywordsString} \n% END OF KEYWORDS\n\n
            Respond with a single javascript array of keywords that combines the best shared elements of the example keywords. Limit to only 5 keywords. Your response must look like this: \n\n
            ['keyword1', 'keyword2', 'keyword3', 'keyword4', 'keyword5']`
        }
    ]
    const keywordReturn = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 100,
    })

    const keywordString = keywordReturn.data.choices[0].message.content;
    const keywordArray = keywordString.replace(/[\[\]']+/g, '').split(',');
    return keywordArray;
}

/* * * * * * * * * * * * * * * * */
/* Handle descriptions processing
/* * * * * * * * * * * * * * * * */

/**
 * Retrieves the description of the tone of voice used in the examples.
 * @param template - The template for describing the tone.
 * @param string - The examples of writing in the desired tone.
 * @param openai - The OpenAI instance.
 * @returns The description of the tone of voice.
 */
export async function getDesription(template: string, string: string, openai = openAIApi as any) {
    'use server'
    // Get tone keywords
    const descriptionMessages = [
        {
            "role": "system",
            "content": `You are an AI Bot that is very good at generating writing in a similar tone as examples. \n\n
            % HOW TO DESCRIBE TONE\n${template}\n\n
            % START OF EXAMPLES\n ${string} \n% END OF EXAMPLES\n\n
            Respond with a short description of the tone of voice used in the examples.`
        }
    ]
    const description = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: descriptionMessages,
        max_tokens: 200,
    })

    return description.data.choices[0].message.content;
}

/**
 * Processes the descriptions using OpenAI.
 * @param descriptions - The array of descriptions to be processed.
 * @param openai - The OpenAI instance.
 * @returns A single description that combines the best shared elements of the example descriptions.
 */
export async function processDescriptions(descriptions: any, openai = openAIApi as any) {
    'use server'
    // add each description to a string, started and ended with "### Start new description ###" and "### End of description ###"
    const descriptionString = descriptions.reduce((acc: string, description: string) => {
        return `${acc}### Start new description ###\n${description}\n### End of description ###\n`
    }, "");
    const messages = [
        {
            "role": "system",
            "content": `You are very good an analyzing similarities in text and combining mutiple examples into one description. \n\n
            % START OF DESCRIPTIONS\n ${descriptionString} \n% END OF DESCRIPTIONS\n\n
            Respond with a single description that combines the shared elements of the example descriptions. It is very important to maintain the same structure as the example descriptions. Your final response must only be a single, short paragraph and nothing else.`
        }
    ]
    const description = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 200,
    })

    return description.data.choices[0].message.content;
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
            model: "text-embedding-ada-002",
            input: chunk,
        });
        const embedding = embeddingResponse.data.data[0].embedding;
        return embedding;
    } catch (error) {
        console.error("Error getting embedding:", error);
        return null;
    }
}