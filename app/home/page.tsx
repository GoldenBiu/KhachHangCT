"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, FileText, Receipt, MessageCircle, LogOut, Home, Mail, Phone, Sun, Moon, Calendar, CheckCircle2, Clock, AlertCircle, TrendingUp, TrendingDown, Cloud, Thermometer, Droplets, Wind, Gauge, X } from 'lucide-react'
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
import { useLichSuThanhToan, isPaidStatus, isPaidRecord } from '@/hooks/use-lichsu-thanh-toan'
import { useHopDong } from '@/hooks/use-hopdong'
import ThemeSelector from '@/components/theme-selector'
import { useTheme } from '@/hooks/use-theme'

interface UserInfo {
  HoTen?: string
  TenDangNhap: string
  Email?: string
  KhachHangID?: string | number
}

interface WeatherData {
  dia_diem: string
  thoi_tiet: string
  nhiet_do: string
  do_am: string
  toc_do_gio: string
  ap_suat: string
  bieu_tuong: string
}

export default function HomePage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [largeText, setLargeText] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardStep, setOnboardStep] = useState(0)
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [weatherLoading, setWeatherLoading] = useState(true)
  const [weatherError, setWeatherError] = useState<string | null>(null)
  const { khachHang } = useCurrentKhachHang()
  const { hoaDon } = useHoaDon()
  const { hopDong } = useHopDong()
  const { records: payRecords, summary: paySummary, loading: payLoading, error: payError, refresh: refreshPay } = useLichSuThanhToan()
  const { currentTheme, changeTheme, getThemeClasses } = useTheme()
  const [showUserCard, setShowUserCard] = useState(true)
  const [showWeatherCard, setShowWeatherCard] = useState(true)

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
  }, [])

  // Load dismissed cards state
  useEffect(() => {
    try {
      const hideUser = localStorage.getItem('hide_user_card') === '1'
      const hideWeather = localStorage.getItem('hide_weather_card') === '1'
      if (hideUser) setShowUserCard(false)
      if (hideWeather) setShowWeatherCard(false)
    } catch {}
  }, [])

  const dismissUserCard = () => {
    setShowUserCard(false)
    try { localStorage.setItem('hide_user_card', '1') } catch {}
  }
  const dismissWeatherCard = () => {
    setShowWeatherCard(false)
    try { localStorage.setItem('hide_weather_card', '1') } catch {}
  }
  const restoreUserCard = () => {
    setShowUserCard(true)
    try { localStorage.removeItem('hide_user_card') } catch {}
  }
  const restoreWeatherCard = () => {
    setShowWeatherCard(true)
    try { localStorage.removeItem('hide_weather_card') } catch {}
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

  // Sync KhachHangID from khachHang data when available (avoid render loop)
  useEffect(() => {
    if (!khachHang?.KhachHangID) return
    setUserInfo(prev => {
      if (!prev) return prev
      if (prev.KhachHangID === khachHang.KhachHangID) return prev
      return { ...prev, KhachHangID: khachHang.KhachHangID }
    })
  }, [khachHang?.KhachHangID])

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

  // Fetch weather data
  const fetchWeather = async () => {
    try {
      setWeatherLoading(true)
      setWeatherError(null)
      // Bust caches aggressively and avoid stale values
      const url = `https://all-oqry.onrender.com/api/thoitiet/can-tho?t=${Date.now()}`
      const response = await fetch(url, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } })
      if (!response.ok) {
        throw new Error('Không thể lấy dữ liệu thời tiết')
      }
      let data = await response.json()

      // Cross-check with Open-Meteo for real-time precipitation; if raining, reflect it
      try {
        const omUrl = 'https://api.open-meteo.com/v1/forecast?latitude=10.0452&longitude=105.7469&current=temperature_2m,relative_humidity_2m,precipitation,rain,showers,cloud_cover,wind_speed_10m,pressure_msl'
        const omRes = await fetch(omUrl, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } })
        const om = await omRes.json()
        const rainNow = Number(om?.current?.rain ?? 0) + Number(om?.current?.showers ?? 0)
        const precipitation = Number(om?.current?.precipitation ?? 0)
        const isRaining = (rainNow > 0.02) || (precipitation > 0.02)
        if (isRaining) {
          const lower = String(data?.thoi_tiet || '').toLowerCase()
          const alreadyRainy = lower.includes('mưa') || lower.includes('rain') || lower.includes('shower')
          if (!alreadyRainy) {
            data = { ...data, thoi_tiet: 'Mưa rải rác' }
          }
        }
      } catch {
        // ignore fallback errors; keep primary data
      }

      setWeatherData(data)
    } catch (error) {
      console.error('Lỗi thời tiết:', error)
      setWeatherError('Không thể tải thông tin thời tiết')
    } finally {
      setWeatherLoading(false)
    }
  }

  // Generate weather-based suggestions
  const getWeatherSuggestions = useCallback((weatherData: WeatherData) => {
    const suggestions: string[] = []
    const temp = parseFloat(weatherData.nhiet_do.replace('°C', ''))
    const humidity = parseInt(weatherData.do_am.replace('%', ''))
    const windSpeed = parseFloat(weatherData.toc_do_gio.replace(' m/s', ''))
    const weatherDesc = weatherData.thoi_tiet.toLowerCase()

    // Determine day vs night to tailor advice
    const hour = new Date().getHours()
    const isNight = hour < 6 || hour >= 20

    // Friendly greeting to reduce monotony; will be kept as the first suggestion
    if (isNight) {
      suggestions.push('🌙 Đêm khuya rồi, hãy ngủ sớm để giữ sức khỏe. Chúc bạn ngủ ngon!')
    } else if (hour >= 5 && hour < 12) {
      suggestions.push('🌅 Chào buổi sáng! Chúc bạn một ngày mới tốt lành và tràn đầy năng lượng!')
    } else if (hour >= 12 && hour < 18) {
      suggestions.push('🌤️ Chúc buổi chiều nhẹ nhàng, nhớ nghỉ mắt và uống nước!')
    } else {
      suggestions.push('🌆 Buổi tối thư giãn, dành thời gian cho gia đình và bản thân nhé!')
    }

    // Temperature-based suggestions (day/night aware)
    if (temp < 18) {
      suggestions.push(isNight
        ? '🌡️ Trời lạnh về đêm, giữ ấm khi ngủ và hạn chế ra ngoài!'
        : '🌡️ Trời lạnh, nhớ mặc ấm và uống trà nóng nhé!')
    } else if (temp < 22) {
      suggestions.push(isNight
        ? '🧥 Trời mát về đêm, nếu cần ra ngoài nhớ mặc ấm!'
        : '🧥 Trời mát, nên mặc áo khoác nhẹ!')
    } else if (temp >= 22 && temp <= 28) {
      if (isNight) {
        suggestions.push('😴 Thời tiết dễ chịu. Hiện là ban đêm, ưu tiên nghỉ ngơi; nếu cần, vận động nhẹ trong nhà!')
      } else {
        suggestions.push('☀️ Thời tiết dễ chịu, thích hợp để ra ngoài và hoạt động!')
      }
    } else if (temp > 28 && temp <= 32) {
      if (isNight) {
        suggestions.push('🌤️ Trời ấm. Ban đêm nên hạn chế hoạt động ngoài trời, uống đủ nước và nghỉ ngơi!')
      } else {
        suggestions.push('🌤️ Trời ấm, thích hợp để đi dạo buổi chiều!')
      }
    } else if (temp > 32) {
      suggestions.push('🔥 Trời nóng, hãy uống nhiều nước và tránh ra ngoài giữa trưa!')
    }

    // Weather condition-based suggestions (day/night aware)
    if (weatherDesc.includes('mưa') || weatherDesc.includes('drizzle') || weatherDesc.includes('rain') || weatherDesc.includes('shower')) {
      suggestions.push('☔ Trời đang mưa, nhớ mang theo ô và áo mưa nhé!')
      suggestions.push('🚗 Đường trơn trượt, lái xe cẩn thận!')
      suggestions.push('🏠 Nên ở trong nhà hoặc tìm nơi trú mưa!')
    } else if (weatherDesc.includes('nắng') || weatherDesc.includes('sunny') || weatherDesc.includes('fair') || (weatherDesc.includes('clear') && !isNight)) {
      suggestions.push('🕶️ Trời nắng đẹp, nhớ đeo kính râm và bôi kem chống nắng!')
      suggestions.push('🌴 Thích hợp để đi picnic hoặc hoạt động ngoài trời!')
    } else if (weatherDesc.includes('clear') && isNight) {
      suggestions.push('🌙 Trời quang đãng. Ban đêm nên nghỉ ngơi; nếu ra ngoài, chú ý an toàn!')
    } else if (weatherDesc.includes('mây') || weatherDesc.includes('cloud')) {
      if (weatherDesc.includes('u ám') || weatherDesc.includes('overcast') || weatherDesc.includes('scattered')) {
        suggestions.push('☁️ Trời âm u, có thể sẽ mưa, nhớ mang theo ô!')
        suggestions.push('📱 Kiểm tra dự báo thời tiết để lên kế hoạch!')
      } else {
        suggestions.push('⛅ Trời có mây, thời tiết dễ chịu!')
      }
    } else if (weatherDesc.includes('sương mù') || weatherDesc.includes('fog') || weatherDesc.includes('mist') || weatherDesc.includes('haze')) {
      suggestions.push('🌫️ Có sương mù, lái xe cẩn thận và bật đèn pha!')
      suggestions.push('🚶‍♂️ Đi bộ cẩn thận, có thể gặp khó khăn khi nhìn đường!')
    } else if (weatherDesc.includes('gió') || weatherDesc.includes('wind') || weatherDesc.includes('breeze')) {
      if (windSpeed > 5) {
        suggestions.push('💨 Gió mạnh, cẩn thận với các vật bay!')
        suggestions.push('🏠 Đóng cửa sổ và cất đồ ngoài trời!')
      } else if (windSpeed > 2) {
        suggestions.push('🍃 Gió nhẹ, thời tiết mát mẻ dễ chịu!')
      }
    } else if (weatherDesc.includes('bão') || weatherDesc.includes('storm') || weatherDesc.includes('thunder')) {
      suggestions.push('⛈️ Có bão, nên ở trong nhà và tránh ra ngoài!')
      suggestions.push('🔌 Tắt các thiết bị điện không cần thiết!')
    }
    
    // Humidity-based suggestions
    if (humidity > 85) {
      suggestions.push('💧 Độ ẩm rất cao, có thể gây khó chịu, nên bật quạt hoặc điều hòa!')
      suggestions.push('🧺 Quần áo khó khô, nên dùng máy sấy!')
    } else if (humidity > 70) {
      suggestions.push('💧 Độ ẩm cao, có thể gây khó chịu, nên bật quạt!')
    } else if (humidity < 30) {
      suggestions.push('🏜️ Độ ẩm thấp, nhớ uống nhiều nước và dưỡng ẩm da!')
      suggestions.push('🌿 Nên dùng máy tạo ẩm trong nhà!')
    }
    
    // Add a pool of varied, time-appropriate tips to reduce repetition
    const commonDayTips = [
      '🚶‍♂️ Đi bộ 5–10 phút để khởi động cơ thể!',
      '💧 Uống một ly nước để bổ sung năng lượng!',
      '🧠 Lên danh sách 3 việc quan trọng nhất hôm nay!',
      '🕶️ Nếu nắng mạnh, nhớ đội nón/khoác nhẹ khi ra ngoài!',
      '🌿 Mở cửa sổ vài phút để thoáng khí!',
    ]
    const commonNightTips = [
      '📵 Giảm ánh sáng xanh 30 phút trước khi ngủ!',
      '🛌 Hít thở sâu 1 phút rồi đi ngủ sớm nhé!',
      '🕰️ Đặt báo thức hợp lý cho ngày mai!',
      '💧 Uống một ngụm nước ấm trước khi ngủ!',
      '🧘‍♂️ Thả lỏng cơ thể, kéo giãn nhẹ 2–3 phút!',
    ]
    const varietyPool = isNight ? commonNightTips : commonDayTips
    varietyPool.forEach((tip) => suggestions.push(tip))
    
    // Time-based suggestions (use the same hour computed above)
    if (hour >= 5 && hour < 8) {
      suggestions.push('🌅 Buổi sáng sớm, thích hợp để tập thể dục và hít thở không khí trong lành!')
    } else if (hour >= 8 && hour < 11) {
      suggestions.push('☀️ Buổi sáng đẹp trời, thích hợp để đi làm hoặc học tập!')
    } else if (hour >= 11 && hour < 14) {
      suggestions.push('🌞 Giữa trưa, nên tránh ra ngoài nếu trời nắng gắt!')
    } else if (hour >= 14 && hour < 17) {
      suggestions.push('🌤️ Buổi chiều, thích hợp để đi dạo và thư giãn!')
    } else if (hour >= 17 && hour < 20) {
      suggestions.push('🌆 Chiều tối mát mẻ, thích hợp để đi dạo hoặc tập thể dục!')
    } else {
      suggestions.push('🌙 Đang là ban đêm, hãy ưu tiên nghỉ ngơi và ngủ đủ giấc!')
    }
    
    // Special combinations
    if (temp > 30 && humidity > 70) {
      suggestions.push('🥵 Trời nóng ẩm, nên ở trong nhà có điều hòa!')
      suggestions.push('🧊 Uống nước mát và ăn trái cây để giải nhiệt!')
    }
    
    if (temp < 18 && windSpeed > 3) {
      suggestions.push('❄️ Trời lạnh và gió, nhớ mặc ấm và đeo khăn!')
      suggestions.push('☕ Uống trà nóng để giữ ấm cơ thể!')
    }
    
    if (temp >= 20 && temp <= 26 && humidity >= 40 && humidity <= 60 && windSpeed < 3) {
      suggestions.push('🌈 Thời tiết hoàn hảo! Thích hợp cho mọi hoạt động ngoài trời!')
    }
    
    // Pressure-based suggestions
    const pressure = parseInt(weatherData.ap_suat.replace(' hPa', ''))
    if (pressure < 1000) {
      suggestions.push('📉 Áp suất thấp, có thể sẽ mưa, nhớ mang theo ô!')
    } else if (pressure > 1020) {
      suggestions.push('📈 Áp suất cao, thời tiết ổn định, thích hợp để lên kế hoạch!')
    }
    
    // Loại bỏ trùng lặp và lấy ngẫu nhiên, luôn giữ lời chào đầu tiên
    const uniqueSuggestions = [...new Set(suggestions)]
    const [firstSuggestion, ...restSuggestions] = uniqueSuggestions
    const shuffled = restSuggestions.sort(() => Math.random() - 0.5)
    const MAX_SUGGESTIONS = 6
    if (!firstSuggestion) return shuffled.slice(0, MAX_SUGGESTIONS)
    return [firstSuggestion, ...shuffled.slice(0, MAX_SUGGESTIONS - 1)]
  }, [])

  useEffect(() => {
    fetchWeather()
    // Cập nhật thời tiết mỗi 10 phút để sát hơn với hiện trạng
    const interval = setInterval(fetchWeather, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-pulse">Đang tải...</div>
      </div>
    )
  }

  const themeClasses = getThemeClasses()
  
  return (
    <div className={cn("min-h-screen", themeClasses.bgClass)}>
      <div className={cn("container mx-auto px-4 py-8", largeText ? 'text-[1.05rem]' : '', highContrast ? 'filter contrast-125' : '')}>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-8 flex-wrap">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Home className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Trang Chủ</h1>
              <p className="text-gray-600 dark:text-gray-300">Chào mừng trở lại!</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <ThemeSelector 
              currentTheme={currentTheme}
              onThemeChange={changeTheme}
            />
            <Button variant="outline" size="icon" className="w-9" onClick={() => setLargeText(v => !v)} title="Cỡ chữ lớn (A11y)">
              A+
            </Button>
            <Button variant="outline" size="icon" className="w-9" onClick={() => setHighContrast(v => !v)} title="Chế độ tương phản cao">
              HC
            </Button>
            
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon" title="Đăng xuất">
                <LogOut className="h-4 w-4" />
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



        {/* Hidden notices to restore cards when dismissed */}
        {(!showUserCard || !showWeatherCard) && (
          <div className="mb-4 text-xs text-gray-600 dark:text-gray-300 flex items-center gap-3 flex-wrap">
            {!showUserCard && (
              <button className="underline hover:opacity-80" onClick={restoreUserCard}>
                Hiện lại thẻ người dùng
              </button>
            )}
            {!showWeatherCard && (
              <button className="underline hover:opacity-80" onClick={restoreWeatherCard}>
                Hiện lại thẻ thời tiết
              </button>
            )}
          </div>
        )}

        {/* User Info Card */}
        {showUserCard && (
        <Card className="mb-8 border-0 shadow-lg relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600">
          <CardContent className="p-6 text-white">
            <div className="pointer-events-none absolute -top-10 -left-8 h-40 w-40 bg-white/20 blur-3xl rounded-full" />
            <div className="pointer-events-none absolute -bottom-12 -right-10 h-48 w-48 bg-white/10 blur-3xl rounded-full" />
            <div className="relative flex items-center gap-6">
              <button aria-label="Đóng thẻ người dùng" onClick={dismissUserCard} className="absolute top-0 right-0 m-2 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white">
                <X className="h-4 w-4" />
              </button>
              <div className="relative group">
                <div className="absolute -inset-1 rounded-full bg-white/30 blur-xl opacity-40 group-hover:opacity-60 transition" />
                <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-pink-300/40 to-cyan-300/40 blur-2xl opacity-40 group-hover:opacity-70 transition" />
                <Avatar
                  className="relative h-20 w-20 ring-4 ring-white/30 shadow-xl shadow-black/10 cursor-pointer transition-transform group-hover:scale-[1.03]"
                  onClick={handleAvatarClick}
                  title="Nhấp để đổi ảnh đại diện"
                >
                  {avatarUrl ? (
                    <AvatarImage src={avatarUrl} alt="Ảnh đại diện" className="object-cover" />
                  ) : null}
                  <AvatarFallback className="bg-white/25 text-white text-xl font-semibold">
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
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/25 backdrop-blur text-white opacity-0 group-hover:opacity-100 transition">Đổi ảnh</div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">
                  Xin chào, {(() => {
                    // Ưu tiên tên từ thông tin khách hàng, sau đó từ userInfo, cuối cùng là fallback
                    const khachHangHoTen = khachHang?.HoTenKhachHang
                    return khachHangHoTen || userInfo.HoTen || 'Người dùng'
                  })()}!
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  <div className="flex items-center text-white/90">
                    <User className="h-4 w-4 mr-2" />
                    <span className="text-sm">Tên đăng nhập: {userInfo.TenDangNhap}</span>
                  </div>
                  {userInfo.KhachHangID && (
                    <div className="flex items-center text-white/90">
                      <User className="h-4 w-4 mr-2" />
                      <span className="text-sm">ID khách hàng: {userInfo.KhachHangID}</span>
                    </div>
                  )}
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
        )}

        {/* Weather Card (compact) */}
        {showWeatherCard && (
        <Card className="mb-6 border-0 shadow-lg relative overflow-hidden bg-gradient-to-br from-sky-500 to-blue-600">
          <CardContent className="p-4 sm:p-5 text-white">
            <div className="pointer-events-none absolute -top-8 -right-8 h-28 w-28 bg-white/20 blur-3xl rounded-full" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 bg-white/10 blur-3xl rounded-full" />
            <div className="relative flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Cloud className="h-4 w-4 text-white/80" />
                  <h3 className="text-base font-semibold">Thời tiết Cần Thơ</h3>
                </div>
                <button aria-label="Đóng thẻ thời tiết" onClick={dismissWeatherCard} className="absolute top-0 right-0 m-2 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white">
                  <X className="h-4 w-4" />
                </button>
                
                {weatherLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white/20 rounded-full animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-3 bg-white/20 rounded animate-pulse w-20" />
                      <div className="h-2.5 bg-white/20 rounded animate-pulse w-28" />
                    </div>
                  </div>
                ) : weatherError ? (
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-8 w-8 text-white/80" />
                    <div>
                      <p className="text-white/90">{weatherError}</p>
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="bg-white/20 hover:bg-white/30 text-white mt-2"
                        onClick={fetchWeather}
                      >
                        Thử lại
                      </Button>
                    </div>
                  </div>
                ) : weatherData ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={weatherData.bieu_tuong} 
                          alt={weatherData.thoi_tiet}
                          className="w-12 h-12"
                        />
                        <div>
                          <p className="text-xl font-bold">{weatherData.nhiet_do}</p>
                          <p className="text-white/90 capitalize text-sm">{weatherData.thoi_tiet}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="flex items-center gap-1.5 text-white/90">
                        <Thermometer className="h-4 w-4" />
                        <span className="text-xs">Nhiệt độ</span>
                        <span className="font-medium">{weatherData.nhiet_do}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-white/90">
                        <Droplets className="h-4 w-4" />
                        <span className="text-xs">Độ ẩm</span>
                        <span className="font-medium">{weatherData.do_am}</span>
                    </div>
                      <div className="flex items-center gap-1.5 text-white/90">
                        <Wind className="h-4 w-4" />
                        <span className="text-xs">Gió</span>
                        <span className="font-medium">{weatherData.toc_do_gio}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-white/90">
                        <Gauge className="h-4 w-4" />
                        <span className="text-xs">Áp suất</span>
                        <span className="font-medium">{weatherData.ap_suat}</span>
                      </div>
                    </div>
                    
                    {/* Weather Suggestions */}
                    {weatherData && (
                      <div className="mt-3 p-2 bg-white/10 rounded-lg border border-white/20 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium text-white/90">💡 Gợi ý thông minh:</span>
                          <div className="flex-1 h-px bg-white/20"></div>
                        </div>
                        <div className="space-y-2">
                          {getWeatherSuggestions(weatherData).map((suggestion: string, index: number) => (
                            <div key={`weather-suggestion-${index}-${suggestion.length}`} className="flex items-start gap-2 text-xs group hover:bg-white/5 p-1.5 rounded-md transition-colors">
                              <span className="text-white/70 mt-0.5 text-[10px]">#{index + 1}</span>
                              <span className="text-white/90 leading-relaxed flex-1">{suggestion}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 pt-2 border-t border-white/20">
                          <p className="text-[10px] text-white/70 text-center">
                            💭 Gợi ý được cập nhật theo thời tiết thực tế
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-1.5 border-t border-white/20">
                      <p className="text-xs text-white/80">
                        Cập nhật lúc {new Date().toLocaleTimeString('vi-VN', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="bg-white/20 hover:bg-white/30 text-white"
                        onClick={fetchWeather}
                      >
                        Làm mới
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className={cn("group rounded-xl p-4 backdrop-blur border shadow hover:shadow-lg transition-all bg-white/70 dark:bg-gray-800/70", themeClasses.borderClass)}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white shadow">
                <Home className="h-5 w-5" />
              </div>
              <div>
                <p className={cn("text-sm", themeClasses.textClass)}>Phòng đang thuê</p>
                <p className={cn("font-semibold", themeClasses.textClass)}>{(khachHang as any)?.HopDongsDangThue?.[0]?.Phong?.DayPhong || '-'}{(khachHang as any)?.HopDongsDangThue?.[0]?.Phong?.SoPhong ? ` • ${(khachHang as any)?.HopDongsDangThue?.[0]?.Phong?.SoPhong}` : ''}</p>
              </div>
            </div>
          </div>
          <div className={cn("group rounded-xl p-4 backdrop-blur border shadow hover:shadow-lg transition-all bg-white/70 dark:bg-gray-800/70", themeClasses.borderClass)}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow">
                <Receipt className="h-5 w-5" />
              </div>
              <div>
                <p className={cn("text-sm", themeClasses.textClass)}>Hóa đơn chưa thanh toán</p>
                <p className={cn("font-semibold", themeClasses.textClass)}>{Array.isArray(hoaDon) ? hoaDon.filter((i:any)=>!isPaidStatus(i?.TrangThaiThanhToan) && !((Number(i?.TienTra||i?.Tientra||0)) >= Number(i?.TongTien||0))).length : 0}</p>
              </div>
            </div>
          </div>
          <div className={cn("group rounded-xl p-4 backdrop-blur border shadow hover:shadow-lg transition-all bg-white/70 dark:bg-gray-800/70", themeClasses.borderClass)}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className={cn("text-sm", themeClasses.textClass)}>Ngày tham gia</p>
                <p className={cn("font-semibold", themeClasses.textClass)}>{
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
                    <p className="text-sm text-gray-600 dark:text-gray-300">Số lần thanh toán đủ</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{paySummary.soLanThanhToan}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Tổng số tiền đã thanh toán</p>
                    <p className="text-lg font-bold text-emerald-600 break-words">{paySummary.tongDaThanhToan.toLocaleString('vi-VN')} VND</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 italic">{numberToVietnameseWords(paySummary.tongDaThanhToan)} đồng</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Tổng số tiền nợ</p>
                    <p className="text-lg font-bold text-red-600 break-words">{paySummary.tongNo.toLocaleString('vi-VN')} VND</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 italic">{numberToVietnameseWords(paySummary.tongNo)} đồng</p>
                  </div>
                </div>
                {(payRecords || []).slice(0,5).map((r, index) => {
                  const isPaid = isPaidRecord(r as any)
                  const tong = (r.TongTien ?? 0).toLocaleString('vi-VN')
                  return (
                    <div key={`payment-record-${index}-${r.ThangNam || 'unknown'}`} className="p-4 flex items-center justify-between">
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
                key={`menu-${item.title}-${index}`}
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
  // Month-over-month percentage changes for consumption
  const prev = data.length >= 2 ? data[data.length - 2] : null
  const curr = data.length >= 1 ? data[data.length - 1] : null
  const pct = (prevVal: number, currVal: number) => {
    if (prevVal > 0) return ((currVal - prevVal) / prevVal) * 100
    if (prevVal === 0 && currVal > 0) return 100
    return 0
  }
  const dienPct = prev && curr ? pct(prev.dien || 0, curr.dien || 0) : 0
  const nuocPct = prev && curr ? pct(prev.nuoc || 0, curr.nuoc || 0) : 0
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
      <p className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-3">
        <span className="flex items-center gap-1">
          {dienPct >= 0 ? <TrendingUp className="h-3.5 w-3.5 text-red-500" /> : <TrendingDown className="h-3.5 w-3.5 text-emerald-500" />}
          Điện:
          <span className={`font-semibold ${dienPct >= 0 ? 'text-red-600' : 'text-emerald-600'}`}>{dienPct >= 0 ? '+' : ''}{Math.abs(dienPct).toFixed(1)}%</span>
        </span>
        <span className="opacity-60">•</span>
        <span className="flex items-center gap-1">
          {nuocPct >= 0 ? <TrendingUp className="h-3.5 w-3.5 text-red-500" /> : <TrendingDown className="h-3.5 w-3.5 text-emerald-500" />}
          Nước:
          <span className={`font-semibold ${nuocPct >= 0 ? 'text-red-600' : 'text-emerald-600'}`}>{nuocPct >= 0 ? '+' : ''}{Math.abs(nuocPct).toFixed(1)}%</span>
        </span>
      </p>
    </div>
  )
}
