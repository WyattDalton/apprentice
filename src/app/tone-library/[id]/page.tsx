'use client';

import LoadingSpinner from "@/components/LoadingSpinner";
import Card from "@/components/UI/Card";
import { useMemo, useState } from "react";



function Page({ params }: { params: { id: string } }) {
    const [title, setTitle] = useState('');
    const [examples, setExamples] = useState([]);
    const [newExample, setNewExample] = useState('');
    const [description, setDescription] = useState('');
    const [keywords, setKeyords] = useState([]);
    const [instructions, setInstructions] = useState('');
    const [displayAddExample, setDisplayAddExample] = useState(false);
    const [loading, setLoading] = useState(false);

    let baseUrl = '' as any;
    if (typeof window !== 'undefined') {
        baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000' : window.location.hostname;
    }

    /* * * * * * * * * * * * * * * * *
    /* Get the tone data
    /* * * * * * * * * * * * * * * * */
    const getToneData = async () => {
        try {
            // get hostname
            const tone = await fetch(`${baseUrl}/api/tonesGetSingle`, {
                method: 'POST',
                body: JSON.stringify({ id: params.id }),
                cache: 'no-store',
            });
            if (!tone.ok) throw new Error('Error getting tone of voice');
            const toneData = await tone.json();
            if (!!toneData.tone.title) setTitle(toneData.tone.title);
            if (!!toneData.tone.examples) setExamples(toneData.tone.examples);
            if (!!toneData.tone.description) setDescription(toneData.tone.description);
            if (!!toneData.tone.keywords) setKeyords(toneData.tone.keywords);
            if (!!toneData.tone.instructions) setInstructions(toneData.tone.instructions);

        } catch (error) {
            console.log(error);
        }
    }
    useMemo(() => {
        getToneData();
    }, []);


    /* * * * * * * * * * * * * * * * *
    /* Update the tone
    /* * * * * * * * * * * * * * * * */
    const handleUpdateTone = async () => {
        try {
            setLoading(true);
            const payload = {
                'dataType': 'update',
                'data': { _id: params.id, update: { title: title, examples: examples, description: description, keywords: keywords, instructions: instructions } },
            }
            const res = await fetch(`${baseUrl}/api/tonesUpdate`, {
                method: 'POST',
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error('Error updating tone of voice');
            setLoading(false);

        } catch (error) {
            console.log(error);
        }
    }

    /* * * * * * * * * * * * * * * * *
    /* Delete the tone
    /* * * * * * * * * * * * * * * * */
    const handleDeleteTone = async () => {
        try {
            const payload = {
                'dataType': 'delete',
                'data': params.id,
            }
            const res = await fetch(`${baseUrl}/api/tonesUpdate`, {
                method: 'POST',
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error('Error deleting tone of voice');
        }
        catch (error) {
            console.log(error);
        }
    }

    /* * * * * * * * * * * * * * * * *
    /* Add an example
    /* * * * * * * * * * * * * * * * */
    const handleAddExample = (example: any) => {
        if (!example) return;
        const newExamples = [...examples] as any;
        newExamples.push({ "text": example });
        setNewExample('');
        setExamples(newExamples);
    }

    /* * * * * * * * * * * * * * * * * */
    /* Update an example
    /* * * * * * * * * * * * * * * * * */
    const handleUpdateExample = (index: number, example: any) => {
        if (!example) return;
        const newExamples = [...examples] as any;
        newExamples[index] = example;
        setExamples(newExamples);
    }

    /* * * * * * * * * * * * * * * * * */
    /* Delete an example
    /* * * * * * * * * * * * * * * * * */
    const handleDeleteExample = (index: number) => {
        const newExamples = [...examples];
        newExamples.splice(index, 1);
        setExamples(newExamples);
    }

    /* * * * * * * * * * * * * * * * * */
    /* Render
    /* * * * * * * * * * * * * * * * * */
    return (
        <section className="relative min-h-screen">
            <div className="grid grid-cols-5 w-full min-h-screen max-w-[90%] mx-auto bg-gray-200/50 rounded-t-3xl pt-4 px-4 gap-4">
                <div className="col-span-5 flex flex-col gap-4">
                    <Card className="!p-0">
                        <input type="text" className="w-full text-gray-500 text-2xl font-bold p-2" value={title} placeholder="Give the tone of voice a title" onChange={(e) => setTitle(e.target.value)} />
                    </Card>
                    <div className="flex flex-col gap-4">
                        {!!examples.length && (
                            <button className="bg-secondary text-dark py-1 px-2 rounded-md max-w-max ml-auto" onClick={() => setDisplayAddExample(!displayAddExample)}>{displayAddExample ? 'Close' : 'Add new example'}</button>
                        )}
                        {!examples.length && (
                            <form className="flex flex-col gap-2 p-4 bg-gray-200 border-4 border-gray-400/50 rounded-md border-dashed" onSubmit={(e) => { e.preventDefault(); handleAddExample(newExample); }}>
                                <h3 className="text-gray-500 text-lg font-bold">Add the first example</h3>
                                <textarea className="w-full text-gray-500 text-lg rounded-md resize-none p-2" value={newExample} onChange={(e) => { setNewExample(e.target.value) }} placeholder="Add an example" />
                                <button type="submit" className="ml-auto bg-secondary text-dark py-1 px-2 rounded-md max-w-max ml-auto">Add example</button>
                            </form>
                        )}
                        {
                            !!displayAddExample && !!examples.length && (
                                <form className="flex flex-col gap-4 p-4 border-4 border-gray-400/50 rounded-md border-dashed bg-gray-200" onSubmit={(e) => { e.preventDefault(); handleAddExample(newExample); }}>
                                    <textarea className="p-2 w-full text-gray-500 text-lg rounded-md resize-none" value={newExample} onChange={(e) => { setNewExample(e.target.value) }} placeholder="Add an example" />
                                    <button type="submit" className="ml-auto bg-secondary text-dark py-1 px-2 rounded-md max-w-max">Add example</button>
                                </form>
                            )
                        }
                        {!!examples.length && (
                            <div className="flex flex-col gap-4 bg-gray-200 p-4 rounded-md">
                                {
                                    examples.map((example: any, index: number) => (
                                        <>
                                            <Card key={index} className="flex flex-col gap-2">
                                                <h3 className="text-gray-500 text-lg font-bold">Example {index + 1}</h3>

                                                <textarea className="w-full text-gray-500 text-lg border-2 border-gray-100 rounded-md p-2 resize-none" value={example.text} onChange={(e) => handleUpdateExample(index, e.target.value)} placeholder="Add an example" />
                                                <div className="flex gap-2 ml-auto">
                                                    <button className="text-red-500" onClick={() => handleDeleteExample(index)}>Delete Example</button>
                                                </div>

                                            </Card>
                                        </>
                                    ))

                                }
                            </div>
                        )
                        }
                    </div>
                </div>
                {/* <Sidebar className={'col-span-2 flex flex-col gap-4'} category={category} tags={tags} keywords={keywords} /> */}
                <div className="sticky col-span-5 bottom-0 right-0 w-full max-w-[88%] max-h-max mx-auto mt-auto bg-white rounded-t-3xl flex gap-4 p-4 shadow-[0_-5px_15px_-15px_rgba(0,0,0,0.6)]">
                    <h3 className="mt-0 mb-0 mr-auto text-gray-500 text-2xl font-bold">{title}</h3>
                    <button className="flex gap-2 bg-secondary text-dark py-1 px-2 rounded-md max-w-max" onClick={handleUpdateTone}>Update {loading ? <LoadingSpinner /> : ''}</button>
                    <button className="text-red-500" onClick={handleDeleteTone}>Delete</button>
                </div>
            </div>

        </section>
    )
}


export default Page;