'use client';

import { Dialog, Transition } from '@headlessui/react';
import { NavMenuIcon, NotificationIcon, UserIcon } from '../_elements/icons';
import { Fragment, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import Link from "next/link";
import Image from 'next/image'
import logo from '../_elements/makerdigital-logo-dark.png';
import { FormulaIcon, SourceIcon, ToneIcon } from "../_elements/icons";

const AppLogo = () => {
    'use client'
    return (
        <h1>
            <span className="hidden">Apprentice by Maker Digital</span>
            <Link
                href="/"
                prefetch={true} 
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
        <Link href="/threads" prefetch={true} className="text-shade-500 hover:text-shade-700 flex gap-2 items-center py-3">
            <span>Threads</span>
        </Link>
    );
}

const SourcesNavItem = () => {
    return (
        <Link href="/sources" prefetch={true} className="text-shade-500 hover:text-shade-700 flex gap-2 items-center py-3">
            <SourceIcon className={'w-6 h-6'} />
            <span>Sources</span>
        </Link>
    );
}

const StylesNavItem = () => {
    'use client';
    return (
        <Link href="/styles" prefetch={true} className="text-shade-500 hover:text-shade-700 flex gap-2 items-center py-3">
            <ToneIcon className={'w-6 h-6'} />
            <span>Styles</span>
        </Link>
    );
}

const FormulasNavItem = () => {
    'use client';
    return (
        <Link href="/formulas" prefetch={true} className="text-shade-500 hover:text-shade-700 flex gap-2 items-center py-3">
            <FormulaIcon className={'w-6 h-6'} />
            <span>Formulas</span>
        </Link>
    );
}

type AppNavigationProps = {
    views: React.ReactNode;
};
const AppNavigation = ({ views }: AppNavigationProps) => {
    const router = useRouter();
    const [mainOpen, setMainOpen] = useState<any>(false);
    const [openPanel, setOpenPanel] = useState<any>('');
    const [startingPath, setStartingPath] = useState<any>('/');

    const path = usePathname();

    useEffect(() => {
        console.log('path', path);
    }, [path]);

    return (
        <>
            <div className='text-dark flex justify-between items-center py-2 px-4 flex-none'>
                <button onClick={() => {
                    setMainOpen(true)
                    setStartingPath(path)
                }}>
                    <NavMenuIcon className={'w-6 h-6'} />
                </button>
                <div className='flex items-center gap-2 ml-auto'>
                    <NotificationIcon className={'w-6 h-6'} />
                    <UserIcon className={'w-6 h-6'} />
                </div>
            </div>

            <Transition
                show={mainOpen}
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0">
                <div className="fixed inset-0 bg-black bg-opacity-25 z-40 backdrop-blur-sm" onClick={() => {
                    setMainOpen(false)
                    router.replace(startingPath)
                }}></div>
            </Transition>

            <Transition
                show={mainOpen}
                as={"section"}
                className='fixed top-0 left-0 min-h-screen w-screen inset-0 overflow-y-auto z-50 grid grid-cols-12 gap-4 p-4 pointer-events-none'
                enter="ease-out duration-300 transform"
                enterFrom="opacity-0 -translate-x-4"
                enterTo="opacity-100 translate-x-0"
                leave="ease-in duration-200 transform"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 -translate-x-4"
                appear={true}
                unmount={true}
            >
                <div className="w-full min-h-[calc(100%-2rem)] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-start shadow-xl transition-all col-span-12 lg:col-span-3 pointer-events-auto">
                    <AppLogo />
                    <ThreadsNavItem />
                    <SourcesNavItem />
                    <StylesNavItem />
                    <FormulasNavItem />
                </div>
                <Transition
                    show={(path != '/' && !path.includes('/g/')) ? true : false}
                    className={'lg:col-span-9 col-span-12 flex flex-col gap-4 p-6 z-[60] rounded-2xl bg-white pointer-events-none'}
                    as="div"
                    enter="ease-out duration-300 transform"
                    enterFrom="opacity-0 translate-x-4"
                    enterTo="opacity-100 translate-x-0"
                    leave="ease-in duration-200 transform"
                    leaveFrom="opacity-100 translate-x-0"
                    leaveTo="opacity-0 translate-x-4"
                    appear={true}
                    unmount={true}
                >
                    <div className="pointer-events-auto">
                        {views}
                    </div>
                </Transition>
            </Transition>
        </>
    );
};

export default AppNavigation;
