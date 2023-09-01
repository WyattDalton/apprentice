import { NextResponse } from 'next/server';
import { closeMongoDB, getMongoDB } from '@/components/utils/getMongo';

export async function GET(req: Request) {
    try {

        const db = await getMongoDB();
        const tones = await db.collection("tones").find({}).toArray();

        return NextResponse.json({ 'tones': tones, 'success': true });

    } catch (error) {
        return NextResponse.json({ 'message': error, 'success': false });
    } finally {
        closeMongoDB();
    }
};
