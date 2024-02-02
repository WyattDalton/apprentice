export default function Loading() {
    return (
        <div className="w-full bg-white rounded-md p-4" aria-hidden="true">

            <div className="flex flex-col md:flex-row gap-2 items-center justify-between mb-2 mx-auto">
                <h2 className="m-0 text-transparent bg-gray-200 rounded-md animate-pulse">Add a Source</h2>
                <div className="flex bg-gray-100 px-4 py-2 rounded-full gap-2">
                    <div className="ui-selected:bg-gray-700 px-4 py-2 rounded-full text-transparent bg-gray-200 animate-pulse">Files</div>
                    <div className="ui-selected:bg-gray-700 px-4 py-2 rounded-full text-transparent bg-gray-200 animate-pulse">Urls</div>
                </div>
            </div>
            <div
                className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 p-4 rounded-md"
            >
                <div className="flex flex-col items-center justify-center w-full h-full gap-2">
                    <p className="text-transparent bg-gray-200 rounded-md animate-pulse">Drag and drop a file here</p>
                    <p className="text-transparent bg-gray-200 rounded-md animate-pulse">or</p>
                    <div className="px-4 py-2 text-transparent bg-gray-200 rounded-md animate-pulse">
                        Select a file
                    </div>
                </div>


            </div>
        </div>
    )
}