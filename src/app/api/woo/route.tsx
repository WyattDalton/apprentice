import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/getPrisma';

const createPrismaUser = async (userId: string, username: string) => {
    // Convert data to strings
    if (typeof userId !== 'string' || typeof username !== 'string') {
        userId = userId.toString();
        username = username.toString();
    }
    //### Create or update user in Prisma
    const user = await prisma.user.upsert({
        where: { id: userId },
        update: { username: username },
        create: { id: userId, username: username },
    });

    return user;
}

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
        const { userId, username } = body;

        // const user = await createMongoUser(userId, username);
        const user = await createPrismaUser(userId, username);

        // ### Return a JSON response with a success flag and updated user data
        return NextResponse.json({
            'success': true,
            'user': user,
        });


    } catch (error) {
        console.log(error)
        return NextResponse.json({
            'success': false,
            'message': error,
        });
    }
}
