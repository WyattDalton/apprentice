"use server"

import prisma from '@/utils/getPrisma'
import getLoggedInUser from '@/utils/getLoggedInUser';

/**
 * Deletes a thread from the database.
 * @param id - The thread ID.
 * @returns An object indicating the success of the operation and the updated list of threads.
*/
export async function deleteThread(id: any) {
    "use server"
    try {
        const user = await getLoggedInUser();
        const userId = user.id;
        const threadToDelete = await prisma.thread.delete({
            where: {
                id: id
            }
        });

        const threads = await prisma.thread.findMany({
            where: {
                userId: userId
            },
            orderBy: {
                created: "desc"
            }
        });

        return {
            'success': true,
            'data': threads,
        };
    } catch (error) {
        console.log(error);
        return {
            'success': false,
            'error': error,
        };
    }
}