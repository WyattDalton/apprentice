import { NextRequest, NextResponse } from 'next/server';
import { closeMongoDB, getMongoDB } from '@/components/utils/getMongo';

export async function POST(req: NextRequest) {
    try {

        const db = await getMongoDB();
        const body = await req.json();
        const { dataFor } = body;

        if (dataFor === 'generator') {

            const sources = await db.collection("sources").find({}).toArray();
            const tones = await db.collection("tones").find({}).toArray();
            const formulas = await db.collection("formulas").find({}).toArray();

            const payload = {
                'sources': sources,
                'tones': tones,
                'formulas': formulas,
            };

            return NextResponse.json({
                'success': true,
                'data': {
                    'sources': sources,
                    'tones': tones,
                    'formulas': formulas,
                },
            });

        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            'success': false,
            'message': error,
        });
    } finally {
        closeMongoDB();
    }
}
