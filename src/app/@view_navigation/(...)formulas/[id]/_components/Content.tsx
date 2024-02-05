import FormulaLibrary_FormulaField from "@/components/FormulaLibrary_FormulaField";
import Card from "@/components/_ui/Card";
import { XMarkIcon, PlusIcon } from "@heroicons/react/24/outline";
import TextareaAutosize from "./TextAreaAutosize";

type ContentProps = {
    className?: string,
    title: string,
    setTitle: any,
    instructions: any,
    setInstructions: any,
    newFormula: any,
    setNewFormula: any,
    handleUpdateInstructions: any,
    format: any,
    setFormat: any,
    handleInsertInstruction: any,
}

function Content({ className, title, setTitle, instructions, setInstructions, newFormula, setNewFormula, handleUpdateInstructions, format, setFormat }: ContentProps) {
    return (
        <div className={className}>
            <div className="w-full flex flex-col gap-4 prose">

                {/* Input field for title */}
                <div className="mb-4">
                    <label
                        htmlFor="title"
                        className="block font-semibold mb-2 text-gray-700 text-2xl"
                    >
                        {title ? 'Formula Title' : 'New Formula Title'}
                    </label>

                    <Card className="!p-0 !rounded-md bg-neutral-50">
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2  rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                    </Card>
                </div>

                {/* Input fields for instructions */}
                <Card className="w-full p-4 relative rounded-lg overflow-hidden bg-white shadow-lg mb-4 bg-neutral-50">
                    <div className="flex justify-between items-center mb-4">
                        <label
                            htmlFor="instructions"
                            className="block font-semibold mb-2 text-gray-500 text-xl"
                        >
                            Instructions for formula
                        </label>
                        <button
                            type="button"
                            id={`instruction--add`}
                            data-action="add-instruction"
                            onClick={(e) =>
                                handleUpdateInstructions(
                                    e,
                                    instructions.length ? instructions.length : 0
                                )
                            }
                            className="font-semibold text-white focus:outline-none w-max px-2 py mb-2 rounded-lg bg-gray-700"
                        >
                            Add
                            <PlusIcon className="inline-block w-4 h-4 pointer-events-none text-white" />
                        </button>
                    </div>

                    {!instructions.length && <p className="text-gray-500">No instructions yet</p>}
                    {!!instructions.length && (
                        <div className="flex flex-col gap-4 divide-y divide-gray-300 divide-dashed">
                            {!!instructions && instructions.map((instruction: any, index: number) => (

                                <div key="index" className="pt-4">
                                    <div className="relative">
                                        <div className="flex justify-between items-center mb-4 wrap">
                                            <label
                                                htmlFor={`instruction-${index}-title`}
                                                className="block mb-2 font-sm font-semibold text-gray-700"
                                            >
                                                Instruction Title
                                            </label>
                                            <div className="flex items-center gap-2 wrap">
                                                <span className="px-3 py-1 flex justify-center items-center text-xs font-semibold text-gray-500 rounded-full border border-gray-500">
                                                    {index === 0 ? 'first' : index === instructions.length - 1 ? 'finally' : 'then'}
                                                </span>
                                                <button
                                                    type="button"
                                                    id={`instruction-${index}-delete`}
                                                    data-action="remove-instruction"
                                                    onClick={(e) => handleUpdateInstructions(e, index)}
                                                    className="text-gray-500 bg-transparent focus:outline-none flex justify-center items-center gap-1"
                                                >
                                                    <XMarkIcon className="w-6 h-6 pointer-events-none" />
                                                </button>
                                            </div>
                                        </div>
                                        <input
                                            type="text"
                                            id={`instruction-${index}-title`}
                                            data-action="update-instruction-title"
                                            onChange={(e) => handleUpdateInstructions(e, index)}
                                            value={instruction.title ? instruction.title : ''}
                                            className="w-full px-3 py-2 mb-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />

                                        <div>
                                            <label
                                                htmlFor={`instruction-${index}-text`}
                                                className="block mb-2 mt-4 font-sm font-semibold text-gray-700"
                                            >
                                                Instruction Text
                                            </label>
                                            <input
                                                type="text"
                                                id={`instruction-${index}-text`}
                                                data-action="update-instruction-text"
                                                onChange={(e) => handleUpdateInstructions(e, index)}
                                                value={
                                                    instruction.instruction ? instruction.instruction : ''
                                                }
                                                className="w-full px-3 py-2 mb-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>

                                            <label
                                                htmlFor={`instruction-${index}-example`}
                                                className="block mb-2 mt-4 font-sm font-semibold text-gray-700"
                                            >
                                                Add an example
                                            </label>
                                            <div className="flex rounded-lg overflow-hidden mb-1 gap-0">
                                                <input
                                                    id={`instruction-${index}-example`}
                                                    name={`instruction-${index}-example`}
                                                    type="text"
                                                    value={instruction.example ? instruction.example : ''}
                                                    data-action="update-instruction-example"
                                                    onChange={(e) => handleUpdateInstructions(e, index)}
                                                    className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-l-lg"
                                                />
                                            </div>
                                        </div>


                                        {/* <p className="mb-2 mt-4 font-xs font-semibold text-gray-700">
                                            Examples:
                                        </p> */}
                                        {/* {!!instruction.examples &&
                                            instruction.examples.map(
                                                (example: any, exampleIndex: any) => (
                                                    <div
                                                        key={exampleIndex}
                                                        className="flex rounded-lg overflow-hidden mb-1 gap-0"
                                                        id={`instruction-${index}-example-${exampleIndex}`}
                                                    >
                                                        <input
                                                            type="text"
                                                            value={example}
                                                            id={`instruction-${index}-example-${exampleIndex}-text`}
                                                            data-action="uppdate-example-text"
                                                            data-example-index={exampleIndex}
                                                            onChange={(e) => handleUpdateInstructions(e, index)}
                                                            className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-l-lg"
                                                        />

                                                        <button
                                                            type="button"
                                                            id={`instruction-${index}-remove-example-${exampleIndex}`}
                                                            data-action="remove-example"
                                                            data-example-index={exampleIndex}
                                                            onClick={(e) => handleUpdateInstructions(e, index)}
                                                            className="text-white rounded-r-lg bg-gray-700 p-2 focus:outline-none"
                                                        >
                                                            <XMarkIcon className="w-6 h-6 pointer-events-none" />
                                                        </button>
                                                    </div>
                                                )
                                            )} */}

                                        {/* <div className="flex justify-between items-center mt-4">
                                            <button
                                                type="button"
                                                id={`instruction-${index}-add-example`}
                                                className="font-semibold text-gray-700 focus:outline-none w-max p-1 mb-2 rounded-lg bg-transparent border border-gray-700 hover:border-gray-700 shadow-sm flex justify-center items-center"
                                                data-action="add-example"
                                                onClick={(e) => handleUpdateInstructions(e, index)}
                                            >
                                                <PlusIcon className="inline-block w-5 h-5 mr-2 pointer-events-none" />
                                                Add Example
                                            </button>
                                        </div> */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                    }
                </Card >

                {/* Textarea field for formula */}
                {/* CONVERT TO CONTENT EDITABLE DIV TO INSERT TAGS */}
                {/* <Card className="!p-0 !rounded-md bg-neutral-50 mt-4 focus:ring-2 focus:ring-blue-500">
                    <TextareaAutosize
                        className="w-full px-3 py-2 rounded-md resize-none"
                        value={format}
                        onChange={setFormat}
                        placeholder={"placeholder"}
                    />
                </Card> */}


            </div>
        </div>
    )
}

export default Content;