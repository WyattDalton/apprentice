'use client'

import { useEffect, useRef, useState } from 'react';
import { CloseIcon } from '@/components/_elements/icons';
import DeleteModal from './DeleteModal';

type SourceData = {
    _id: string,
    sourceData: any;
    deleteSource: any;
    updateSource: any;
    handleCloseViewModal: any;
}

function SingleSourceUi({ _id, sourceData, deleteSource, updateSource, handleCloseViewModal }: SourceData) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState("");

    const [title, setTitle] = useState(sourceData.title || "Default title");
    const [text, setText] = useState(sourceData.text || "");


    useEffect(() => {
        // Adjust textarea height to fit content
        if (textareaRef.current) {
            const field = textareaRef.current;
            field.style.height = "0px";
            const scrollHeight = field.scrollHeight;
            field.style.height = scrollHeight + "px";
        }
    }, [text]);

    const titleTimerRef = useRef<NodeJS.Timeout | undefined>();
    const handleChangeTitle = async (updated: any) => {
        try {

            setLoading(true);
            setProgress('Updating title...');
            setTitle(updated);

            const payload = {
                title: updated,
            };

            if (titleTimerRef.current) {
                clearTimeout(titleTimerRef.current);
            }

            titleTimerRef.current = setTimeout(async () => {
                console.log('updating title... ', payload);
                await updateSource(_id, payload)
                setProgress('');
                setLoading(false);
            }, 1000);

        } catch (err) {
            setProgress('Error updating title');
            console.log(err);
        }
    };

    const textTimerRef = useRef<NodeJS.Timeout | undefined>();
    const handleChangeText = async (updated: any) => {
        try {

            setLoading(true);
            setProgress('Updating source text...');
            setText(updated);

            const payload = {
                text: updated,
            };

            if (textTimerRef.current) {
                clearTimeout(textTimerRef.current);
            }

            textTimerRef.current = setTimeout(async () => {
                await updateSource(_id, payload)
                setProgress('');
                setLoading(false);
            }, 1000);

        } catch (err) {
            setProgress('Error updating source text');
            console.log(err);
        }
    }




    return (
        <>
            <section className="flex flex-col flex-grow p-4 overflow-y-scroll">
                <div className="w-full max-w-[800px] mx-auto bg-white rounded-lg p-4 flex flex-col flex-grow gap-4 shadow-lg relative z-10">

                    <button className="ml-auto flex justify-center items-center gap-2 border border-gray-500 px-2 rounded-md" onClick={() => handleCloseViewModal()}>Close <CloseIcon className="w-4 h-4" /></button>

                    <div className="flex gap-4 justify-between items-center p-4">
                        <span className='flex-grow'>
                            <input
                                className="text-gray-800 text-2xl font-bold p-2 bg-transparent border-b border-b-gray-800 border-dashed truncate w-full flex-grow"
                                type="text"
                                value={title === 'Default title' ? '' : title}
                                placeholder="Click here to edit the title"
                                onChange={(e) => handleChangeTitle(e.target.value)}
                            />
                        </span>
                        <DeleteModal title={title} _id={_id} deleteSource={deleteSource} handleCloseViewModal={handleCloseViewModal} />
                    </div>

                    <textarea
                        ref={textareaRef}
                        className="w-full text-gray-800 bg-neutral-50 text-lg p-4 border-b border-gray-800 border-dashed resize-none transition-all duration-300 ease-in-out focus:border-gray-300 focus:ring-0 overflow-hidden"
                        placeholder="Content"
                        value={text}
                        onChange={(e) => handleChangeText(e.target.value)}
                    />

                    {!!loading ? (
                        <div className="sticky bottom-4 w-full max-w-max bg-white mx-auto rounded-lg flex flex-col justify-between items-center gap-4 p-4 shadow-lg z-30">
                            <span className="w-full text-center text-gray-500">{progress}</span>
                        </div>
                    ) : ''}

                </div>
            </section>
        </>
    )

}

export default SingleSourceUi