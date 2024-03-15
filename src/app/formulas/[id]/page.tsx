'use server'

import { getMongoDB } from "@/utils/getMongo";
import { ObjectId } from 'mongodb';
import { deleteFormula } from "@/app/_actions/_formulas/deleteFormula";
import { updateFormula } from "@/app/_actions/_formulas/updateFormula";

import FormulaSingleUi from "./_components/FormulaSingleUi";

/* * * * * * * * * * */
// Get formula data
/* * * * * * * * * * */
const getFormulaData = async (idString: any) => {
    let formulaData: any = {};
    try {
        const id = new ObjectId(idString);
        const db = await getMongoDB() as any;
        const formula = await db.collection("formulas").findOne({ _id: id });

        formulaData = {
            _id: idString,
            title: formula.title || '',
            instructions: formula.instructions || '',
            outline: formula.outline || '',
            thinkAbout: formula.thinkAbout || '',
        }

    } catch (error) {
        console.log(error);
    }

    return formulaData;
}

export default async function FormulaLibrary({ params }: { params: { id: string } }) {

    const formulaData = await getFormulaData(params.id);
    const { _id, title, instructions, formula, thinkAbout, outline } = formulaData;

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
