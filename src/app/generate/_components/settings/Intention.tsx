import Card from '@/components/UI/Card';
import { Transition } from '@headlessui/react';
import { TrophyIcon } from '@heroicons/react/24/outline';

import React, { useState } from 'react'
import { IoAddCircleOutline, IoCloseOutline } from 'react-icons/io5';
type Props = {
    intention: string;
    setIntention: any;
    settingFocus: boolean;
    setSettingFocus: any;
    className?: string | '';
}

function Intention({ intention, setIntention, settingFocus, setSettingFocus, className }: Props) {

    const [active, setActive] = useState<boolean>(false);

    return (
        <>

            <Card className={`!mb-0 relative overflow-visible duration-300 transition ${className}`}>
                <div className={`flex gap-2 justify-center items-center w-full flex-col lg:flex-row`}>
                    <TrophyIcon className="w-6 h-6 text-gray-700" />
                    <span className="block font-semibold lg:mr-auto">Intention</span>
                    <div className='flex gap-2'>
                    {!intention && (
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
                    {!!intention && (
                        <span
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-white"
                        >
                            {intention}
                        </span>
                    )}
                    {!!intention && (
                        <button
                            onClick={() => {
                                setIntention('');
                            }}
                            className="text-sm text-gray-500 hover:text-gray-700 bg-transparent"
                        >
                            <IoCloseOutline className="w-6 h-6 text-gray-700" />
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

                    {['Sales', 'Informing', 'Entertaining'].map(
                        (intentionOption) => (
                            <label
                                key={intentionOption}
                                className={`mr-2 mb-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${intention === intentionOption.toLowerCase()
                                    ? 'bg-gray text-white'
                                    : 'bg-gray-200 text-gray-700'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    className="form-radio h-4 w-4 text-gray-700 transition duration-150 ease-in-out"
                                    name="intention"
                                    value={intentionOption.toLowerCase()}
                                    checked={intention === intentionOption.toLowerCase()}
                                    onChange={(e) => {
                                        setSettingFocus(false);
                                        setIntention(e.target.value)
                                        setActive(false);
                                    }}
                                />
                                <span className="ml-2">{intentionOption}</span>
                            </label>
                        )
                    )}
                </Transition>
            </Card>
        </>
    )
}

export default Intention;