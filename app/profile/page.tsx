"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, Home, Phone, CreditCard, Calendar, Briefcase, MapPin, LogOut, Receipt, HeadphonesIcon, FileText, Wifi, Snowflake, Droplets, WashingMachine, ChefHat, Loader2 } from 'lucide-react'
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

const userData = {
  rentDate: '01/01/2024',
}

export default function ProfilePage() {
  const router = useRouter()
  const { khachHang, loading: khachHangLoading, error: khachHangError } = useCurrentKhachHang()

  useEffect(() => {
    const token = localStorage.getItem('userToken')
    if (!token) {
      router.replace('/login')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('userToken')
    localStorage.removeItem('userInfo')
    router.replace('/login')
  }

  const handleQuickAction = (action: string) => {
    alert(`Chức năng ${action} đang được phát triển`)
  }

  // Hiển thị loading nếu đang tải thông tin khách hàng
  if (khachHangLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    )
  }

  // Hiển thị lỗi nếu có
  if (khachHangError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{khachHangError}</p>
          <Button onClick={() => window.location.reload()}>
            Thử lại
          </Button>
        </div>
      </div>
    )
  }

  const currentPhong = khachHang?.HopDongsDangThue?.[0]?.Phong
  const formattedNgaySinh = khachHang?.NgaySinh ? new Date(khachHang?.NgaySinh).toLocaleDateString('vi-VN') : 'Chưa cập nhật'
  const infoItems = [
    { icon: User, label: 'Tên khách hàng', value: khachHang?.HoTenKhachHang || 'Chưa cập nhật' },
    { icon: Home, label: 'Phòng', value: currentPhong ? `Dãy ${currentPhong.DayPhong || '-'} - Phòng ${currentPhong.SoPhong || '-'}` : 'Chưa cập nhật' },
    { icon: Phone, label: 'Số điện thoại', value: khachHang?.SoDienThoai || 'Chưa cập nhật' },
    { icon: CreditCard, label: 'CMND/CCCD', value: khachHang?.SoCCCD || 'Chưa cập nhật' },
    { icon: Calendar, label: 'Ngày sinh', value: formattedNgaySinh },
    { icon: Briefcase, label: 'Công việc', value: khachHang?.CongViec || 'Chưa cập nhật' },
    { icon: Calendar, label: 'Ngày thuê', value: userData.rentDate },
    { icon: MapPin, label: 'Địa chỉ', value: khachHang?.DiaChiCuThe && khachHang?.PhuongXa && khachHang?.QuanHuyen && khachHang?.TinhThanh 
      ? `${khachHang.DiaChiCuThe}, ${khachHang.PhuongXa}, ${khachHang.QuanHuyen}, ${khachHang.TinhThanh}`
      : 'Chưa cập nhật'
    },
  ]

  const quickActions = [
    { icon: Receipt, label: 'Xem Hóa Đơn', action: 'Xem Hóa Đơn' },
    { icon: HeadphonesIcon, label: 'Liên Hệ Hỗ Trợ', action: 'Liên Hệ Hỗ Trợ' },
    { icon: FileText, label: 'Xem Hợp Đồng', action: 'Xem Hợp Đồng' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.back()}
            >
              ← Quay lại
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Hồ Sơ Cá Nhân</h1>
          </div>
          
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

        {/* Customer Information */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Thông Tin Khách Hàng
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {infoItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{item.label}</p>
                      <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mt-1 break-words">
                        {item.value}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Additional Customer Details */}
        {khachHang && (
          <Card className="mb-6 border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Thông Tin Chi Tiết
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Giới tính</p>
                      <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mt-1">
                        {khachHang.GioiTinh || 'Chưa cập nhật'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Ngày sinh</p>
                      <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mt-1">
                        {khachHang.NgaySinh 
                          ? new Date(khachHang.NgaySinh).toLocaleDateString('vi-VN')
                          : 'Chưa cập nhật'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Ngày cấp CCCD</p>
                      <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mt-1">
                        {khachHang.NgayCapCCCD 
                          ? new Date(khachHang.NgayCapCCCD).toLocaleDateString('vi-VN')
                          : 'Chưa cập nhật'
                        }
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Nơi cấp CCCD</p>
                      <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mt-1">
                        {khachHang.NoiCapCCCD || 'Chưa cập nhật'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CreditCard className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">ID Khách hàng</p>
                      <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mt-1">
                        {khachHang.KhachHangID}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* CCCD Images */}
        {khachHang && (khachHang.CCCDMT || khachHang.CCCDMS) && (
          <Card className="mb-6 border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Ảnh CCCD
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {khachHang.CCCDMT && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Mặt trước CCCD</p>
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <img 
                        src={khachHang.CCCDMT} 
                        alt="CCCD Mặt trước" 
                        className="w-full h-auto max-h-64 object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  </div>
                )}
                {khachHang.CCCDMS && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Mặt sau CCCD</p>
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <img 
                        src={khachHang.CCCDMS} 
                        alt="CCCD Mặt sau" 
                        className="w-full h-auto max-h-64 object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Services & Amenities (from current room) */}
        {currentPhong && (
          <Card className="mb-6 border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <Home className="h-5 w-5 mr-2" />
                Dịch Vụ & Tiện Ích
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(() => {
                  const list = Array.isArray(currentPhong.TienIch) ? currentPhong.TienIch : []
                  const iconMap: Record<string, any> = { Wifi, 'WC riêng': Droplets }
                    return list.map((name: string, idx: number) => {
                    const IconComp = iconMap[name] || Home
                    return (
                      <div key={`${name}-${idx}`} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-green-100 dark:bg-green-900/30">
                            <IconComp className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <span className="font-medium text-gray-900 dark:text-gray-100">{name}</span>
                        </div>
                        <Badge> Có </Badge>
                      </div>
                    )
                  })
                })()}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <Receipt className="h-5 w-5 mr-2" />
              Thao Tác Nhanh
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-white/10 dark:hover:border-blue-800 transition-colors"
                    onClick={() => handleQuickAction(action.action)}
                  >
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
                      <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm font-medium text-center dark:text-gray-100">{action.label}</span>
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
