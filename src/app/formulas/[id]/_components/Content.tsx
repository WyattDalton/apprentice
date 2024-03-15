import Card from "@/components/_ui/Card";
import TextareaAutosize from "./TextAreaAutosize";
import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";
import rehypeRaw from "rehype-raw";
import { Switch } from '@headlessui/react'

type ContentProps = {
    className?: string,
    title: string,
    setTitle: any,
    instructions: any,
    newFormula: any,
    setNewFormula: any,
    handleUpdateInstructions: any,
    thinkAbout: any,
    handleUpdateThinkAbout: any,
    outline: any,
    handleUpdateOutline: any,
}

function Content({ className, title, setTitle, instructions, newFormula, setNewFormula, handleUpdateInstructions, thinkAbout, handleUpdateThinkAbout, outline, handleUpdateOutline }: ContentProps) {

    const [editThinkAbout, setEditThinkAbout] = useState(false);
    const [updatedThinkAbout, setUpdatedThinkAbout] = useState('' || thinkAbout);
    const [useOutline, setUseOutline] = useState(false || outline);

    useEffect(() => {
        handleUpdateOutline(useOutline)
    }, [useOutline])

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

                {/* input fields for thinkAbout */}
                <div className="flex flex-col gap-2 mb-6">
                    <div className="pb-2 border-b border-gray-200">
                        <h3 className="text-gray-500 text-lg font-bold !m-0">Think about</h3>
                        <p>The "think about" section gives Apprentice a cue to think through how it should respond to a prompt before actually generating a response.</p>
                    </div>
                    {!!editThinkAbout ? (
                        <TextareaAutosize
                            className="w-full text-gray-500 text-lg border-2 border-gray-200 border-dashed rounded-md p-4 resize-none transition-all duration-300 ease-in-out focus:border-gray-300 focus:ring-0"
                            value={updatedThinkAbout}
                            onChange={(data: any) => {
                                setUpdatedThinkAbout(data)
                            }}
                            placeholder="Type here to change the blueprint..."
                        />
                    ) : (
                        <ReactMarkdown
                            className="mt-0 text-lg prose"
                            linkTarget="_blank"
                            transformLinkUri={null}
                            skipHtml={false}
                            rehypePlugins={[rehypeRaw]}
                        >
                            {(thinkAbout || '') as string}
                        </ReactMarkdown>
                    )}

                    <div className="flex items-center justify-end gap-4">
                        {!editThinkAbout ? (
                            <button className="" onClick={() => setEditThinkAbout(true)}>
                                {thinkAbout ? "Edit think about" : "Add something to think about"}
                            </button>
                        ) : (
                            <>
                                <button onClick={() => {
                                    setEditThinkAbout(false)
                                    handleUpdateThinkAbout(updatedThinkAbout)
                                }
                                }>Submit</button>
                                <button onClick={() => setEditThinkAbout(false)}>Cancel</button>
                            </>
                        )}
                    </div>
                </div>

                {/* input fields for outline */}
                <div className="flex flex-col gap-2 mb-6">
                    <div className="pb-2 border-b border-gray-200">
                        <h3 className="text-gray-500 text-lg font-bold !m-0">Outline</h3>
                        <p>By asking Apprentice to outline it's response before it begins generation, you increase the potential for a high-quality response. Especially with complicate responses.</p>
                    </div>

                    {/* I want to enable dynamic outlines generated by the AI and manual outlines provided by the user */}

                    <span className="flex gap-2 justify-center items-center max-w-max">
                        Use outline
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
                <Card className="w-full p-4 relative rounded-lg overflow-hidden bg-white shadow-lg mb-4 bg-neutral-50">
                    <h2 className="m-0 mb-2">Instructions</h2>
                    <TextareaAutosize
                        className="w-full text-gray-500 text-lg border-2 border-gray-200 border-dashed rounded-md p-4 resize-none transition-all duration-300 ease-in-out focus:border-gray-300 focus:ring-0"
                        value={instructions}
                        onChange={handleUpdateInstructions}
                        placeholder={"Add your instructions here..."}
                    />
                </Card>
            </div>
        </div>
    )
}

export default Content;