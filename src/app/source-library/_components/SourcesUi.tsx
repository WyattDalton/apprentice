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
    const [updating, setUpdating] = useState(false)

    useEffect(() => {
        setSourcesData(sources)
    }, [sources])

    useEffect(() => {
        console.log(sourcesData)
    }, [sourcesData])

    useEffect(() => {
        console.log(updating);
    }, [updating]);

    return (
        <section className='w-[90%] mx-auto'>
            <AddSource setUpdating={setUpdating} sourcesData={sourcesData} setSourcesData={setSourcesData} />
            <SourcesGrid data={sourcesData} />
        </section>
    )
}