import AppNavigation from '@/components/_ui/AppNav'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/utils/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Apprentice',
  description: 'Apprentice | The marketing assistant by Maker Digital',
}

export default function RootLayout({
  children,
  view_navigation,
}: {
    children: React.ReactNode,
    view_navigation: React.ReactNode,
  }) {

  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-100`}>
        <AuthProvider>
          <div className=" flex flex-col gap-4 min-h-screen">
            <AppNavigation views={view_navigation} />
            <div className="flex flex-col grow-1 w-full flex-grow">
              {children}
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}