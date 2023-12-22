export default function NewContentGridSkeleton() {
    return (
        <>
            <div className="grid grid-cols-2 gap-4 animate-pulse">
                <div className="h-full w-[100px] h-[100px] bg-gray-200 rounded mb-2"></div>
                <div className="h-full w-[100px] h-[100px] bg-gray-200 rounded mb-2"></div>
                <div className="h-full w-[100px] h-[100px] bg-gray-200 rounded mb-2"></div>
                <div className="h-full w-[100px] h-[100px] bg-gray-200 rounded mb-2"></div>
            </div>
        </>
    )
}