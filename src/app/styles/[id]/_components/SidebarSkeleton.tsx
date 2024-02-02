export default function SidebarSkeleton() {
    return (
        <div className={`col-span-6 md:col-span-2 gap-4 rounded-lg sticky bottom-0 lg:flex lg:flex-col lg:justify-end lg:flex-grow p-0 lg:p-4 bg-transparent lg:bg-neutral-50`}>
            <div className="sticky bottom-4 w-full bg-white rounded-lg flex flex-wrap justify-between items-center gap-4 p-4 shadow-[0_-5px_15px_-15px_rgba(0,0,0,0.6)]">
                <h3 className="mt-0 mb-0 flex-grow lg:text-center lg:flex-grow-0 bg-gray-200 rounded-md animate-pulse text-transparent">{`cattle dog social`}</h3>

                <div className="flex items-center justify-center gap-4 flex-wrap flex-grow lg:flex-grow-0">
                    <div className="px-4 py-2 flex gap-2 justify-center items-center bg-gray-200 rounded-md animate-pulse text-transparent">Update </div>
                    <div className="bg-gray-200 rounded-md animate-pulse text-transparent">Delete</div>
                </div>

            </div>
        </div>
    );
}