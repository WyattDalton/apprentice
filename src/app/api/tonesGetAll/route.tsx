import { NextResponse } from 'next/server';
import { getMongoDB } from '@/components/utils/getMongo';

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
