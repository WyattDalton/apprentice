
import { useState } from "react";
import Card from "./Card";

type SearchBarProps = {
    query: string;
    setQuery: (query: string) => void;
}

const SearchBar = ({ query, setQuery }: SearchBarProps) => {
    return (
        <Card className="w-full !p-0 !m-0">
            <div style={{ position: 'relative' }}>
                <input
                    className="w-full h-14 px-3 pr-10 text-sm text-gray-700 placeholder-gray-600 border rounded-lg focus:shadow-outline"
                    style={{ paddingRight: '30px' }} // To avoid text under the icon
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Type to Search..."
                />
            </div>
        </Card>
    )
}

export default SearchBar;
