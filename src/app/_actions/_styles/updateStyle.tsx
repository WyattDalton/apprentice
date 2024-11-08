'use server'
import prisma from "@/utils/getPrisma";

/**
 * Updates a style in the database.
 * @param id - The ID of the style to update.
 * @param payload - The updated style data.
 * @returns The cleaned updated style object.
 */
export async function updateStyle(id: string, payload: any) {
    'use server'
    try {
        const style = await prisma.style.update({
            where: {
                id: id
            },
            data: payload
        });
        return style;
    } catch (error: any) {
        console.error('Error in PUT:', error.message);
    }
}