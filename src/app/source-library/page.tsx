import SourcesHeader from './_components/SourcesHeader'
import SourcesGrid from './_components/SourcesGrid'
import AddSource from './_components/AddSource'
import SourcesUi from './_components/SourcesUi';
import { getMongoDB } from '@/components/utils/getMongo';

export default async function Page() {
    async function getAllSources() {
        try {
            const db = await getMongoDB() as any;
            const sources = await db.collection("sources").find({}).toArray();
            const cleanSources = sources.map(({ _id, ...rest }: any) => ({ _id: _id.toString(), ...rest }));
            return cleanSources;
        } catch (error: any) {
            console.log(error)
        }
    }
    const sources = await getAllSources();
    return (
        // <section className='w-[90%] mx-auto'>
        //     <AddSource />
        //     {!!sources ? <SourcesGrid data={!!sources.sources ? sources.sources : []} /> : 'Loading...'}
        // </section>
        <SourcesUi sources={sources} />
    )
}