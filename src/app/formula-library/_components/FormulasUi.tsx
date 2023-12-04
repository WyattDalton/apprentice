'use client'

import Card from '@/components/UI/Card';
import React, { useEffect, useState } from 'react';
import AddFormula from './AddFormula';
import { useRouter } from 'next/navigation';

type FormulaLibraryProps = {
    formulasData: any
}

export default function FormulasUi({ formulasData }: FormulaLibraryProps) {

    const router = useRouter();
    const [formulas, setFormulas] = useState(formulasData || []);
    const [newFormula, setNewFormula] = useState({
        title: '',
        instructions: [],
        formula: '',
    });

    /* * * * * * * * ** * * * * * * *
    /* Add a new formula
    /* * * * * * * * ** * * * * * * */
    const handleAddNewFormula = async () => {
        try {
            const payload = {
                'dataType': 'create',
                'data': newFormula
            }
            const res = await fetch('/api/formulas', {
                method: 'POST',
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error('Error creating formula of voice');
            const data = await res.json();
            router.push(`/formula-library/${data.formula}`);
        }
        catch (error) {
            console.log(error);
        }
    }

    /* * * * * * * * ** * * * * * * *
    /* Delete a formula
    /* * * * * * * * ** * * * * * * */
    const handleDeleteFormula = async (_id: string) => {
        try {
            const payload = {
                'dataType': 'delete',
                'data': { _id: _id },
            }
            const res = await fetch('/api/formulas', {
                method: 'POST',
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error('Error deleting formula of voice');
            const data = await res.json();
            setFormulas(data.formulas);
        }
        catch (error) {
            console.log(error);
        }
    }

    /* * * * * * * * ** * * * * * * *
    /* Edit a formula
    /* * * * * * * * ** * * * * * * */
    const handleEditFormula = (_id: string) => {
        try {
            router.push(`/formula-library/${_id}`);
        } catch (error) {
            console.log(error);
        }
    }

    /* * * * * * * * ** * * * * * * *
    /* Render
    /* * * * * * * * ** * * * * * * */
    return (
        <section className='w-[90%] mx-auto flex flex-col gap-4 h-full flex-grow'>
            <AddFormula handleAddFormula={handleAddNewFormula} type="create" />

            {!!formulas.length && (
                <div className="flex-grow grid grid-col-1 md:grid-cols-2 gap-8 auto-rows-min inset-0 bg-[radial-gradient(#e2e2e2_1px,transparent_1px)] [background-size:13px_13px] py-[5%] px-[2.5%]">
                    {formulas.map((formula: any, index: number) => (
                        <Card key={index} className='flex flex-col gap-4 prose'>

                            <div className='flex items-center justify-start gap-4 text-sm'>
                                <h2 className="mt-0 mb-0 capitalize">{formula.title || 'Default Title'}</h2>
                            </div>

                            {!!formula.instructions.length && (
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-2 divide-y divide-gray-200">
                                        {formula.instructions.map((instruction: any, index: number) => (
                                            <div className="flex gap-2 justify-start items-start pt-4" key={index}><span className='bg-gray-700 aspect-square w-8 p-0 flex justify-center items-center text-white rounded-md'>{(index + 1)}</span>{instruction.title}</div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-4 w-full">
                                <button className="border border-gray-700 text-gray-700 px-4 rounded-md" onClick={() => handleEditFormula(formula._id)}>Edit</button>
                                <button className="text-red-500" onClick={() => handleDeleteFormula(formula._id)} >Delete</button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </section>
    );
}
