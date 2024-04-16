import GeneratorGridSkeleton from "./GeneratorGridSkeleton";

export default function generatorSkeleton() {
    return (
        <section className="flex flex-col gap-4 flex-grow p-4 pb-8">

            <div className="w-full place-content-center flex-grow place-content-center inset-0 bg-[radial-gradient(#e2e2e2_1px,transparent_1px)] [background-size:16px_16px] px-[5%]">
                <GeneratorGridSkeleton />
            </div>

            <div className={`bg-white rounded-lg shadow-lg p-4 w-full max-w-[800px] mx-auto !overflow-visible !mb-0 flex flex-col gap-4 p-4`}>
                <div className="flex gap-2 justify-end align-center">
                    <div className={`h-6 w-6 p-2 rounded-full text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-300`}></div>
                </div>
            </div>

        </section>
    )
}