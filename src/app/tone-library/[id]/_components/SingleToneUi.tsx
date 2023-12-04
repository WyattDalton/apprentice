'use client';

import { useState } from "react";
import Content from "./Content";
import Sidebar from "./Sidebar";

type UiProps = {
    titleData: any,
    examplesData: any,
    descriptionData: any,
    keywordsData: any,
    instructionsData: any,
    id: any,
}

function SingleToneUi({ titleData, examplesData, descriptionData, keywordsData, instructionsData, id }: UiProps) {

    const [title, setTitle] = useState(titleData || '');
    const [examples, setExamples] = useState(examplesData || []);
    const [description, setDescription] = useState(descriptionData || '');
    const [keywords, setKeywords] = useState(keywordsData || []);
    const [instructions, setInstructions] = useState(instructionsData || '');

    const [newExample, setNewExample] = useState('');
    const [displayAddExample, setDisplayAddExample] = useState(false);
    const [loading, setLoading] = useState<any>(false);

    /* * * * * * * * * * * * * * * * *
        /* Update the tone
        /* * * * * * * * * * * * * * * * */
    const handleUpdateTone = async () => {
        try {
            setLoading(true);
            const payload = {
                'dataType': 'update',
                'data': { _id: id, update: { title: title, examples: examples, description: description, keywords: keywords, instructions: instructions } },
            }
            const res = await fetch(`/api/tonesUpdate`, {
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
                'data': id,
            }
            const res = await fetch(`/api/tonesUpdate`, {
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
        <section className="
            relative 
            flex-grow 
            h-full 
            grid 
            grid-cols-6
            w-[90%] 
            mx-auto
            gap-4 
        ">
            <Content
                className="col-span-6 lg:col-span-4 flex flex-col items-center gap-4 bg-[radial-gradient(#e2e2e2_1px,transparent_1px)] [background-size:13px_13px] py-[5%] px-[2.5%]"
                title={title}
                setTitle={setTitle}
                examples={examples}
                setExamples={setExamples}
                newExample={newExample}
                setNewExample={setNewExample}
                displayAddExample={displayAddExample}
                setDisplayAddExample={setDisplayAddExample}
                handleAddExample={handleAddExample}
                handleUpdateExample={handleUpdateExample}
                handleDeleteExample={handleDeleteExample}
            // description={description} 
            // setDescription={setDescription} 
            // keywords={keywords} 
            // setKeyords={setKeyords} 
            // instructions={instructions} 
            // setInstructions={setInstructions}
            />
            {/* <Sidebar className={'col-span-2 flex flex-col gap-4'} category={category} tags={tags} keywords={keywords} /> */}
            <Sidebar
                className={'col-span-6 md:col-span-2 gap-4 rounded-lg sticky bottom-0 lg:flex lg:flex-col lg:justify-end lg:flex-grow p-0 lg:p-4 bg-transparent lg:bg-neutral-50'}
                description={description}
                setDescription={setDescription}
                keywords={keywords}
                setKeywords={setKeywords}
                instructions={instructions}
                setInstructions={setInstructions}
                title={title}
                handleUpdateTone={handleUpdateTone}
                handleDeleteTone={handleDeleteTone}
                loading={loading} />

        </section>
    )
}

export default SingleToneUi;