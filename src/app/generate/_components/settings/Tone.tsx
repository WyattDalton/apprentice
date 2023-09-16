import Card from '@/components/UI/Card';
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
}

function Tone({ tone, setTone, settingFocus, setSettingFocus, toneLibrary }: Props) {

    const [active, setActive] = useState<boolean>(false);
    const [toneSetting, setToneSetting] = useState('');

    return (
        <>
            <Card className="!mb-0 grow relative overflow-visible">
                <div className="flex gap-2 w-full flex-wrap">
                    <div className='w-full flex items-center gap-2'>
                        <MegaphoneIcon className="w-6 h-6 text-theme_primary-700" />
                        <span className="block font-semibold">Tone of Voice</span>
                        {!toneSetting && (
                            <button
                                onClick={() => {
                                    setSettingFocus(true);
                                    setActive(true);
                                }}
                                className="ml-auto flex justify-center items-center gap-2 text-sm text-theme_primary-700 hover:text-theme_primary-600 bg-transparent rounded-full border border-theme_primary-700 px-2 py-1"
                            >
                                Add <IoAddCircleOutline className="w-6 h-6 text-theme_primary-700" />
                            </button>
                        )}
                        {!!toneSetting && (
                            <span
                                className="ml-auto inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-theme_primary-700 text-white"
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
                                className="text-sm text-theme_primary-700 hover:text-theme_primary-600 bg-transparent"
                            >
                                <IoCloseOutline className="w-6 h-6 text-theme_gray-700" />
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

                        {!!toneLibrary ? (
                            toneLibrary.map((toneOption) => (
                                <label
                                    key={toneOption._id}
                                    className={`mr-2 mb-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${tone === toneOption._id
                                        ? 'bg-theme_primary-700 text-white'
                                        : 'bg-gray-200 text-gray-700'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        className="form-radio h-4 w-4 text-theme_primary-600 transition duration-150 ease-in-out"
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

                </div>

            </Card>
        </>
    )
}

export default Tone