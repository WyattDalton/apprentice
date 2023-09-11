import React from 'react';
import Link from 'next/link';
import { UilPen, UilSitemap, UilBookmark, UilFlaskPotion, UilMegaphone, UilFileBookmarkAlt, UilWindowGrid, UilSetting } from '@iconscout/react-unicons';

const AppNavigation = () => {

    return (
        <nav className='sticky top-4 left-4 !text-white bg-theme_gray-300 rounded-md'>
            <h1 className="text-2xl font-bold py-4 px-4 mb-4 border-b border-gray-200">
                <Link
                    href="/"
                    className="font-bold"
                >
                    Apprentice
                </Link>
            </h1>
            <ul className="flex flex-col gap-2 p-2 pb-4 mb-4 border-b border-gray-200">
                <li>
                    <Link
                        href="/generate"
                        className={`w-full flex gap-2 font-bold py-2 px-4 rounded-md hover:text-highlight`}>
                        <UilPen /> Generator
                    </Link>
                </li>
                {/* <li>
                    <Link
                        href="/campaigns"
                        className={`w-full flex gap-2 font-bold py-2 px-4 rounded-md hover:text-highlight`}><UilSitemap /> Campaigns</Link>
                </li> */}
                <li>
                    <Link
                        href="/formula-library"
                        className={`w-full flex gap-2 font-bold py-2 px-4 rounded-md hover:text-highlight`}><UilFlaskPotion /> Formulas</Link>
                </li>
                <li>
                    <Link
                        href="/tone-library"
                        className={`w-full flex gap-2 font-bold py-2 px-4 rounded-md hover:text-highlight`}><UilMegaphone /> Tones</Link>
                </li>
                <li>
                    <Link
                        href="/source-library"
                        className={`w-full flex gap-2 font-bold py-2 px-4 rounded-md hover:text-highlight`}><UilFileBookmarkAlt /> Sources</Link>
                </li>
                {/* <li>
                    <Link
                        href="/layout-Library"
                        className={`w-full flex gap-2 font-bold py-2 px-4 rounded-md hover:text-highlight`}><UilWindowGrid /> Layouts</Link>
                </li> */}
            </ul>
            <div className='flex flex-col gap-2 p-2'>
                <Link
                    href="/settings"
                    className={`w-full flex gap-2 font-bold py-2 px-4 rounded-md hover:text-highlight`}
                >
                    <UilSetting /> Settings
                </Link>
            </div>
        </nav>
    );
};

export default AppNavigation;
