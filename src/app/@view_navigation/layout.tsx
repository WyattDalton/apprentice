export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className='rounded-2xl bg-white p-6'>
            {children}
        </div>
    )
}
