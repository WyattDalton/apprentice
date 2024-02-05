import Card from '@/components/_ui/Card';
import { Transition } from '@headlessui/react';
import { MegaphoneIcon } from '@heroicons/react/24/outline';
import { IoAddCircleOutline, IoCloseOutline } from 'react-icons/io5';
import React, { useState } from 'react'

type Props = {
    tone: string;
    setTone: any;
    settingFocus: boolean;
    setSettingFocus: any;
    toneLibrary: any[];
    className?: string | '';
}

function Tone({ tone, setTone, settingFocus, setSettingFocus, toneLibrary, className }: Props) {

    const [active, setActive] = useState<boolean>(false);
    const [toneSetting, setToneSetting] = useState('');

    return (
        <>
            <Card className="!mb-0 relative overflow-visible">
                <div className="!mb-0 flex flex-col lg:flex-row justify-center items-center gap-2 w-full flex-wrap">

                    <MegaphoneIcon className="w-6 h-6 text-gray-700" />
                    <span className="block font-semibold lg:mr-auto w-max">Style</span>



                    <div className="flex gap-2">
                        {!toneSetting && (
                            <button
                                onClick={() => {
                                    setSettingFocus(true);
                                    setActive(true);
                                }}
                                className="flex justify-center items-center gap-2 text-sm text-gray-500 hover:text-gray-700 bg-transparent rounded-full border border-gray-700 px-2 py-1"
                            >
                                Add <IoAddCircleOutline className="w-6 h-6 text-gray-700" />
                            </button>
                        )}
                        {!!toneSetting && (
                            <span
                                className="truncate inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-white truncate"
                            >
                                {toneSetting}
                            </span>
                        )}
                        {!!toneSetting && (
                            <button
                                onClick={() => {
                                    setToneSetting('');
                                    setTone('');
                                }}
                                className="text-sm text-gray-500 hover:text-gray-700 bg-transparent"
                            >
                                <IoCloseOutline className="w-6 h-6 text-dark" />
                            </button>
                        )}
                    </div>
                </div>


                <Transition
                    as="div"
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

                    {!!toneLibrary ? (
                        toneLibrary.map((toneOption) => (
                            <label
                                key={toneOption._id}
                                className={`mr-2 mb-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${tone === toneOption._id
                                    ? 'bg-gray text-white'
                                    : 'bg-gray-200 text-gray-700'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    className="form-radio h-4 w-4 text-gray-700 transition duration-150 ease-in-out"
                                    name="tone"
                                    value={toneOption._id}
                                    checked={tone === toneOption._id}
                                    onChange={(e) => {
                                        setTone(toneOption._id);
                                        setToneSetting(toneOption.title);
                                        setSettingFocus(false);
                                        setActive(false);
                                    }}
                                />
                                <span className="ml-2">{toneOption.title}</span>
                            </label>
                        ))
                    ) : ''}
                </Transition>
            </Card>
        </>
    )
}

export default Tone