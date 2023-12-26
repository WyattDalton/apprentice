'use client';

import { useEffect, useRef, useState } from "react";

type Props = {
    className?: string;
    source: any;
    setSource: any;
};

function Content({ className = '', source = {}, setSource = () => { } }: Props) {

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [title, setTitle] = useState(source?.title || "");
    const [text, setText] = useState(source?.text || "");

    useEffect(() => {
        // Adjust textarea height to fit content
        if (textareaRef.current) {
            const field = textareaRef.current;
            field.style.height = "0px";
            const scrollHeight = field.scrollHeight;
            field.style.height = scrollHeight + "px";
        }
    }, [text]);

    useEffect(() => {
        const oldSource = { ...source };
        if (oldSource.title === title && oldSource.text === text) return;
        oldSource.title === title ? null : oldSource.title = title;
        oldSource.text === text ? null : oldSource.text = text;
        setSource(oldSource);
    }, [title, text]);

    return (
        <div className={className}>
            <form className="grow min-h-[100%] flex flex-col gap-4 prose w-full">
                <input
                    className="px-2 py-1 text-2xl font-bold rounded-md bg-neutral-50"
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                    }}
                />
                <textarea
                    ref={textareaRef}
                    className="px-2 py-1 grow rounded-md resize-none  bg-neutral-50"
                    placeholder="Content"
                    value={text}
                    onChange={(e) => {
                        setText(e.target.value);

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
