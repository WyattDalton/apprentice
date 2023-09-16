import SourcesHeader from './_components/SourcesHeader'
import SourcesGrid from './_components/SourcesGrid'
import AddSource from './_components/AddSource'


async function getData() {

    try {
        const api = process.env.API_URL;
        const res = await fetch(`${api}/sourcesGetAll`)

        if (!res.ok) {
            console.log(api)
            throw new Error('Failed to fetch sources')
        }

        return res.json()  
    } catch (error) {
        console.log(error)
    }
}

export default async function Page() {
    const sources = await getData()
    return (
        <section className='w-[90%] marginx-auto'>
            <SourcesHeader />
            <AddSource />
            <SourcesGrid data={!!sources.sources ? sources.sources : []} />
        </section>
    )
}