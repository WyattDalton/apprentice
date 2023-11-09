'use client'

import Card from "@/components/UI/Card";
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from "react";
import { IoFileTrayFullOutline } from "react-icons/io5";

type Props = {
    data: any;
}
function SourcesGrid({ data }: Props) {
    const [sources, setSources] = useState([])
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
        <div className="grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-min">
            {
                !!sources.length && (
                    sources.map((source: any) => (
                        <Card key={source._id} className="col-span-1 !m-0 prose">
                            <div className="flex gap-2 items-center text-md">
                                {source.type == 'file' ? <IoFileTrayFullOutline className="h-6 w-6" /> : ''}
                                <h3 className="mt-0 mb-0">{source.title}</h3>
                            </div>
                            {/* truncate source description to 4 lines */}
                            <p className="line-clamp-3">{source.text}</p>
                            <div className="flex gap-2 justify-end items-center">
                                <button className="bg-theme_primary-500 text-whitepy-1 px-2 rounded-md" onClick={() => handleEdit(source._id)}>Edit</button>
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