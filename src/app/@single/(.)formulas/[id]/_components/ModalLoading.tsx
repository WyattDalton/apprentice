"use client"

import { Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";

export default function ModalLoading() {

    const router = useRouter();

    const handleCloseModal = () => {
        router.back();
    }

    return (
        <Transition
            className={'z-50 fixed left-0 top-0 h-screen w-full max-w-[800px] overflow-y-scroll'}
            as={'div'}
            appear={true}
            show={true}
            enter="transition ease-out duration-200 opacity-0"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition ease-in duration-150 transform opacity-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div className="fixed w-screen h-screen top-0 left-0 z-0 bg-blue backdrop-blur-sm cursor-pointer" onClick={() => handleCloseModal()}></div>
        </Transition >
    )
}