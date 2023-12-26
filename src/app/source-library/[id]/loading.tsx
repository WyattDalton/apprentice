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
            <div className={'col-span-6 lg:col-span-4 flex flex-col items-center min-h-full gap-4 bg-[radial-gradient(#e2e2e2_1px,transparent_1px)] [background-size:13px_13px] py-[5%] px-[2.5%]'}>
                <form className="grow min-h-[100%] flex flex-col gap-4 prose w-full">
                    <div
                        className="px-2 py-1 text-2xl w-full font-bold rounded-md bg-gray-200 text-transparent animate-pulse" aria-hidden="true"
                    >
                        Charin and Fahlun 1 (A Game)
                    </div>
                    <div
                        className="px-2 py-1 grow rounded-md bg-gray-200 text-transparent animate-pulse w-full" aria-hidden="true"
                    >
                        Stalking, normally, would not be this hard.

                        Lowering himself below the brush, he slowly crawled his way forward through the snow. It was fresh powder, the flaky white kind that stuck to his fur and froze his nose. His lips pulled back in a snarl as he shook his head—careful not to let his ears slap and give away his position—trying to get the snow off of his face.
                    </div>
                </form>
            </div>
            <div className={`col-span-6 md:col-span-2 gap-4 rounded-lg sticky bottom-0 lg:flex lg:flex-col lg:justify-end lg:flex-grow p-0 lg:p-4 bg-transparent lg:bg-neutral-50`}>
                <div className="sticky bottom-4 w-full bg-white rounded-lg flex flex-wrap gap-4 p-4 shadow-[0_-5px_15px_-15px_rgba(0,0,0,0.6)]">
                    <div className="flex items-center justify-start gap-4">
                        <div className="w-6 h-6 p-2 rounded-md bg-gray-200 rounded-md animate-pulse" />
                        <h3 className="mt-0 mb-0 mr-auto text-transparent bg-gray-200 rounded-md animate-pulse" aria-hidden="true">Charin and Fahlun</h3>
                    </div>
                    <div className="flex items-center justify-end gap-4 w-full flex-wrap">
                        <div className="px-4 rounded-md max-w-full text-transparent bg-gray-200 rounded-md animate-pulse" aria-hidden="true"><span>Update</span></div>
                        <div className="max-w-full text-transparent bg-gray-200 rounded-md animate-pulse" aria-hidden="true">Delete</div>
                    </div>
                </div>
            </div>
        </section>
    )
}