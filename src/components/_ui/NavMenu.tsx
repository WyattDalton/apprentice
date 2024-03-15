'use client';

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
        <Link href="/threads" className="text-shade-500 hover:text-shade-700 flex gap-2 items-center py-3">
            <span>Threads</span>
        </Link>
    );
}

const SourcesNavItem = () => {
    return (
        <Link href="/sources" className="text-shade-500 hover:text-shade-700 flex gap-2 items-center py-3">
            <SourceIcon className={'w-6 h-6'} />
            <span>Sources</span>
        </Link>
    );
}

const StylesNavItem = () => {
    'use client';
    return (
        <Link href="/styles" className="text-shade-500 hover:text-shade-700 flex gap-2 items-center py-3">
            <StyleIcon className={'w-6 h-6'} />
            <span>Styles</span>
        </Link>
    );
}

const FormulasNavItem = () => {
    'use client';
    return (
        <Link href="/formulas" className="text-shade-500 hover:text-shade-700 flex gap-2 items-center py-3">
            <FormulaIcon className={'w-6 h-6'} />
            <span>Formulas</span>
        </Link>
    );
}

type NavMenuProps = {
    setViewOpen: any;
}
export default function NavMenu({ setViewOpen }: NavMenuProps) {
    'use client';
    return (
        <>
            <AppLogo />
            <ThreadsNavItem />
            <SourcesNavItem />
            <StylesNavItem />
            <FormulasNavItem />
        </>
    )
}