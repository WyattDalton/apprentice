import { NextRequest, NextResponse } from 'next/server';
import { closeMongoDB, getMongoDB } from '@/components/utils/getMongo';
import clientPromise from '@/components/utils/getMongoClient';

export async function POST(req: NextRequest) {
    try {

        const body = await req.json();
        const { dataType, data } = body;
        const db = await getMongoDB() as any;
        const collection = db.collection("users");

        if (dataType === 'create') {

            const { userId, username, email, organization, available_words } = data;
            const { secretKey, apiKey, access } = body.auth;

            const client = await clientPromise;

            const id = userId
                .toString()
                .toLowerCase()
                .replace(/ /g, '_');
            const org = organization
                .toLowerCase()
                .replace(/ /g, '_');
            const _mongoUserId = `${id}-${org}`;

            const newDb = client.db(_mongoUserId);
            const newCollection = newDb.collection("users");

            const payload = {
                userId: userId,
                username: username,
                email: email,
                organization: organization,
                available_words: available_words,
                auth: {
                    secretKey: secretKey,
                    apiKey: apiKey,
                    access: access,
                }
            };

            console.log(payload)

            const res = await newCollection.insertOne(payload);

            return NextResponse.json({
                'success': true,
                'user': res,
            });

        } else if (dataType === 'update') {

            const { userId, update } = data;
            const res = await collection.updateOne({ userId: userId }, { $set: update }, { upsert: true });
            return NextResponse.json({
                'success': true,
                'user': res,
            });

        } else if (dataType === 'delete') {

            const { userId } = data;
            const deleteThread = await collection.deleteOne({ userId: userId });
            const users = await collection.find({}).toArray();
            return NextResponse.json({
                'success': true,
                'users': users,
            });

        } else if (dataType === 'get') {

            const { userId } = data;

            if (!!userId) {
                const res = await collection.findOne({ userId: userId });
                return NextResponse.json({
                    'success': true,
                    'user': res,
                });
            } else {
                const res = await collection.find({}).toArray();
                return NextResponse.json({
                    'success': true,
                    'users': res,
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
