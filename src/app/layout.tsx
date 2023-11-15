import AppNavigation from '@/components/AppNav'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/components/utils/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Apprentice',
  description: 'Apprentice | The marketing assistant by Maker Digital',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
  }) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="bg-slate-100 flex flex-col gap-4 min-h-screen">
            <AppNavigation />
            <div className="flex flex-col grow-1 w-full flex-grow">
              {children}
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}