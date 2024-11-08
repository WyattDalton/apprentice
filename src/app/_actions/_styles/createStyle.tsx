'use server'
import prisma from "@/utils/getPrisma";
import getLoggedInUser from "@/utils/getLoggedInUser";

/**
 * Creates a new style in the database.
 * @param payload - The data for the new style.
 * @returns The created style object.
 */
export async function createStyle(payload: any) {
    'use server'
    try {
        const user = await getLoggedInUser();
        const userId = user.id.toString();
        payload.userId = userId;

        const style = await prisma.style.create({
            data: payload
        });
        return {
            success: true,
            insertedId: style.id,
        };
    } catch (error: any) {
        console.error('Error in POST:', error.message);
    }
}