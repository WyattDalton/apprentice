'use client'

import Card from '@/components/UI/Card';
import React, { useEffect, useState } from 'react';
import AddFormula from './AddFormula';
import { useRouter } from 'next/navigation';
import { Transition } from '@headlessui/react';

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
        <section>
            <AddFormula handleAddFormula={handleAddNewFormula} type="create" />

            {!!formulas.length && (
                <div className="flex flex-col gap-4">
                    {formulas.map((formula: any, index: number) => (
                        <Card key={index} className=''>
                            <div className='flex items-center gap-4 max-w-[300px]'>
                                <h2 className="text-xl font-semibold text-gray-700 w-full">{formula.title || 'Default Title'}</h2>
                                <button
                                    className="group w-max font-semibold flex items-center rounded-md bg-decoration hover:bg-primary py-0 px-4 dark !mt-0"
                                    onClick={() => handleEditFormula(formula._id)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="flex items-center text-red-700 !mt-0"
                                    onClick={() => handleDeleteFormula(formula._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </section>
    );
}
