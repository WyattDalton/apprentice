import { NextRequest, NextResponse } from 'next/server';
import { closeMongoDB, getMongoDB } from '@/components/utils/getMongo';
import { getUserData } from '@/components/utils/getUserData';

export async function POST(req: NextRequest) {
    try {

        const db = await getMongoDB();
        const body = await req.json();
        const userData = await getUserData();
        const { dataFor } = body;

        if (dataFor === 'generator') {
            const sources = await db.collection("sources").find({}).toArray();
            const tones = await db.collection("tones").find({}).toArray();
            const formulas = await db.collection("formulas").find({}).toArray();
            const user = await db.collection("users").findOne({ userId: userData.userId });

            const payload = {
                'sources': sources,
                'tones': tones,
                'formulas': formulas,
                'user': user,
            };

            return NextResponse.json({
                'success': true,
                'data': {
                    'sources': sources,
                    'tones': tones,
                    'formulas': formulas,
                    'user': user,
                },
            });

        }
    } catch (error: any) {
        return NextResponse.json({
            'success': false,
            'message': error.message,
        });
    }
}
