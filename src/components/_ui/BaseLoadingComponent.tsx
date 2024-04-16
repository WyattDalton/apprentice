"use client"

import { Transition } from "@headlessui/react";
import { usePathname, useRouter } from "next/navigation";
import GeneratorSkeleton from "@/components/_skeletons/GeneratorSkeleton";

export default function BaseLoadingComponent() {
    const router = useRouter();
    const path = usePathname();

    if (path === "/") {
        return <GeneratorSkeleton />;
    } else {
        return (
            <Transition
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
                <div className="fixed w-screen h-screen top-0 left-0 z-0 bg-blue backdrop-blur-sm cursor-pointer"></div>
            </Transition>
        )
    }
}