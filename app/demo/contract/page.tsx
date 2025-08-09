"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, UserCheck, Home, DollarSign, FileText, Printer, Check, ArrowLeft } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function DemoContractPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    landlordName: 'Nguyễn Thị Lan',
    landlordPhone: '0376539778',
    landlordId: '123456789012',
    landlordAddress: 'Hẻm 444, đường Cách Mạng Tháng 8, TP. Cần Thơ',
    tenantName: 'Nguyễn Văn An',
    tenantPhone: '0987654321',
    tenantId: '987654321098',
    tenantJob: 'Nhân viên văn phòng',
    building: 'A',
    roomNumber: '101',
    area: '25',
    roomFee: '3500000',
    deposit: '7000000',
    paymentCycle: '1month'
  })

  const [amenities, setAmenities] = useState(['Máy lạnh', 'Wifi', 'Máy nước nóng'])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePrint = () => {
    alert('Chức năng in hợp đồng đang được phát triển')
  }

  const toggleAmenity = (amenity: string) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter(item => item !== amenity))
    } else {
      setAmenities([...amenities, amenity])
    }
  }

  const amenityList = ['Máy lạnh', 'Máy nước nóng', 'Máy giặt', 'Wifi', 'Tủ lạnh']

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
            <h1 className="text-2xl font-bold text-gray-900">Hợp Đồng Thuê Phòng</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-red-50 px-3 py-1 rounded-full">
              <span className="text-red-600 text-sm font-medium">DEMO MODE</span>
            </div>
            <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700">
              <Printer className="h-4 w-4 mr-2" />
              In Hợp Đồng
            </Button>
          </div>
        </div>

        {/* Contract Title */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold text-blue-600">HỢP ĐỒNG THUÊ PHÒNG TRỌ</h2>
          </CardContent>
        </Card>

        {/* Landlord Information */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Thông Tin Chủ Trọ (Bên A)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="landlordName">Họ tên *</Label>
                <Input
                  id="landlordName"
                  value={formData.landlordName}
                  onChange={(e) => handleInputChange('landlordName', e.target.value)}
                  placeholder="Nhập họ tên đầy đủ"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="landlordPhone">Số điện thoại *</Label>
                <Input
                  id="landlordPhone"
                  value={formData.landlordPhone}
                  onChange={(e) => handleInputChange('landlordPhone', e.target.value)}
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="landlordId">CMND/CCCD</Label>
                <Input
                  id="landlordId"
                  value={formData.landlordId}
                  onChange={(e) => handleInputChange('landlordId', e.target.value)}
                  placeholder="Nhập số CMND/CCCD"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="landlordAddress">Địa chỉ</Label>
                <Textarea
                  id="landlordAddress"
                  value={formData.landlordAddress}
                  onChange={(e) => handleInputChange('landlordAddress', e.target.value)}
                  placeholder="Nhập địa chỉ chi tiết"
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tenant Information */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <UserCheck className="h-5 w-5 mr-2" />
              Thông Tin Khách Thuê (Bên B)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="tenantName">Tên người đại diện *</Label>
                <Input
                  id="tenantName"
                  value={formData.tenantName}
                  onChange={(e) => handleInputChange('tenantName', e.target.value)}
                  placeholder="Nhập họ tên đầy đủ"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tenantPhone">Số điện thoại *</Label>
                <Input
                  id="tenantPhone"
                  value={formData.tenantPhone}
                  onChange={(e) => handleInputChange('tenantPhone', e.target.value)}
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tenantId">CMND/CCCD</Label>
                <Input
                  id="tenantId"
                  value={formData.tenantId}
                  onChange={(e) => handleInputChange('tenantId', e.target.value)}
                  placeholder="Nhập số CMND/CCCD"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tenantJob">Công việc</Label>
                <Input
                  id="tenantJob"
                  value={formData.tenantJob}
                  onChange={(e) => handleInputChange('tenantJob', e.target.value)}
                  placeholder="Nhập nghề nghiệp"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Room Information */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <Home className="h-5 w-5 mr-2" />
              Thông Tin Phòng
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="building">Dãy trọ</Label>
                <Input
                  id="building"
                  value={formData.building}
                  onChange={(e) => handleInputChange('building', e.target.value)}
                  placeholder="A, B, C..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomNumber">Số phòng</Label>
                <Input
                  id="roomNumber"
                  value={formData.roomNumber}
                  onChange={(e) => handleInputChange('roomNumber', e.target.value)}
                  placeholder="101, 102..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Diện tích (m²)</Label>
                <Input
                  id="area"
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  placeholder="Nhập diện tích"
                  type="number"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Tiện ích</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {amenityList.map((amenity, index) => (
                    <Badge
                      key={index}
                      variant={amenities.includes(amenity) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-blue-100 transition-colors"
                      onClick={() => toggleAmenity(amenity)}
                    >
                      {amenities.includes(amenity) && <Check className="h-3 w-3 mr-1" />}
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Tiền Phòng & Tiền Cọc
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="roomFee">Số tiền phòng (VND) *</Label>
                <Input
                  id="roomFee"
                  value={formData.roomFee}
                  onChange={(e) => handleInputChange('roomFee', e.target.value)}
                  placeholder="Nhập số tiền phòng"
                  type="number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deposit">Số tiền cọc (VND) *</Label>
                <Input
                  id="deposit"
                  value={formData.deposit}
                  onChange={(e) => handleInputChange('deposit', e.target.value)}
                  placeholder="Nhập số tiền cọc"
                  type="number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentCycle">Chu kỳ thu tiền</Label>
                <Select value={formData.paymentCycle} onValueChange={(value) => handleInputChange('paymentCycle', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn chu kỳ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1month">1 tháng</SelectItem>
                    <SelectItem value="3months">3 tháng</SelectItem>
                    <SelectItem value="6months">6 tháng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contract Terms */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Điều Khoản Hợp Đồng
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Điều khoản chính:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Bên A cho Bên B thuê phòng tại địa chỉ cụ thể</li>
                  <li>• Bên B thanh toán đầy đủ tiền theo thỏa thuận</li>
                  <li>• Bên B bảo quản thiết bị, tài sản của Bên A</li>
                  <li>• Không sửa chữa, cải tạo khi chưa được đồng ý</li>
                  <li>• Giữ vệ sinh khu vực phòng trọ</li>
                  <li>• Tuân thủ pháp luật và quy định địa phương</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Trách nhiệm chung:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Hai bên hỗ trợ nhau thực hiện hợp đồng</li>
                  <li>• Báo trước 30 ngày nếu muốn chấm dứt hợp đồng</li>
                  <li>• Hoàn trả tiền cọc khi kết thúc hợp đồng</li>
                  <li>• Hợp đồng có giá trị pháp lý</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="text-center">
                  <h5 className="font-semibold mb-4">Đại diện Bên A</h5>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50">
                    <p className="text-gray-500 text-sm">Ký tên và ghi họ tên</p>
                  </div>
                </div>
                <div className="text-center">
                  <h5 className="font-semibold mb-4">Đại diện Bên B</h5>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50">
                    <p className="text-gray-500 text-sm">Ký tên và ghi họ tên</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
