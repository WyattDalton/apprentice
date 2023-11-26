"use server";

import { getMongoDB } from "@/components/utils/getMongo";
import { ObjectId } from "mongodb";

export async function fetchTones() {
    const db = await getMongoDB() as any;
    const tones = db.collection("tones");
    const allTones = await tones.find({}).toArray();
    return allTones;
}

export async function fetchFormulas() {
    const db = await getMongoDB() as any;
    const formulas = db.collection("formulas");
    const allFormulas = await formulas.find({}).toArray();
    return allFormulas;
}

export async function fetchThreads() {
    const db = await getMongoDB() as any;
    const threads = db.collection("threads");
    const allThreads = await threads.find({}).toArray();
    return allThreads;
}

export async function fetchMetadata(threadId: string) {
    const db = await getMongoDB() as any;
    const threads = db.collection("threads");
    const _id = new ObjectId(threadId);
    const thread = await threads.findOne({ _id: _id });

    const threadMeta = {} as any;
    thread.title ? threadMeta['title'] = thread.title : null;
    if (!threadMeta) return null;
    return threadMeta;
}
