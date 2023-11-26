import { NextResponse } from 'next/server';
import { getMongoDB } from '@/components/utils/getMongo';

export async function POST(req: Request) {
    try {

        const db = await getMongoDB() as any;
        const threads = db.collection("threads");

        // extract the data from req.body
        const data = await req.json()
        const initial_prompt = data.initial_prompt
        const saved = data.saved
        const messages = data.messages
        const created = data.created
        const _id = !!data._id ? data._id : null;

        const payload = {} as any;

        if (!!saved) saved == 'true' ? payload['saved'] = true : payload['saved'] = false;
        if (!!messages) payload['messages'] = messages;

        console.log(payload)

        if (!!_id) {
            const response = await threads.updateOne(
                { _id: _id }, // filter
                { $set: payload }, // update
                { upsert: true } // options
            );
        } else {
            await threads.updateOne(
                { initial_prompt: initial_prompt, created: created }, // filter
                { $set: payload }, // update
                { upsert: true } // options
            );
        }

        // Retrieve the updated document from the database
        const updatedItem = await threads.findOne({ initial_prompt: initial_prompt, created: created });

        return NextResponse.json({ item: updatedItem, success: true });

    } catch (error) {
        return NextResponse.json({ message: error, success: false });
    }
};
