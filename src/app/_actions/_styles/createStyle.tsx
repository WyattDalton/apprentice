'use server'
import { getMongoDB } from "@/utils/getMongo";

/**
 * Creates a new style in the database.
 * @param payload - The data for the new style.
 * @returns The created style object.
 */
export async function createStyle(payload: any) {
    'use server'
    try {
        const db = await getMongoDB() as any;
        const style = await db.collection("styles").insertOne(payload);
        const cleanedStyle = { ...style, _id: style.insertedId.toString() };
        return {
            success: true,
            insertedId: cleanedStyle._id,
        };
    } catch (error: any) {
        console.error('Error in POST:', error.message);
    }
}