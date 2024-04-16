import Card from "@/components/_ui/Card";
import TextareaAutosize from "./TextAreaAutosize";
import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";
import rehypeRaw from "rehype-raw";
import { Switch, Transition } from '@headlessui/react'
import DeleteModal from "./DeleteModal";
import { CloseIcon } from "@/components/_elements/icons";

type ContentProps = {
    className?: string,
    newFormula: any,
    setNewFormula: any,
    title: string,
    setTitle: any,
    instructionsData: any,
    thinkAboutData: any,
    outlineData: any,
    handleDeleteFormula: any,
    deleting: any,
    handleCloseViewModal: any,
}

function Content({ className, title, setTitle, instructionsData, newFormula, setNewFormula, thinkAboutData, outlineData, handleDeleteFormula, deleting, handleCloseViewModal }: ContentProps) {


    const [thinkAbout, setThinkAbout] = useState('' || thinkAboutData);
    const [useOutline, setUseOutline] = useState(false || outlineData);
    const [instructions, setInstructions] = useState('' || instructionsData);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState('');

    const handleUpdateTitle = async (titleData: string) => {
        let timer: NodeJS.Timeout | undefined;
        try {
            setLoading(true);

            setProgress('Updating title...');
            setTitle(titleData);

            const previousTitle = titleData;

            if (timer) {
                clearTimeout(timer);
            }

            timer = setTimeout(async () => {
                if (titleData === previousTitle) {
                    // const data = await updateStyle(id, { 'title': title });
                }
                setProgress('');
                setLoading(false);
            }, 1000);
        } catch (err) {
            setProgress('Error updating title');
            console.log(err);
        }
    }

    const handleUpdateThinkAbout = async (updatedThinkAbout: any) => {
        let timer: NodeJS.Timeout | undefined;
        try {
            setLoading(true);

            setProgress('Updating think about...');
            setThinkAbout(updatedThinkAbout);

            const previousThinkAbout = updatedThinkAbout;

            if (timer) {
                clearTimeout(timer);
            }

            timer = setTimeout(async () => {
                // Update data in DB
                setProgress('');
                setLoading(false);
            }, 1000);

        } catch (err) {
            setProgress('Error updating think about');
            console.log(err);
        }
    };

    const handleUpdateInstructions = async (updatedInstructions: any) => {
        let timer: NodeJS.Timeout | undefined;
        try {
            setLoading(true);

            setProgress('Updating instructions...');
            setInstructions(updatedInstructions);

            const previousInstructions = updatedInstructions;

            if (timer) {
                clearTimeout(timer);
            }

            timer = setTimeout(async () => {
                // Update data in DB
                setProgress('');
                setLoading(false);
            }, 1000);

        } catch (err) {
            setProgress('Error updating instructions');
            console.log(err);
        }
    }

    return (
        <>
            <section className="flex flex-col flex-grow p-4 max-h-full overflow-y-scroll">
                <div className="w-full max-w-[800px] min-h-screen mx-auto bg-white rounded-lg p-4 flex flex-col gap-4 shadow-lg relative z-10">

                    <button className="ml-auto flex justify-center items-center gap-2 border border-gray-500 px-2 rounded-md" onClick={() => handleCloseViewModal()}>Close <CloseIcon className="w-4 h-4" /></button>

                    {/* Input field for title */}
                    <div className="flex gap-4 justify-between items-center p-4">
                        <input type="text" className="text-gray-800 text-2xl font-bold p-2 bg-transparent border-b border-b-gray-800 border-dashed	" value={title === 'Default title' ? '' : title} placeholder="Click here to edit the title" onChange={(e) => {
                            handleUpdateTitle(e.target.value)
                        }} />
                        <DeleteModal title={title} deleting={deleting} handleDeleteFormula={handleDeleteFormula} />
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



                    {/* input fields for outline */}
                    <div className="flex flex-col gap-2 mb-6 p-4 bg-neutral-100 rounded-lg">

                        <h3 className="text-gray-500 text-lg font-bold !m-0 prose">Outline</h3>
                        <p className="prose">Should Apprentice work from an outline to draft a response?</p>

                        {/* I want to enable dynamic outlines generated by the AI and manual outlines provided by the user */}

                        <span className="flex gap-2 justify-center items-center max-w-max">
                            <Switch
                                checked={useOutline}
                                onChange={setUseOutline}
                                className={`${useOutline ? 'bg-blue-600' : 'bg-gray-200'
                                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                            >
                                <span className="sr-only">Enable notifications</span>
                                <span
                                    className={`${useOutline ? 'translate-x-6' : 'translate-x-1'
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
                </div>
            </section>

            <Transition
                show={!!loading}
                enter="transition-all duration-300"
                enterFrom="opacity-0 translate-y-full"
                enterTo="opacity-100 translate-y-0"
                leave="transition-all duration-300"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-full"
            >
                <div className="sticky bottom-4 w-full max-w-max bg-white mx-auto rounded-lg flex flex-col justify-between items-center gap-4 p-4 shadow-lg z-30">
                    <span className="w-full text-center text-gray-500">{progress}</span>
                </div>
            </Transition>
        </>
    )
}

export default Content;