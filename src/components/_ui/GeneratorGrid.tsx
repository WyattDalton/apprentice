import Link from "next/link";

export function GeneratorGrid() {
    return (
        <div className="grid grid-cols-2 gap-4 w-full max-w-[400px] mx-auto">
            <Link href="/sources" prefetch={true} className="w-full aspect-[3/2] bg-white rounded-md flex justify-center items-center">
                <h2>Add sources</h2>
            </Link>
            <Link href="/formulas" prefetch={true} className="w-full aspect-[3/2] bg-white rounded-md flex justify-center items-center">
                <h2>Add formulas</h2>
            </Link>
            {/* <Link href="/guides" prefetch={true} className="w-full aspect-[6/2] col-span-full bg-white rounded-md flex justify-center items-center">
                <h2>Get help</h2>
            </Link> */}
        </div>
    )
}