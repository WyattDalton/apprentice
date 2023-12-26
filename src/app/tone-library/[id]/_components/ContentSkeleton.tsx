export default function ContentSkeleton() {
    return (
        <>
            <div className={`col-span-6 lg:col-span-4 flex flex-col items-center gap-4 bg-[radial-gradient(#e2e2e2_1px,transparent_1px)] [background-size:13px_13px] py-[5%] px-[2.5%]`} aria-hidden="true">
                <div className="flex flex-col gap-4 prose w-full">
                    <div className="!p-0 bg-white rounded-md">
                        <div className="w-full text-2xl font-bold p-2 text-transparent bg-gray-200 animate-pulse">Cattle Dog Social</div>
                    </div>
                    <div className="flex flex-col gap-4 p-4">
                        <div className="w-full mx-auto flex justify-end items-center gap-4">
                            <div className={`py-2 px-4 rounded-md w-full ml-auto flex justify-end items-center gap-2 text-xl font-bold`}>
                                <span className="text-transparent bg-gray-200 animate-pulse rounded-md">Add new example'</span>
                            </div>

                        </div>

                        <div className="flex flex-col gap-2 !bg-white rounded-md p-4">
                            <h3 className="text-lg font-bold !m-0 text-transparent bg-gray-200 animate-pulse">Example 1</h3>

                            <div className="w-full text-lg rounded-md p-2 text-transparent bg-gray-200 animate-pulse">
                                {`UPDATE!!! 💥💥We passed!!! See you all on Saturday 10/28 at 7am & @thecowbellkitchen to open 8am for brunch Thank you @haleigh.bei for these last day photos of our previous spot. You did an amazing job capturing our friends & family. Check her out Ramona! Time flies & I cannot believe it’s almost been a month since we closed at 632 Main. Today, we get our inspection for our new location & to tell you I haven’t been nervous & anxious would be an understatement. I want nothing more than for you all to enjoy our beautiful new space! Send positive vibes for todays inspection & if all goes well (which we are confident it will) then we are still on target for 10/28. Keep you posted…🤞🏼`}
                            </div>

                            <div className="flex gap-2 ml-auto">
                                <div className="text-transparent bg-gray-200 animate-pulse">Delete Example</div>
                            </div>

                        </div>


                    </div>
                </div>
            </div>
        </>
    )
}