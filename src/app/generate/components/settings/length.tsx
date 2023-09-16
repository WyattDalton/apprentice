import Card from '@/components/UI/Card';
import { Transition } from '@headlessui/react';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react'
import { IoAddCircleOutline, IoCloseOutline } from 'react-icons/io5';

type Props = {
    length: number;
    setLength: any;
    settingFocus: boolean;
    setSettingFocus: any;
}
function Length({ length, setLength, settingFocus, setSettingFocus }: Props) {
    const [active, setActive] = useState<boolean>(false);
    return (
        <Card className="!mb-0">
            <div className="flex items-center justify-between mb-2">
                <label htmlFor="length" className="block font-semibold mb-2">
                    <div className="flex gap-2">
                        <ArrowsRightLeftIcon className="w-6 h-6 text-theme_primary-700" />
                        Max Length
                    </div>
                </label>

                {!length && active == false && (
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
                {active == true && (
                    <span
                        className="ml-auto inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-theme_primary-700 text-white"
                    >
                        {length ? `${length} words` : 'No Limit'}

                    </span>
                )}
                {!!length && (
                    <button
                        onClick={() => {
                            setLength(0);
                            setActive(false);
                        }}
                        className="text-sm text-theme_primary-700 hover:text-theme_primary-600 bg-transparent"
                    >
                        <IoCloseOutline className="w-6 h-6 text-theme_gray-700" />
                    </button>
                )}
            </div>
            <Transition
                as="div"
                className={`relative bg-gray-100 rounded-md overflow-hidden h-6`}
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
                <div className="">
                    <div
                        style={
                            length
                                ? { width: `${((length - 10) / (1000 - 10)) * 100}%` }
                                : { width: 0 }
                        }
                        className="absolute top-0 left-0 h-full bg-theme_primary-700"
                    ></div>
                    <input
                        type="range"
                        id="length"
                        className="w-full h-6 opacity-0 top-0 left-0"
                        min={0}
                        max={1000}
                        step={10}
                        value={length}
                        onChange={(e) => {
                            e.target.value
                                ? setLength(Number(e.target.value))
                                : setLength(0);
                        }}
                    />
                </div>
            </Transition>
        </Card>
    )
}

export default Length;