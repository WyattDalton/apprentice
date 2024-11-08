"use server"

import OpenAI from "openai";
const openai = new OpenAI({
    organization: "org-B0x5nwrSR31e5bkeQuwEKeyY",
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generates a blueprint for mimicking or replicating the style of the examples in the previous messages.
 * The blueprint is created by completing a chat conversation using the OpenAI API.
 * 
 * @param iteration - The iteration object containing previous messages.
 * @returns The generated blueprint as a string.
 */
export async function generateBlueprint(iteration: any) {
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
        const blueprint = await openai.chat.completions.create({
            model: `${process.env.PROCESSING_MODEL}`,
            messages: messages,
        });

        // Return the blueprint
        const response = blueprint.choices[0].message.content;
        return response;
    } catch (error) {
        console.log("error in processBluePrint: ", error);
    }
}