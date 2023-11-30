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

            const payload = {} as any;

            const sources = await db.collection("sources").find({}).toArray();
            const tones = await db.collection("tones").find({}).toArray();
            const formulas = await db.collection("formulas").find({}).toArray();
            const threads = await db.collection("threads").find({}).toArray();
            const user = await db.collection("users").findOne({ userId: userData.id });

            let threadMeta = {} as any;
            if (!!thread) {
                const _id = new ObjectId(thread) as any;
                const threadData = await db.collection("threads").findOne({ _id: _id });

                threadData.title ? threadMeta['title'] = threadData.title : false;
            }

            !!sources ? payload['sources'] = sources : false;
            !!tones ? payload['tones'] = tones : false;
            !!formulas ? payload['formulas'] = formulas : false;
            !!threads ? payload['threads'] = threads : false;
            !!user ? payload['user'] = user : false;
            !!threadMeta ? payload['meta'] = threadMeta : false;

            console.log('From API route ', payload);

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
