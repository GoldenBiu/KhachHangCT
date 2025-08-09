"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, FileText, Receipt, MessageCircle, LogOut, Home, Mail, Phone, Sun, Moon, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart'
import { cn } from '@/lib/utils'
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
import { useCurrentKhachHang } from '@/hooks/use-khachhang'
import { useHoaDon } from '@/hooks/use-hoadon'
import { useLichSuThanhToan } from '@/hooks/use-lichsu-thanh-toan'
import { useHopDong } from '@/hooks/use-hopdong'

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
  const [largeText, setLargeText] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardStep, setOnboardStep] = useState(0)
  const { khachHang } = useCurrentKhachHang()
  const { hoaDon } = useHoaDon()
  const { hopDong } = useHopDong()
  const { records: payRecords, summary: paySummary, loading: payLoading, error: payError, refresh: refreshPay } = useLichSuThanhToan()

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

  // Onboarding minimal (3 steps, first visit)
  useEffect(() => {
    const seen = localStorage.getItem('onboarding_v1_seen')
    if (!seen) setShowOnboarding(true)
  }, [])

  const closeOnboarding = () => {
    localStorage.setItem('onboarding_v1_seen', '1')
    setShowOnboarding(false)
    setOnboardStep(0)
  }

  // Seasonal gradient classes (predefined to keep Tailwind from purging)
  const season = (() => {
    const m = new Date().getMonth() + 1
    if (m === 1 || m === 2) return 'tet' // Tết
    if (m === 9) return 'midautumn' // Trung thu
    if (m >= 5 && m <= 8) return 'summer'
    return 'default'
  })()
  const seasonGradient = (
    season === 'tet' ? 'from-rose-500/10 to-amber-300/20' :
    season === 'midautumn' ? 'from-amber-200/20 to-yellow-300/20' :
    season === 'summer' ? 'from-sky-200/20 to-cyan-300/20' :
    'from-slate-50 to-blue-50'
  )

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
    <div className={cn("min-h-screen bg-gradient-to-br dark:from-slate-900 dark:to-gray-900", seasonGradient)}>
      <div className={cn("container mx-auto px-4 py-8", largeText ? 'text-[1.05rem]' : '', highContrast ? 'filter contrast-125' : '')}>
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
            <Button variant="outline" size="sm" onClick={() => setLargeText(v => !v)} title="Cỡ chữ lớn (A11y)">
              A+
            </Button>
            <Button variant="outline" size="sm" onClick={() => setHighContrast(v => !v)} title="Chế độ tương phản cao">
              HC
            </Button>
            
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
        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
          <CardContent className="p-6">
            <div className="pointer-events-none absolute -top-10 -left-8 h-40 w-40 bg-white/20 blur-3xl rounded-full" />
            <div className="pointer-events-none absolute -bottom-12 -right-10 h-48 w-48 bg-white/10 blur-3xl rounded-full" />
            <div className="relative flex items-center gap-6">
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
                <Button size="sm" variant="secondary" className="bg-white/15 hover:bg-white/25" onClick={() => router.push('/payment-history')}>
                  <Receipt className="h-4 w-4 mr-2" /> Lịch sử
                </Button>
                <Button size="sm" variant="secondary" className="bg-white/15 hover:bg-white/25" onClick={() => router.push('/contact')}>
                  <MessageCircle className="h-4 w-4 mr-2" /> Liên hệ
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="group rounded-xl p-4 bg-white/70 dark:bg-white/5 backdrop-blur border border-white/20 dark:border-white/10 shadow hover:shadow-lg transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white shadow">
                <Home className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Phòng đang thuê</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{(khachHang as any)?.HopDongsDangThue?.[0]?.Phong?.DayPhong || '-'}{(khachHang as any)?.HopDongsDangThue?.[0]?.Phong?.SoPhong ? ` • ${(khachHang as any)?.HopDongsDangThue?.[0]?.Phong?.SoPhong}` : ''}</p>
              </div>
            </div>
          </div>
          <div className="group rounded-xl p-4 bg-white/70 dark:bg-white/5 backdrop-blur border border-white/20 dark:border-white/10 shadow hover:shadow-lg transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow">
                <Receipt className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Hóa đơn chưa thanh toán</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{Array.isArray(hoaDon) ? hoaDon.filter((i:any)=>!(i.TrangThaiThanhToan==='Y'||i.TrangThaiThanhToan==='1'||i.TrangThaiThanhToan==='true')).length : 0}</p>
              </div>
            </div>
          </div>
          <div className="group rounded-xl p-4 bg-white/70 dark:bg-white/5 backdrop-blur border border-white/20 dark:border-white/10 shadow hover:shadow-lg transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Ngày tham gia</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{
                  (() => {
                    const hd = Array.isArray(hopDong) ? hopDong[0] : null
                    const d = hd?.NgayBatDau || hd?.NgayTaoHopDong
                    return d ? new Date(d as any).toLocaleDateString('vi-VN') : '—'
                  })()
                }</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment History Preview */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center"><Receipt className="h-5 w-5 mr-2"/>Lịch sử thanh toán gần đây</CardTitle>
              <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white" onClick={() => router.push('/payment-history')}>Xem tất cả</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {payLoading ? (
              <div className="p-6 text-gray-600 dark:text-gray-300">Đang tải...</div>
            ) : payError ? (
              <div className="p-6 text-center">
                <AlertCircle className="h-6 w-6 mx-auto mb-2 text-red-600" />
                <p className="text-red-600 mb-2">{payError}</p>
                <Button onClick={refreshPay}>Thử lại</Button>
              </div>
            ) : (payRecords && payRecords.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Số lần thanh toán</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{paySummary.soLanThanhToan}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Tổng đã thanh toán</p>
                    <p className="text-lg font-bold text-emerald-600 break-words">{paySummary.tongDaThanhToan.toLocaleString('vi-VN')} VND</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 italic">{numberToVietnameseWords(paySummary.tongDaThanhToan)} đồng</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Tổng nợ</p>
                    <p className="text-lg font-bold text-red-600 break-words">{paySummary.tongNo.toLocaleString('vi-VN')} VND</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 italic">{numberToVietnameseWords(paySummary.tongNo)} đồng</p>
                  </div>
                </div>
                {payRecords.slice(0,5).map((r) => {
                  const isPaid = r.TrangThaiThanhToan === 'Y'
                  const tong = (r.TongTien ?? 0).toLocaleString('vi-VN')
                  return (
                    <div key={r.ChiSoID} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isPaid ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'}`}>
                          {isPaid ? <CheckCircle2 className="h-5 w-5"/> : <Clock className="h-5 w-5"/>}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">Tháng {r.ThangNam}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Điện: {r.SoDienDaTieuThu ?? 0} • Nước: {r.SoNuocDaTieuThu ?? 0}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{tong} VND</p>
                        <p className={`text-sm ${isPaid ? 'text-emerald-600' : 'text-yellow-600'}`}>{isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="p-6 text-gray-600 dark:text-gray-300">Chưa có lịch sử thanh toán</div>
            ))}
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
        {/* Consumption Chart */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle>Biểu đồ tiêu thụ điện nước</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ConsumptionChart />
          </CardContent>
        </Card>
      {/* Onboarding overlay */}
      {showOnboarding && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-lg w-full p-6">
            <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">Chào mừng!</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {onboardStep === 0 && 'Đây là thẻ chào mừng: bạn có thể đổi ảnh đại diện và xem thông tin nhanh.'}
              {onboardStep === 1 && 'Tại đây là biểu đồ tiêu thụ điện nước theo tháng và ước tính hóa đơn.'}
              {onboardStep === 2 && 'Phía dưới là lịch sử thanh toán gần đây và các tính năng chính.'}
            </p>
            <div className="flex justify-end gap-2">
              {onboardStep > 0 && (
                <Button variant="outline" onClick={() => setOnboardStep(s => s - 1)}>Quay lại</Button>
              )}
              {onboardStep < 2 ? (
                <Button onClick={() => setOnboardStep(s => s + 1)}>Tiếp</Button>
              ) : (
                <Button onClick={closeOnboarding}>Bắt đầu</Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function numberToVietnameseWords(n: number): string {
  if (!Number.isFinite(n) || n < 0) return ''
  if (n === 0) return 'không'
  const units = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ']
  const digitWords = ['không','một','hai','ba','bốn','năm','sáu','bảy','tám','chín']

  const readTriple = (num: number, full: boolean): string => {
    const tr = Math.floor(num / 100)
    const ch = Math.floor((num % 100) / 10)
    const dv = num % 10
    let out = ''
    if (full || tr > 0) {
      out += `${digitWords[tr]} trăm`
      if (ch === 0 && dv > 0) out += ' lẻ'
    }
    if (ch > 1) {
      out += ` ${digitWords[ch]} mươi`
      if (dv === 1) out += ' mốt'
      else if (dv === 5) out += ' lăm'
      else if (dv > 0) out += ` ${digitWords[dv]}`
    } else if (ch === 1) {
      out += ' mười'
      if (dv === 5) out += ' lăm'
      else if (dv > 0) out += ` ${digitWords[dv]}`
    } else if (dv > 0 && (full || tr > 0)) {
      out += ` ${digitWords[dv]}`
    } else if (dv > 0) {
      out += `${digitWords[dv]}`
    }
    return out.trim()
  }

  let result: string[] = []
  let i = 0
  while (n > 0 && i < units.length) {
    const triple = n % 1000
    if (triple > 0) {
      const full = i > 0
      const part = readTriple(triple, full)
      result.unshift(`${part} ${units[i]}`.trim())
    }
    n = Math.floor(n / 1000)
    i++
  }
  return result.join(' ').replace(/\s+/g, ' ').trim()
}

// Build chart data from payment records
function ConsumptionChart() {
  const { records } = useLichSuThanhToan()
  const list = records || []
  const data = list.slice(0, 6).map((r: any) => ({
    month: r.ThangNam,
    dien: r.SoDienDaTieuThu || 0,
    nuoc: r.SoNuocDaTieuThu || 0,
    tong: r.TongTien || 0,
  })).reverse()
  const estimate = data.length ? Math.round(data[data.length - 1].tong * 1.02) : 0
  const config = {
    dien: { label: 'Điện', color: 'oklch(65% 0.2 260)' },
    nuoc: { label: 'Nước', color: 'oklch(70% 0.12 200)' },
    tong: { label: 'Tổng', color: 'oklch(60% 0.18 30)' },
  }

  return (
    <div className="space-y-2">
      <ChartContainer config={config as any} className="aspect-[16/7]">
        <BarChart data={data}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} formatter={(val: any, name: any) => [val?.toLocaleString('vi-VN') + ' VND', name]} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="dien" fill="var(--color-dien)" radius={4} />
          <Bar dataKey="nuoc" fill="var(--color-nuoc)" radius={4} />
          <Line type="monotone" dataKey="tong" stroke="var(--color-tong)" strokeWidth={2} dot={false} />
        </BarChart>
      </ChartContainer>
      <p className="text-xs text-gray-600 dark:text-gray-300">Ước tính hóa đơn tháng này: <span className="font-semibold">{estimate.toLocaleString('vi-VN')} VND</span> (tăng 2% so với trung bình gần đây)</p>
    </div>
  )
}
