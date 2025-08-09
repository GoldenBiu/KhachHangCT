"use client"

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, Home, Phone, CreditCard, Calendar, Briefcase, MapPin, Receipt, HeadphonesIcon, FileText, Wifi, Snowflake, Droplets, WashingMachine, ChefHat, ArrowLeft } from 'lucide-react'

const userData = {
  name: 'Nguyễn Văn An',
  roomNumber: '101',
  building: 'A',
  phone: '0376539778',
  idNumber: '123456789012',
  birthDate: '15/03/1990',
  job: 'Nhân viên văn phòng',
  rentDate: '01/01/2024',
  address: 'Hẻm 444, đường Cách Mạng Tháng 8, TP. Cần Thơ',
}

const amenities = [
  { name: 'Máy lạnh', available: true, icon: Snowflake },
  { name: 'Máy nước nóng', available: true, icon: Droplets },
  { name: 'Máy giặt', available: true, icon: WashingMachine },
  { name: 'Wifi', available: true, icon: Wifi },
  { name: 'Tủ lạnh', available: false, icon: ChefHat },
]

export default function DemoProfilePage() {
  const router = useRouter()

  const handleQuickAction = (action: string) => {
    alert(`Chức năng ${action} đang được phát triển`)
  }

  const infoItems = [
    { icon: User, label: 'Tên khách hàng', value: userData.name },
    { icon: Home, label: 'Phòng', value: `Dãy ${userData.building} - Phòng ${userData.roomNumber}` },
    { icon: Phone, label: 'Số điện thoại', value: userData.phone },
    { icon: CreditCard, label: 'CMND/CCCD', value: userData.idNumber },
    { icon: Calendar, label: 'Ngày sinh', value: userData.birthDate },
    { icon: Briefcase, label: 'Công việc', value: userData.job },
    { icon: Calendar, label: 'Ngày thuê', value: userData.rentDate },
    { icon: MapPin, label: 'Địa chỉ', value: userData.address },
  ]

  const quickActions = [
    { icon: Receipt, label: 'Xem Hóa Đơn', action: 'Xem Hóa Đơn' },
    { icon: HeadphonesIcon, label: 'Liên Hệ Hỗ Trợ', action: 'Liên Hệ Hỗ Trợ' },
    { icon: FileText, label: 'Xem Hợp Đồng', action: 'Xem Hợp Đồng' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push('/demo/home')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Hồ Sơ Cá Nhân</h1>
          </div>
          
          <div className="bg-red-50 px-3 py-1 rounded-full">
            <span className="text-red-600 text-sm font-medium">DEMO MODE</span>
          </div>
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
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-600">{item.label}</p>
                      <p className="text-base font-semibold text-gray-900 mt-1 break-words">
                        {item.value}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Services & Amenities */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <Home className="h-5 w-5 mr-2" />
              Dịch Vụ & Tiện Ích
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {amenities.map((amenity, index) => {
                const Icon = amenity.icon
                return (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        amenity.available ? 'bg-green-100' : 'bg-gray-200'
                      }`}>
                        <Icon className={`h-4 w-4 ${
                          amenity.available ? 'text-green-600' : 'text-gray-400'
                        }`} />
                      </div>
                      <span className="font-medium text-gray-900">{amenity.name}</span>
                    </div>
                    <Badge variant={amenity.available ? "default" : "secondary"}>
                      {amenity.available ? 'Có' : 'Không'}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

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
                    className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                    onClick={() => handleQuickAction(action.action)}
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-center">{action.label}</span>
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
