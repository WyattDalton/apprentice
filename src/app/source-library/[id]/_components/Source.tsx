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
    updating: any;
    handleOpenModal?: any;
};

function Source({ _id, name, title, type, text, handleUpdate, updating, handleOpenModal }: Props) {

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
                className={'col-span-6 lg:col-span-4 flex flex-col items-center gap-4 bg-[radial-gradient(#e2e2e2_1px,transparent_1px)] [background-size:13px_13px] py-[5%] px-[2.5%]'}
                source={source}
                setSource={setSource} />

            <Sidebar
                className={'col-span-6 md:col-span-2 gap-4 rounded-lg sticky bottom-0 lg:flex lg:flex-col lg:justify-end lg:flex-grow p-0 lg:p-4 bg-transparent lg:bg-neutral-50'}
                handleUpdate={handleUpdate}
                source={source}
                type={type}
                name={name}
                updating={updating}
                handleOpenModal={handleOpenModal}
            />
        </section>
    )
}

export default Source