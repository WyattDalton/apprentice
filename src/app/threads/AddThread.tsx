"use client"
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@/components/_elements/icons";
import { Fragment, useState } from "react";
import AddSource from "../sources/_components/AddSource";
import { useRouter } from "next/navigation";

export default async function AddThread() {
    const router = useRouter();

    return (
        <button onClick={(e) => router.push('/g')} className="px-4 py-1 text-gray-700 border border-gray-700 rounded-full flex gap-2 justify-center items-center"><PlusIcon className={'w-4 h-4 text-gray-700'} /> Add</button>
    )
}