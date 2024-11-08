"use server"

import prisma from "@/utils/getPrisma";

/**
 * Retrieves a source from the DB.
 * @param id The ID of the source to be retrieved.
 * @returns A Promise that resolves to the retrieved source.
 */
export async function fetchSource(idString: string) {
    "use server"
    try {

        const source = await prisma.source.findUnique({
            where: {
                id: idString
            }
        });
        if (source) {
            const cleanSource = {
                type: source.type,
                category: source.category,
                name: source.name,
                title: source.title,
                text: source.text,
                id: source.id
            };
            return cleanSource;
        }
        throw new Error('Source not found');
    } catch (error) {
        return { success: false, message: error }
    }
};
