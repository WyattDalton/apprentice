'use client';

import { useEffect, useRef, useState } from "react";

type Props = {
    className?: string;
    source: any;
    setSource: any;
};

function Content({ className, source, setSource }: Props) {

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const { title, text } = source;

    useEffect(() => {
        // Adjust textarea height to fit content
        if (textareaRef.current) {
            const field = textareaRef.current;
            field.style.height = "0px";
            const scrollHeight = field.scrollHeight;
            field.style.height = scrollHeight + "px";
        }
    }, [source.text]);

    return (
        <div className={className}>
            <form className="flex-grow-1 flex flex-col gap-4 prose">
                <input
                    className="px-2 py-1 bg-white text-2xl font-bold rounded-md"
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => {
                        setSource({ ...source, title: e.target.value });
                    }}
                />
                <textarea
                    ref={textareaRef}
                    className="px-2 py-1 bg-white flex-grow-1 rounded-md resize-none"
                    placeholder="Content"
                    value={text}
                    onChange={(e) => {
                        setSource({ ...source, text: e.target.value });

                        // Adjust textarea height to fit content
                        if (textareaRef.current) {
                            const field = textareaRef.current;
                            field.style.height = "0px";
                            const scrollHeight = field.scrollHeight;
                            field.style.height = scrollHeight + "px";
                        }
                    }}
                />
            </form>
        </div>
    );
}

export default Content;
