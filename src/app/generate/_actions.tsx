"use server";

import { getMongoDB } from "@/components/utils/getMongo";
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
    const allThreads = await threads.find({}).toArray();
    const cleanThreads = allThreads.map(({ _id, ...rest }: any) => ({ _id: _id.toString(), ...rest }));
    return cleanThreads;
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