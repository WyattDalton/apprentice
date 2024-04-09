'use client'

import createFormula from '@/app/_actions/_formulas/createFormula';
import { PlusIcon } from '@/components/_elements/icons';
import { useRouter } from 'next/navigation'


export default async function AddFormula() {
    const router = useRouter();

    const handleAddFormula = async () => {
        const rawNewFormula = {
            title: '',
            instructions: [],
            formula: '',
        }
        const newFormula = await createFormula(rawNewFormula);
        if (newFormula.success) {
            router.push(`/formulas/${newFormula.formula}`);
        }
    }

    return (
        <button onClick={(e) => handleAddFormula()} className="px-4 py-1 text-gray-700 border border-gray-700 rounded-full flex gap-2 justify-center items-center"><PlusIcon className={'w-4 h-4 text-gray-700'} /> Add</button>
    );
}