"use server";

import { Configuration, OpenAIApi } from 'openai-edge'
const apiConfig = new Configuration({
    apiKey: process.env.OPENAI_API_KEY!
})
const openai = new OpenAIApi(apiConfig)

import { getMongoDB } from "@/utils/getMongo";
import { ObjectId } from "mongodb";

export async function fetchSources() {
    const db = await getMongoDB() as any;
    const sources = db.collection("sources");
    const allSources = await sources.find({}).toArray();
    const cleanSources = allSources.map(({ _id, ...rest }: any) => ({ _id: _id.toString(), ...rest }));
    return cleanSources;
}

export async function fetchTones() {
    const db = await getMongoDB() as any;
    const tones = db.collection("tones");
    const allTones = await tones.find({}).toArray();
    const cleanTones = allTones.map(({ _id, ...rest }: any) => ({ _id: _id.toString(), ...rest }));
    return cleanTones;
}

export async function fetchFormulas() {
    const db = await getMongoDB() as any;
    const formulas = db.collection("formulas");
    const allFormulas = await formulas.find({}).toArray();
    const cleanFormulas = allFormulas.map(({ _id, ...rest }: any) => ({ _id: _id.toString(), ...rest }));
    return cleanFormulas;
}

export async function fetchThreads() {
    const db = await getMongoDB() as any;
    const threads = db.collection("threads");
    const allThreads = await threads.find({}).sort({ created: -1 }).toArray();
    const cleanThreads = allThreads.map(({ _id, ...rest }: any) => ({ _id: _id.toString(), ...rest }));
    return cleanThreads;
}

export async function fetchMetaData(threadId: string) {
    const db = await getMongoDB() as any;
    const threads = db.collection("threads");
    const _id = new ObjectId(threadId);
    const thread = await threads.findOne({ _id: _id });

    const threadMeta = {} as any;
    thread.title ? threadMeta['title'] = thread.title : null;
    if (!threadMeta) return null;
    const cleanThreadMeta = { _id: thread._id.toString(), ...threadMeta };
    return cleanThreadMeta;
}

export async function updateThread(data: any) {
    const { _id, update } = data;
    const db = await getMongoDB() as any;
    const collection = db.collection("threads");

    const res = await collection.updateOne({ _id: new ObjectId(_id) }, { $set: update }, { upsert: true });
    const threads = await collection.find({}).toArray();

    const cleanThreads = threads.map(({ _id, ...rest }: any) => ({ _id: _id.toString(), ...rest }));
    const cleanThread = { _id: _id.toString(), ...update };
    return ({
        'success': true,
        'thread': cleanThread,
        'threads': cleanThreads,
    });
}


export async function saveThread(data: any) {
    const db = await getMongoDB() as any;
    const threads = db.collection("threads");
    const initial_prompt = data.initial_prompt ? data.initial_prompt : null;
    const saved = data.saved ? data.saved : null;
    const messages = data.messages ? data.messages : null;
    const created = data.created ? data.created : null;
    const _id = !!data._id ? new ObjectId(data._id) : null;

    const payload = {} as any;

    if (!!saved) saved == 'true' ? payload['saved'] = true : payload['saved'] = false;
    if (!!messages) payload['messages'] = messages;

    if (!!_id) {
        const response = await threads.updateOne(
            { _id: _id }, // filter
            { $set: payload }, // update
            { upsert: true } // options
        );
    } else {
        await threads.updateOne(
            { initial_prompt: initial_prompt, created: created }, // filter
            { $set: payload }, // update
            { upsert: true } // options
        );
    }

    // Retrieve the updated document from the database
    const updatedItem = await threads.findOne({ initial_prompt: initial_prompt, created: created });
    const cleanItem = { _id: updatedItem._id.toString(), ...updatedItem };
    return cleanItem;
}

export async function getTitle(messages: any, _id: any) {

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
}