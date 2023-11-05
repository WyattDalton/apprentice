'use client';

import { useEffect, useState } from "react";
import Card from "@/components/UI/Card";
import LoadingText from "@/components/LoadingText";
import { Transition } from "@headlessui/react";
import { map } from "lodash";

type GeneratorInformationProps = {
    placeholder: string | '',
    active: boolean,
    setActive: any,
};

const GeneratorInformation = ({
    placeholder,
    active,
    setActive
}: GeneratorInformationProps) => {

    const [title, setTitle] = useState('Title');
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (!!active) {
            setShow(true)
        }
    })

    const handleSubmit = () => {
        console.log(title)
    }
    const handleClose = () => {
        setActive(false);
        setShow(false);
    };

    /* * * * * * * * * * * * * * * * * * * */
    /* Render Generator Information
    /* * * * * * * * * * * * * * * * * * * */
    return (
        <Transition
            show={show}
            className={`bg-white rounded-md flex flex-col gap-2 p-2 transition-all transition-300`}
            enter={`transition ease-out duration-300`}
            enterFrom={`transform opacity-0 scale-95`}
            enterTo={`transform opacity-100 scale-100`}
            leave={`transition ease-in duration-300`}
            leaveFrom={`transform opacity-100 scale-100`}
            leaveTo={`transform opacity-0 scale-95`}

        >

            <Card className={`!shadow-md !mb-0 !p-0 w-full overflow-hidden flex justify-between items-center gap-2 !bg-gray-100`}>
                <input type="text" className={`w-full p-2`} placeholder={title} value={title} onChange={(e) => setTitle(e.target.value)} />
            </Card>

            <button
                className={`!bg-gray-100 !hover:bg-gray-200 !text-gray-900 !font-semibold !py-2 !px-4 !border !border-gray-400 !rounded-md !shadow`}
                onClick={handleSubmit}>
                Save
            </button>
            <button onClick={handleClose}>Cancel</button>
        </Transition>
    )
}
export default GeneratorInformation;