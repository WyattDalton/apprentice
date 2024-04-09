'use server'

import { getMongoDB } from "@/utils/getMongo"
import { ObjectId } from "mongodb"

/**
 * Retrieves style data from the database based on the provided ID.
 * @param id - The ID of the style to retrieve.
 * @returns A promise that resolves to the retrieved style data.
 */
export async function getStyleData(id: string) {
    'use server'
    try {
        const db = await getMongoDB() as any;
        const _id = new ObjectId(id);
        const style = await db.collection("styles").findOne({ _id: _id });
        const cleanStyle = { _id: style._id.toString(), ...style };

        const payload = {} as any;

        !!cleanStyle.title ? payload.title = cleanStyle.title : false;
        !!cleanStyle.examples ? payload.examples = cleanStyle.examples : false;
        !!cleanStyle.description ? payload.description = cleanStyle.description : false;
        !!cleanStyle.keywords ? payload.keywords = cleanStyle.keywords : false;
        !!cleanStyle.bluePrint ? payload.bluePrint = cleanStyle.bluePrint : false;
        !!cleanStyle.sample ? payload.sample = cleanStyle.sample : false;
        !!cleanStyle.iteration ? payload.iteration = cleanStyle.iteration : false;

        return payload;
    } catch (error: any) {
        console.error('Error in GET:', error.message);
    }
}
