import { NextRequest, NextResponse } from 'next/server';
import { getMongoDB } from '@/components/utils/getMongo';
import { Configuration, OpenAIApi } from "openai";
import { ObjectId } from 'mongodb';
import { processTone } from './utils/processTone';
const configuration = new Configuration({
    organization: "org-B0x5nwrSR31e5bkeQuwEKeyY",
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function POST(req: NextRequest) {
    try {

        const db = await getMongoDB() as any;
        const body = await req.json();
        const { dataType, data } = body;

        if (dataType === 'create') {

            // get the mongodb _id for the new item after creating it
            const res = await db.collection("tones").insertOne(data);
            return NextResponse.json({
                'success': true,
                'tone': res.insertedId,
            });

        } else if (dataType === 'update') {
            const { _id, update } = data;

            // Process the examples with OpenAI
            // Need to check if new examples match old examples before attempting to process
            // const tone = await processTone(update, openai);
            const res = await db.collection("tones").updateOne(
                { _id: new ObjectId(_id) },
                { $set: update },
                { upsert: true }
            );

            return NextResponse.json({
                'success': true,
                'tone': res,
            });

        } else if (dataType === 'delete') {
            const { _id } = data;
            const res = await db.collection("tones").deleteOne({ _id: new ObjectId(_id) });
            const tones = await db.collection("tones").find({}).toArray();
            return NextResponse.json({
                'success': true,
                'tones': tones,
            });
        }

    } catch (error) {
        console.log(error);
        return NextResponse.json({
            'success': false,
            'message': error,
        });
    }
}
