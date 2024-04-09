'use server';
import { getMongoDB } from '@/utils/getMongo';
import { ObjectId } from 'mongodb';

/**
 * Deletes a formula from the database.
 * @param data - The data of the formula to be deleted.
 * @returns An object indicating the success of the deletion and the updated list of formulas.
 */
export async function deleteFormula(data: any) {
    'use server'
    const db = await getMongoDB() as any;
    try {
        const formulaToDelete = await db.collection("formulas").deleteOne({ _id: new ObjectId(data._id) });
        const formulas = await db.collection("formulas").find({}).toArray();
        const cleanFormulas = formulas.map(({ _id, ...rest }: any) => ({ _id: _id.toString(), ...rest }));
        return {
            'success': true,
            'data': cleanFormulas,
        };
    } catch (error) {
        return {
            'success': false
        };
    }
}