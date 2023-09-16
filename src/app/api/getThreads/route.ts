import { NextResponse } from 'next/server';
import { closeMongoDB, getMongoDB } from '@/components/utils/getMongo';

export async function GET(req: Request) {
    try {

        const db = await getMongoDB() as any;
        const threads = await db.collection("threads").find({}).toArray();
        return NextResponse.json({ "data": threads });


    } catch (error) {
        return NextResponse.json({ message: error, success: false });
    }
};
