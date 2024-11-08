"use server"

import prisma from "@/utils/getPrisma";
import getLoggedInUser from "@/utils/getLoggedInUser";

/**
 * Deletes a source from the DB.
 * @param id The ID of the source to be deleted.
 * @returns A Promise that resolves to a success message.
 */
export async function deleteSource(data: any) {
    "use server"

    try {

        const user = await getLoggedInUser();
        const userId = user.id;

        const deleteSource = await prisma.source.delete({
            where: {
                id: data
            }
        });

        const sources = await prisma.source.findMany({
            where: {
                userId: userId
            }
        });

        return { "data": sources, "success": true };
    } catch (err) {
        return { success: false, message: err };
    }
}
