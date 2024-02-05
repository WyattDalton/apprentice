export default function Loading() {
    return (
        <section className="
            relative 
            grow 
            h-full 
            grid 
            grid-cols-6
            w-[90%] 
            mx-auto
            gap-4 
        ">

            {/* Content */}
            <div
                className="col-span-6 lg:col-span-4 flex flex-col items-center gap-4 bg-[radial-gradient(#e2e2e2_1px,transparent_1px)] [background-size:13px_13px] py-[5%] px-[2.5%]"
            >

                <div className="w-full flex flex-col gap-4 prose">

                    {/* Input field for title */}
                    <div className="mb-4">
                        <div className="block font-semibold mb-2 text-2xl text-transparent bg-gray-200 animate-pulse rounded-md" aria-hidden="true">New Formula Title</div>

                        <div className="!rounded-md bg-gray-200 animate-pulse text-transparent w-full px-4 py-2" aria-hidden="true">
                            Default Title
                        </div>
                    </div>

                    {/* Input fields for instructions */}
                    <div>

                        <div className="block font-semibold mb-2 text-xl text-transparent bg-gray-200 rounded-md animate-pulse" aria-hidden="true">Instructions for formula</div>


                        {/* Instructions */}
                        <div className="w-full p-4 relative rounded-lg overflow-hidden bg-white mb-4">
                            <span className="absolute top-1 right-1 w-6 h-6 flex justify-center items-center text-xs font-semibold rounded-lg text-transparent bg-gray-200 animate-pulse" aria-hidden="true">1</span>

                            <div className="block mb-2 font-sm font-semibold rounded-md text-transparent bg-gray-200 animate-pulse" aria-hidden="true">
                                Instruction Title
                            </div>

                            <div className="w-full px-3 py-2 mb-1 rounded-md text-transparent bg-gray-200 animate-pulse" aria-hidden="true">Instruction Title. Might be a little longer than the label</div>

                            <div className="block mb-2 mt-4 font-sm font-semibold rounded-md text-transparent bg-gray-200 animate-pulse" aria-hidden="true">
                                Instruction Text
                            </div>

                            <div className="w-full px-3 py-2 mb-1 rounded-md text-transparent bg-gray-200 animate-pulse" aria-hidden="true">This is the example instructions. It should be a little longer</div>

                            <p className="mb-2 mt-4 font-xs font-semibold rounded-md text-transparent bg-gray-200 animate-pulse" aria-hidden="true">Examples:</p>


                            <div className="flex rounded-lg overflow-hidden mb-1 gap-0 text-transparent bg-gray-200 animate-pulse" aria-hidden="true">
                                <div className="w-full px-3 py-2 rounded-l-lg">example</div>
                                <div className="rounded-r-lg bg-gray-300 p-2 w-6 h-6" />
                            </div>


                            <div className="flex justify-between items-center mt-4">
                                <div className="font-semibold w-max p-1 mb-2 rounded-md flex justify-center items-center text-transparent bg-gray-200 animate-pulse" aria-hidden="true">
                                    <div className="inline-block w-5 h-5 mr-2 pointer-events-none" />
                                    Add Example
                                </div>

                                <div className="flex justify-center items-center gap-1 rounded-md text-transparent bg-gray-200 animate-pulse" aria-hidden="true">
                                    Delete
                                    <div className="w-6 h-6 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                        <div className="w-full p-4 relative rounded-lg overflow-hidden bg-white mb-4">
                            <span className="absolute top-1 right-1 w-6 h-6 flex justify-center items-center text-xs font-semibold rounded-lg text-transparent bg-gray-200 animate-pulse" aria-hidden="true">1</span>

                            <div className="block mb-2 font-sm font-semibold rounded-md text-transparent bg-gray-200 animate-pulse" aria-hidden="true">
                                Instruction Title
                            </div>

                            <div className="w-full px-3 py-2 mb-1 rounded-md text-transparent bg-gray-200 animate-pulse" aria-hidden="true">Instruction Title. Might be a little longer than the label</div>

                            <div className="block mb-2 mt-4 font-sm font-semibold rounded-md text-transparent bg-gray-200 animate-pulse" aria-hidden="true">
                                Instruction Text
                            </div>

                            <div className="w-full px-3 py-2 mb-1 rounded-md text-transparent bg-gray-200 animate-pulse" aria-hidden="true">This is the example instructions. It should be a little longer</div>

                            <p className="mb-2 mt-4 font-xs font-semibold rounded-md text-transparent bg-gray-200 animate-pulse" aria-hidden="true">Examples:</p>


                            <div className="flex rounded-lg overflow-hidden mb-1 gap-0 text-transparent bg-gray-200 animate-pulse" aria-hidden="true">
                                <div className="w-full px-3 py-2 rounded-l-lg">example</div>
                                <div className="rounded-r-lg bg-gray-300 p-2 w-6 h-6" />
                            </div>


                            <div className="flex justify-between items-center mt-4">
                                <div className="font-semibold w-max p-1 mb-2 rounded-md flex justify-center items-center text-transparent bg-gray-200 animate-pulse" aria-hidden="true">
                                    <div className="inline-block w-5 h-5 mr-2 pointer-events-none" />
                                    Add Example
                                </div>

                                <div className="flex justify-center items-center gap-1 rounded-md text-transparent bg-gray-200 animate-pulse" aria-hidden="true">
                                    Delete
                                    <div className="w-6 h-6 pointer-events-none" />
                                </div>
                            </div>
                        </div>


                        <div className="font-semibold w-full p-4 mb-2 rounded-md bg-gray-200 text-transparent animate-pulse" aria-hidden="true">
                            <div className="inline-block w-5 h-5 mr-2 pointer-events-none" />
                            Add Instruction
                        </div>
                    </div>

                    <div className="mt-4 bg-gray-200 rounded-md h-12 animate-pulse rounded-md"></div>
                </div>
            </div>

            {/* Sidebar */}
            <div
                className="col-span-6 md:col-span-2 gap-4 rounded-lg sticky bottom-0 lg:flex lg:flex-col lg:justify-end lg:flex-grow p-0 lg:p-4 bg-transparent lg:bg-neutral-50"
            >

                <div className="sticky bottom-4 w-full bg-white rounded-lg flex flex-wrap justify-between items-center gap-4 p-4 shadow-[0_-5px_15px_-15px_rgba(0,0,0,0.6)]">

                    <h3 className="mt-0 mb-0 flex-grow lg:text-center lg:flex-grow-0 bg-gray-200 text-transparent rounded-md animate-pulse" aria-hidden="true">Default Title</h3>

                    <div className="flex items-center justify-center gap-4 flex-wrap flex-grow lg:flex-grow-0">
                        <div className="px-4 py-2 flex gap-2 justify-center items-center text-transparent bg-gray-200 rounded-md animate-pulse" aria-hidden="true">Update</div>
                        <div className=" text-transparent bg-gray-200 rounded-md animate-pulse" aria-hidden="true">Delete</div>
                    </div>
                </div>

            </div>
        </section>
    );
}