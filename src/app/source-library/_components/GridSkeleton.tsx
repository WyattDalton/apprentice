
const GridItem = () => {
    return (
        <div className="bg-white rounded-md col-span-1 !m-0 prose p-4">
            <div className="flex items-center justify-start gap-4 text-sm mb-2">
                <div className="w-6 h-6 p-2 rounded-md bg-gray-200 animate-pulse" />
                <h3 className="mt-0 mb-0 line-clamp-2 text-transparent bg-gray-200 animate-pulse">{`Charin and Fahlun 1(A Game)`}</h3>
            </div>
            <p className="line-clamp-3 text-xs text-transparent bg-gray-200 animate-pulse rounded-md mb-2">
                {`talking, normally, would not be this hard.Lowering himself below the brush, he slowly crawled his way forward through the snow.
                It was fresh powder, the flaky white kind that stuck to his fur and froze his nose.
                His lips pulled back in a snarl as he shook his head—careful not to let his ears slap and give away his position—trying to get the snow off of his face.`}
            </p>
            <div className="flex items-center justify-end gap-4 w-full">
                <div className="px-4 rounded-md text-transparent bg-gray-200 animate-pulse">Edit</div>
                <div className="text-transparent bg-gray-200 animate-pulse">Delete</div>
            </div>
        </div>
    )
}


export default function Loading() {

    return (
        <div className="flex-grow grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-min inset-0 bg-[radial-gradient(#e2e2e2_1px,transparent_1px)] [background-size:13px_13px] py-[5%] px-[2.5%]">
            {Array(4).fill(<GridItem />)}
        </div>
    )
}