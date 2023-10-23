import { NextRequest, NextResponse } from 'next/server';
import { getMongoDB } from '@/components/utils/getMongo';

/**
 * POST request handler for updating user data in MongoDB.
 * @param req - The NextRequest object containing the request data.
 * @returns A NextResponse object containing a JSON response with a success flag and updated user data.
 * @throws A NextResponse object containing a JSON response with a success flag and error message if an error occurs.
 */
export async function POST(req: NextRequest) {
    try {

        //### Get data from request body
        const body = await req.json();
        const { data } = body;
        const { userId, organization, words, datetime } = data;

        //### Init db
        let db;

        //### Get db for {userId}-{organization}
        db = await getMongoDB(userId, organization) as any;

        //### Access the users collection
        const collection = db.collection("users");

        //### find user in collection by finding userId
        const user = await collection.findOne({ userId: userId });

        //### Get the words from the user
        const currentWords = user.available_words ? user.available_words : 0;
        const newWords = parseInt(currentWords) + parseInt(words);

        //### Get the history array from the user
        const currentHistory = user.history ? user.history : [];
        const newHistory = currentHistory.push({ words: words, datetime: datetime });

        //### Build Payload
        const payload = {
            words: newWords,
            history: newHistory,
        };

        //### Update the user
        const res = await collection.updateOne({ userId: userId }, { $set: payload }, { upsert: true });

        //### Return the user
        return NextResponse.json({
            'success': true,
            'user': res,
        });

    } catch (error) {
        return NextResponse.json({
            'success': false,
            'message': error,
        });
    }
}
