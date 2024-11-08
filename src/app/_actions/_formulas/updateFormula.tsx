'use server'

import prisma from "@/utils/getPrisma";

export async function updateFormula(id: any, data: any) {
    try {

        const res = await prisma.formula.update({
            where: {
                id: id
            },
            data: data
        });

        return {
            'success': true,
            'formula': res,
        };

    } catch (error) {
        console.log(error);
        return {
            'success': false,
        };
    }
}