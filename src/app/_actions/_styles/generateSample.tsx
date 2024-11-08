"use server";

import { getEmbedding } from "./getEmbedding";
import { getStyleForPrompt } from "./getStyleForPrompt";
import OpenAI from "openai";
const openai = new OpenAI({
    organization: "org-B0x5nwrSR31e5bkeQuwEKeyY",
    apiKey: process.env.OPENAI_API_KEY,
});

export async function generateSample(style: any, prompt = 'Generate a sample of the style' as any) {
    'use server'
    try {
        const promptEmbeddingVectors = await getEmbedding('Generate a sentence about how an apprentice helps a business owner achieve their goals') as any;

        const styleForPrompt = await getStyleForPrompt(style, promptEmbeddingVectors);

        let styleString = `### Use the following notes to guide the style of your response ###\n
            %%% Instructions for the style you should use: %%%\n${styleForPrompt.blueprint} \n\n`;

        if (!!styleForPrompt.example) {
            styleString += `%%% Example of a response with the appropriate style: %%%\n
            ${styleForPrompt.example} \n\n`;
        }
        styleString += `### End of style ###\n\n`;

        const contentString = `${styleString}\n\n ${prompt}` as string;

        // Create the chat completion
        const sample = await openai.chat.completions.create({
            model: `${process.env.PROCESSING_MODEL}`,
            messages: [{ role: "user", content: contentString }],
        });

        // Return the combined instructions
        const response = sample.choices[0].message.content;

        return response
    } catch (error) {
        console.log('Error getting sample: ', error);
    }
}