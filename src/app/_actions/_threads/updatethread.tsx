"use server";
import prisma from "@/utils/getPrisma";
import getLoggedInUser from "@/utils/getLoggedInUser";

/**
 * Updates a thread in the database.
 * @param data - The data object containing the thread ID and update.
 * @returns An object with the success status, updated thread, and all threads.
 */
export async function updateThread(data: any) {
    "use server";
    try {

        const update = data as any;
        const id = update.id;
        const user = await getLoggedInUser();
        const userId = user.id;

        const thread = await prisma.thread.update({
            where: {
                id: id
            },
            data: update
        });
        const threads = await prisma.thread.findMany({
            where: {
                userId: userId
            }
        });

        return ({
            'success': true,
            'thread': thread,
            'threads': threads
        })
    } catch (err) {
        console.error("Error in updateThread: ", err);
    }
}