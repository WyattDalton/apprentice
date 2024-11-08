"use server"

import prisma from "@/utils/getPrisma";
import getLoggedInUser from "@/utils/getLoggedInUser";

export default async function createFormula(data: any) {
    'use server'
    try {

        const user = await getLoggedInUser();
        const userId = user.id;
        const payload = data;
        payload.userId = userId;

        console.log('payload', payload);

        const newFormula = await prisma.formula.create({
            data: payload
        });

        return {
            'success': true,
            'formula': newFormula.id
        };

    } catch (error) {
        console.log('Error in createFormula:', error);
        return {
            'success': false
        };
    }
}