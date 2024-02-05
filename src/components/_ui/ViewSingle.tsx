type viewSingleProps = {
    children: React.ReactNode;
    data?: any;
    type?: string;
}

export default async function ViewSingle({ children, data, type }: viewSingleProps) {
    return (
        <div className="view-single">
            {children}
        </div>
    );
};