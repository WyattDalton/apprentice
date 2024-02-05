type ViewProps = {
    children: React.ReactNode;
    data?: any;
    type?: string;
}

export default async function View({ children, data, type }: ViewProps) {
    return (
        <div className="view">
            {children}
        </div>
    );
};