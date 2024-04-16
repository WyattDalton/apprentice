"use client"

import { Transition } from "@headlessui/react"
import { useRouter } from "next/navigation"
import FormulaSingleUi from "./FormulaSingleUi"

type ModalProps = {
    titleData: any,
    instructionsData: any,
    formulaData: any,
    _id: any,
    deleteFormula: any,
    updateFormula: any,
    thinkAboutData: any,
    outlineData: any
}

export default function Modal({ titleData, instructionsData, formulaData, _id, deleteFormula, updateFormula, thinkAboutData, outlineData
}: ModalProps) {

    const router = useRouter()

    const handleCloseViewModal = () => {
        router.back();
    }

    return (
        <>
            <div className="fixed block w-screen h-screen top-0 left-0 z-10 backdrop-blur-sm cursor-pointer" onClick={() => handleCloseViewModal()}></div>
            <Transition
                className={'z-50 fixed left-0 top-0 h-screen w-full max-w-[800px] overflow-y-scroll'}
                as={'div'}
                appear={true}
                show={true}
                enter="transition ease-out duration-200 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in duration-150 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
            >
                <FormulaSingleUi
                    titleData={titleData}
                    instructionsData={instructionsData}
                    formulaData={formulaData}
                    _id={_id}
                    deleteFormula={deleteFormula}
                    updateFormula={updateFormula}
                    thinkAboutData={thinkAboutData}
                    outlineData={outlineData}
                />
            </Transition>
        </>

    )
}