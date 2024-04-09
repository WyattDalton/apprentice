"use server"

import { getMongoDB } from "@/utils/getMongo";

export default async function createFormula(data: any) {
    'use server'
    const db = await getMongoDB() as any;
    try {
        const rawData = await db.collection("formulas").insertOne(data);
        const cleaned_id = rawData.insertedId.toString()

        return {
            'success': true,
            'formula': cleaned_id,
        };
    } catch (error) {
        return {
            'success': false
        };
    }
}