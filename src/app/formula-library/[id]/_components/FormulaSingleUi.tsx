'use client'

import FormulaLibrary_FormulaField from "@/components/FormulaLibrary_FormulaField";
import LoadingText from "@/components/LoadingText";
import Card from "@/components/UI/Card";
import Sidebar from "./Sidebar";
import { XMarkIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useState, useEffect, useMemo } from "react";
import Content from "./Content";
import { set } from "lodash";

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

    /* * * * * * * * ** * * * * * * *
    /* Delete a formula
    /* * * * * * * * ** * * * * * * */
    const handleDeleteFormula = async () => {
        try {
            const payload = {
                'dataType': 'delete',
                'data': { _id },
            }
            const res = await fetch('/api/formulas', {
                method: 'POST',
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error('Error deleting formula of voice');

            window.location.href = '/formula-library';
            window.history.back();
        }
        catch (error) {
            console.log(error);
        }
    }

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
        <section className="
            relative 
            flex-grow 
            h-full 
            grid 
            grid-cols-6
            w-[90%] 
            mx-auto
            gap-4 
        ">
            <Content
                className="col-span-6 lg:col-span-4 flex flex-col items-center gap-4 bg-[radial-gradient(#e2e2e2_1px,transparent_1px)] [background-size:13px_13px] py-[5%] px-[2.5%]"
                title={title}
                setTitle={setTitle}
                instructions={instructions}
                setInstructions={setInstructions}
                newFormula={newFormula} 
                setNewFormula={setNewFormula}
                handleUpdateInstructions={handleUpdateInstructions}
                handleFormulaChange={handleFormulaChange}
                handleInsertInstruction={handleInsertInstruction}
            />
            <Sidebar
                className="col-span-6 md:col-span-2 gap-4 rounded-lg sticky bottom-0 lg:flex lg:flex-col lg:justify-end lg:flex-grow p-0 lg:p-4 bg-transparent lg:bg-neutral-50"
                title={title}
                handleSubmit={handleSubmit}
                handleDeleteFormula={handleDeleteFormula}
                uploading={uploading}
            />
        </section>
    );
};
