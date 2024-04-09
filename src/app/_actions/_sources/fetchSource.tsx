"use server"

import { getMongoDB } from "@/utils/getMongo";
import { ObjectId } from "mongodb";

/**
 * Retrieves a source from the MongoDB collection.
 * @param id The ID of the source to be retrieved.
 * @returns A Promise that resolves to the retrieved source.
 */
export async function fetchSource(idString: string) {
    "use server"
    try {
        const id = new ObjectId(idString);
        const db = await getMongoDB() as any;
        const source = await db.collection("sources").findOne({ _id: id });
        if (source) {
            const cleanSource = {
                type: source.type,
                category: source.category,
                name: source.name,
                title: source.title,
                text: source.text,
                _id: source._id.toString()
            };
            return cleanSource;
        }
        throw new Error('Source not found');
    } catch (error) {
        return { success: false, message: error }
    }
};
