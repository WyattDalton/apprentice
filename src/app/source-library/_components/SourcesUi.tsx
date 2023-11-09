'use client'

import SourcesHeader from './SourcesHeader'
import SourcesGrid from './SourcesGrid'
import AddSource from './AddSource'
import { useEffect, useState } from 'react'

type SourcesUiProps = {
    sources: any
}

export default async function SourcesUi({ sources }: SourcesUiProps) {

    const [sourcesData, setSourcesData] = useState(sources || {})

    const fetchSources = async () => {
        const res = await fetch(`/api/sourcesGetAll`, {
            cache: 'no-store'
        })
        if (!res.ok) {
            throw new Error('Failed to fetch sources')
        }
        setSourcesData(await res.json())
    }
    useEffect(() => {
        fetchSources()
    });

    return (
        <section className='w-[90%] mx-auto'>
            <AddSource />
            {!!sourcesData ? <SourcesGrid data={!!sourcesData.sources ? sourcesData.sources : []} /> : 'Loading...'}
        </section>
    )
}