"use server";
import { getMongoDB } from "@/utils/getMongo";
/**
 * Fetches formulas from the server.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of clean formulas.
 */
export async function fetchFormulas() {
    "use server";
    try {
        const db = await getMongoDB() as any;
        const formulas = db.collection("formulas");
        const allFormulas = await formulas.find({}).toArray();
        const cleanFormulas = allFormulas.map(({ _id, ...rest }: any) => ({ _id: _id.toString(), ...rest }));
        return cleanFormulas;
    } catch (err) {
        console.error("Error in fetchFormulas: ", err);
    }
}