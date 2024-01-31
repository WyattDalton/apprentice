'use client'

import SourcesHeader from './SourcesHeader'
import SourcesGrid from './SourcesGrid'
import AddSource from './AddSource'
import { Fragment, Suspense, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import GridSkeleton from './GridSkeleton'

type SourcesUiProps = {
    sources: any,
    fetchHtmlFromUrl: any,
    processHtmlFromUrl: any,
    addUrl: any,
    addFile: any,
    addRaw: any,
    deleteSource: any
}

export default async function SourcesUi({ sources, fetchHtmlFromUrl, processHtmlFromUrl, addUrl, addFile, addRaw, deleteSource }: SourcesUiProps) {

    const [sourcesData, setSourcesData] = useState(sources || [])
    const [updating, setUpdating] = useState(false)

    useEffect(() => {
        setSourcesData(sources)
    }, [sources])

    return (
        <section className='w-[90%] mx-auto flex flex-col gap-4 h-full flex-grow'>
            <AddSource
                setUpdating={setUpdating}
                sourcesData={sourcesData}
                setSourcesData={setSourcesData}

                fetchHtmlFromUrl={fetchHtmlFromUrl}
                processHtmlFromUrl={processHtmlFromUrl}
                addUrl={addUrl}

                addFile={addFile}
                addRaw={addRaw}
            />
            {!!sourcesData.length &&
                <SourcesGrid data={sourcesData} deleteSource={deleteSource} />
            }
        </section>
    )
}