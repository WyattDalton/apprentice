import AddSourceSkeleton from "./_components/AddSourceSkeleton";
import GridSkeleton from "./_components/GridSkeleton";

export default function Loading() {
    return (
        <section className='w-[90%] mx-auto flex flex-col gap-4 h-full flex-grow'>
            <AddSourceSkeleton />
            <GridSkeleton />
        </section>
    )
}