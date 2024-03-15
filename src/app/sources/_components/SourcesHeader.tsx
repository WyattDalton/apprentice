'use client'

import SearchBar from "@/components/_ui/SearchBar"
import { useEffect, useState } from "react";

function SourcesHeader() {
    const [query, setQuery] = useState<string>("");

    return (
        <div className="flex items-center justify-center gap-4 mb-4">
            <SearchBar query={""} setQuery={setQuery} />
            <button className="bg-theme_primary text-white font-bold py-2 px-4 rounded text-sm">
                Add Source
            </button>
        </div>
    )
}

export default SourcesHeader