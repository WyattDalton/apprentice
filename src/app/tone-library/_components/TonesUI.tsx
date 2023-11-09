'use client'

import Card from '@/components/UI/Card';
import React, { useEffect, useState } from 'react';
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
    /* Get all tones on load
    /* * * * * * * * ** * * * * * * */
    const fetchTones = async () => {
        try {
            const res = await fetch('/api/tonesGetAll', {
                cache: 'no-store',
                next: { revalidate: 0 }
            });
            if (!res.ok) throw new Error('Error fetching tones');
            const data = await res.json();
            setTones(data.tones);
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
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

            <AddTone handleAddTone={handleAddNewTone} />

            {!!tones && (
                <div className="flex flex-col gap-4">
                    {!!tones.length && tones.map((tone: any, index: number) => (
                        <Card key={index} className=''>
                            <div className='flex items-center gap-4'>
                                <h2 className="text-xl font-semibold text-dark w-full">{tone.title || 'Default Title'}</h2>
                                <button
                                    className="group w-max font-semibold flex items-center rounded-md bg-theme_primary hover:bg-decoration py-0 px-4 dark !mt-0"
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
                                                    <div key={index} className="bg-secondary dark px-2 py-1 rounded-md">
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
                                                <p className="text-dark">
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
    );
}
