import { getMongoDB } from "@/utils/getMongo";
import { ObjectId } from "mongodb";


export async function getAllStyles() {
    'use server'
    try {
        const db = await getMongoDB() as any;
        const styles = await db.collection("styles").find({}).toArray();
        const plainStyles = styles.map(({ _id, ...rest }: any) => ({ _id: _id.toString(), ...rest }));
        return plainStyles;
    } catch (error: any) {
        console.error('Error in GET:', error.message);
    }
}

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

export async function deleteStyle(id: string) {
    'use server'
    try {
        const db = await getMongoDB() as any;
        const _id = new ObjectId(id);
        const style = await db.collection("styles").deleteOne({ _id: _id });
        const allStyles = await db.collection("styles").find({}).toArray();
        const plainStyles = allStyles.map(({ _id, ...rest }: any) => ({ _id: _id.toString(), ...rest }));
        return plainStyles;
    } catch (error: any) {
        console.error('Error in DELETE:', error.message);
    }
}

export async function createStyle(payload: any) {
    'use server'
    try {
        const db = await getMongoDB() as any;
        const style = await db.collection("styles").insertOne(payload);
        const cleanedStyle = { ...style, _id: style.insertedId.toString() };
        return cleanedStyle;
    } catch (error: any) {
        console.error('Error in POST:', error.message);
    }
}

export async function updateStyle(id: string, payload: any) {
    'use server'
    try {
        const db = await getMongoDB() as any;
        const _id = new ObjectId(id);

        const update = await db.collection("styles").updateOne({ _id: _id }, { $set: payload });
        const style = await db.collection("styles").findOne({ _id: _id });
        // const cleanedStyle = { _id: style._id.toString(), ...style };
        const cleanedStyle = { ...style, _id: style._id.toString() };

        return { success: true, style: cleanedStyle };
    } catch (error: any) {
        console.error('Error in PUT:', error.message);
    }
}