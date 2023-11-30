import { NextRequest, NextResponse } from 'next/server';
import { getMongoDB } from '@/components/utils/getMongo';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
    try {

        const db = await getMongoDB() as any;
        const body = await req.json();

        const { dataFor, thread } = body;

        if (dataFor === 'generator') {

            const payload = {} as any;

            const sources = await db.collection("sources").find({}).toArray();
            const tones = await db.collection("tones").find({}).toArray();
            const formulas = await db.collection("formulas").find({}).toArray();
            const threads = await db.collection("threads").find({}).toArray();

            console.log('From API route: ', !!sources)

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
            !!threadMeta ? payload['meta'] = threadMeta : false;

            console.log('From API route: sources - ', !!sources);

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
