import Card from '@/components/_ui/Card'
import { Transition } from '@headlessui/react';
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import React, { useState } from 'react'
import { IoAddCircleOutline, IoCloseOutline } from 'react-icons/io5';

type Props = {
    details: string;
    setDetails: any;
    settingFocus: boolean;
    setSettingFocus: any;
}

function Details({ details, setDetails, settingFocus, setSettingFocus }: Props) {
    const [active, setActive] = useState<boolean>(false);
    return (
        <Card className="!mb-0 col-span-2">
            <div className="flex gap-2 mb-2 flex-col lg:flex-row justify-center items-center">
                <PencilSquareIcon className="w-6 h-6 text-gray-700" />
                <span className="block font-semibold lg:mr-auto">Details</span>

                <div className="flex gap-2">
                {!details && (
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
                {!!details && (
                    <span
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-white"
                    >
                        Include Details
                    </span>
                )}
                {!!details && (
                    <button
                        onClick={() => {
                            setDetails('');
                            setActive(false);
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
                <textarea
                    id="details"
                    className="w-full px-3 py-2 rounded border border-gray-300 h-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                />
            </Transition>
        </Card>
    )
}

export default Details