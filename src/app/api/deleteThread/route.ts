import { NextResponse } from 'next/server';
import { closeMongoDB, getMongoDB } from '@/components/utils/getMongo';

export async function DELETE(req: Request) {
    try {

        const data = await req.json()
        const initial_prompt = data.initial_prompt
        const created = data.created


        const db = await getMongoDB();
        await db.collection("threads").deleteOne({ initial_prompt: initial_prompt, created: created });

        return NextResponse.json({ "success": true });


    } catch (error) {
        return NextResponse.json({ message: error, success: false });
    } finally {
        await closeMongoDB();
    }
};
