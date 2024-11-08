'use server';
import prisma from "@/utils/getPrisma";
import getLoggedInUser from "@/utils/getLoggedInUser";

/**
 * Deletes a formula from the database.
 * @param id - The id of the formula to be deleted.
 * @returns An object indicating the success of the deletion and the updated list of formulas.
 */
export async function deleteFormula(id: any) {
    'use server'
    try {

        const user = await getLoggedInUser();
        const userId = user.id;

        const formulaToDelete = await prisma.formula.delete({
            where: {
                id: id
            }
        });
        const formulas = await prisma.formula.findMany({
            where: {
                userId: userId
            }
        });


        return {
            'success': true,
            'data': formulas,
        };
    } catch (error) {
        return {
            'success': false
        };
    }
}