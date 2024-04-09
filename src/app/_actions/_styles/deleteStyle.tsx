'use server'
import { getMongoDB } from "@/utils/getMongo";
import { ObjectId } from "mongodb";

/**
 * Deletes a style from the database.
 * @param id - The ID of the style to delete.
 * @returns An object with the success status and the updated list of styles.
 */
export async function deleteStyle(data: any) {
    'use server'
    const db = await getMongoDB() as any;
    try {
        const styleToDelete = await db.collection("styles").deleteOne({ _id: new ObjectId(data._id) });
        const allStyles = await db.collection("styles").find({}).toArray();
        const cleanStyles = allStyles.map(({ _id, ...rest }: any) => ({ _id: _id.toString(), ...rest }));
        return {
            "success": true,
            "data": cleanStyles
        };
    } catch (error: any) {
        console.error('Error in DELETE:', error.message);
    }
}