import Link from "next/link";

import { SparklesIcon } from '@heroicons/react/24/outline';
import { IoSchool } from "react-icons/io5";

export function GeneratorGrid() {
    return (
        <div className="grid grid-cols-2 gap-4 w-full max-w-[400px] mx-auto">

            <Link href="/sources" prefetch={true} className="w-full aspect-[3/2] bg-white rounded-md gap-2 flex flex-col justify-center items-center text-gray-700 text-center">
                <IoSchool className="w-6 h-6 text-gray" />
                <h2 className="font-bold">Add sources <span className="text-sm block text-gray-500 font-light">to your source library</span></h2>
            </Link>

            <Link href="/formulas" prefetch={true} className="w-full aspect-[3/2] bg-white rounded-md gap-2 flex flex-col justify-center items-center text-gray-700 text-center">
                <SparklesIcon className="w-6 h-6" />
                <h2 className="font-bold">Add formulas <span className="text-sm block text-gray-500 font-light">to your formula library</span></h2>
            </Link>

            {/* <Link href="/guides" prefetch={true} className="w-full aspect-[6/2] col-span-full bg-white rounded-md flex justify-center items-center">
                <h2>Get help</h2>
            </Link> */}
        </div>
    )
}