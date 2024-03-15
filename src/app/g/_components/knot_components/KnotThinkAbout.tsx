import { ArrowDownIcon, ArrowUpIcon } from "@/components/_elements/icons";
import { Dialog, Disclosure, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

type KnotThinkAboutProps = {
    thinking: any;
    index: number;
};
function KnotThinkAbout({ thinking, index }: KnotThinkAboutProps) {
    const [openModal, setOpenModal] = useState(false);

    return (

        <Disclosure key={`${index}-sources`}>
            {({ open }) => (
                <>
                    <div className="relative">
                        <Disclosure.Button className={'text-xs font-semibold text-gray-400 flex gap-1 bg-gray-200 transition duration-300 text-gray-500 group-hover:bg-gray-500 group-hover:text-white rounded-full px-3 py-1 truncate max-w-max'}>
                            <span className="truncate ">Thinking</span>
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
                                <div className="flex flex-col gap-4">
                                    <ReactMarkdown
                                        className="mt-0"
                                        linkTarget="_blank"
                                        transformLinkUri={null}
                                        skipHtml={false}
                                        rehypePlugins={[rehypeRaw]}
                                    >
                                        {(thinking || '') as string}
                                    </ReactMarkdown>
                                </div>
                            </Disclosure.Panel>
                        </Transition>
                    </div>
                </>
            )}
        </Disclosure>

    );
}

export default React.memo(KnotThinkAbout);