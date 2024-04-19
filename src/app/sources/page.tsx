'use server';

import { deleteSource } from '@/app/_actions/_sources/deleteSource';
import { fetchSources } from '@/app/_actions/_sources/fetchSources';
import structureTheData from './_structureTheData';
import ViewTable from '@/components/_ui/ViewTable';
import AddSource from './_components/AddSource';
import loadData from '../_actions/_utilities/loadViewTableData';

export default async function Page() {

    const tableData = await loadData('sources');

    return (
        <section className="flex-grow inset-0 bg-[radial-gradient(#e2e2e2_1px,transparent_1px)] [background-size:16px_16px] px-[5%]">
            <ViewTable
                viewTitle="Sources"
                addItem={<AddSource />}
                deleteItem={deleteSource}
                headers={tableData.headers}
                data={tableData.body}
                viewItemRoutePrefix={'/sources'}
                structureTheData={structureTheData}
            />
        </section>
    )
}