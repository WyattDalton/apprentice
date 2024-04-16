
export default function GeneratorGridSkeleton() {
    return (
        <div className="grid grid-cols-2 gap-4 animate-pulse max-w-[400px] m-auto">
            <div className="w-full aspect-[3/2] bg-gray-200 rounded mb-2"></div>
            <div className="w-full aspect-[3/2] bg-gray-200 rounded mb-2"></div>
            <div className="w-full aspect-[3/2] bg-gray-200 rounded mb-2"></div>
            <div className="w-full aspect-[3/2] bg-gray-200 rounded mb-2"></div>
        </div>
    )
}