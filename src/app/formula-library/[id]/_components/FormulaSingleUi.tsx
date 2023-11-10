'use client'

import FormulaLibrary_FormulaField from "@/components/FormulaLibrary_FormulaField";
import LoadingText from "@/components/LoadingText";
import Card from "@/components/UI/Card";
import { XMarkIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useState, useEffect, useMemo } from "react";

type FormulaProps = {
    _id: string,
    titleData: string,
    instructionsData: any,
    formulaData: string,
}

export default function FormulaSingleUi({ _id, titleData, instructionsData, formulaData }: FormulaProps) {

    /* * * * * * * * * * */
    // Use State
    /* * * * * * * * * * */
    const [editing, setEditing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [newFormula, setNewFormula] = useState({});
    const [title, setTitle] = useState(titleData || '');
    const [instructions, setInstructions] = useState(instructionsData || []);
    const [formula, setFormula] = useState(formulaData || '');

    /* * * * * * * * * * */
    // Update Formula on data change
    /* * * * * * * * * * */
    useEffect(() => {
        setNewFormula({
            title,
            instructions,
            formula,
        });
    }, [title, instructions, formula]);

    /* * * * * * * * * * */
    // Handle Functions
    /* * * * * * * * * * */
    // Hook for handline instruction actions
    const handleUpdateInstructions = (e: any, index: number) => {
        const action = e.target.dataset.action;
        let newInstructions = [...instructions] as any;

        switch (action) {
            case 'add-instruction':
                newInstructions = [
                    ...newInstructions,
                    { title: '', instruction: '', examples: [] },
                ];
                break;
            case 'remove-instruction':
                newInstructions = [
                    ...newInstructions.slice(0, index),
                    ...newInstructions.slice(index + 1),
                ];
                break;
            case 'update-instruction-title':
                newInstructions = newInstructions.map((instr: any, idx: any) =>
                    idx === index ? { ...instr, title: e.target.value } : instr
                );
                break;
            case 'update-instruction-text':
                newInstructions = newInstructions.map((instr: any, idx: any) =>
                    idx === index ? { ...instr, instruction: e.target.value } : instr
                );
                break;
            case 'add-example':
                newInstructions = newInstructions.map((instr: any, idx: any) =>
                    idx === index
                        ? { ...instr, examples: [...instr.examples, ''] }
                        : instr
                );
                break;
            case 'uppdate-example-text':
                const exampleIndex = parseInt(e.target.dataset.exampleIndex, 10);
                newInstructions = newInstructions.map((instr: any, idx: any) =>
                    idx === index
                        ? {
                            ...instr,
                            examples: instr.examples.map((ex: any, exIdx: any) =>
                                exIdx === exampleIndex ? e.target.value : ex
                            ),
                        }
                        : instr
                );
                break;
            case 'remove-example':
                const removeIndex = parseInt(e.target.dataset.exampleIndex, 10);
                newInstructions = newInstructions.map((instr: any, idx: any) =>
                    idx === index
                        ? {
                            ...instr,
                            examples: instr.examples.filter(
                                (_: any, exIdx: any) => exIdx !== removeIndex
                            ),
                        }
                        : instr
                );
                break;
            default:
                break;
        }
        setInstructions(newInstructions);
    };

    // Handle formula title change
    const handleFormulaChange = (e: any) => {
        setFormula(e.target.value);
    };

    // Handle instruction insert into formula
    const handleInsertInstruction = (instructionIndex: any) => {
        setNewFormula((prevFormula: any) => {
            const updatedInstructions = [...prevFormula.instructions];

            let updatedFormula = prevFormula.formula;

            const instruction = `<${updatedInstructions[instructionIndex].title}>`;

            // Check if the instruction is already present in the formula
            const isInstructionPresent = updatedFormula.includes(instruction);

            // Add or remove the instruction from the formula based on its presence
            if (isInstructionPresent) {
                // Remove the instruction from the formula
                updatedFormula = updatedFormula.replace(instruction, '');
            } else {
                // Add the instruction to the formula at the current cursor position
                const textarea = document.getElementById('formula') as any;
                const { selectionStart, selectionEnd } = textarea;

                updatedFormula =
                    updatedFormula.slice(0, selectionStart) +
                    instruction +
                    updatedFormula.slice(selectionEnd);
            }

            return {
                ...prevFormula,
                instructions: updatedInstructions,
                formula: updatedFormula,
            };
        });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setUploading(true);

        const payload = {
            dataType: 'update',
            data: {
                _id: _id,
                update: newFormula,
            },
        }
        const res = await fetch('/api/formulas', {
            method: 'POST',
            body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error('Error updating formula');

        const data = await res.json();

        setUploading(false);

    };

    /* * * * * * * * * * */
    // Render
    /* * * * * * * * * * */
    return (
        <section className="relative min-h-screen">
            <div className="grid grid-cols-5 w-full min-h-screen max-w-[90%] mx-auto bg-gray-200/50 rounded-t-3xl p-4 gap-4">
                <div className="col-span-5 flex flex-col gap-4">

                    {/* Input field for title */}
                    <div className="mb-4">
                        <label
                            htmlFor="title"
                            className="block font-semibold mb-2 text-gray-700 text-2xl"
                        >
                            {title ? 'Formula Title' : 'New Formula Title'}
                        </label>

                        <Card className="!p-0 !rounded-md">
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
                                <span className="absolute top-1 right-1 w-6 h-6 flex justify-center items-center text-xs font-semibold text-dark bg-secondary rounded-lg">
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
                                        className="font-semibold text-secondary focus:outline-none w-max p-1 mb-2 rounded-lg bg-transparent border border-decoration hover:border-primary hover:text-dadrk shadow-sm flex justify-center items-center"
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
                            className="font-semibold text-secondary focus:outline-none w-full p-4 mb-2 rounded-lg bg-transparent border border-decoration hover:border-primary hover:text-dark shadow-sm"
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
            <div className="sticky bottom-0 right-0 w-full max-w-[88%] mx-auto bg-white rounded-t-3xl flex gap-4 p-4 shadow-[0_-5px_15px_-15px_rgba(0,0,0,0.6)]">
                <h3 className="mt-0 mb-0 mr-auto text-gray-500 text-2xl font-bold">{title}</h3>
                {/* Submit button */}
                <button
                    onClick={handleSubmit}
                    className="p-4 mt-4 text-dark bg-secondary rounded-md focus:outline-none shadow-sm"
                >
                    {!uploading ? 'Save Formula' : <LoadingText
                        text="Saving Formula"
                        className="!text-dark gap-2"
                        iconClassName="!text-dark order-last !mr-0"
                    />}
                </button>
            </div>
        </section>
    );
};
