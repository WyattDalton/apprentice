'use client';
import Card from "@/components/UI/Card";

type SidebarProps = {
    className?: string,
    category: string,
    tags: string[],
    keywords: string[]
}
function Sidebar({ className, category, tags, keywords }: SidebarProps) {
    return (
        <div className={className}>
            <button className="close-button">Close</button>
            <Card>
                <h2>Tags</h2>
            </Card>
            <Card>
                <h2>Keywords</h2>
            </Card>
            <Card>
                <h2>Category</h2>
            </Card>
        </div>
    )
}

export default Sidebar