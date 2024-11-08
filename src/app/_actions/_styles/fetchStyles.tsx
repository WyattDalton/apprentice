'use server';

import prisma from "@/utils/getPrisma";
import getLoggedInUser from "@/utils/getLoggedInUser";

/**
 * Fetches styles from the database.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of styles.
 */
export async function fetchStyles() {
    'use server';
    try {

        const user = await getLoggedInUser();
        const userId = user.id;

        const allStyles = await prisma.style.findMany({
            where: {
                userId: userId
            }
        });

        return allStyles;

    } catch (err) {
        console.error("Error in fetchStyles: ", err);
    }
}