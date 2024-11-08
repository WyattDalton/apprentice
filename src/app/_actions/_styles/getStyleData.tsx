'use server'

import prisma from '@/utils/getPrisma';

/**
 * Retrieves style data from the database based on the provided ID.
 * @param id - The ID of the style to retrieve.
 * @returns A promise that resolves to the retrieved style data.
 */
export async function getStyleData(id: string) {
    'use server'
    try {

        const style = await prisma.style.findUnique({
            where: {
                id: id
            }
        });

        const payload = {} as any;

        !!style.title ? payload.title = style.title : false;
        !!style.examples ? payload.examples = style.examples : false;
        !!style.description ? payload.description = style.description : false;
        !!style.keywords ? payload.keywords = style.keywords : false;
        !!style.blueprint ? payload.blueprint = style.blueprint : false;
        !!style.sample ? payload.sample = style.sample : false;
        !!style.iteration ? payload.iteration = style.iteration : false;

        return payload;
    } catch (error: any) {
        console.error('Error in GET:', error.message);
    }
}
