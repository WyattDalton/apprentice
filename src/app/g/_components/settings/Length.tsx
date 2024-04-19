import { BackChevronIcon, PlusIcon } from '@/components/_elements/icons';
import { Transition } from '@headlessui/react';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useRef, useState } from 'react'

type Props = {
    length: number;
    setLength: any;
    settingFocus: boolean;
    setSettingFocus: any;
}
function Length({ length, setLength, settingFocus, setSettingFocus }: Props) {
    const [active, setActive] = useState<boolean>(false);
    const inputRef = useRef(null);

    return (
        <>
            <div className={`gap-4 flex flex-col`}>
                <div className="flex gap-4 justify-between items-center w-full flex-row">
                    {!length ? (
                        <button
                            onClick={() => {
                                setSettingFocus(true);
                                setActive(true);
                            }}
                            className="flex gap-2 items-center bg-white rounded-full py-2 px-4 border-gray-700 border text-gray-700">
                            <ArrowsRightLeftIcon className="w-6 h-6 " />
                            <span className="block font-semibold flex gap-2 items-center">Set output length <PlusIcon className="w-5 h-5" /></span>
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                setLength(0);
                                setActive(false);
                            }}
                                className="flex gap-2 items-center bg-gray-700 rounded-full py-2 px-4 border-white border text-white">
                                <ArrowsRightLeftIcon className="w-6 h-6" />
                                <span className="block font-semibold flex gap-2 items-center"><span className="truncate">{!!length ? `${length} words` : ''}</span><PlusIcon className="w-5 h-5 transform rotate-45" /></span>
                            </button>

                    )}
                </div>
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
                <button className='block mr-auto' onClick={() => setActive(false)}><BackChevronIcon className={'h-4 w-4'} /> Back</button>
                <div className="flex flex-wrap-reverse w-full justify-start items-center gap-2 text-lg font-semibold text-gray-700">
                    <input
                        type="number"
                        id="length"
                        className="bg-gray-100 rounded-lg py-1 px-2 max-w-[50%] w-max"
                        min={0}
                        step={1}
                        value={length}
                        onChange={(e) => {
                            setLength(Number(e.target.value));
                        }}
                    />
                    <span className="text-gray-700 text-lg">words</span>
                </div>
            </Transition>
        </>
    )
}

export default Length;
