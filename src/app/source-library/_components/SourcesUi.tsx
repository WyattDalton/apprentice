'use client'

import SourcesHeader from './SourcesHeader'
import SourcesGrid from './SourcesGrid'
import AddSource from './AddSource'
import { useEffect, useState } from 'react'

type SourcesUiProps = {
    sources: any
}

export default async function SourcesUi({ sources }: SourcesUiProps) {

    const [sourcesData, setSourcesData] = useState(sources || [])

    return (
        <section className='w-[90%] mx-auto'>
            <AddSource />
            {!!sourcesData ? <SourcesGrid data={!!sourcesData ? sourcesData : []} /> : 'Loading...'}
        </section>
    )
}