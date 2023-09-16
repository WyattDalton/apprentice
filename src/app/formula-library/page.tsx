'use client'

import Card from '@/components/UI/Card';
import React, { useEffect, useState } from 'react';
import AddFormula from './_components/AddFormula';
import { useRouter } from 'next/navigation';
import { Transition } from '@headlessui/react';


export default function FormulaLibrary() {

    const router = useRouter();
    const [noFormulas, setNoFormulas] = useState(false);
    const [formulas, setFormulas] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newFormula, setNewFormula] = useState({
        title: '',
        instructions: [],
        formula: '',
    });

    /* * * * * * * * ** * * * * * * *
    /* Get all formulas on load
    /* * * * * * * * ** * * * * * * */
    const fetchFormulas = async () => {
        try {
            const payload = {
                'dataType': 'get',
                'data': { "_id": false },
            }
            const res = await fetch('/api/formulas', {
                method: 'POST',
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error('Error fetching formulas');
            const data = await res.json();
            setFormulas(data.formulas);
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        (async () => {
            await fetchFormulas();
            setNoFormulas(true);
        })()
    }, []);

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
                'data': _id,
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
            <div className="flex justify-between items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-700 mb-4">Formula Library</h1>
                <button onClick={() => { setShowForm(!showForm) }} className={`flex gap-1 transition-all ${!!showForm ? 'text-gray' : 'text-theme_primary'}`}>
                    {!!showForm ? 'Close' : 'Add Formula'}
                </button>
            </div>

            <Transition
                show={showForm}
                enter="transition ease-out duration-100 transform"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-75 transform"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
                appear={true}
                unmount={true}
            >
                <AddFormula handleAddFormula={handleAddNewFormula} type="add" />
            </Transition>

            <Transition
                show={noFormulas}
                enter="transition ease-out duration-100 transform"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-75 transform"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
                appear={true}
                unmount={true}
            >
                <AddFormula handleAddFormula={handleAddNewFormula} type="create" />
            </Transition>

            {!!formulas.length && (
                <div className="flex flex-col gap-4">
                    {formulas.map((formula: any, index: number) => (
                        <Card key={index} className=''>
                            <div className='flex items-center gap-4 max-w-[300px]'>
                                <h2 className="text-xl font-semibold text-gray-700 w-full">{formula.title || 'Default Title'}</h2>
                                <button
                                    className="group w-max font-semibold flex items-center rounded-md bg-theme_primary hover:bg-theme_primary-600 py-0 px-4 text-white !mt-0"
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
