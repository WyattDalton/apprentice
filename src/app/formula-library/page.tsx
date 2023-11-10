'use server'

import { getMongoDB } from '@/components/utils/getMongo';
import FormulasUi from './_components/FormulasUi';


export default async function FormulaLibrary() {
    /* * * * * * * * ** * * * * * * *
    /* Get all formulas on load
    /* * * * * * * * ** * * * * * * */
    const fetchFormulas = async () => {
        'use server'
        try {
            const db = await getMongoDB() as any;
            const formulas = await db.collection("formulas").find({}).toArray();
            const cleanFormulas = formulas.map(({ _id, ...rest }: any) => ({ _id: _id.toString(), ...rest }));
            return cleanFormulas;
        }
        catch (error) {
            console.log(error);
        }
    }

    const formulas = await fetchFormulas();

    /* * * * * * * * ** * * * * * * *
    /* Render
    /* * * * * * * * ** * * * * * * */
    return (
        <FormulasUi formulasData={formulas} />
    );
}
