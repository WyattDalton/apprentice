import { getMongoDB } from "@/utils/getMongo";
import { ObjectId } from "mongodb";


export async function getAllTones() {
    'use server'
    try {
        const db = await getMongoDB() as any;
        const tones = await db.collection("tones").find({}).toArray();
        const plainTones = tones.map(({ _id, ...rest }: any) => ({ _id: _id.toString(), ...rest }));
        return plainTones;
    } catch (error: any) {
        console.error('Error in GET:', error.message);
    }
}

export async function getToneData(id: string) {
    'use server'
    try {
        const db = await getMongoDB() as any;
        const _id = new ObjectId(id);
        const tone = await db.collection("tones").findOne({ _id: _id });
        const cleanTone = { _id: tone._id.toString(), ...tone };

        const payload = {} as any;

        !!cleanTone.title ? payload.title = cleanTone.title : false;
        !!cleanTone.examples ? payload.examples = cleanTone.examples : false;
        !!cleanTone.description ? payload.description = cleanTone.description : false;
        !!cleanTone.keywords ? payload.keywords = cleanTone.keywords : false;
        !!cleanTone.instructions ? payload.instructions = cleanTone.instructions : false;

        return payload;
    } catch (error: any) {
        console.error('Error in GET:', error.message);
    }
}

export async function deleteTone(id: string) {
    'use server'
    try {
        const db = await getMongoDB() as any;
        const _id = new ObjectId(id);
        const tone = await db.collection("tones").deleteOne({ _id: _id });
        const allTones = await db.collection("tones").find({}).toArray();
        const plainTones = allTones.map(({ _id, ...rest }: any) => ({ _id: _id.toString(), ...rest }));
        return plainTones;
    } catch (error: any) {
        console.error('Error in DELETE:', error.message);
    }
}

export async function createTone(payload: any) {
    'use server'
    try {
        const db = await getMongoDB() as any;
        const tone = await db.collection("tones").insertOne(payload);
        return tone;
    } catch (error: any) {
        console.error('Error in POST:', error.message);
    }
}

export async function updateTone(id: string, payload: any) {
    'use server'
    try {
        const db = await getMongoDB() as any;
        const _id = new ObjectId(id);
        const update = await db.collection("tones").updateOne({ _id: _id }, { $set: payload });
        const tone = await db.collection("tones").findOne({ _id: _id });
        const cleanedTone = { _id: tone._id.toString(), ...tone };
        return { success: true, tone: cleanedTone };
    } catch (error: any) {
        console.error('Error in PUT:', error.message);
    }
}