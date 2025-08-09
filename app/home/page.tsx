"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, FileText, Receipt, MessageCircle, LogOut, Home, Mail, Phone, Sun, Moon } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface UserInfo {
  HoTen?: string
  TenDangNhap: string
  Email?: string
}

export default function HomePage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const token = localStorage.getItem('userToken')
    if (!token) {
      router.replace('/login')
      return
    }

    const storedUserInfo = localStorage.getItem('userInfo')
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo))
    }
  }, [router])

  // Sync theme with html class for next-themes minimal usage
  useEffect(() => {
    setMounted(true)
    const html = document.documentElement
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null
    const initial = stored || 'light'
    setTheme(initial)
    html.classList.toggle('dark', initial === 'dark')
  }, [])

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    const html = document.documentElement
    html.classList.toggle('dark', next === 'dark')
    localStorage.setItem('theme', next)
  }

  // Load stored avatar when user info is available
  useEffect(() => {
    if (!userInfo?.TenDangNhap) return
    const key = `userAvatar_${userInfo.TenDangNhap}`
    const saved = localStorage.getItem(key)
    if (saved) setAvatarUrl(saved)
  }, [userInfo?.TenDangNhap])

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      setAvatarUrl(dataUrl)
      if (userInfo?.TenDangNhap) {
        const key = `userAvatar_${userInfo.TenDangNhap}`
        localStorage.setItem(key, dataUrl)
      }
    }
    reader.readAsDataURL(file)
    // reset input so selecting the same file again still triggers change
    e.currentTarget.value = ''
  }

  const handleLogout = () => {
    localStorage.removeItem('userToken')
    localStorage.removeItem('userInfo')
    router.replace('/login')
  }

  const menuItems = [
    {
      title: 'Hồ Sơ Cá Nhân',
      description: 'Xem và quản lý thông tin cá nhân',
      icon: User,
      href: '/profile',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Hợp Đồng',
      description: 'Xem và quản lý hợp đồng thuê phòng',
      icon: FileText,
      href: '/contract',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Hóa Đơn',
      description: 'Xem lịch sử và thanh toán hóa đơn',
      icon: Receipt,
      href: '/invoice',
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Liên Hệ',
      description: 'Hỗ trợ và liên hệ với quản lý',
      icon: MessageCircle,
      href: '/contact',
      color: 'from-purple-500 to-pink-500'
    }
  ]

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-pulse">Đang tải...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Home className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Trang Chủ</h1>
              <p className="text-gray-600 dark:text-gray-300">Chào mừng trở lại!</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {mounted && (
              <Button variant="outline" size="icon" onClick={toggleTheme} title="Đổi giao diện">
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            )}
            
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                <LogOut className="h-4 w-4 mr-2" />
                Đăng xuất
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận đăng xuất</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
                  Đăng xuất
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        </div>

        {/* User Info Card */}
        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar
                  className="h-16 w-16 border-2 border-white/20 cursor-pointer hover:ring-2 hover:ring-white/40"
                  onClick={handleAvatarClick}
                  title="Nhấp để đổi ảnh đại diện"
                >
                  {avatarUrl ? (
                    <AvatarImage src={avatarUrl} alt="Ảnh đại diện" />
                  ) : null}
                  <AvatarFallback className="bg-white/20 text-white text-lg font-semibold">
                    {userInfo.HoTen ? userInfo.HoTen.charAt(0).toUpperCase() : userInfo.TenDangNhap.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">
                  Xin chào, {userInfo.HoTen || 'Người dùng'}!
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  <div className="flex items-center text-white/90">
                    <User className="h-4 w-4 mr-2" />
                    <span className="text-sm">Tên đăng nhập: {userInfo.TenDangNhap}</span>
                  </div>
                  {userInfo.Email && (
                    <div className="flex items-center text-white/90">
                      <Mail className="h-4 w-4 mr-2" />
                      <span className="text-sm">Email: {userInfo.Email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick actions to reduce empty space */}
              <div className="hidden md:flex items-center gap-2">
                <Button size="sm" variant="secondary" className="bg-white/15 hover:bg-white/25" onClick={() => router.push('/invoice')}>
                  <Receipt className="h-4 w-4 mr-2" /> Hóa đơn
                </Button>
                <Button size="sm" variant="secondary" className="bg-white/15 hover:bg-white/25" onClick={() => router.push('/contract')}>
                  <FileText className="h-4 w-4 mr-2" /> Hợp đồng
                </Button>
                <Button size="sm" variant="secondary" className="bg-white/15 hover:bg-white/25" onClick={() => router.push('/contact')}>
                  <MessageCircle className="h-4 w-4 mr-2" /> Liên hệ
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <Card 
                key={index}
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg overflow-hidden"
                onClick={() => router.push(item.href)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
