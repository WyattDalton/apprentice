
export const processTone = async (tone: any, openai: any) => {
    const { examples, title } = tone;

    // ###
    // Outline elements of tone
    const tone_template = `1. Pace: The speed at which the story, action, or conflict unfolds and events occur.\n 
        2. Mood: The overall emotional atmosphere or feeling of the text.\n
        3. Tone: The attitude towards the subject matter.\n
        4. Voice: Unique style and personality as it comes through in writing.\n
        5. Diction: The choice of words and phrases.\n
        6. Syntax: The arrangement of words and phrases to create well-formed sentences.\n
        7. Imagery: The use of vivid and descriptive language to create mental images for the reader.\n
        8. Theme: The central idea or message of the text.\n
        9. Point of View: The perspective from which the text is written (first person, third person, etc.).\n
        10. Structure: The organization and arrangement of the text, including headings and sections, and sentence and paragraph length.\n`;

    // ###
    // Get embeddings for each example
    const examplesWithEmbeddings = await Promise.all(examples.map(async (example: any) => {
        const text = example.text;
        const embedding = await getEmbedding(example.text, openai);
        return { text: text, embedding: embedding };
    }));

    // ###
    // Split examples into chunks of 5 and add to array for processing
    const examplesToProcess: string[] = [];
    let string = "";
    examplesWithEmbeddings.forEach((example: any, index: number) => {
        if (index % 10 === 0 && index !== 0) {
            examplesToProcess.push(string);
            string = "";
        }
        string += `### Start new example ###\n${example.text}\n### End of example ###\n`;
    }
    );
    examplesToProcess.push(string);

    // ###
    // Instructions
    const instructionsList = await Promise.all(examplesToProcess.map(async (example: string) => {
        const instructions = await getInstructions(tone_template, example, openai);
        return instructions;
    }
    ));
    const instructions = await processInstructions(instructionsList, openai);

    // ###
    // Keywords
    const keywordsList = await Promise.all(examplesToProcess.map(async (example: string) => {
        const keywords = await getKeywords(tone_template, example, openai);
        return keywords;
    }));
    const keywords = await processKeywords(keywordsList, openai);

    // ###
    // Descriptions
    const descriptions = await Promise.all(examplesToProcess.map(async (example: string) => {
        const description = await getDesription(tone_template, example, openai);
        return description;
    }));
    const description = await processDescriptions(descriptions, openai);

    // ###
    // Format newTone
    const newTone = {
        title: title,
        examples: examplesWithEmbeddings,
        instructions: instructions,
        keywords: keywords,
        description: description,
    }

    return newTone;
}


/* * * * * * * * * * * * * * * * */
/* Handle instructions processing
/* * * * * * * * * * * * * * * * */
// ###
// Get instructions for each group of examples and add to array
const getInstructions = async (template: string, string: string, openai: any) => {
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
// ###
// Combine instructions array into a single instruction
const processInstructions = async (instructions: any, openai: any) => {
    try {
        const instructionString = instructions.reduce((acc: string, instruction: string) => {
            return `${acc}### Start new instruction ###\n${instruction}\n### End of instruction ###\n`
        }, "");
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
        ]
        const instruction = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: messages,
            max_tokens: 400,
        })

        return instruction.data.choices[0].message.content;
    } catch (error) {
        console.log(error)
    }
}


/* * * * * * * * * * * * * * * * */
/* Handle keywords processing
/* * * * * * * * * * * * * * * * */
// ###
// Get keywords for each group of examples and add to array
const getKeywords = async (template: string, string: string, openai: any) => {
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
// ###
// Combine keywords array into a single array
const processKeywords = async (keywords: any, openai: any) => {
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
// ###
// Get description for each group of examples and add to array
const getDesription = async (template: string, string: string, openai: any) => {
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
// ###
// Combine descriptions array into a single description
const processDescriptions = async (descriptions: any, openai: any) => {
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
async function getEmbedding(chunk: string, openai: any) {
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