'use client'

import Card from '@/components/UI/Card';
import React, { useEffect, useMemo, useState } from 'react';
import AddTone from './_components/AddTone';
import { useRouter } from 'next/navigation';

export default function ToneOfVoiceLibrary() {
    const router = useRouter();
    const [tones, setTones] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newTone, setNewTone] = useState({
        title: '',
        examples: [],
        summary: '',
    });

    /* * * * * * * * ** * * * * * * *
    /* Get all tones on load
    /* * * * * * * * ** * * * * * * */
    const fetchTones = async () => {
        try {
            const res = await fetch('/api/tonesGetAll');
            if (!res.ok) throw new Error('Error fetching tones');
            const data = await res.json();
            setTones(data.tones);
        }
        catch (error) {
            console.log(error);
        }
    }

    useMemo(() => {
        fetchTones();
    }, []);

    /* * * * * * * * ** * * * * * * *
    /* Add a new tone
    /* * * * * * * * ** * * * * * * */
    const handleAddNewTone = async () => {
        try {
            const payload = {
                'dataType': 'create',
                'data': newTone
            }
            const res = await fetch('/api/tonesUpdate', {
                method: 'POST',
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error('Error creating tone of voice');
            const data = await res.json();
            router.push(`/tone-library/${data.tone}`);
        }
        catch (error) {
            console.log(error);
        }
    }

    /* * * * * * * * ** * * * * * * *
    /* Delete a tone
    /* * * * * * * * ** * * * * * * */
    const handleDeleteTone = async (_id: string) => {
        try {
            const payload = {
                'dataType': 'delete',
                'data': _id,
            }
            const res = await fetch('/api/tonesUpdate', {
                method: 'POST',
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error('Error deleting tone of voice');
            const data = await res.json();
            setTones(data.tones);
        }
        catch (error) {
            console.log(error);
        }
    }

    /* * * * * * * * ** * * * * * * *
    /* Edit a tone
    /* * * * * * * * ** * * * * * * */
    const handleEditTone = (_id: string) => {
        try {
            router.push(`/tone-library/${_id}`);
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
                <h1 className="text-2xl font-bold text-gray-700 mb-4">Tone of Voice Library</h1>
                <button onClick={() => { setShowForm(!showForm) }} className={`flex gap-1 transition-all ${!!showForm ? 'text-gray' : 'text-theme_primary'}`}>
                    {!!showForm ? 'Close' : 'Add Tone'}
                </button>
            </div>

            {!!showForm &&
                <AddTone handleAddTone={handleAddNewTone} />
            }

            {!!tones.length && (
                <div className="flex flex-col gap-4">
                    {/* Map through all tones and display */}
                    {tones.map((tone: any, index: number) => (
                        <Card key={index} className=''>
                            <div className='flex items-center gap-4'>
                                <h2 className="text-xl font-semibold text-gray-700 w-full">{tone.title || 'Default Title'}</h2>
                                <button
                                    className="group w-max font-semibold flex items-center rounded-md bg-theme_primary hover:bg-theme_primary-600 py-0 px-4 text-white !mt-0"
                                    onClick={() => handleEditTone(tone._id)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="flex items-center text-red-700 !mt-0"
                                    onClick={() => handleDeleteTone(tone._id)}
                                >
                                    Delete
                                </button>
                            </div>

                            {/* Tone processed information */}
                            {!!tone.keywords && !!tone.description ? (
                                <div className="grid grid-cols-5 gap-4">

                                    {/* Tone words */}
                                    {
                                        tone.keywords ? (
                                            <div className="flex flex-wrap gap-4 w-full col-span-1">
                                                {tone.keywords.map((word: any, index: number) => (
                                                    <div key={index} className="bg-theme_primary-700 text-white px-2 py-1 rounded-md">
                                                        {word}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : null
                                    }

                                    {/* Tone description */}
                                    {
                                        tone.description ? (
                                            <div className="col-span-4">
                                                <p className="text-gray-700">
                                                    {tone.description}
                                                </p>
                                            </div>
                                        ) : null
                                    }

                                </div>
                            ) : null}

                        </Card>
                    ))}
                </div>
            )}
        </section>



        // <div className="w-full p-4 bg-gray-100 rounded-lg shadow-sm">
        //     <div>
        //         <h2 className="text-xl font-semibold text-gray-700">
        //             {editingTone !== null ? 'Edit Tone' : 'Add New Tone'}
        //         </h2>
        //         <form className="mt-4" onSubmit={handleSubmitTone}>
        //             <label htmlFor="title" className="block font-semibold mb-2">
        //                 Title:
        //             </label>
        //             <input
        //                 type="text"
        //                 id="title"
        //                 name="title"
        //                 value={newTone.title}
        //                 onChange={handleInputChange}
        //                 className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        //             />

        //             {newTone.examples.map((example, index) => (
        //                 <div key={index} className="mb-6">
        //                     <label
        //                         htmlFor={`example-${index + 1}`}
        //                         className="block font-semibold mb-2"
        //                     >
        //                         Example {index + 1}:
        //                     </label>
        //                     <textarea
        //                         id={`example-${index + 1}`}
        //                         name={`example-${index + 1}`}
        //                         value={example}
        //                         onChange={(e) => handleEditExample(index, e.target.value)}
        //                         rows={10}
        //                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        //                     />
        //                     <button
        //                         type="button"
        //                         onClick={() => handleDeleteExample(index)}
        //                         className="text-red-500 bg-transparent focus:outline-none"
        //                     >
        //                         Delete Example
        //                     </button>
        //                 </div>
        //             ))}

        //             <div className="flex justify-between items-center gap-4 flex-wrap">
        //                 {newTone.examples.length < MAX_EXAMPLES && (
        //                     <button
        //                         type="button"
        //                         onClick={handleAddExample}
        //                         className="font-semibold text-theme_primary-700 focus:outline-none w-full p-4 mb-4 rounded-lg bg-transparent border border-theme_primary-700 hover:border-theme_primary-600 hover:text-theme_primary-600 shadow-sm"
        //                     >
        //                         <PlusIcon className="inline-block w-5 h-5 mr-2" />
        //                         {newTone.examples.length === 0
        //                             ? 'Add an Example'
        //                             : 'Add Another Example'}
        //                     </button>
        //                 )}
        //                 <button
        //                     type="button"
        //                     onClick={() => handleCancelEdit()}
        //                     className=" px-4 py-2 text-rose-700 border-2 border-rose-700 bg-transparent rounded-md focus:outline-none shadow-sm"
        //                 >
        //                     Cancel
        //                 </button>

        //                 <button
        //                     type="submit"
        //                     className=" px-4 py-2 text-white bg-theme_primary-700 rounded-md focus:outline-none shadow-sm hover:bg-theme_primary-600"
        //                 >
        //                     {editingTone !== null ? 'Save' : 'Generate Tone of Voice'}
        //                 </button>
        //             </div>
        //         </form>
        //     </div>


        //     <div>
        //         <h2 className="text-2xl font-bold text-gray-700 mb-4">
        //             Tone of Voice Library
        //         </h2>
        //         {!!tones && (
        //             <>

        //                 {!!tones && tones.length === 0 ? (
        //                     <p className="mt-4">No tones of voice available.</p>
        //                 ) : (
        //                     tones.map((tone: any, index: number) => (
        //                         <div key={index} className="mt-4">
        //                             <Card>
        //                                 <h3 className="text-lg font-semibold">{tone.title}</h3>
        //                                 <div className="font-xs">
        //                                     <p>{tone.summary}</p>
        //                                 </div>
        //                                 <button
        //                                     type="button"
        //                                     onClick={() => handleEditTone(index)}
        //                                     className="bg-transparent p-2 text-theme_primary-700 hover:text-theme_primary-600 hover:border-theme_primary-600 focus:outline-none"
        //                                 >
        //                                     Edit
        //                                 </button>
        //                                 <button
        //                                     type="button"
        //                                     onClick={() => handleDeleteTone(index)}
        //                                     className="bg-transparent p-2 text-rose-700 hover:text-rose-600 focus:outline-none ml-1"
        //                                 >
        //                                     Delete
        //                                 </button>
        //                             </Card>
        //                         </div>
        //                     ))
        //                 )}
        //             </>
        //         )}
        //         <button
        //             type="button"
        //             onClick={() => setShowForm(true)}
        //             className="mt-4 px-4 py-2 text-white bg-theme_primary-700 hover:bg-theme_primary-600 rounded-md focus:outline-none"
        //         >
        //             Add Tone
        //         </button>
        //     </div>
        // </div>
    );
}
