import { NextResponse } from 'next/server';
import { closeMongoDB, getMongoDB } from '@/components/utils/getMongo';
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const id = new ObjectId(data.id);

        const db = await getMongoDB() as any;

        // delete source by id
        const sources = await db.collection("sources").deleteOne({ "_id": id });

        return NextResponse.json({ 'sources': sources, 'success': true });

    } catch (error) {
        return NextResponse.json({ 'message': error, 'success': false });
    }
};
