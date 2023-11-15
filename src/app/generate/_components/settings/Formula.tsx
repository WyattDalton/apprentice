import Card from '@/components/UI/Card';
import { Transition } from '@headlessui/react';
import { SparklesIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react'
import { IoAddCircleOutline, IoCloseOutline, IoCloseCircleOutline } from 'react-icons/io5';

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
        <Card className="!mb-0 col-span-2" >

            <div className="flex gap-2 mb-2">
                <SparklesIcon className="w-6 h-6 text-gray-700" />
                <span className="block font-semibold">Formula</span>

                {!formula && (
                    <button
                        onClick={() => {
                            setSettingFocus(true);
                            setActive(true);
                        }}
                        className="ml-auto flex justify-center items-center gap-2 text-sm text-gray-500 hover:text-gray-700 bg-transparent rounded-full border border-gray-700 px-2 py-1"
                    >
                        Add <IoAddCircleOutline className="w-6 h-6 text-gray-700" />
                    </button>
                )}

                {!!formula && (
                    <span
                        className="ml-auto inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-white"
                    >
                        {formulaSetting}
                    </span>
                )}

                {!!formula && (
                    <button
                        onClick={() => {
                            setFormula('');
                        }}
                        className="text-sm text-gray-500 hover:text-gray-700 bg-transparent"
                    >
                        <IoCloseOutline className="w-6 h-6 text-gray-700" />
                    </button>
                )}

            </div>

            <Transition
                as="div"
                className={`flex flex-wrap w-full`}
                show={active}
                enter="transition ease-out duration-100 transform"
                enterFrom="opacity-0 -translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-75 transform"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 -translate-y-1"
                appear={true}
                unmount={true}
            >

                <div className="flex flex-wrap">
                    {formulaLibrary &&
                        formulaLibrary.map(
                            ({ _id, examples, instructions, summary, title }) => (
                                <label
                                    key={_id}
                                    className={`mr-2 mb-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${formula === _id
                                        ? 'bg-gray text-white'
                                        : 'bg-gray-200 text-gray-700'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        className="form-radio h-4 w-4 text-gray transition duration-150 ease-in-out"
                                        name="formula"
                                        value={_id}
                                        checked={formula === _id}
                                        onChange={(e) => {
                                            setFormula(_id);
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
        </Card >

    )
}

export default Formula