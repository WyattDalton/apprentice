'use client';

import { Transition } from '@headlessui/react';
import { NavMenuIcon } from '../_elements/icons';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';


import Link from "next/link";
import Image from 'next/image'
import logo from '../_elements/makerdigital-logo-dark.png';
import { FormulaIcon, SourceIcon, StyleIcon } from "../_elements/icons";


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
    'use client';
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
            <StyleIcon className={'w-6 h-6'} />
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

    return (
        <>

            <div className='text-dark flex justify-between items-center py-2 px-4 flex-none py-4'>
                <Transition
                    show={!mainOpen}
                    as={"div"}
                    enter='transition-opacity duration-300'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='transition-opacity duration-300'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'
                >
                <button onClick={() => {
                    setMainOpen(true)
                }}>
                    <NavMenuIcon className={'w-6 h-6'} />
                </button>
                </Transition>
                {/* <div className='flex items-center gap-2 ml-auto'>
                    <NotificationIcon className={'w-6 h-6'} />
                    <UserIcon className={'w-6 h-6'} />
                </div> */}
            </div>

            <Transition
                show={mainOpen}
                as={"section"}
                className='fixed top-0 left-0 min-h-screen w-screen inset-0 overflow-y-auto z-50 backdrop-blur-sm'
                enter="ease-out duration-300 transform"
                enterFrom="opacity-0 -translate-x-4"
                enterTo="opacity-100 translate-x-0"
                leave="ease-in duration-200 transform"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 -translate-x-4"
                appear={true}
                unmount={true}
            >
                <div className='w-full h-full' onClick={(e) => setMainOpen(false)}></div>
            </Transition>

            <Transition
                show={mainOpen}
                as={"section"}
                className='fixed top-0 left-0 min-h-screen w-screen lg:max-w-[350px] inset-0 overflow-y-auto z-50 grid grid-cols-12 gap-4 p-4 pointer-events-none'
                enter="ease-out duration-300 transform"
                enterFrom="opacity-0 -translate-x-4"
                enterTo="opacity-100 translate-x-0"
                leave="ease-in duration-200 transform"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 -translate-x-4"
                appear={true}
                unmount={true}
            >
                <div className="w-full min-h-[calc(100%-2rem)] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-start shadow-xl transition-all col-span-12 pointer-events-auto">
                    <AppLogo />
                    <Link href="/threads" prefetch={true} onClick={() => setMainOpen(false)} className="text-shade-500 hover:text-shade-700 flex gap-2 items-center py-3">
                        <span>Threads</span>
                    </Link>
                    <Link href="/sources" prefetch={true} onClick={() => setMainOpen(false)} className="text-shade-500 hover:text-shade-700 flex gap-2 items-center py-3">
                        <span>Sources</span>
                    </Link>
                    <Link href="/styles" prefetch={true} onClick={() => setMainOpen(false)} className="text-shade-500 hover:text-shade-700 flex gap-2 items-center py-3">
                        <span>Styles</span>
                    </Link>
                    <Link href="/formulas" prefetch={true} onClick={() => setMainOpen(false)} className="text-shade-500 hover:text-shade-700 flex gap-2 items-center py-3">
                        <span>Formulas</span>
                    </Link>
                </div>
            </Transition>
        </>
    );
};

export default AppNavigation;
