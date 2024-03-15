import { ArrowDownIcon, ArrowUpIcon } from "@/components/_elements/icons";
import { Disclosure, Transition } from "@headlessui/react";

type KnotUserPromptProps = {
    item: any;
    index: number;
};

export default function KnotUserPrompt({ item, index }: KnotUserPromptProps) {
    return (
        !!item.settings.enabled ? (
            <Disclosure key={`${index}-user_prompt`}>
                {({ open }) => (
                    <>
                        <div className="relative mt-4">
                            <Disclosure.Button className={'bg-gray-200 text-gray-700 py-1 px-4 rounded-full flex gap-2 items-center max-w-full'}>
                                <span className="truncate ">{item.user_prompt}</span>
                                {!!open ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
                            </Disclosure.Button>

                            <Transition
                                className={'bg-gray-700 text-white p-6 rounded-xl w-full prose shadow-lg'}
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
                                        <h3 className="text-lg font-bold w-full">Settings used for this generation</h3>

                                        <span className="block text-xs font-semibold text-white border-t border-b border-white/20 py-2 my-2 w-full">
                                            {item.user_prompt}
                                        </span>
                                        {!!item.settings.contentType && (
                                            <span className="text-xs font-semibold text-gray-400 flex gap-1 bg-gray-200 transition duration-300 text-gray-500 group-hover:bg-gray-500 group-hover:text-white rounded-full px-3 py-1 truncate">
                                                <span>Type</span>
                                                <span>|</span>
                                                <span className="truncate">{item.settings.contentType}</span>
                                            </span>
                                        )}
                                        {!!item.settings.style && (
                                            <span className="text-xs font-semibold text-gray-400 flex gap-1 bg-gray-200 transition duration-300 text-gray-500 group-hover:bg-gray-500 group-hover:text-white rounded-full px-3 py-1 truncate">
                                                <span>Style</span>
                                                <span>|</span>
                                                <span className="truncate">{item.settings.style}</span>
                                            </span>
                                        )}
                                        {!!item.settings.intention && (
                                            <span className="text-xs font-semibold text-gray-400 flex gap-1 bg-gray-200 transition duration-300 text-gray-500 group-hover:bg-gray-500 group-hover:text-white rounded-full px-3 py-1 truncate">
                                                <span>Intention</span>
                                                <span>|</span>
                                                <span className="truncate">{item.settings.intention}</span>
                                            </span>
                                        )}
                                        {!!item.settings.length && (
                                            <span className="text-xs font-semibold text-gray-400 flex gap-1 bg-gray-200 transition duration-300 text-gray-500 group-hover:bg-gray-500 group-hover:text-white rounded-full px-3 py-1 truncate">
                                                <span>Length</span>
                                                <span>|</span>
                                                <span className="truncate">{item.settings.length}</span>
                                            </span>
                                        )}
                                        {!!item.settings.details && (
                                            <span className="text-xs font-semibold text-gray-400 flex gap-1 bg-gray-200 transition duration-300 text-gray-500 group-hover:bg-gray-500 group-hover:text-white rounded-full px-3 py-1 truncate">
                                                <span>Details</span>
                                                <span>|</span>
                                                <span className="truncate">{item.settings.details}</span>
                                            </span>
                                        )}
                                        {!!item.settings.formula && (
                                            <span className="text-xs font-semibold text-gray-400 flex gap-1 bg-gray-200 transition duration-300 text-gray-500 group-hover:bg-gray-500 group-hover:text-white rounded-full px-3 py-1 truncate">
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
            <div key={item.id} className="relative truncate bg-gray-200 text-gray-700 py-1 px-4 rounded-full w-min max-w-full mt-4">{item.user_prompt}</div>
        )
    );
}