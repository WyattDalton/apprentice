'use server';

import SourcesUi from './_components/SourcesUi';
import { deleteSource } from '@/app/_actions/_sources/deleteSource';
import { fetchSources } from '@/app/_actions/_sources/fetchSources';
import structureTheData from './_structureTheData';
import ViewTable from '@/components/_ui/ViewTable';
import AddSource from './_components/AddSource';

export default async function Page() {

    const sources = await fetchSources();
    let tableData = await structureTheData(sources);

    return (
        <>
            <ViewTable
                viewTitle="Sources"
                addItem={<AddSource />}
                deleteItem={deleteSource}
                headers={tableData.headers}
                data={tableData.body}
                viewItemRoutePrefix={'/sources'}
                structureTheData={structureTheData}
            />

            {/* <SourcesUi
            sources={sources}
            fetchHtmlFromUrl={fetchHtmlFromUrl}
            deleteSource={deleteSource}
            addFile={addFiles}
            addRaw={addRaw}
            addUrl={addUrl}
            processHtmlFromUrl={processHtmlFromUrl}
            /> */}
        </>
    )
}