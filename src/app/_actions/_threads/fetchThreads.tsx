"use server";

import prisma from "@/utils/getPrisma";
import getLoggedInUser from "@/utils/getLoggedInUser";

/**
 * Fetches threads from the server.
 * @returns {Promise<Array<any>>} A promise that resolves to an array of clean threads.
 */
export async function fetchThreads() {
    "use server";
    try {
        const user = await getLoggedInUser();
        const userId = user.id;

        const allThreads = await prisma.thread.findMany({
            where: {
                userId: userId
            },
            orderBy: {
                created: "desc"
            }
        });

        return allThreads;
    } catch (err) {
        console.error("Error in fetchThreads: ", err);
    }
}