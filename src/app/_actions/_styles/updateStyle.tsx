'use server'
import { getMongoDB } from "@/utils/getMongo";
import { ObjectId } from "mongodb";

/**
 * Updates a style in the database.
 * @param id - The ID of the style to update.
 * @param payload - The updated style data.
 * @returns The cleaned updated style object.
 */
export async function updateStyle(id: string, payload: any) {
    'use server'
    try {
        const db = await getMongoDB() as any;
        const _id = new ObjectId(id);
        const style = await db.collection("styles").updateOne({ _id: _id }, { $set: payload });
        const updatedStyle = await db.collection("styles").findOne({ _id: _id });
        const cleanedStyle = { ...updatedStyle, _id: updatedStyle._id.toString() };
        return cleanedStyle;
    } catch (error: any) {
        console.error('Error in PUT:', error.message);
    }
}