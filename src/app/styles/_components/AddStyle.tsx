'use client'

import { createStyle } from "@/app/_actions/_styles/createStyle";
import { PlusIcon } from "@/components/_elements/icons";
import { useRouter } from "next/navigation";
import { useState } from "react";



/* * * * * * * * ** * * * * * * *
    /* Add a new style
    /* * * * * * * * ** * * * * * * */
const handleAddNewStyle = async (newStyle: any, router: any) => {
    try {
        const style = await createStyle(newStyle) as any;
        router.push(`/styles/${style.insertedId}`);
    }
    catch (error) {
        console.log(error);
    }
}

function AddStyle() {
    const router = useRouter();
    const [newStyle, setNewStyle] = useState({
        title: '',
        examples: [],
        summary: '',
    });

    return (
        <><button onClick={(e) => handleAddNewStyle(newStyle, router)} className="px-4 py-1 text-gray-700 border border-gray-700 rounded-full flex gap-2 justify-center items-center"><PlusIcon className={'w-4 h-4 text-gray-700'} /> Add</button></>
    );
}

export default AddStyle;