import { ArrowDownIcon, ArrowUpIcon } from "@/components/_elements/icons";
import { Dialog, Disclosure, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";

type KnotSourcesProps = {
    sources: any;
    index: number;
};
function KnotSources({ sources, index }: KnotSourcesProps) {
    const [openModal, setOpenModal] = useState(false);

    return (

        <Disclosure key={`${index}-sources`}>
            {({ open }) => (
                <>
                    <div className="relative">
                        <Disclosure.Button className={'text-xs font-semibold text-gray-400 flex gap-1 bg-gray-200 transition duration-300 text-gray-500 group-hover:bg-gray-500 group-hover:text-white rounded-full px-3 py-1 truncate max-w-max'}>
                            <span className="truncate ">Sources</span>
                            {!!open ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
                        </Disclosure.Button>

                        <Transition
                            className={'bg-gray-700 text-white p-6 rounded-xl w-full shadow-lg mt-4'}
                            show={open}
                            enter="transition duration-100 ease-out"
                            enterFrom="transform -translate-y-6 opacity-0"
                            enterTo="transform translate-y-0 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform translate-y-0 opacity-100"
                            leaveTo="transform -translate-y-6 opacity-0"
                        >
                            <Disclosure.Panel static>
                                <h2 className="text-xl font-bold mb-4 text-white"
                                >Sources used for this response</h2>
                                <div className="flex flex-col gap-4">
                                    {sources.map((source: any, index: any) => {
                                        return (
                                            <div key={index} className="flex w-full gap-4 text-white">
                                                <div className="flex justify-center items-center">
                                                    <div className="aspect-square bg-white rounded-md text-gray-500  text-lg font-bold flex justify-center items-center p-2">
                                                        {`${(source.score * 100).toFixed(0)}%`}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col justify-start align-end prose text-white">
                                                    <h3 className="mb-0 text-white text-lg font-bold">{source.title}</h3>
                                                    <p>{source.content}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Disclosure.Panel>
                        </Transition>
                    </div>
                </>
            )}
        </Disclosure>

    );
}

export default React.memo(KnotSources);