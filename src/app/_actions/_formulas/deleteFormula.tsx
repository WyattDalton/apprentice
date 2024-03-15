'use server';
import { getMongoDB } from '@/utils/getMongo';
import { ObjectId } from 'mongodb';


export async function deleteFormula(id: any) {
    'use server'
    const db = await getMongoDB() as any;
    try {
        const res = await db.collection("formulas").deleteOne({ _id: new ObjectId(id) });
        const formulas = await db.collection("formulas").find({}).toArray();
        return {
            'success': true,
            'formulas': formulas,
        };

    } catch (error) {
        console.log(error);
        return {
            'success': false
        };
    }
}