export default function Loading() {
    return (
        <>
            <section className='w-[90%] mx-auto flex flex-col gap-4 h-full flex-grow' aria-hidden="true">
                <div className="w-full bg-white p-4">
                    <div className="flex flex-col gap-2 items-center justify-center mb-2 prose mx-auto">
                        <h2 className="m-0 text-transparent bg-gray-200 rounded-md animate-pulse">Add a Style</h2>
                        <p className="text-sm text-transparent bg-gray-200 rounded-md animate-pulse">{`Adding a style of voice is easy. Just copy and paste a few examples for Apprentice to learn from. We&lsquo;ll take care of the rest.`}</p>
                        <div className="flex flex-col items-center justify-center w-full h-full">
                            <div className="px-4 py-2 text-transparent bg-gray-200 rounded-md animate-pulse">
                                Add a style of voice
                            </div>
                        </div>

                    </div>
                </div>

                <div className="flex-grow grid grid-col-1 md:grid-cols-2 gap-8 auto-rows-min inset-0 bg-[radial-gradient(#e2e2e2_1px,transparent_1px)] [background-size:13px_13px] py-[5%] px-[2.5%]">

                    <div className='flex flex-col gap-4 prose bg-white rounded-lg p-4'>
                        <div className='flex items-center justify-start gap-4 text-sm'>
                            <h2 className="mt-0 mb-0 capitalize text-transparent bg-gray-200 rounded-md animate-pulse">Default Title</h2>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-wrap gap-2 w-full">
                                <div className="text-gray-500 px-4 rounded-full text-transparent bg-gray-200 animate-pulse">
                                    Excitement
                                </div>
                                <div className="text-gray-500 px-4 rounded-full text-transparent bg-gray-200 animate-pulse">
                                    Anticipation
                                </div>
                                <div className="text-gray-500 px-4 rounded-full text-transparent bg-gray-200 animate-pulse">
                                    Warmth
                                </div>
                                <div className="text-gray-500 px-4 rounded-full text-transparent bg-gray-200 animate-pulse">
                                    Hopefulness
                                </div>
                                <div className="text-gray-500 px-4 rounded-full text-transparent bg-gray-200 animate-pulse">
                                    Thankfulness
                                </div>
                            </div>
                            <p className="m-0 text-transparent bg-gray-200 rounded-md animate-pulse">{`The style of voice in the examples is upbeat, enthusiastic, and optimistic, with an energetic writing style that includes exclamation marks and emojis to convey excitement. There is a sense of urgency in the updates and announcements, while maintaining a friendly and inviting style that creates a connection with the audience. The use of informal language and a conversational style adds to the overall style of positivity and anticipation.`}</p>
                        </div>
                        <div className="flex items-center justify-end gap-4 w-full">
                            <div className="px-4 text-transparent bg-gray-200 rounded-md animate-pulse">Edit</div>
                            <div className="text-transparent bg-gray-200 rounded-md animate-pulse">Delete</div>
                        </div>
                    </div>

                    <div className='flex flex-col gap-4 prose bg-white rounded-lg p-4'>
                        <div className='flex items-center justify-start gap-4 text-sm'>
                            <h2 className="mt-0 mb-0 capitalize text-transparent bg-gray-200 rounded-md animate-pulse">Default Title</h2>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-wrap gap-2 w-full">
                                <div className="text-gray-500 px-4 rounded-full text-transparent bg-gray-200 animate-pulse">
                                    Excitement
                                </div>
                                <div className="text-gray-500 px-4 rounded-full text-transparent bg-gray-200 animate-pulse">
                                    Anticipation
                                </div>
                                <div className="text-gray-500 px-4 rounded-full text-transparent bg-gray-200 animate-pulse">
                                    Warmth
                                </div>
                                <div className="text-gray-500 px-4 rounded-full text-transparent bg-gray-200 animate-pulse">
                                    Hopefulness
                                </div>
                                <div className="text-gray-500 px-4 rounded-full text-transparent bg-gray-200 animate-pulse">
                                    Thankfulness
                                </div>
                            </div>
                            <p className="m-0 text-transparent bg-gray-200 rounded-md animate-pulse">{`The style of voice in the examples is upbeat, enthusiastic, and optimistic, with an energetic writing style that includes exclamation marks and emojis to convey excitement. There is a sense of urgency in the updates and announcements, while maintaining a friendly and inviting style that creates a connection with the audience. The use of informal language and a conversational style adds to the overall style of positivity and anticipation.`}</p>
                        </div>
                        <div className="flex items-center justify-end gap-4 w-full">
                            <div className="px-4 rounded-md text-transparent bg-gray-200 rounded-md animate-pulse">Edit</div>
                            <div className="text-transparent bg-gray-200 rounded-md animate-pulse">Delete</div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}