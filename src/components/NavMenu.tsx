'use client';

import Link from "next/link";
import Image from 'next/image'
import logo from './makerdigital-logo-dark.png';
import { Dialog, Disclosure, Transition } from "@headlessui/react";
import { NavMenuIcon } from "./icons";
import { Fragment, useState } from "react";

const AppLogo = () => {
    'use client'
    return (
        <h1>
            <span className="hidden">Apprentice by Maker Digital</span>
            <Link
                href="/"
            >
                <Image
                    className="cursor-pointer w-12 h-12 block"
                    src={logo}
                    alt="MakerDigital Logo"
                    width={180}
                    height={180}
                    priority
                />
            </Link>
        </h1>
    );
}


const ThreadsNavItem = () => {
    'use client';
    return (
        <Link href="/threads" className="text-gray-700 hover:text-gray-900">Threads</Link>
    );
}

const SourcesNavItem = () => {
    return (
        <Link href="/sources" className="text-gray-700 hover:text-gray-900">Sources</Link>
    );
}

const StylesNavItem = () => {
    'use client';
    return (
        <Link href="/styles" className="text-gray-700 hover:text-gray-900">Styles</Link>
    );
}

const FormulasNavItem = () => {
    'use client';
    return (
        <Link href="/formulas" className="text-gray-700 hover:text-gray-900">Formulas</Link>
    );
}

export default function NavMenu() {
    'use client';
    const [mainOpen, setMainOpen] = useState<any>(false);
    const [threadsOpen, setThreadsOpen] = useState<any>(false);

    const handleOpenThreadsItem = () => {
        setThreadsOpen(true);
        setMainOpen(false);
    }
    const handleCloseThreadsItem = () => {
        setThreadsOpen(false);
        setMainOpen(true);
    }
    return (
        <>
            <button onClick={() => setMainOpen(true)}>
                <NavMenuIcon className={'w-6 h-6'} />
            </button>

            <Transition appear show={mainOpen} as={Fragment}>
                <Dialog as="div" className="relative z-40" onClose={() => setMainOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25" />
                    </Transition.Child>

                    <div className="fixed min-h-screen inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300 transform"
                                enterFrom="opacity-0 translate-x-[-50%] skew-x-6"
                                enterTo="opacity-100 translate-x-0 skew-x-0"
                                leave="ease-in duration-200 transform"
                                leaveFrom="opacity-100 translate-x-0 skew-x-0"
                                leaveTo="opacity-0 translate-x-[-50%] -skew-x-6"
                            >
                                <Dialog.Panel className="w-full max-w-md min-h-[calc(100vh-2rem)] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <AppLogo />
                                    <ThreadsNavItem />
                                    <SourcesNavItem />
                                    <StylesNavItem />
                                    <FormulasNavItem />
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}