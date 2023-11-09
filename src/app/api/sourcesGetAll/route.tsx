import { NextResponse } from 'next/server';
import { getMongoDB } from '@/components/utils/getMongo';

export async function GET(req: Request) {
    try {

        const db = await getMongoDB() as any;
        const sources = await db.collection("sources").find({}).toArray();

        console.log(await sources)

        return NextResponse.json({ 'sources': sources, 'success': true });

    } catch (error) {
        return NextResponse.json({ 'message': error, 'success': false });
    }
};
