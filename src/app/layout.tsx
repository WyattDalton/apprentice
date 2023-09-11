import AppNavigation from '@/components/AppNav'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

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
        <div className="flex min-h-screen bg-gray-100 p-4 gap-4">
          <div className="flex flex-col w-1/4 max-w-[300px]">
            <AppNavigation />
          </div>
          <div className="flex flex-col min-h-screen grow-1 w-full">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}