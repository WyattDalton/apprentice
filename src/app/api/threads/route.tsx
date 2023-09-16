import { NextRequest, NextResponse } from 'next/server';
import { closeMongoDB, getMongoDB } from '@/components/utils/getMongo';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
    try {

        const db = await getMongoDB() as any;
        const body = await req.json();
        const { dataType, data } = body;
        const collection = db.collection("threads");

        if (dataType === 'create') {

            // get the mongodb _id for the new item after creating it
            const res = await collection.insertOne(data);
            return NextResponse.json({
                'success': true,
                'thread': res.insertedId,
            });

        } else if (dataType === 'update') {

            const { _id, update } = data;
            const res = await collection.updateOne({ _id: new ObjectId(_id) }, { $set: update }, { upsert: true });
            const threads = await collection.find({}).toArray();
            return NextResponse.json({
                'success': true,
                'thread': res,
                'threads': threads,
            });

        } else if (dataType === 'delete') {

            const { _id } = data;
            const deleteThread = await collection.deleteOne({ _id: new ObjectId(_id) });
            const threads = await collection.find({}).toArray();
            return NextResponse.json({
                'success': true,
                'threads': threads,
            });

        } else if (dataType === 'get') {

            const { _id } = data;
            if (!!_id) {
                const res = await collection.findOne({ _id: new ObjectId(_id) });
                return NextResponse.json({
                    'success': true,
                    'thread': res,
                });
            } else {
                const res = await collection.find({}).toArray();
                return NextResponse.json({
                    'success': true,
                    'threads': res,
                });
            }

        }

    } catch (error) {
        console.log(error);
        return NextResponse.json({
            'success': false,
            'message': error,
        });
    }
}
