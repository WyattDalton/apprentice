'use client'

import { UilPlus } from '@iconscout/react-unicons'
import SearchBar from "@/components/UI/SearchBar"
import { useEffect, useState } from "react";

function SourcesHeader() {
    const [query, setQuery] = useState<string>("");

    // filter posts on chang of query
    useEffect(() => {
        console.log(query)
    }, [query])

    return (
        <div className="flex items-center justify-center gap-4 mb-4">
            <SearchBar query={""} setQuery={setQuery} />

            <button className="bg-theme_primary text-white font-bold py-2 px-4 rounded text-sm">
                <UilPlus className="h-6 w-6" />
            </button>
        </div>
    )
}

export default SourcesHeader