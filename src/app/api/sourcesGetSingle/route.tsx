import { NextResponse } from 'next/server';
import { closeMongoDB, getMongoDB } from '@/components/utils/getMongo';
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
    try {

        const data = await req.json();
        const id = new ObjectId(data.id); // Convert to ObjectId
        const db = await getMongoDB();
        const source = await db.collection("sources").findOne({ _id: id });

        return NextResponse.json({ 'source': source, 'success': true });

    } catch (error) {
        return NextResponse.json({ 'message': error, 'success': false });
    } finally {
        closeMongoDB();
    }
};
