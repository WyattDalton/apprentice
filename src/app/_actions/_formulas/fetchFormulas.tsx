"use server";

import prisma from "@/utils/getPrisma";
import getLoggedInUser from "@/utils/getLoggedInUser";

/**
 * Fetches formulas from the server.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of clean formulas.
 */
export async function fetchFormulas() {
    "use server";
    try {

        const user = await getLoggedInUser();
        const userId = user.id;

        const formulas = await prisma.formula.findMany({
            where: {
                userId: userId
            }
        });

        return formulas;

    } catch (err) {
        console.error("Error in fetchFormulas: ", err);
    }
}