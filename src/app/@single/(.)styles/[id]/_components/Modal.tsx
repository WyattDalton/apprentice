"use client"

import { Transition } from "@headlessui/react"
import SingleViewStyleUi from "./SingleViewStyleUi"
import { useState } from "react"
import { useRouter } from "next/navigation"

type ModalProps = {
    params: any,
    data: any,
    deleteStyle: any,
    updateStyle: any,
    getEmbedding: any,
    getInstructions: any,
    generateBlueprint: any,
    generateSample: any,
    generateComparison: any
}

export default function Modal({ params, data, deleteStyle, updateStyle, getEmbedding, getInstructions, generateBlueprint, generateSample, generateComparison }: ModalProps) {

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
                <SingleViewStyleUi
                    // Style data
                    id={params.id}
                    titleData={data.title || ''}
                    examplesData={data.examples || []}
                    descriptionData={data.description || ''}
                    keywordsData={data.keywords || []}
                    bluePrintData={data.bluePrint || []}
                    sampleData={data.sample || ''}
                    iterationData={data.iteration || []}

                    // CRUD functions
                    deleteStyle={deleteStyle}
                    updateStyle={updateStyle}

                    // Processing functions
                    getEmbedding={getEmbedding}
                    getInstructions={getInstructions}
                    generateBlueprint={generateBlueprint}
                    generateSample={generateSample}
                    generateComparison={generateComparison}

                    // Modal function
                    handleCloseViewModal={handleCloseViewModal}
                />
            </Transition>
        </>

    )
}