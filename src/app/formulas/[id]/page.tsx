'use server'

import { getMongoDB } from "@/utils/getMongo";
import { ObjectId } from 'mongodb';
import { deleteFormula } from "@/app/_actions/_formulas/deleteFormula";
import { updateFormula } from "@/app/_actions/_formulas/updateFormula";
import fetchFormula from "@/app/_actions/_formulas/fetchFormula";

import FormulaSingleUi from "./_components/FormulaSingleUi";


export default async function FormulaLibrary({ params }: { params: { id: string } }) {

    const rawData = await fetchFormula({ "_id": params.id });
    if (!rawData.success) {
        return {
            'redirect': '/formulas'
        }
    }

    const { _id, title, instructions, formula, thinkAbout, outline } = rawData.formula;

    /* * * * * * * * * * */
    // Render
    /* * * * * * * * * * */
    return (
        <FormulaSingleUi
            titleData={title}
            instructionsData={instructions}
            formulaData={formula}
            _id={_id}
            deleteFormula={deleteFormula}
            updateFormula={updateFormula}
            thinkAboutData={thinkAbout}
            outlineData={outline}
        />
    );
};
