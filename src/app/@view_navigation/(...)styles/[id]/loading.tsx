import ContentSkeleton from "./_components/ContentSkeleton";
import SidebarSkeleton from "./_components/SidebarSkeleton";

export default function Loading() {
    return (
        <section className="
            relative 
            flex-grow 
            h-full 
            grid 
            grid-cols-6
            w-[90%] 
            mx-auto
            gap-4 
        ">
            <ContentSkeleton />
            <SidebarSkeleton />
        </section>
    )
}