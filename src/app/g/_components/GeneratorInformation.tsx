'use client';

import { useEffect, useState } from "react";
import Card from "@/components/UI/Card";
import TextareaAutosize from "@/app/tone-library/[id]/_components/TextAreaAutosize";
import LoadingText from "@/components/LoadingText";

type GeneratorInformationProps = {
    className: string | '',
    placeholder: string | '',
    setMeta: any,
    meta: any,
    _id: string,
    updateThread: any
};

const GeneratorInformation = ({
    className,
    placeholder,
    setMeta,
    meta,
    _id,
    updateThread
}: GeneratorInformationProps) => {

    const [title, setTitle] = useState(meta.title || '');
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        setTitle(meta.title);
    }, [meta])

    const updateMeta = async () => {

        // ### Check if updating
        if (!!updating) return;

        // ### Set updating
        setUpdating(true);

        // ### Prep payload to update
        const payload = {
            _id: _id,
            update: {
                title: title
            }
        }

        // ### Update Thread
        const update = await updateThread(payload);
        const thread = update.thread;

        // ### Prep meta to update
        const newTitle = !!thread.title ? thread.title : false;

        // ### Update Meta
        const newMeta = {} as any;
        const oldMeta = { ...meta };

        !!newTitle ? newMeta['title'] = newTitle : null;
        setMeta({ ...oldMeta, ...newMeta });

        // ### Set updating
        setUpdating(false);

    }

    /* * * * * * * * * * * * * * * * * * * */
    /* Render Generator Information
    /* * * * * * * * * * * * * * * * * * * */
    return (
        <div className="flex flex-col gap-4">
            <div>
                <div className={`text-sm text-gray-400`}>Title</div>
                <Card className={`!shadow-md !mb-0 !p-0 w-full overflow-hidden flex justify-start items-center gap-2  ${className}`}>
                    <TextareaAutosize className={`w-full p-2`} value={title} onChange={(e: any) => setTitle(e.target.value)} placeholder={placeholder} />
                </Card>
            </div>

            <button
                onClick={() => updateMeta()}
                className="bg-transparent text-white border border-white rounded-md py-2 px-6 w-full">
                {!updating ? 'Update' : <LoadingText text={"Loading..."} className={"text-white"} iconClassName={""} />}
            </button>
        </div>
    )
}
export default GeneratorInformation;