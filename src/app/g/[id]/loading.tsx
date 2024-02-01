
import { ArrowDownIcon } from "@heroicons/react/24/outline";
import GeneratorContentSkeleton from "./_components/GeneratorContentSkeleton";
import Card from "@/components/UI/Card";

export default function GeneratorSkeleton() {
    return (
        <>
            <section
                className={`transition-all duration-300 relative flex-grow flex flex-col lg:grid lg:grid-cols-6 lg:auto-rows-auto gap-4 p-4`}
            >
                <div className="col-span-6 lg:col-span-4 inset-0 bg-[radial-gradient(#e2e2e2_1px,transparent_1px)] [background-size:16px_16px] flex flex-col flex-grow px-[5%]">
                    {/* "Add new" button */}
                    <div className="w-full mx-auto max-w-[800px] py-4 relative">
                        <div className="py-2 px-6 rounded-xl flex gap-4 items-center w-max max-w-full bg-gray-200 animate-pulse rounded mb-2 text-transparent" aria-hidden="true">
                            New content
                            <ArrowDownIcon className="h-4 w-4" />
                        </div>
                    </div>

                    {/* Generator */}
                    <Card className="flex-grow w-full max-w-[800px] p-4 mx-auto !bg-neutral-50 !overflow-visible !mb-0 rounded-xl ">
                        <GeneratorContentSkeleton />
                    </Card>
                </div>

                <div className="col-span-6 lg:col-span-2 lg:h-full flex flex-col gap-4 justify-end relative lg:bg-neutral-50 rounded-lg">
                    {/* actions */}
                    <div className="hidden lg:flex flex-col gap-4 sticky bottom-2 bg-white rounded-lg p-4 shadow-lg z-30">
                        <div className="flex flex-wrap w-full gap-4 transition-all duration-300">

                            <div
                                className={`block w-full h-10 p-4 bg-gray-200 rounded-md animate-pulse`}
                            ></div>

                            <div className="flex gap-2">
                                <div className="flex flex-col justify-center items-center gap-2 p-2 rounded-xl">
                                    <span className="icon w-6 aspect-square flex justify-center items-center rounded-xl bg-gray-200 animate-pulse">
                                        <div className={'h-6 w-6'} />
                                    </span>
                                </div>
                            </div>

                            <div className="ml-auto">
                                <span className="flex gap-2 items-center rounded-md bg-gray-200 animate-pulse p-2 ml-auto lg:px-6 lg:py-2 lg:mt-auto">
                                    <div className="hidden lg:inline-block text-transparent rounded-md bg-gray-200 animate-pulse" aria-hidden="true">
                                        Generate
                                    </div>
                                    <div className="inline-block lg:hidden h-4 w-4 bg-gray-200 animate-pulse" ></div>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}