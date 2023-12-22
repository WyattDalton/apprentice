import Card from "@/components/UI/Card";

export default function GeneratorContentSkeleton() {
    return (
        <>
            <div className="relative truncate bg-gray-200 text-gray-700 py-1 px-4 rounded-full w-min max-w-full mt-4 text-transparent bg-gray-200 animate-pulse mb-4" aria-hidden="true">
                {`write an epic poem like beowolf, but in the style of a sixth grader fdrom tennessee`.replace(/'/g, "&apos;")}
            </div>
            <div className="relative mb-4">
                <div className="flex flex-col prose mx-auto relative">
                    <span className="mb-2 text-transparent bg-gray-200 animate-pulse rounded-md" aria-hidden="true">{`In the land of Tennessee, where the rivers wide do flow, A tale unfolded long ago, of a hero grand and bold. His name was Billy Joe McBride, a sixth-grader with pride, Who battled beasts and bullies with a heart that's pure as gold.`.replace(/'/g, "&apos;")}</span>
                </div>
            </div>
            <div className="relative truncate bg-gray-200 text-gray-700 py-1 px-4 rounded-full w-min max-w-full mt-4 text-transparent bg-gray-200 animate-pulse mb-4" aria-hidden="true">
                {`write an`.replace(/'/g, "&apos;")}
            </div>
            <div className="relative mb-4">
                <div className="flex flex-col prose mx-auto relative">
                    <span className="mb-2 text-transparent bg-gray-200 animate-pulse rounded-md" aria-hidden="true">{`In the land of Tennessee, where the rivers.`.replace(/'/g, "&apos;")}</span>
                </div>
            </div>

            <div className="relative truncate bg-gray-200 text-gray-700 py-1 px-4 rounded-full w-min max-w-full mt-4 text-transparent bg-gray-200 animate-pulse mb-4" aria-hidden="true">
                {`write an epic poem like beowolf`.replace(/'/g, "&apos;")}
            </div>
        </>
    )
}