import SourcesHeader from './_components/SourcesHeader'
import SourcesGrid from './_components/SourcesGrid'
import AddSource from './_components/AddSource'
import SourcesUi from './_components/SourcesUi';
import { getAllSources } from '../api/sourcesGetAll/route';

export default async function Page() {
    const sources = await getAllSources();
    console.log(sources);
    return (
        // <section className='w-[90%] mx-auto'>
        //     <AddSource />
        //     {!!sources ? <SourcesGrid data={!!sources.sources ? sources.sources : []} /> : 'Loading...'}
        // </section>
        <SourcesUi sources={sources} />
    )
}