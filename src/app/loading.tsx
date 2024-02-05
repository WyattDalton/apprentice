import { GeneratorArrowIcon } from "@/components/_elements/icons";

export default function Loading() {
    return (
        <main className="w-[90%] mx-auto flex flex-col gap-4 h-full flex-grow">
            <section className="flex-grow flex flex-col gap-8 inset-0 bg-[radial-gradient(#e2e2e2_1px,transparent_1px)] [background-size:13px_13px] py-[5%] px-[2.5%]">

                <div className='w-full'>
                    <h1 className='text-4xl font-bold text-gray-700 w-full'>Say Hello to Apprentice</h1>
                    <p className='text-gray-500'>Your newest team member. Generate effective marketing in 15 minutes or less.</p>
                </div>

                <div className="w-full">
                    {/* Geerator card */}
                    <div className='!bg-neutral-50 p-4 rounced-md col-span-full flex flex-col gap-2'>
                        <h2 className='text-xl text-gray-700 m-0'>Generate content</h2>
                        <p className='text-gray-500 mb-2'>Generate content for your social media, blog, or website.</p>
                        <div
                            className={`mt-auto no-underline bg-transparent border border-gray-700 text-gray-500 flex justify-center items-center gap-2 rounded-md max-w-max py-1 px-1`}>
                            <span className="px-3 text-lg ">Go to generator</span>
                            <span className='bg-gray-700 text-white p-2 h-full rounded-md aspect-square flex justify-center items-center'><GeneratorArrowIcon className="w-4 h-4 block" /></span>
                        </div>
                    </div>
                </div>

                {/* Library cards */}
                <div className='grid grid-cols-6 auto-rows-max gap-2'>
                    <div className='col-span-full'>
                        <div className='prose'>
                            <h2 className='text-2xl font-bold text-gray-500 m-0'>Libraries</h2>
                            <p className="">Give Apprentice superpowers! Teach him to use a specific tone of voice, learn specific information about your industry, and create content by following exact formulas</p>
                        </div>
                    </div>

                    <div className='!bg-neutral-50 p-4 rounded-md flex flex-col gap-2 col-span-full md:col-span-3 xl:col-span-2'>
                        <h3 className='text-xl text-gray-700 m-0'>Formula Library</h3>
                        <p className='text-gray-500 mb-2'>Create formulas to generate content with your own patterns.</p>
                        <div
                            className={`mt-auto no-underline bg-gray-700 text-white py-1 px-4 rounded-md max-w-max flex justify-center items-center text-lg`}>
                            Go to formula library
                        </div>
                    </div>
                    <div className='!bg-neutral-50 p-4 rounded-md flex flex-col gap-2 col-span-full md:col-span-3 xl:col-span-2'>
                        <h3 className='text-xl text-gray-700 m-0'>Tone Library</h3>
                        <p className='text-gray-500 mb-2'>Create your own styles and tone of voice.</p>
                        <div
                            className={`mt-auto no-underline bg-gray-700 text-white py-1 px-4 rounded-md max-w-max flex justify-center items-center text-lg`}>
                            Go to tone library
                        </div>
                    </div>
                    <div className='!bg-neutral-50 rounded-md p-4 flex flex-col gap-2 col-span-full md:col-span-3 xl:col-span-2'>
                        <h3 className='text-xl text-gray-700 m-0'>Source Library</h3>
                        <p className='text-gray-500 mb-2'>Give Apprentice source material to use while generating content.</p>
                        <div
                            className={`mt-auto no-underline bg-gray-700 text-white py-1 px-4 rounded-md max-w-max flex justify-center items-center text-lg`}>
                            Go to source library
                        </div>
                    </div>
                </div>

                {/* Coming soon cards */}
                <div className='grid grid-cols-6 auto-rows-max grid-flow-dense gap-2'>
                    <div className='w-full col-span-full prose'>
                        <h2 className='text-2xl font-bold text-gray-500 m-0'>In the works</h2>
                        <p className="">We&apos;re working on some cool features to make Apprentice even more powerful. Stay tuned!\</p>
                    </div>

                    <div className="!bg-neutral-50 rounded-md p-4 !bg-neutral-50 flex flex-col gap-2 col-span-full md:col-span-3">
                        <h3 className='text-xl text-gray-700 m-0'>Layout Library</h3>
                        <p className='text-gray-500 mb-2'>Create complex content patterns for Apprentice to follow.</p>
                        <span className="mt-auto no-underline bg-transparent border border-gray-700 rounded-md max-w-max text-gray-500 py-1 px-4 text-lg">Coming soon</span>
                    </div>

                    <div className='!bg-neutral-50 rounded-md p-4 flex flex-col gap-2 col-span-full md:col-span-3'>
                        <h3 className='text-xl text-gray-700 m-0'>Campaigns</h3>
                        <p className='mb-2 text-gray-500'>Create campaign templates that enable you to generate all of the marketing material you need for an entire month in a single command.</p>
                        <span className="mt-auto no-underline bg-transparent border border-gray-700 rounded-md max-w-max text-gray-500 py-1 px-4 text-lg">Coming soon</span>
                    </div>
                </div>
            </section>
        </main>
    )
}