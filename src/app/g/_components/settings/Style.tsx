import { Transition } from '@headlessui/react';
import { MegaphoneIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react'
import { BackChevronIcon, PlusIcon } from '@/components/_elements/icons';

type Props = {
    style: string;
    setStyle: any;
    settingFocus: boolean;
    setSettingFocus: any;
    styleLibrary: any[];
    className?: string | '';
}

function Style({ style, setStyle, settingFocus, setSettingFocus, styleLibrary, className }: Props) {

    const [active, setActive] = useState<boolean>(false);
    const [styleSetting, setStyleSetting] = useState('');

    return (
        <>
            <div className={`gap-4 flex flex-col ${!!className ? ` ${className}` : ''}`}>
                <div className="flex gap-4 justify-between items-center w-full flex-row">
                    {!styleSetting ? (
                        <button
                            onClick={() => {
                                setSettingFocus(true);
                                setActive(true);
                            }}
                            className="flex gap-2 items-center bg-white rounded-full py-2 px-4 border-gray-700 border text-gray-700"
                        >
                            <MegaphoneIcon className="w-6 h-6 " />
                            <span className="block font-semibold flex gap-2 items-center">Add style <PlusIcon className="w-5 h-5" /></span>
                        </button>
                    ) : (
                            <button
                                onClick={() => {
                                    setStyleSetting('');
                                    setStyle('');
                                }}
                                className="flex gap-2 items-center bg-gray-700 rounded-full py-2 px-4 border-white border text-white"
                            >
                                <MegaphoneIcon className="w-6 h-6" />
                                <span className="block font-semibold flex gap-2 items-center"><span className="truncate">{styleSetting}</span><PlusIcon className="w-5 h-5 transform rotate-45" /></span>
                            </button>

                    )}
                </div>


                <Transition
                    as="div"
                    className={`flex flex-col gap-2 w-full absolute top-0 left-0 w-full h-full overflow-y-scroll bg-white rounded-lg p-4 shadow-lg z-30`}
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

                    {!!styleLibrary ? (
                        styleLibrary.map((styleOption) => (
                            <label
                                key={styleOption._id}
                                className={`mr-2 mb-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${style === styleOption._id
                                    ? 'bg-gray text-white'
                                    : 'bg-gray-200 text-gray-700'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    className="form-radio h-4 w-4 text-gray-700 transition duration-150 ease-in-out"
                                    name="style"
                                    value={styleOption._id}
                                    checked={style === styleOption._id}
                                    onChange={(e) => {
                                        setStyle(styleOption._id);
                                        setStyleSetting(styleOption.title);
                                        setSettingFocus(false);
                                        setActive(false);
                                    }}
                                />
                                <span className="ml-2">{styleOption.title}</span>
                            </label>
                        ))
                    ) : ''}
                </Transition>
            </div >
        </>
    )
}

export default Style