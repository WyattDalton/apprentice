import AppNavigation from '@/components/AppNav'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { cookies } from 'next/headers'

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

  const cookieStore = cookies();
  const nonce = cookieStore.get('mkr_user');

  const auth = fetch('https://makerdigital.io/wp-json/wp/v2/makerdigital/v1/get-current-user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-WP-Nonce': `${nonce}`,
    },
  }).then((response) => {
    return response.json()
  }).then((data) => {
    console.log('auth: ', data)
  })

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