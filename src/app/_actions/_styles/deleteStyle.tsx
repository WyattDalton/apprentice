'use server'

import prisma from "@/utils/getPrisma";
import getLoggedInUser from "@/utils/getLoggedInUser";

/**
 * Deletes a style from the database.
 * @param id - The ID of the style to delete.
 * @returns An object with the success status and the updated list of styles.
 */
export async function deleteStyle(id: any) {
    'use server'
    try {

        const user = await getLoggedInUser();
        const userId = user.id;

        const styleToDelete = await prisma.style.delete({
            where: {
                id: id
            }
        });
        const allStyles = await prisma.style.findMany({
            where: {
                userId: userId
            }
        });

        return {
            "success": true,
            "data": allStyles
        };
    } catch (error: any) {
        console.error('Error in DELETE:', error.message);
    }
}