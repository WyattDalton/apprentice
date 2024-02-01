'use server';
import { Configuration, OpenAIApi } from 'openai-edge'
const apiConfig = new Configuration({
    apiKey: process.env.OPENAI_API_KEY!
})
const openai = new OpenAIApi(apiConfig)
import { getMongoDB } from "@/utils/getMongo";
import { ObjectId } from "mongodb";

/**
 * Retrieves the title for a thread based on the provided messages and updates the thread in the database.
 * 
 * @param messages - An array of messages in the thread.
 * @param _id - The ID of the thread.
 * @returns The updated thread object with the title.
 */
export async function getTitle(messages: any, _id: any) {
    'use server';
    try {
        const db = await getMongoDB() as any;
        const collection = db.collection("threads");
        const cleanedMessages = messages.map(({ createdAt, id, settings, ...rest }: any) => rest);
        const instructions = 'Create a descriptive title for this thread that summarizes the previous messages. Limit the response to less than 100 characters. It should be as short as possible while also being descriptive enough to be useful. IMPORTANT: Your response should only include text. No special characters, and no numbers.';
        const instructionMessage = {
            'role': 'user',
            'content': instructions,
        }
        // Add instructionMessage to the end of the messages array
        cleanedMessages.push(instructionMessage);
        const res = await openai.createChatCompletion({
            model: `${process.env.GENERATOR_MODEL}`,
            messages: cleanedMessages
        })
        const resData = await res.json();
        const title = resData.choices[0].message.content;
        // Upsert the title to this thread in mongo
        const update = { $set: { title } };
        const id = new ObjectId(_id);
        await collection.updateOne({ _id: id }, update, { upsert: true });
        const updatedThread = await collection.findOne({ _id: id });
        const cleanedThread = { _id: updatedThread._id.toString(), ...updatedThread };
        return cleanedThread;
    } catch (err) {
        console.error("Error in getTitle: ", err);
    }
}