import { NextRequest, NextResponse } from 'next/server';
import { getMongoDB } from '@/components/utils/getMongo';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
    try {

        const db = await getMongoDB() as any;
        const body = await req.json();
        const { dataType, data } = body;

        if (dataType === 'create') {

            // get the mongodb _id for the new item after creating it
            const res = await db.collection("formulas").insertOne(data);
            return NextResponse.json({
                'success': true,
                'formula': res.insertedId,
            });

        } else if (dataType === 'update') {

            const { _id, update } = data;
            console.log(_id, update);
            const res = await db.collection("formulas").updateOne({ _id: new ObjectId(_id) }, { $set: update }, { upsert: true });
            return NextResponse.json({
                'success': true,
                'formula': res,
            });

        } else if (dataType === 'delete') {

            const { _id } = data;
            const res = await db.collection("formulas").deleteOne({ _id: new ObjectId(_id) });
            const formulas = await db.collection("formulas").find({}).toArray();
            return NextResponse.json({
                'success': true,
                'formulas': formulas,
            });

        } else if (dataType === 'get') {

            const { _id } = data;
            if (!!_id) {
                const res = await db.collection("formulas").findOne({ _id: new ObjectId(_id) });
                return NextResponse.json({
                    'success': true,
                    'formula': res,
                });
            } else {
                const res = await db.collection("formulas").find({}).toArray();
                return NextResponse.json({
                    'success': true,
                    'formulas': res,
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
