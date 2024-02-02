import { useRef, useEffect } from 'react';

type TextareaAutosizeProps = {
    className?: string,
    value: string,
    onChange: any,
    placeholder: string
};

const TextareaAutosize = ({ className, value, onChange, placeholder }: TextareaAutosizeProps) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleInput = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    useEffect(() => {
        handleInput();
    }, [value]);

    return (
        <textarea
            ref={textareaRef}
            className={className}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onInput={handleInput}
            placeholder={placeholder}
            style={{ overflow: 'hidden' }}
        />
    );
};

export default TextareaAutosize;