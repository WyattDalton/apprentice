'use client';

import { useState } from "react";
import Card from "@/components/UI/Card";

type GeneratorInformationProps = {
    placeholder: string | '',
};

const GeneratorInformation = ({
    placeholder,
}: GeneratorInformationProps) => {

    const [title, setTitle] = useState('Title');


    /* * * * * * * * * * * * * * * * * * * */
    /* Render Generator Information
    /* * * * * * * * * * * * * * * * * * * */
    return (
        <>
            <Card className={`!shadow-md !mb-0 !p-0 w-full overflow-hidden flex justify-between items-center gap-2 !bg-gray-100`}>
                <input type="text" className={`w-full p-2`} placeholder={title} value={title} onChange={(e) => setTitle(e.target.value)} />
            </Card>
        </>
    )
}
export default GeneratorInformation;