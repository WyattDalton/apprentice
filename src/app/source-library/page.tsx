'use server';
import { fetchHtmlFromUrl, processHtmlFromUrl, addUrl, fetchSources } from './_actions';
import SourcesUi from './_components/SourcesUi';
import { getMongoDB } from '@/components/utils/getMongo';

export default async function Page() {

    const sources = await fetchSources();


    return (
        <SourcesUi
            sources={sources}
            fetchHtmlFromUrl={fetchHtmlFromUrl}
            processHtmlFromUrl={processHtmlFromUrl}
            addUrl={addUrl}
        />
    )
}