'use server'

import ViewTable from '@/components/_ui/ViewTable';
import { deleteFormula } from '@/app/_actions/_formulas/deleteFormula';
import structureTheData from './_structureTheData';
import AddFormula from './_components/AddFormula';
import loadData from '../_actions/_utilities/loadViewTableData';



export default async function FormulaLibrary() {

    const tableData = await loadData('formulas');

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
