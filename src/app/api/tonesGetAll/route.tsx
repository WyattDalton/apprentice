import { NextResponse } from 'next/server';
import { getMongoDB } from '@/components/utils/getMongo';

export async function GET(req: Request) {
    try {

        const db = await getMongoDB() as any;
        const tones = await db.collection("tones").find({}).toArray();
        console.log(tones)
        return NextResponse.json({ 'tones': tones, 'success': true });

    } catch (error) {
        return NextResponse.json({ 'message': error, 'success': false });
    }
};
