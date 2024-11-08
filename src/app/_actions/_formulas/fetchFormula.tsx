"use server"

import prisma from "@/utils/getPrisma";

export default async function fetchFormula(data: any) {
    'use server'

    try {

        const formula = await prisma.formula.findUnique({
            where: {
                id: data._id
            }
        });

        return {
            'success': true,
            'formula': formula,
        };
    } catch (error) {
        return {
            'success': false
        };
    }
}