import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/navigation'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Nhà trọ Cần Thơ',
  description: 'Ứng dụng quản lý phòng trọ hiện đại và tiện lợi',
  generator: 'v0.dev',
  manifest: '/manifest.json',
}

export const viewport = {
  themeColor: '#0ea5e9',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <Navigation />
          <Toaster position="top-center" reverseOrder={false} />
          <div className="pb-16 md:pb-0" />
        </ThemeProvider>
      </body>
    </html>
  )
}
