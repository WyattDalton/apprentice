"use server"

import { getMongoDB } from "@/utils/getMongo";
import { ObjectId } from "mongodb";

/**
 * Deletes a source from the MongoDB collection.
 * @param id The ID of the source to be deleted.
 * @returns A Promise that resolves to a success message.
 */
export async function deleteSource(data: any) {
    "use server"
    const db = await getMongoDB() as any;
    try {
        const sourceToDelete = await db.collection("sources").deleteOne({ "_id": new ObjectId(data._id) });
        const sources = await db.collection("sources").find({}).toArray();
        const cleanSources = sources.map(({ _id, embeddings, ...rest }: any) => {
            return { ...rest, _id: _id.toString() };
        });
        return { "data": cleanSources, "success": true };
    } catch (err) {
        return { success: false, message: err };
    }
}
