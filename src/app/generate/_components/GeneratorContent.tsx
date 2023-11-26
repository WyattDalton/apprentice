import { ArrowDownIcon, ArrowUpIcon, GeneratorArrowIcon } from "@/components/icons";
import { Disclosure, Transition } from "@headlessui/react";
import React from "react";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";


type GeneratorContentProps = {
    conversation: any;
    className?: string | '';
};

const GeneratorContent = ({ conversation, className }: GeneratorContentProps) => {

    useEffect(() => {
        const handleScroll = () => {
            const stickyElements = document.querySelectorAll(".sticky-message");
            let currentSticky: any;

            stickyElements.forEach((sticky, index) => {
                const stickyContainer = sticky.querySelector(".sticky-content");
                const stickyContent = sticky.querySelector(".sticky-content") as any;
                const nextSticky = stickyElements[index + 1];

                const rectSticky = sticky.getBoundingClientRect();
                const viewportOffsetTop = 0; // You can adjust this if you have a header or other element offsetting your stickies

                if (rectSticky.top <= viewportOffsetTop && (!nextSticky || (nextSticky && rectSticky.bottom < nextSticky.getBoundingClientRect().top))) {
                    currentSticky = sticky;
                }

                // if stickyContent is null, stop
                if (!stickyContent) return;

                if (nextSticky) {
                    const rectNextSticky = nextSticky.getBoundingClientRect();
                    const distanceApart = rectNextSticky.top - rectSticky.bottom;

                    if (distanceApart <= 20 && distanceApart >= 10) {
                        const opacity = (distanceApart - 10) / 10;
                        stickyContent.style.opacity = Math.max(opacity, 0);
                    } else if (distanceApart < 10) {
                        stickyContent.style.opacity = '0';
                    } else {
                        stickyContent.style.opacity = '1';
                    }
                }
            });

            // Remove shadow-md class from all stickies
            stickyElements.forEach(sticky => sticky.classList.remove("shadow-md"));

            // Add shadow-md class to the current sticky
            if (currentSticky) currentSticky.classList.add("shadow-md");

            // Remove bg-white class from all stickies
            stickyElements.forEach(sticky => sticky.classList.remove("bg-white"));

            // Add bg-white class to the current sticky
            if (currentSticky) currentSticky.classList.add("bg-white");
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className={`${className}`}>
            {conversation.map((item: any, index: any) => (

                <>
                    {item.role === 'user' && (
                        !!item.settings ? (
                            <Disclosure key={item.id}>
                                {({ open }) => (
                                    <>
                                        <div className="relative mt-4">
                                            <Disclosure.Button className={'bg-gray-200 text-gray-700 py-1 px-4 rounded-full flex gap-2 items-center'}>
                                                <span className="truncate">{item.content}</span>
                                                {!!open ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
                                            </Disclosure.Button>

                                            <Transition
                                                className={'bg-gray-700 text-white p-6 rounded-xl absolute left-0 top-[120%] w-full max-w-[400px] shadow-lg max-h-[70vh] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 z-50'}
                                                show={open}
                                                enter="transition duration-100 ease-out"
                                                enterFrom="transform -translate-y-6 opacity-0"
                                                enterTo="transform translate-y-0 opacity-100"
                                                leave="transition duration-75 ease-out"
                                                leaveFrom="transform translate-y-0 opacity-100"
                                                leaveTo="transform -translate-y-6 opacity-0"
                                            >
                                                <Disclosure.Panel static>
                                                    <div className="flex flex-row flex-wrap items-center justify-start gap-2">
                                                        <h3 className="text-lg font-bold border-b border-white/20 w-full pb-2 mb-2">Settings used for this generation</h3>
                                                        {!!item.settings.sources && (
                                                            <span className="text-xs font-semibold text-gray-400 flex gap-1 bg-gray-200 transition duration-300 text-gray-500 group-hover:bg-gray-500 group-hover:text-white rounded-full px-3 py-1">
                                                                <span>Sources used</span>
                                                            </span>
                                                        )}
                                                        {!!item.settings.contentType && (
                                                            <span className="text-xs font-semibold text-gray-400 flex gap-1 bg-gray-200 transition duration-300 text-gray-500 group-hover:bg-gray-500 group-hover:text-white rounded-full px-3 py-1">
                                                                <span>Type</span>
                                                                <span>|</span>
                                                                <span className="truncate">{item.settings.contentType}</span>
                                                            </span>
                                                        )}
                                                        {!!item.settings.tone && (
                                                            <span className="text-xs font-semibold text-gray-400 flex gap-1 bg-gray-200 transition duration-300 text-gray-500 group-hover:bg-gray-500 group-hover:text-white rounded-full px-3 py-1">
                                                                <span>Tone</span>
                                                                <span>|</span>
                                                                <span className="truncate">{item.settings.tone}</span>
                                                            </span>
                                                        )}
                                                        {!!item.settings.intention && (
                                                            <span className="text-xs font-semibold text-gray-400 flex gap-1 bg-gray-200 transition duration-300 text-gray-500 group-hover:bg-gray-500 group-hover:text-white rounded-full px-3 py-1">
                                                                <span>Intention</span>
                                                                <span>|</span>
                                                                <span className="truncate">{item.settings.intention}</span>
                                                            </span>
                                                        )}
                                                        {!!item.settings.length && (
                                                            <span className="text-xs font-semibold text-gray-400 flex gap-1 bg-gray-200 transition duration-300 text-gray-500 group-hover:bg-gray-500 group-hover:text-white rounded-full px-3 py-1">
                                                                <span>Length</span>
                                                                <span>|</span>
                                                                <span className="truncate">{item.settings.length}</span>
                                                            </span>
                                                        )}
                                                        {!!item.settings.details && (
                                                            <span className="text-xs font-semibold text-gray-400 flex gap-1 bg-gray-200 transition duration-300 text-gray-500 group-hover:bg-gray-500 group-hover:text-white rounded-full px-3 py-1">
                                                                <span>Details</span>
                                                                <span>|</span>
                                                                <span className="truncate">{item.settings.details}</span>
                                                            </span>
                                                        )}
                                                        {!!item.settings.formula && (
                                                            <span className="text-xs font-semibold text-gray-400 flex gap-1 bg-gray-200 transition duration-300 text-gray-500 group-hover:bg-gray-500 group-hover:text-white rounded-full px-3 py-1">
                                                                <span>Formula</span>
                                                                <span>|</span>
                                                                <span className="truncate">{item.settings.formula}</span>
                                                            </span>
                                                        )}
                                                    </div>
                                                </Disclosure.Panel>
                                            </Transition>
                                        </div>
                                    </>
                                )}
                            </Disclosure>
                        ) : (
                            <div key={item.id} className="relative truncate bg-gray-200 text-gray-700 py-1 px-4 rounded-full w-min max-w-full mt-4">{item.content}</div>
                        )
                    )}

                    {item.role === 'assistant' && (
                        <div key={item.id} className="relative ">
                            <div className="flex flex-col prose mx-auto relative group/actions">
                                <ReactMarkdown
                                    className="mt-0"
                                    linkTarget="_blank"
                                    transformLinkUri={null}
                                    skipHtml={false}
                                    rehypePlugins={[rehypeRaw]}
                                >
                                    {(item.content || '') as string}
                                </ReactMarkdown>
                            </div>
                        </div>
                    )}
                </>
            ))}
        </div>
    );
}


export default GeneratorContent