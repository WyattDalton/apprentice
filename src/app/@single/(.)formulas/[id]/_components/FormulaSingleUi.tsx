'use client'

import { useState, useRef } from "react";
import { Switch } from "@headlessui/react";
import { useRouter } from 'next/navigation';
import { CloseIcon } from "@/components/_elements/icons";
import DeleteModal from "./DeleteModal";
import TextareaAutosize from "./TextAreaAutosize";



type FormulaProps = {
    _id: string,
    titleData: string,
    instructionsData: any,
    formulaData?: string,
    thinkAboutData?: string,
    outlineData?: string,
    deleteFormula: any,
    updateFormula: any,
}

export default function FormulaSingleUi({
    _id,
    titleData,
    instructionsData,
    formulaData,
    thinkAboutData,
    outlineData,
    deleteFormula,
    updateFormula
}: FormulaProps) {

    const router = useRouter();

    /* * * * * * * * * * */
    // Use State
    /* * * * * * * * * * */
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState('');

    const [title, setTitle] = useState(titleData || '');
    const [thinkAbout, setThinkAbout] = useState(thinkAboutData || '');
    const [outline, setOutline] = useState(outlineData || false);
    const [instructions, setInstructions] = useState<any>(instructionsData || '');


    const handleCloseViewModal = () => {
        router.back();
    }


    const titleTimerRef = useRef<NodeJS.Timeout | undefined>();
    const handleUpdateTitle = async (titleData: string) => {
        try {
            setLoading(false);
            setProgress('Updating title...');
            setTitle(titleData);

            const payload = {
                title: titleData,
            };

            if (titleTimerRef.current) {
                clearTimeout(titleTimerRef.current);
            }

            titleTimerRef.current = setTimeout(async () => {
                await updateFormula(_id, payload);
                setProgress('');
                setLoading(false);
            }, 1000);

        } catch (err) {
            setProgress('Error updating title');
            console.log(err);
        }
    }

    const thinkAboutTimerRef = useRef<NodeJS.Timeout | undefined>();
    const handleUpdateThinkAbout = async (thinkAboutData: string) => {
        try {
            setLoading(true);
            setProgress('Updating think about...');
            setThinkAbout(thinkAboutData);

            const payload = {
                thinkAbout: thinkAboutData,
            };

            if (thinkAboutTimerRef.current) {
                clearTimeout(thinkAboutTimerRef.current);
            }

            thinkAboutTimerRef.current = setTimeout(async () => {
                await updateFormula(_id, payload);
                setProgress('');
                setLoading(false);
            }, 1000);

        } catch (err) {
            setProgress('Error updating think about');
            console.log(err);
        }
    }

    const outlineTimerRef = useRef<NodeJS.Timeout | undefined>();
    const handleUpdateOutline = async (updated: any) => {
        try {

            setLoading(true);
            setProgress('Updating outline...');
            setOutline(!!updated);

            const payload = {
                outline: !!updated,
            };

            if (outlineTimerRef.current) {
                clearTimeout(outlineTimerRef.current);
            }

            outlineTimerRef.current = setTimeout(async () => {
                await updateFormula(_id, payload);
                setProgress('');
                setLoading(false);
            }, 500);

        } catch (err) {
            setProgress('Error updating think about');
            console.log(err);
        }
    }

    const instructionsTimerRef = useRef<NodeJS.Timeout | undefined>();
    const handleUpdateInstructions = async (updatedInstructions: any) => {
        try {
            setLoading(true);
            setProgress('Updating instructions...');
            setInstructions(updatedInstructions);

            const payload = {
                instructions: updatedInstructions,
            };

            if (instructionsTimerRef.current) {
                clearTimeout(instructionsTimerRef.current);
            }

            instructionsTimerRef.current = setTimeout(async () => {
                await updateFormula(_id, payload);
                setProgress('');
                setLoading(false);
            }, 1000);

        } catch (err) {
            setProgress('Error updating instructions');
            console.log(err);
        }
    }


    /* * * * * * * * * * */
    // Render
    /* * * * * * * * * * */
    return (
        <>
            <section className="flex flex-col flex-grow p-4 h-screen overflow-y-scroll">
                <div className="w-full max-w-[800px] mx-auto bg-white rounded-lg p-4 flex flex-col gap-4 shadow-lg relative z-10">

                    <button className="ml-auto flex justify-center items-center gap-2 border border-gray-500 px-2 rounded-md" onClick={() => handleCloseViewModal()}>Close <CloseIcon className="w-4 h-4" /></button>

                    <div className="flex gap-4 justify-between items-center p-4">
                        <input type="text" className="text-gray-800 text-2xl font-bold p-2 bg-transparent border-b border-b-gray-800 border-dashed	" value={title === 'Default title' ? '' : title} placeholder="Click here to edit the title" onChange={(e) => {
                            handleUpdateTitle(e.target.value)
                        }} />
                        <DeleteModal _id={_id} title={title} deleteFormula={deleteFormula} />
                    </div>

                    <div className="flex flex-col gap-2 mb-6 p-4 bg-neutral-100 rounded-lg">
                        <h3 className="text-gray-500 text-lg font-bold !m-0 prose">Think about</h3>
                        <p className="prose">What should Apprentice think about before generating a response?</p>
                        <TextareaAutosize
                            className="w-full text-gray-800 bg-white text-lg p-4 border-b border-gray-800 border-dashed resize-none transition-all duration-300 ease-in-out focus:border-gray-300 focus:ring-0"
                            value={thinkAbout}
                            onChange={(data: any) => {
                                handleUpdateThinkAbout(data)
                            }}
                            placeholder="Tell Apprentice what it should think through before generating a response..."
                        />
                    </div>

                    <div className="flex flex-col gap-2 mb-6 p-4 bg-neutral-100 rounded-lg">

                        <h3 className="text-gray-500 text-lg font-bold !m-0 prose">Outline</h3>
                        <p className="prose">Should Apprentice work from an outline to draft a response?</p>

                        {/* I want to enable dynamic outlines generated by the AI and manual outlines provided by the user */}

                        <span className="flex gap-2 justify-center items-center max-w-max">
                            <Switch
                                checked={!!outline}
                                onChange={(e) => handleUpdateOutline(e)}
                                className={`${!!outline ? 'bg-blue-600' : 'bg-gray-200'
                                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                            >
                                <span className="sr-only">Enable outline</span>
                                <span
                                    className={`${!!outline ? 'translate-x-6' : 'translate-x-1'
                                        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                />
                            </Switch>
                        </span>
                    </div>

                    {/* Input fields for instructions */}
                    <div className="flex flex-col gap-2 mb-6 p-4 bg-neutral-100 rounded-lg">
                        <h2 className="text-gray-500 text-lg font-bold !m-0 prose">Instructions</h2>
                        <p className="prose">Provide the instructions that Apprentice should follow in order to compplete the response.</p>
                        <TextareaAutosize
                            className="w-full text-gray-800 bg-white text-lg p-4 border-b border-gray-800 border-dashed resize-none transition-all duration-300 ease-in-out focus:border-gray-300 focus:ring-0"
                            value={instructions}
                            onChange={handleUpdateInstructions}
                            placeholder={"Add your instructions here..."}
                        />
                    </div>

                    {!!loading ? (
                        <div className="sticky bottom-4 w-full max-w-max bg-white mx-auto rounded-lg flex flex-col justify-between items-center gap-4 p-4 shadow-lg z-30">
                            <span className="w-full text-center text-gray-500">{progress}</span>
                        </div>
                    ) : ''}

                </div>
            </section>
        </>
    );
};
