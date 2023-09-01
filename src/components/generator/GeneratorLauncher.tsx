import { useEffect, useState, useRef } from "react";
import Card from "../UI/Card";
import { UilAngleDoubleRight } from '@iconscout/react-unicons'
import LoadingSpinner from "../LoadingSpinner";

type LauncherProps = {
    className?: string | '';
};

const GeneratorActions = ({ className, active, setActive }: LauncherProps) => {
    const searchBarRef = useRef({} as any);
    const [generation, setGeneration] = useState<any>('');
    const [input, setInput] = useState<string>('');

    const handleInputChange = (e: any) => {
        setInput(e.target.value);
    }

    useEffect(() => {
        if (searchBarRef.current) {
            const field = searchBarRef.current as any;
            field.style.height = '0px';
            const scrollHeight = field.scrollHeight;
            field.style.height = scrollHeight + 'px';
        }
    }, [searchBarRef, input]);


    return (

        <Card className={`!shadow-md !mb-0 !p-0 w-full overflow-hidden flex justify-between items-center gap-2 !bg-gray-100`}>
            <textarea
                className="w-full outline-none break-words p-4 resize-none bg-transparent"
                placeholder="What should we create today?"
                name="prompt"
                rows={1}
                value={input}
                ref={searchBarRef}
                onChange={
                    handleInputChange
                }
            ></textarea>
            <button
                className="px-2 text-theme_primary mt-auto"
                type="submit"
            >
            </button>
        </Card>
    )
}
export default GeneratorActions;