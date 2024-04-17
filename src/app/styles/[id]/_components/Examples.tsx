'use client';

import Card from "@/components/_ui/Card";
import TextareaAutosize from "./TextAreaAutosize";
import { Disclosure, Transition } from "@headlessui/react";
import { ArrowDownIcon, ArrowUpIcon, CloseIcon, EditIcon, PlusIcon } from "@/components/_elements/icons";
import { useEffect } from "react";

type ExamplesProps = {
    examples: any,
    newExample: any,
    setNewExample: any,
    handleAddExample: any,
    handleUpdateExample: any,
    handleDeleteExample: any
};

function Examples({
    examples,
    newExample,
    setNewExample,
    handleAddExample,
    handleUpdateExample,
    handleDeleteExample
}: ExamplesProps) {

    return (
        <div className="flex flex-col gap-4">
            <Disclosure>
                {({ open }) => (
                    <div className={`rounded-lg flex flex-col gap-4${!examples.length ? ' bg-neutral-100 p-4' : ''}`}>
                        <Disclosure.Button className={`w-full ml-auto flex flex-col gap-2 text-gray-500 transition-300 transition-ease-in-out justify-center ${!!open ? 'items-end' : 'items-center'}${!examples.length ? ' items-end' : ''}`}>
                            {!examples.length ? (
                                <>
                                    {!open && (
                                        <>
                                            <h2 className="text-xl font-semibold">Start with some examples</h2>
                                            <p>Give Apprentice some examples of the style you would like it to learn. The more examples the better. </p>
                                        </>
                                    )}
                                    <span className="flex justify-center items-center gap-2 border border-gray-500 rounded-lg text-lg px-4 py-2">
                                        <span>{!open ? "Add the first example" : "Done"}</span>
                                        <span>{!open ? <PlusIcon className={`w-5 h-5`} /> : <CloseIcon className={`w-5 h-5`} />} </span>
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="flex justify-center items-center gap-2 border border-gray-500 rounded-lg text-lg px-4 py-2 ml-auto">
                                        <span>{!open ? "Add example" : "Done"}</span>
                                        <span>{!open ? <PlusIcon className={`w-5 h-5`} /> : <CloseIcon className={`w-5 h-5`} />} </span>
                                    </span>
                                </>
                            )}

                        </Disclosure.Button>
                        <Transition
                            className={'left-0 top-full w-full mt-4'}
                            show={open}
                            enter="transition duration-150 ease-out"
                            enterFrom="transform -translate-y-6 opacity-0"
                            enterTo="transform translate-y-0 opacity-100"
                            leave="transition duration-150 ease-out"
                            leaveFrom="transform translate-y-0 opacity-100"
                            leaveTo="transform -translate-y-6 opacity-0"
                        >
                            <Disclosure.Panel static>

                                <div className="flex flex-col justify-center items-center gap-4">
                                    <textarea
                                        className="p-2 pb-6 w-full text-gray-500 bg-neutral-50 text-lg rounded-md resize-none"
                                        value={newExample}
                                        onChange={(e) => {
                                            setNewExample(e.target.value)
                                        }}
                                        placeholder="Add an example" />

                                    <button onClick={(e) => handleAddExample(newExample)} className="py-2 px-4 rounded-md bg-transparent border max-w-max">Add to examples</button>

                                </div>
                            </Disclosure.Panel>
                        </Transition>
                    </div>
                )}
            </Disclosure>
            {!!examples.length && (
                <div className="flex flex-col gap-4 rounded-md">
                    {
                        examples.map((example: any, index: number) => (
                            <div key={index} className="flex flex-col gap-2 bg-neutral-100 p-4 rounded-lg">
                                <div className="flex gap-2 justify-between">
                                    <h3 className="text-gray-500 text-lg font-bold !m-0">Example {index + 1}</h3>
                                    <div className="flex gap-2">
                                        <button className="text-gray-500"><EditIcon className={'h-4 w-4'} /></button>
                                        <button className="text-red-500" onClick={() => handleDeleteExample(index)}><CloseIcon className={'h4- w-4'} /></button>
                                    </div>
                                </div>

                                <TextareaAutosize
                                    className="w-full text-gray-500 text-lg border-2 border-gray-100 rounded-md p-2 resize-none transition-all duration-300 ease-in-out focus:border-gray-300 focus:ring-0"
                                    value={!!example?.text ? example.text : example}
                                    onChange={(e: any) => {
                                        handleUpdateExample(index, e.target.value)
                                    }}
                                    placeholder="Add an example"
                                />


                            </div>
                        ))

                    }
                </div>
            )}
        </div>
    )
}

export default Examples;