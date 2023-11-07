'use client';

import React, { useEffect, useState } from 'react'
import Content from './Content';
import { IoFileTrayFullOutline } from 'react-icons/io5';

type Props = {
    _id: string;
    name: any;
    title: string;
    type: string;
    text: string;
    handleUpdate: any;
};

function Source({ _id, name, title, type, text, handleUpdate }: Props) {

    const [source, setSource] = useState({
        _id: "",
        name: "",
        title: "",
        type: "",
        text: "",
    });
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        setSource({ name, title, type, text, _id });
    }, [name, title, type, text, _id]);




    return (
        <section className="relative flex-grow h-full flex">
            <div className="flex-grow grid grid-cols-5 w-full min-h-full w-full max-w-[90%] mx-auto bg-gray-200/50 rounded-t-3xl px-4 pt-4 gap-4">
                <Content className={'col-span-5 flex flex-col'} source={source} setSource={setSource} />
                {/* <Sidebar className={'col-span-2 flex flex-col gap-4'} category={category} tags={tags} keywords={keywords} /> */}
                <div className="sticky col-span-5 bottom-0 right-0 w-full max-w-[88%] max-h-max mx-auto mt-auto bg-white rounded-t-3xl flex gap-4 p-4 shadow-[0_-5px_15px_-15px_rgba(0,0,0,0.6)]">
                    {type === 'file' ? <IoFileTrayFullOutline className="h-6 w-6" /> : ''}
                    <h3 className="mt-0 mb-0 mr-auto ">{name}</h3>
                    <button className="  bg-secondary text-dark py-1 px-2 rounded-md max-w-max" onClick={(e) => { handleUpdate(source) }}>Update</button>
                    <button className="  text-red-500">Delete</button>
                </div>
            </div>
        </section>
    )
}

export default Source