'use server'
import { getMongoDB } from "@/utils/getMongo";
import { ObjectId } from 'mongodb';

export async function updateFormula(id: any, data: any) {
    try {
        const db = await getMongoDB() as any;
        const res = await db.collection("formulas").updateOne({ _id: new ObjectId(id) }, { $set: data }, { upsert: true });
        return {
            'success': true,
            'formula': res,
        };

    } catch (error) {
        console.log(error);
        return {
            'success': false,
        };
    }
}