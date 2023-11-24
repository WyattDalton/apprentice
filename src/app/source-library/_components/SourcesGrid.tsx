'use client'

import Card from "@/components/UI/Card";
import { FileIcon, LinkIcon } from "@/components/icons";
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from "react";

type Props = {
    data: any;
}
function SourcesGrid({ data }: Props) {
    const [sources, setSources] = useState(data || [])
    const router = useRouter();
    const currentUrl = usePathname();

    useEffect(() => {
        if (data) {
            setSources(data)
        }
    }, [data])

    if (!sources) {
        return <p>Loading...</p>
    }

    const handleEdit = (id: string) => {
        router.push(`${currentUrl}/${id}`)
    }

    const handleDelete = async (id: string) => {
        const res = await fetch(`/api/sourcesDelete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "id": id }),
        });
        if (!res.ok) {
            throw new Error('Failed to fetch data')
        }
        const data = await res.json();
        if (data.success) {
            setSources(sources.filter((source: any) => source._id !== id))
        }
    }


    return (
        <div className="flex-grow grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-min inset-0 bg-[radial-gradient(#e2e2e2_1px,transparent_1px)] [background-size:13px_13px] py-[5%] px-[2.5%]">
            {
                !!sources.length && (
                    sources.map((source: any) => (
                        <Card key={source._id} className="col-span-1 !m-0 prose">

                            <div className="flex items-center justify-start gap-4 text-sm">
                                {source.type == 'file' ? <FileIcon className="w-6 h-6 p-2 rounded-md bg-gray-700 text-white" /> : <LinkIcon className="w-6 h-6 p-2 rounded-md bg-gray-700 text-white" />}
                                <h3 className="mt-0 mb-0">{source.title}</h3>
                            </div>

                            <p className="line-clamp-3 text-xs">{source.text}</p>

                            <div className="flex items-center justify-end gap-4 w-full">
                                <button className="border border-gray-700 text-gray-700 px-4 rounded-md" onClick={() => handleEdit(source._id)}>Edit</button>
                                <button className="text-red-500" onClick={() => handleDelete(source._id)}>Delete</button>
                            </div>

                        </Card>
                    ))
                )
            }
        </div >
    )
}

export default SourcesGrid