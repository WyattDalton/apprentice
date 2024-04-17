"use server";

import OpenAI from "openai";
const openai = new OpenAI({
    organization: "org-B0x5nwrSR31e5bkeQuwEKeyY",
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generates a comparison using OpenAI chat completions.
 * @param messages - The messages to use for generating the comparison.
 * @param openai - The OpenAI API object.
 * @returns The generated comparison response.
 */
export async function generateComparison(messages: any) {
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