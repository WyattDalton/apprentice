'use client';

import { useEffect, useState } from "react";
import Card from "@/components/UI/Card";

type GeneratorInformationProps = {
    className: string | '',
    placeholder: string | '',
    setMeta: any,
    meta: any,
};

const GeneratorInformation = ({
    className,
    placeholder,
    setMeta,
    meta
}: GeneratorInformationProps) => {

    const [title, setTitle] = useState(meta.title || '');

    useEffect(() => {
        setTitle(meta.title);
    }, [meta])

    /* * * * * * * * * * * * * * * * * * * */
    /* Render Generator Information
    /* * * * * * * * * * * * * * * * * * * */
    return (
        <>
            <Card className={`!shadow-md !mb-0 !p-0 w-full overflow-hidden flex justify-between items-center gap-2 !bg-gray-100 ${className}`}>
                <input type="text" className={`w-full p-2`} placeholder={placeholder} value={title} onChange={(e) => setTitle(e.target.value)} />
            </Card>
        </>
    )
}
export default GeneratorInformation;