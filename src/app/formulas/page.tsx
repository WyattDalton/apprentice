'use server'

import { getMongoDB } from '@/utils/getMongo';
import ViewTable from '@/components/_ui/ViewTable';
import { deleteFormula } from '@/app/_actions/_formulas/deleteFormula';
import { fetchFormulas } from '@/app/_actions/_formulas/fetchFormulas';
import structureTheData from './_structureTheData';
import AddFormula from './_components/AddFormula';


export default async function FormulaLibrary() {

    const formulas = await fetchFormulas();
    const tableData = await structureTheData(formulas);

    /* * * * * * * * ** * * * * * * *
    /* Render
    /* * * * * * * * ** * * * * * * */
    return (
        <section className="flex-grow inset-0 bg-[radial-gradient(#e2e2e2_1px,transparent_1px)] [background-size:16px_16px] px-[5%]">
            <ViewTable
                viewTitle={'Formulas'}
                addItem={<AddFormula />}
                deleteItem={deleteFormula}
                data={tableData.body}
                headers={tableData.headers}
                viewItemRoutePrefix={'/formulas'}
                structureTheData={structureTheData}
            />
        </section>
    );
}
