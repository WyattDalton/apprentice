export default function DefaultSingleLoading() {
    return (
        <>
            <div className="fixed w-screen h-screen backdrop-blur-sm"></div>
            <section className="inset-0 bg-[radial-gradient(#e2e2e2_1px,transparent_1px)] [background-size:16px_16px] flex flex-col flex-grow px-[5%]">
                <div className="w-full max-w-[800px] mx-auto bg-white rounded-lg p-4 my-4 flex flex-col flex-grow gap-4"></div>
            </section>
        </>
    )
}