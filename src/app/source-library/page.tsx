import SourcesHeader from './components/SourcesHeader'
import SourcesGrid from './components/SourcesGrid'
import AddSource from './components/AddSource'
import { revalidatePath } from 'next/cache';

async function getData() {

    // revalidatePath(`/source-library`);

    const { signal } = new AbortController()

    const api = process.env.API_URL;
    const res = await fetch(`${api}/sourcesGetAll`, { next: { revalidate: 1 } })

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
    }

    return res.json()
}

export default async function Page() {
    const sources = await getData();
    return (
        <section className='w-[90%] marginx-auto'>
            <SourcesHeader />
            <AddSource />
            <SourcesGrid data={!!sources.sources ? sources.sources : []} />
        </section>
    )
}