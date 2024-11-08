"use server";

import prisma from "@/utils/getPrisma";
import getLoggedInUser from "@/utils/getLoggedInUser";

/**
 * Fetches sources from the database.
 * @returns {Promise<Array<Object>>} The array of clean sources.
 */
export async function fetchSources() {
    "use server"
    try {
        const user = await getLoggedInUser();
        const userId = user.id;

        const allSources = await prisma.source.findMany({
            where: {
                userId: userId
            }
        });

        return allSources;
    } catch (err) {
        console.error("Error in fetchSources: ", err);
    }
}