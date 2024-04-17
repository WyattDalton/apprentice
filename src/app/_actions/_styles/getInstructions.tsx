"use server"

import OpenAI from "openai";
const openai = new OpenAI({
    organization: "org-B0x5nwrSR31e5bkeQuwEKeyY",
    apiKey: process.env.OPENAI_API_KEY,
});


/**
 * Retrieves instructions for replicating a specific writing style and tone of voice.
 * @param string - The string containing the examples of the desired writing style.
 * @returns A Promise that resolves to the instructions for replicating the writing style and tone of voice in the examples.
 */
export async function getInstructions(string: string) {
    'use server'
    try {
        const instructionMessages = [
            {
                role: "system",
                name: "system",
                content: `You are very good at describing the style, sentence structure, and tone of voice used in writing samples supplied by the user. Your purpose is to describe the elements of style demonstrated in these examples well enough that an AI writer can mimic the style, sentence structure, and tone of voice perfectly. You even use examples inside your instructions to show how text should formatted. 
                \n\nThese are the elements of style that you are concerned with copying from the examples: sentence structure, word choice, emotion (or lack of emotion), penmanship (how does the author treat capitalizations, hyphens, dashes, etc... Pay attention to any deviations from standard) and diction, creative language or lack of creative language\n\n
                % START OF EXAMPLES\n ${string} \n% END OF EXAMPLES\n\n
                Use the information you've been given on the elements of style to generate instructions for yourself on replicating the writing style and tone of voice in the examples.Your response should only contain instructions for replicating the writing style and tone of voice in the examples. DO NOT PROVIDE ANY COMENTARY ON THE EXAMPLES OR REFER TO THE EXAMPLES IN YOUR RESPONSE.`
            }
        ]

        const instructions = await openai.chat.completions.create({
            model: `${process.env.PROCESSING_MODEL}`,
            messages: instructionMessages,
            max_tokens: 400,
        })

        const response = instructions.choices[0].message.content;
        return response;
    } catch (error) {
        console.log("error in getInstructions: ", error);
    }
}