'use client';

import { Transition } from '@headlessui/react';
import { GeneratorArrowIcon, NavMenuIcon } from '../_elements/icons';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';


import Link from "next/link";
import Image from 'next/image'
import logo from '../_elements/makerdigital-logo-dark.png';
import { FormulaIcon, SourceIcon, StyleIcon } from "../_elements/icons";
import { IoSchool } from 'react-icons/io5';
import { MegaphoneIcon, SparklesIcon } from '@heroicons/react/24/outline';

type AppNavigationProps = {
    views: React.ReactNode;
};
const AppNavigation = ({ views }: AppNavigationProps) => {
    const router = useRouter();
    const [mainOpen, setMainOpen] = useState<any>(false);
    const [openPanel, setOpenPanel] = useState<any>('');

    const currentPath = usePathname();

    const handleNavHome = () => {
        setMainOpen(false);
        router.push('/');
    }

    return (
        <>

            <div className='text-dark flex justify-between items-center py-2 px-4 flex-none py-4 min-h-max'>
                {/* <Transition
                    show={!mainOpen}
                    as={"div"}
                    enter='transition-opacity duration-300'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='transition-opacity duration-300'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'
                    unmount={false}
                    appear={false}
                > */}
                <button
                    className={`flex items-center gap-2 text-dark hover:text-shade-500 bg-white rounded-full py-2 px-4 border-gray-700 border ${!!mainOpen ? 'opacity-0' : 'opacity-100'}`}
                    onClick={() => { setMainOpen(true) }}
                >
                    <NavMenuIcon className={'w-4 h-4'} /> Menu
                </button>
                {/* </Transition> */}
            </div>

            <Transition
                show={mainOpen}
                as={"section"}
                enter="ease-out duration-300 transform"
                enterFrom="opacity-0 -translate-x-4"
                enterTo="opacity-100 translate-x-0"
                leave="ease-in duration-200 transform"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 -translate-x-4"
                appear={true}
                unmount={true}
            >
                <div className='block fixed w-screen h-screen top-0 left-0 bg-white bg-opacity-20 backdrop-blur-sm cursor-pointer z-50' onClick={(e) => setMainOpen(false)}></div>
            </Transition>

            <Transition
                show={mainOpen}
                as={"section"}
                className='fixed top-4 left-4 flex flex-col p-4 bg-white bg-opacity-50 backdrop-blur-sm rounded-lg w-full max-w-max max-h-screen overflow-y-scroll z-50'
                enter="ease-out duration-300 transform"
                enterFrom="opacity-0 -translate-x-4"
                enterTo="opacity-100 translate-x-0"
                leave="ease-in duration-200 transform"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 -translate-x-4"
                appear={true}
                unmount={true}
            >
                <div className="transform rounded-lg bg-white p-6 text-left align-start shadow-lg flex flex-col gap-4 text-center">
                    <h1>
                        <span className="hidden">Apprentice by Maker Digital</span>
                        <button
                            onClick={handleNavHome}
                        >
                            <Image
                                className="cursor-pointer w-full max-w-[75px] aspect-square block mx-auto"
                                src={logo}
                                alt="MakerDigital Logo"
                                width={100}
                                height={100}
                                priority
                            />
                        </button>
                    </h1>
                    <Link
                        href="/threads"
                        prefetch={true}
                        onClick={() => setMainOpen(false)}
                        className={`flex items-center gap-2 ${currentPath === "/threads" ? "text-primary-700 border border-primary-700 font-semibold" : "text-shade hover:text-shade-500"} bg-white rounded-full py-2 px-4`}
                    >
                        <GeneratorArrowIcon className="w-5 h-5" />
                        <span>Threads</span>
                    </Link>
                    <Link
                        href="/sources"
                        prefetch={true}
                        onClick={() => setMainOpen(false)}
                        className={`flex items-center gap-2 ${currentPath === "/sources" ? "text-primary-700 border border-primary-700 font-semibold" : "text-shade hover:text-shade-500"} bg-white rounded-full py-2 px-4`}>
                        <IoSchool className="w-5 h-5 text-gray" />
                        <span>Sources</span>
                    </Link>
                    <Link
                        href="/styles"
                        prefetch={true}
                        onClick={() => setMainOpen(false)}
                        className={`flex items-center gap-2 ${currentPath === "/styles" ? "text-primary-700 border border-primary-700 font-semibold" : "text-shade hover:text-shade-500"} bg-white rounded-full py-2 px-4`}
                    >
                        <MegaphoneIcon className="w-5 h-5" />
                        <span>Styles</span>
                    </Link>
                    <Link
                        href="/formulas"
                        prefetch={true}
                        onClick={() => setMainOpen(false)}
                        className={`flex items-center gap-2 ${currentPath === "/formulas" ? "text-primary-700 border border-primary-700 font-semibold" : "text-shade hover:text-shade-500"} bg-white rounded-full py-2 px-4`}
                    >
                        <SparklesIcon className="w-5 h-5" />
                        <span>Formulas</span>
                    </Link>
                </div>
            </Transition>
        </>
    );
};

export default AppNavigation;
