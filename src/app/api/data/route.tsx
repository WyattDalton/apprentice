import { NextRequest, NextResponse } from 'next/server';
import { getMongoDB } from '@/components/utils/getMongo';
import { getUserData } from '@/components/utils/getUserData';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
    try {

        const db = await getMongoDB() as any;
        const body = await req.json();
        const userData = await getUserData();

        const { dataFor, thread } = body;

        if (dataFor === 'generator') {

            const [sources, tones, formulas, threads, user] = await Promise.all([
                db.collection("sources").find({}).toArray(),
                db.collection("tones").find({}).toArray(),
                db.collection("formulas").find({}).toArray(),
                db.collection("threads").find({}).toArray(),
                db.collection("users").findOne({ userId: userData.id }),
            ]);

            let threadMeta = {} as any;
            if (!!thread) {
                const _id = new ObjectId(thread) as any;
                const threadData = await db.collection("threads").findOne({ _id: _id });

                threadData.title ? threadMeta['title'] = threadData.title : false;
            }

            const payload = {
                'sources': sources,
                'tones': tones,
                'formulas': formulas,
                'threads': threads,
                'user': user,
            } as any;

            !!threadMeta ? payload['meta'] = threadMeta : false;

            return NextResponse.json({
                'success': true,
                'data': payload,
            });

        }
    } catch (error: any) {
        return NextResponse.json({
            'success': false,
            'message': error.message,
        });
    }
}
