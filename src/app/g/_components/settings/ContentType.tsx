import Card from '@/components/UI/Card'
import { Transition } from '@headlessui/react';
import { HashtagIcon } from '@heroicons/react/24/outline'
import React, { useState } from 'react'
import { IoAddCircleOutline, IoCloseOutline } from 'react-icons/io5';

type Props = {
    contentType: string;
    setContentType: any;
    settingFocus: boolean;
    setSettingFocus: any;
}


function ContentType({ contentType, setContentType, settingFocus, setSettingFocus }: Props) {

    const [active, setActive] = useState<boolean>(false);

    return (
        <>
            <Card className="!mb-0 relative overflow-visible">
                <div className="!mb-0 flex flex-col lg:flex-row justify-center items-center gap-2 w-full">
                    <HashtagIcon className="w-6 h-6 text-gray-700" />
                    <span className="block font-semibold lg:mr-auto">Type</span>

                    <div className="flex gap-2">
                        {!contentType && (
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
                        {!!contentType && (
                            <span
                                className="truncate inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-white"
                            >
                                {contentType}
                            </span>
                        )}
                        {!!contentType && (
                            <button
                                onClick={() => {
                                    setContentType('');
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
                    className="flex flex-wrap"
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
                    {[
                        'Social Media Post',
                        'Blog Post',
                        'Product Description',
                        'Email',
                    ].map((type) => (
                        <label
                            key={type}
                            className={`mr-2 mb-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${contentType === type.toLowerCase()
                                ? 'bg-gray text-white'
                                : 'bg-gray-200 text-gray-700'
                                }`}
                        >
                            <input
                                type="radio"
                                className="form-radio h-4 w-4 text-gray-700 transition duration-150 ease-in-out"
                                name="contentType"
                                value={type.toLowerCase()}
                                checked={contentType === type.toLowerCase()}
                                onChange={(e) => {
                                    setContentType(e.target.value)
                                    setActive(false);
                                }
                                }
                            />
                            <span className="ml-2">{type}</span>
                        </label>
                    ))}
                </Transition>

            </Card>
        </>
    )
}

export default ContentType