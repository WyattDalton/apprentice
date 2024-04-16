
export default function RootLayout({
    children,
    single,
}: {
    children: React.ReactNode,
    single: React.ReactNode,
}) {

    return (
        <>
            {single}
            {children}
        </>
    )
}