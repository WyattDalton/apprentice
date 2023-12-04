'use client';

import Card from "@/components/UI/Card";
import TextareaAutosize from "./TextAreaAutosize";
import { Disclosure, Transition } from "@headlessui/react";
import { ArrowDownIcon, ArrowUpIcon } from "@/components/icons";

type ContentProps = {
    className: string,
    title: string,
    setTitle: any,
    examples: any,
    newExample: any,
    setNewExample: any,
    setExamples: any,
    displayAddExample: boolean,
    setDisplayAddExample: any,
    handleAddExample: any,
    handleUpdateExample: any,
    handleDeleteExample: any
};

function Content({
    className,
    title,
    setTitle,
    examples,
    setExamples,
    newExample,
    setNewExample,
    displayAddExample,
    setDisplayAddExample,
    handleAddExample, handleUpdateExample,
    handleDeleteExample
}: ContentProps) {

    return (
        <div className={className}>
            <div className="flex flex-col gap-4 prose w-full">
                <Card className="!p-0">
                    <input type="text" className="w-full text-gray-500 text-2xl font-bold p-2 bg-neutral-50" value={title} placeholder="Give the tone of voice a title" onChange={(e) => setTitle(e.target.value)} />
                </Card>
                <div className="flex flex-col gap-4">
                    <div className="w-full mx-auto flex flex-col justify-end items-end gap-4">
                        <Disclosure>
                            {({ open }) => (
                                <>
                                    <Disclosure.Button className={`py-2 px-4 rounded-md w-full ml-auto flex justify-center items-center gap-2 bg-gray-700 text-white ${!!examples.length ? 'max-w-max ' : 'text-xl font-bold'}`}>
                                        {!!examples.length ? (
                                            <>
                                                <span>{!open ? 'Add new example' : 'Close'}</span>
                                                <span>{!!open ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>{!open ? 'Add your first example example' : 'Close'}</span>
                                            </>
                                        )}

                                    </Disclosure.Button>
                                    <Transition
                                        className={'bg-gray-700 text-white p-6 rounded-xl left-0 top-full w-full shadow-lg max-h-[70vh] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 z-50'}
                                        show={open}
                                        enter="transition duration-150 ease-out"
                                        enterFrom="transform -translate-y-6 opacity-0"
                                        enterTo="transform translate-y-0 opacity-100"
                                        leave="transition duration-150 ease-out"
                                        leaveFrom="transform translate-y-0 opacity-100"
                                        leaveTo="transform -translate-y-6 opacity-0"
                                    >
                                        <Disclosure.Panel static>

                                            <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); handleAddExample(newExample); }}>
                                                <textarea className="p-2 w-full text-gray-500 bg-neutral-50 text-lg rounded-md resize-none" value={newExample} onChange={(e) => { setNewExample(e.target.value) }} placeholder="Add an example" />
                                                <button type="submit" className="py-2 px-4 rounded-md bg-transparent border border-white text-white max-w-max ml-auto">Add example</button>
                                            </form>

                                        </Disclosure.Panel>
                                    </Transition>
                                </>
                            )}
                        </Disclosure>
                    </div>

                    {!!examples.length && (
                        <div className="flex flex-col gap-4 p-4 rounded-md">
                            {
                                examples.map((example: any, index: number) => (
                                    <>
                                        <Card key={index} className="flex flex-col gap-2 !bg-neutral-50">
                                            <h3 className="text-gray-500 text-lg font-bold !m-0">Example {index + 1}</h3>

                                            {/* <textarea className="w-full text-gray-500 text-lg border-2 border-gray-100 rounded-md p-2 resize-none" value={example.text} onChange={(e) => handleUpdateExample(index, e.target.value)} placeholder="Add an example" /> */}

                                            <TextareaAutosize
                                                className="w-full text-gray-500 text-lg border-2 border-gray-100 rounded-md p-2 resize-none transition-all duration-300 ease-in-out focus:border-gray-300 focus:ring-0"
                                                value={example.text}
                                                onChange={(e: any) => handleUpdateExample(index, e.target.value)}
                                                placeholder="Add an example"
                                            />

                                            <div className="flex gap-2 ml-auto">
                                                <button className="text-red-500" onClick={() => handleDeleteExample(index)}>Delete Example</button>
                                            </div>

                                        </Card>
                                    </>
                                ))

                            }
                        </div>
                    )
                    }
                </div>
            </div>
        </div>
    )
}

export default Content;