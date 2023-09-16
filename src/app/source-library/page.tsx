import SourcesHeader from './_components/SourcesHeader'
import SourcesGrid from './_components/SourcesGrid'
import AddSource from './_components/AddSource'


type PageProps = {
    sources: any;
}
async function getData(): Promise<PageProps> {
    const { signal } = new AbortController()
    const api = process.env.API_URL;
    const res = await fetch(`${api}/sourcesGetAll`)

    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }

    return res.json()
}

function Page({ sources }: PageProps) {
    return (
        <section className='w-[90%] marginx-auto'>
            <SourcesHeader />
            <AddSource />
            <SourcesGrid data={!!sources.sources ? sources.sources : []} />
        </section>
    );
}

export async function getServerSideProps(): Promise<{ props: PageProps }> {
    const sources = await getData();
    return { props: { sources } };
}

export default Page;
