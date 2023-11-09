import SourcesHeader from './_components/SourcesHeader'
import SourcesGrid from './_components/SourcesGrid'
import AddSource from './_components/AddSource'
import SourcesUi from './_components/SourcesUi';


async function getData() {

    let data;

    try {
        const api = process.env.API_URL ? process.env.API_URL : false;
        if (!!api) {
            const res = await fetch(`${api}/sourcesGetAll`, {
                cache: 'no-store'
            })
            if (!res.ok) {
                console.log(api)
                throw new Error('Failed to fetch sources')
            }
            data = res.json()
        }
    } catch (error) {
        console.log(error)
    }

    return data;
}

export default async function Page() {
    const sources = await getData();
    return (
        // <section className='w-[90%] mx-auto'>
        //     <AddSource />
        //     {!!sources ? <SourcesGrid data={!!sources.sources ? sources.sources : []} /> : 'Loading...'}
        // </section>
        <SourcesUi sources={sources} />
    )
}