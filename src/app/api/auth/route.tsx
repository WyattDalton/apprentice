import { NextRequest, NextResponse } from 'next/server';
import { getMongoDB } from '@/utils/getMongo';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, auth } = body;
        const db = await getMongoDB() as any;
        const collection = db.collection("users");

        const user = await collection.findOne({ userId: userId });

        if (user.auth.secretKey === auth.secretKey && user.auth.apiKey === auth.apiKey) {

            // add auth status to local storage as the following object {authorized: true, userId: userId, access: auth.access}
            const authStatus = {
                authorized: true,
                userId: userId,
                access: auth.access,
            }
            localStorage.setItem('authStatus', JSON.stringify(authStatus));

            return NextResponse.json({
                'success': true,
                'user': user,
            });
        } else {
            const authStatus = {
                authorized: false,
                userId: null,
                access: null,
            }
            localStorage.setItem('authStatus', JSON.stringify(authStatus));
            return NextResponse.json({
                'success': false,
                'message': 'Authentication failed',
            });
        }



    } catch (error) {
        console.log(error);
        return NextResponse.json({
            'success': false,
            'message': error,
        });
    }
}
