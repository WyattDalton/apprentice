"use client"

import { Transition } from "@headlessui/react"
import { useRouter } from "next/navigation"
import SingleSourceUi from "./SingleSourceUi"

type SourceData = {
    _id: string,
    sourceData: any;
    deleteSource: any;
    updateSource: any;
}

export default function Modal({ _id, sourceData, deleteSource, updateSource }: SourceData) {

    const router = useRouter()

    const handleCloseViewModal = () => {
        router.back();
    }

    return (
        <>
            <div className="fixed block w-screen h-screen top-0 left-0 z-10 backdrop-blur-sm cursor-pointer" onClick={() => handleCloseViewModal()}></div>
            <Transition
                className={'z-50 fixed flex flex-col left-0 top-0 min-h-screen w-full max-w-[800px] overflow-y-scroll'}
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
                <SingleSourceUi
                    _id={_id}
                    sourceData={sourceData}
                    deleteSource={deleteSource}
                    updateSource={updateSource}
                    handleCloseViewModal={handleCloseViewModal}
                />
            </Transition>
        </>

    )
}