import { NextResponse } from 'next/server';
import { getMongoDB } from '@/components/utils/getMongo';

export async function getAllTones() {
    try {
        const db = await getMongoDB() as any;
        if (!db) {
            return NextResponse.json({ 'message': 'Error connecting to database', 'success': false });
        }
        const tones = await db.collection("tones").find({}).toArray();
        const plainTones = tones.map(({ _id, ...rest }: any) => ({ _id: _id.toString(), ...rest }));

        return plainTones;
    } catch (error: any) {
        console.error('Error in GET:', error.message);
        console.error(error.stack);
        return NextResponse.json({ 'message': error.message, 'success': false });
    }
}

export async function GET(req: Request) {
    try {

        const tones = await getAllTones();
        return NextResponse.json({ 'tones': tones, 'success': true });

    } catch (error: any) {
        console.error('Error in GET:', error.message);
        console.error(error.stack);
        return NextResponse.json({ 'message': error.message, 'success': false });
    }
};
