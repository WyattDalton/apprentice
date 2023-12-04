import FormulaLibrary_FormulaField from "@/components/FormulaLibrary_FormulaField";
import Card from "@/components/UI/Card";
import { XMarkIcon, PlusIcon } from "@heroicons/react/24/outline";

type ContentProps = {
    className?: string,
    title: string,
    setTitle: any,
    instructions: any,
    setInstructions: any,
    newFormula: any,
    setNewFormula: any,
    handleUpdateInstructions: any,
    handleFormulaChange: any,
    handleInsertInstruction: any,
}

function Content({ className, title, setTitle, instructions, setInstructions, newFormula, setNewFormula, handleUpdateInstructions, handleFormulaChange, handleInsertInstruction }: ContentProps) {
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
                <div>
                    <label
                        htmlFor="instructions"
                        className="block font-semibold mb-2 text-gray-700 text-xl"
                    >
                        Instructions for formula
                    </label>

                    {!!instructions && instructions.map((instruction: any, index: number) => (
                        <div
                            key={index}
                            className="w-full p-4 relative rounded-lg overflow-hidden bg-white shadow-lg mb-4"
                        >
                            <span className="absolute top-1 right-1 w-6 h-6 flex justify-center items-center text-xs font-semibold text-dark bg-gray-700 text-white rounded-lg">
                                {index + 1}
                            </span>

                            <label
                                htmlFor={`instruction-${index}-title`}
                                className="block mb-2 font-sm font-semibold text-gray-700"
                            >
                                Instruction Title
                            </label>
                            <input
                                type="text"
                                id={`instruction-${index}-title`}
                                data-action="update-instruction-title"
                                onChange={(e) => handleUpdateInstructions(e, index)}
                                value={instruction.title ? instruction.title : ''}
                                className="w-full px-3 py-2 mb-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

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

                            <p className="mb-2 mt-4 font-xs font-semibold text-gray-700">
                                Examples:
                            </p>

                            {!!instruction.examples &&
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
                                )}

                            <div className="flex justify-between items-center mt-4">
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

                                <button
                                    type="button"
                                    id={`instruction-${index}-delete`}
                                    data-action="remove-instruction"
                                    onClick={(e) => handleUpdateInstructions(e, index)}
                                    className="text-gray-500 bg-transparent focus:outline-none flex justify-center items-center gap-1"
                                >
                                    Delete
                                    <XMarkIcon className="w-6 h-6 pointer-events-none" />
                                </button>
                            </div>
                        </div>
                    ))}

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
                        className="font-semibold text-gray-700 focus:outline-none w-full p-4 mb-2 rounded-lg bg-transparent border border-gray-700 hover:border-gray-700 hover:text-dark shadow-sm"
                    >
                        <PlusIcon className="inline-block w-5 h-5 mr-2 pointer-events-none" />
                        Add Instruction
                    </button>
                </div>

                {/* Textarea field for formula */}
                {/* CONVERT TO CONTENT EDITABLE DIV TO INSERT TAGS */}
                <div className="mt-4">
                    <FormulaLibrary_FormulaField
                        newFormula={newFormula}
                        handleFormulaChange={handleFormulaChange}
                        handleInsertInstruction={handleInsertInstruction}
                    />
                </div>


            </div>
        </div>
    )
}

export default Content;