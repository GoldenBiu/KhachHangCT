"use client"

import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Home, User, FileText, Receipt, MessageCircle } from 'lucide-react'

export default function Navigation() {
  const router = useRouter()
  const pathname = usePathname()

  // Don't show navigation on login, forgot-password, or other auth pages
  const isAuthPage = ['/login', '/forgot-password', '/register'].includes(pathname)
  
  if (isAuthPage) {
    return null
  }

  const navItems = [
    { href: '/home', icon: Home, label: 'Trang chủ' },
    { href: '/profile', icon: User, label: 'Hồ sơ' },
    { href: '/contract', icon: FileText, label: 'Hợp đồng' },
    { href: '/invoice', icon: Receipt, label: 'Hóa đơn' },
    { href: '/contact', icon: MessageCircle, label: 'Liên hệ' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 md:hidden no-print">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Button
              key={item.href}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center space-y-1 ${
                isActive ? 'text-blue-600' : 'text-gray-600'
              }`}
              onClick={() => router.push(item.href)}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </Button>
          )
        })}
      </div>
    </nav>
  )
}
