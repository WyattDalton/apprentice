export default function Loading() {
    return (
        <section className='w-[90%] mx-auto flex flex-col gap-4 h-full flex-grow'>

            <div className="w-full">

                <div className="flex flex-col gap-2 items-center justify-center mb-2 prose mx-auto bg-white rounded-md w-full p-4">
                    <h2 className="m-0 text-transparent bg-gray-200 rounded-md animate-pulse" aria-hidden="true">Add a Formula</h2>
                    <div className="flex flex-col items-center justify-center w-full h-full">
                        <div
                            className="px-4 py-2 text-transparent bg-gray-200 rounded-md animate-pulse" aria-hidden="true"
                        >
                            Add a formula
                        </div>
                    </div>

                </div>
            </div>

            <div className="flex-grow grid grid-col-1 md:grid-cols-2 gap-8 auto-rows-min inset-0 bg-[radial-gradient(#e2e2e2_1px,transparent_1px)] [background-size:13px_13px] py-[5%] px-[2.5%]">
                <div className='flex flex-col gap-4 prose bg-white rounded-md p-4'>
                    <div className='flex items-center justify-start gap-4 text-sm'>
                        <h2 className="mt-0 mb-0 capitalize rounded-md bg-gray-200 text-transparent animate-pulse" aria-hidden="true">Default Title</h2>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2 divide-y divide-gray-200">

                            <div className="flex gap-2 justify-start items-start rounded-md bg-gray-200 text-transparent animate-pulse py-2 px-4" aria-hidden="true">
                                <span className='bg-gray-300 aspect-square w-8 p-0 flex justify-center items-center rounded-md'>1</span>
                                A title
                            </div>
                            <div className="flex gap-2 justify-start items-start rounded-md bg-gray-200 text-transparent animate-pulse py-2 px-4" aria-hidden="true">
                                <span className='bg-gray-300 aspect-square w-8 p-0 flex justify-center items-center rounded-md'>1</span>
                                Another title
                            </div>
                            <div className="flex gap-2 justify-start items-start rounded-md bg-gray-200 text-transparent animate-pulse py-2 px-4" aria-hidden="true">
                                <span className='bg-gray-300 aspect-square w-8 p-0 flex justify-center items-center rounded-md'>1</span>
                                A relatively long title
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-4 w-full">
                        <div className="px-4 rounded-md bg-gray-200 text-transparent animate-pulse" aria-hidden="true" >Edit</div>
                        <div className="rounded-md bg-gray-200 text-transparent animate-pulse" aria-hidden="true">Delete</div>
                    </div>
                </div>


                <div className='flex flex-col gap-4 prose bg-white rounded-md p-4'>
                    <div className='flex items-center justify-start gap-4 text-sm'>
                        <h2 className="mt-0 mb-0 capitalize rounded-md bg-gray-200 text-transparent animate-pulse" aria-hidden="true">Default Title</h2>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2 divide-y divide-gray-200">

                            <div className="flex gap-2 justify-start items-start rounded-md bg-gray-200 text-transparent animate-pulse py-2 px-4" aria-hidden="true">
                                <span className='bg-gray-300 aspect-square w-8 p-0 flex justify-center items-center rounded-md'>1</span>
                                A title
                            </div>
                            <div className="flex gap-2 justify-start items-start rounded-md bg-gray-200 text-transparent animate-pulse py-2 px-4" aria-hidden="true">
                                <span className='bg-gray-300 aspect-square w-8 p-0 flex justify-center items-center rounded-md'>1</span>
                                Another title
                            </div>
                            <div className="flex gap-2 justify-start items-start rounded-md bg-gray-200 text-transparent animate-pulse py-2 px-4" aria-hidden="true">
                                <span className='bg-gray-300 aspect-square w-8 p-0 flex justify-center items-center rounded-md'>1</span>
                                A relatively long title
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-4 w-full">
                        <div className="px-4 rounded-md bg-gray-200 text-transparent animate-pulse" aria-hidden="true" >Edit</div>
                        <div className="rounded-md bg-gray-200 text-transparent animate-pulse" aria-hidden="true">Delete</div>
                    </div>
                </div>



            </div>
        </section>
    )
}