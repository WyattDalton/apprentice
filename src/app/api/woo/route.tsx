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
        const { userId, organization, username } = body;

        //### Init db
        let db;

        //### Get db for {userId}-{organization}
        db = await getMongoDB(userId, organization, username) as any;

        //### Access the users collection
        const collection = db.collection("users");

        // ### Upsert the user to the collection with information from request body
        const res = await collection.updateOne({ userId: userId }, { $set: { userId: userId, organization: organization, username: username } }, { upsert: true });

        // ### Return a JSON response with a success flag and updated user data
        return NextResponse.json({
            'success': true,
            'user': res,
        });


    } catch (error) {
        console.log(error)
        return NextResponse.json({
            'success': false,
            'message': error,
        });
    }
}
