import { BackChevronIcon, PlusIcon } from '@/components/_elements/icons';
import { Transition } from '@headlessui/react';
import { SparklesIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react'

type Props = {
    formula: string;
    setFormula: any;
    formulaLibrary: any[];
    settingFocus: boolean;
    setSettingFocus: any;
}

function Formula({ formula, setFormula, formulaLibrary, settingFocus, setSettingFocus }: Props) {
    const [active, setActive] = useState<boolean>(false);
    const [formulaSetting, setFormulaSetting] = useState('');

    return (
        <>
            <div className="flex gap-4 justify-between items-center w-full flex-row">
                {!formula ? (
                    <button
                        onClick={() => {
                            setSettingFocus(true);
                            setActive(true);
                        }}
                        className="flex gap-2 items-center bg-white rounded-full py-2 px-4 border-gray-700 border text-gray-700">
                        <SparklesIcon className="w-6 h-6 " />
                        <span className="block font-semibold flex gap-2 items-center">Add formula <PlusIcon className="w-5 h-5" /></span>
                    </button>
                ) : (
                    <button
                        onClick={() => {
                            setFormula('');
                        }}
                            className="flex gap-2 items-center bg-gray-700 rounded-full py-2 px-4 border-white border text-white">
                            <SparklesIcon className="w-6 h-6" />
                            <span className="block font-semibold flex gap-2 items-center"><span className="truncate">{formulaSetting}</span><PlusIcon className="w-5 h-5 transform rotate-45" /></span>
                    </button>

                )}
            </div>

            <Transition
                as="div"
                className={`flex flex-col gap-4 w-full absolute top-0 left-0 w-full h-full bg-white rounded-lg p-4 shadow-lg z-30`}
                show={active}
                enter="transition ease-out duration-150 transform"
                enterFrom="opacity-0 -translate-x-5"
                enterTo="opacity-100 translate-x-0"
                leave="transition ease-in duration-150 transform"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 -translate-x-5"
                appear={true}
                unmount={true}
            >
                <button className='block mr-auto' onClick={() => setActive(false)}><BackChevronIcon className={'h-4 w-4å'} /> Back</button>
                <div className="flex flex-wrap w-full">
                    {formulaLibrary &&
                        formulaLibrary.map(
                            ({ id, examples, instructions, summary, title }) => (
                                <label
                                    key={id}
                                    className={`mr-2 mb-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${formula === id
                                        ? 'bg-gray text-white'
                                        : 'bg-gray-200 text-gray-700'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        className="form-radio h-4 w-4 text-gray transition duration-150 ease-in-out"
                                        name="formula"
                                        value={id}
                                        checked={formula === id}
                                        onChange={(e) => {
                                            setFormula(id);
                                            setFormulaSetting(title);
                                            setActive(false);
                                        }}
                                    />
                                    <span className="ml-2">{title}</span>
                                </label>
                            )
                        )
                    }

                </div>
            </Transition>
        </>

    )
}

export default Formula