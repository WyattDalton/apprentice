import ViewTableSkeleton from "@/components/_skeletons/ViewTableSkeleton";

export default function Loading() {
    return (
        <section className="flex-grow inset-0 bg-[radial-gradient(#e2e2e2_1px,transparent_1px)] [background-size:16px_16px] px-[5%]">
            <ViewTableSkeleton />
        </section>)
}