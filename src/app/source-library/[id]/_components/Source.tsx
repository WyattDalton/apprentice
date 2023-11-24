'use client';

import React, { useEffect, useState } from 'react'
import Content from './Content';
import Sidebar from './Sidebar';

type Props = {
    _id: string;
    name: any;
    title: string;
    type: string;
    text: string;
    handleUpdate: any;
    updating: boolean;
};

function Source({ _id, name, title, type, text, handleUpdate, updating }: Props) {

    const [source, setSource] = useState({
        _id: _id || "",
        name: name || "",
        title: title || "",
        type: type || "",
        text: text || "",
    });

    useEffect(() => {
        setSource({ name, title, type, text, _id });
    }, [name, title, type, text, _id]);

    useEffect(() => {
        console.log(updating);
    }, [updating]);

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
                className={'col-span-4 flex flex-col items-center gap-4 bg-[radial-gradient(#e2e2e2_1px,transparent_1px)] [background-size:13px_13px] py-[5%] px-[2.5%]'}
                source={source}
                setSource={setSource} />

            <Sidebar
                className={'col-span-2 flex flex-col justify-end flex-grow p-4 gap-4 bg-neutral-50 rounded-lg'}
                handleUpdate={handleUpdate}
                source={source}
                type={type}
                name={name}
                updating={updating} />

        </section>
    )
}

export default Source