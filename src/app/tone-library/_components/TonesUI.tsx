'use client'

import Card from '@/components/UI/Card';
import React, { useState } from 'react';
import AddTone from './AddTone';
import { useRouter } from 'next/navigation';

type TonesUiProps = {
    tonesSource: any;
}

export default function TonesUi({ tonesSource }: TonesUiProps) {
    const router = useRouter();
    const [tones, setTones] = useState(tonesSource);
    const [newTone, setNewTone] = useState({
        title: '',
        examples: [],
        summary: '',
    });

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
                cache: 'no-store',
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
                'data': { _id },
            }
            console.log(payload)
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
        <section className='w-[90%] mx-auto flex flex-col gap-4 h-full flex-grow'>

            <AddTone handleAddTone={handleAddNewTone} />

            {!!tones && (
                <div className="flex-grow grid grid-col-1 md:grid-cols-2 gap-8 auto-rows-min inset-0 bg-[radial-gradient(#e2e2e2_1px,transparent_1px)] [background-size:13px_13px] py-[5%] px-[2.5%]">

                    {!!tones.length && tones.map((tone: any, index: number) => (
                        <Card key={index} className='flex flex-col gap-4 prose'>
                            <div className='flex items-center justify-start gap-4 text-sm'>
                                <h2 className="mt-0 mb-0 capitalize">{tone.title || 'Default Title'}</h2>
                            </div>

                            {/* Tone processed information */}
                            {!!tone.keywords && !!tone.description ? (
                                <div className="flex flex-col gap-4">

                                    {/* Tone words */}
                                    {
                                        tone.keywords ? (
                                            <div className="flex flex-wrap gap-2 w-full">
                                                {tone.keywords.map((word: any, index: number) => (
                                                    <div key={index} className="bg-gray-200 text-gray-500 px-4 rounded-full">
                                                        {word}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : null
                                    }

                                    {/* Tone description */}
                                    {
                                        tone.description ? (

                                            <p className="m-0">
                                                    {tone.description}
                                                </p>

                                        ) : null
                                    }

                                </div>
                            ) : null}

                            <div className="flex items-center justify-end gap-4 w-full">
                                <button className="border border-gray-700 text-gray-700 px-4 rounded-md" onClick={() => handleEditTone(tone._id)}>Edit</button>
                                <button className="text-red-500" onClick={() => handleDeleteTone(tone._id)}>Delete</button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </section>
    );
}
