import { NextResponse } from 'next/server';
import { closeMongoDB, getMongoDB } from '@/components/utils/getMongo';

export async function GET(req: Request) {
    try {

        const db = await getMongoDB();
        const sources = await db.collection("sources").find({}).toArray();

        return NextResponse.json({ 'sources': sources, 'success': true });

    } catch (error) {
        return NextResponse.json({ 'message': error, 'success': false });
    }
};
