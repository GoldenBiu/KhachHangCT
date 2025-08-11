"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, UserCheck, Home, DollarSign, FileText, Printer, Check, Loader2, Calendar, AlertCircle, Phone } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useHopDong } from '@/hooks/use-hopdong'
import { toVietnameseNumberText } from '@/lib/utils'
import { useCurrentKhachHang } from '@/hooks/use-khachhang'

export default function ContractPage() {
  const router = useRouter()
  const { hopDong, loading: hopDongLoading, error: hopDongError } = useHopDong()
  const { khachHang, loading: khachHangLoading, error: khachHangError } = useCurrentKhachHang()
  
  const [formData, setFormData] = useState({
    landlordName: 'Nguyễn Thị Lan',
    landlordPhone: '0376539778',
    landlordId: '',
    landlordAddress: '',
    tenantName: 'Nguyễn Văn An',
    tenantPhone: '0987654321',
    tenantId: '',
    tenantJob: '',
    building: 'A',
    roomNumber: '101',
    area: '25',
    roomFee: '3500000',
    deposit: '7000000',
    paymentCycle: '1month'
  })

  const [amenities, setAmenities] = useState(['Máy lạnh', 'Wifi', 'Máy nước nóng'])

  useEffect(() => {
    const token = localStorage.getItem('userToken')
    if (!token) {
      router.replace('/login')
    }
  }, [router])

  // Hiển thị loading nếu đang tải dữ liệu
  if (hopDongLoading || khachHangLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Đang tải thông tin hợp đồng...</p>
        </div>
      </div>
    )
  }

  // Hiển thị lỗi nếu có
  if (hopDongError || khachHangError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-600" />
          <p className="text-red-600 mb-4">{hopDongError || khachHangError}</p>
          <Button onClick={() => window.location.reload()}>
            Thử lại
          </Button>
        </div>
      </div>
    )
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-gray-900">
      <div id="print-area" className="container mx-auto px-4 py-8">
        {/* Header (screen only) */}
        <div className="flex items-center justify-between mb-8 screen-only">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.back()}
            >
              ← Quay lại
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Hợp Đồng Thuê Phòng</h1>
          </div>
          
          <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700">
            <Printer className="h-4 w-4 mr-2" />
            In Hợp Đồng
          </Button>
        </div>

        {/* Simple printable title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-center text-black dark:text-gray-100">HỢP ĐỒNG THUÊ PHÒNG TRỌ</h2>
        </div>

        {/* Current Contract Information */}
        {hopDong && hopDong.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-black dark:text-gray-100 mb-3">Hợp Đồng Hiện Tại</h3>
            <div className="p-0">
              {hopDong.map((contract, index) => {
                const matchedPhong = khachHang?.HopDongsDangThue?.find((hd) => hd.HopDongID === (contract as any).HopDongID)?.Phong
                const dayPhongToShow = (matchedPhong as any)?.DayPhong || (contract as any).DayPhong || 'Không có dữ liệu'
                const soPhongToShow = (matchedPhong as any)?.SoPhong || ''
                return (
                <div key={contract.HopDongID} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Ngày ký:</p>
                        <p className="font-semibold">{new Date((contract as any).NgayTaoHopDong || contract.NgayBatDau).toLocaleDateString('vi-VN')}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Home className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Dãy trọ:</p>
                        <p className="font-semibold">{dayPhongToShow}</p>
                      </div>
                    </div>
                    {soPhongToShow && (
                      <div className="flex items-center space-x-3">
                        <Home className="h-5 w-5 text-green-600" />
                        <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Số phòng:</p>
                          <p className="font-semibold">{soPhongToShow}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Ngày bắt đầu:</p>
                        <p className="font-semibold">{new Date(contract.NgayBatDau).toLocaleDateString('vi-VN')}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Ngày kết thúc:</p>
                        <p className="font-semibold">{new Date(contract.NgayKetThuc).toLocaleDateString('vi-VN')}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Chu kỳ:</p>
                        <p className="font-semibold">{(contract as any).ChuKy || (contract as any).ThoiHanHopDong || 'Không có dữ liệu'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Tiền cọc:</p>
                        <p className="font-semibold">{
                          typeof (contract as any).TienDatCoc === 'number'
                            ? (contract as any).TienDatCoc.toLocaleString('vi-VN')
                            : Number(((contract as any).TienDatCoc || 0)).toLocaleString('vi-VN')
                        } VND</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Quản lý:</p>
                        <p className="font-semibold">{(contract as any).HoTenQuanLi || 'Không có dữ liệu'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">SĐT quản lý:</p>
                        <p className="font-semibold">{(contract as any).SoDienThoaiDN || 'Không có dữ liệu'}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Trạng thái hợp đồng</p>
                      <p className="font-medium dark:text-gray-100">{(contract as any).TrangThaiHopDong}</p>
                    </div>
                  </div>
                  {(contract as any).GhiChuHopDong && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Ghi chú:</p>
                      <p className="font-medium dark:text-gray-100">{(contract as any).GhiChuHopDong}</p>
                    </div>
                  )}
                </div>
              )})}
            </div>
          </div>
        )}

        {/* No Contract Message */}
        {hopDong && hopDong.length === 0 && (
          <Card className="mb-6 border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">Chưa có hợp đồng</h3>
              <p className="text-gray-500 dark:text-gray-400">Bạn chưa có hợp đồng thuê phòng nào. Vui lòng liên hệ chủ trọ để ký hợp đồng.</p>
            </CardContent>
          </Card>
        )}

        {/* Landlord Information */}
        <div className="mb-6">
          <h3 className="font-semibold text-black dark:text-gray-100 mb-3">Thông Tin Chủ Trọ (Bên A)</h3>
          <div className="p-0">
            {(() => {
              const currentContract: any = (hopDong || []).find((c: any) => c.TrangThaiHopDong === 'HoatDong') || (hopDong || [])[0] || null
              return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="landlordName">Họ tên *</Label>
                <Input
                  id="landlordName"
                  value={currentContract?.HoTenQuanLi || formData.landlordName}
                  onChange={(e) => handleInputChange('landlordName', e.target.value)}
                  placeholder="Nhập họ tên đầy đủ"
                  readOnly={!!currentContract?.HoTenQuanLi}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="landlordPhone">Số điện thoại *</Label>
                <Input
                  id="landlordPhone"
                  value={currentContract?.SoDienThoaiDN || formData.landlordPhone}
                  onChange={(e) => handleInputChange('landlordPhone', e.target.value)}
                  placeholder="Nhập số điện thoại"
                  readOnly={!!currentContract?.SoDienThoaiDN}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="landlordId">CMND/CCCD</Label>
                <Input
                  id="landlordId"
                  value={currentContract?.SoCCCD || formData.landlordId}
                  onChange={(e) => handleInputChange('landlordId', e.target.value)}
                  placeholder="Nhập số CMND/CCCD"
                  readOnly={!!currentContract?.SoCCCD}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="landlordDistrict">Quận/Huyện</Label>
                <Input
                  id="landlordDistrict"
                  value={currentContract?.Quan || ''}
                  placeholder="Quận/Huyện"
                  readOnly
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="landlordAddress">Địa chỉ</Label>
                <Textarea
                  id="landlordAddress"
                  value={currentContract?.DiaChiChiTiet || formData.landlordAddress}
                  onChange={(e) => handleInputChange('landlordAddress', e.target.value)}
                  placeholder="Nhập địa chỉ chi tiết"
                  rows={3}
                  readOnly={!!currentContract?.DiaChiChiTiet}
                />
              </div>
            </div>
              )
            })()}
          </div>
        </div>

        {/* Tenant Information */}
        <div className="mb-6">
          <h3 className="font-semibold text-black dark:text-gray-100 mb-3">Thông Tin Khách Thuê (Bên B)</h3>
          <div className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="tenantName">Tên người đại diện *</Label>
                <Input
                  id="tenantName"
                  value={khachHang?.HoTenKhachHang || formData.tenantName}
                  onChange={(e) => handleInputChange('tenantName', e.target.value)}
                  placeholder="Nhập họ tên đầy đủ"
                  readOnly={!!khachHang?.HoTenKhachHang}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tenantPhone">Số điện thoại *</Label>
                <Input
                  id="tenantPhone"
                  value={khachHang?.SoDienThoai || formData.tenantPhone}
                  onChange={(e) => handleInputChange('tenantPhone', e.target.value)}
                  placeholder="Nhập số điện thoại"
                  readOnly={!!khachHang?.SoDienThoai}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tenantId">CMND/CCCD</Label>
                <Input
                  id="tenantId"
                  value={khachHang?.SoCCCD || formData.tenantId}
                  onChange={(e) => handleInputChange('tenantId', e.target.value)}
                  placeholder="Nhập số CMND/CCCD"
                  readOnly={!!khachHang?.SoCCCD}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tenantJob">Công việc</Label>
                <Input
                  id="tenantJob"
                  value={khachHang?.CongViec || formData.tenantJob}
                  onChange={(e) => handleInputChange('tenantJob', e.target.value)}
                  placeholder="Nhập nghề nghiệp"
                  readOnly={!!khachHang?.CongViec}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Room Information */}
        <div className="mb-6">
          <h3 className="font-semibold text-black dark:text-gray-100 mb-3">Thông Tin Phòng</h3>
          <div className="p-0">
            {(() => {
              const phong = khachHang?.HopDongsDangThue?.[0]?.Phong
              if (!phong) {
                return (
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
                            className="cursor-pointer hover:bg-blue-100 dark:hover:bg-white/10 transition-colors"
                            onClick={() => toggleAmenity(amenity)}
                          >
                            {amenities.includes(amenity) && <Check className="h-3 w-3 mr-1" />}
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                </div>
              )
              }

              const formatVnd = (val: any) =>
                typeof val === 'number' ? val.toLocaleString('vi-VN') : Number(val || 0).toLocaleString('vi-VN')

              const parseTienIch = (val: any): string[] => {
                if (Array.isArray(val)) return val
                if (typeof val === 'string') {
                  // thử parse JSON array
                  try {
                    const parsed = JSON.parse(val)
                    if (Array.isArray(parsed)) return parsed
                  } catch {}
                  // fallback csv
                  if (val.includes(',')) return val.split(',').map((s) => s.trim()).filter(Boolean)
                  if (val.trim()) return [val.trim()]
                }
                return []
              }

              const tienIchList = parseTienIch((phong as any).TienIch)
              const normalizeArea = (val: any): string => {
                if (val == null) return ''
                const str = String(val).trim()
                // Extract first number, allow decimal
                const match = str.match(/\d+(?:[\.,]\d+)?/)
                if (match) {
                  const num = match[0].replace(',', '.')
                  return `${num}`
                }
                return str
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Số phòng</p>
                      <p className="font-medium dark:text-gray-100">{(phong as any).SoPhong || '—'}</p>
                  </div>
                  <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Dãy trọ</p>
                      <p className="font-medium dark:text-gray-100">{(phong as any).DayPhong || '—'}</p>
                  </div>
                  <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Giá phòng</p>
                      <p className="font-medium dark:text-gray-100">{formatVnd((phong as any).GiaPhong)} VND</p>
                  </div>
                  <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Diện tích</p>
                      <p className="font-medium dark:text-gray-100">{(phong as any).DienTich ? `${normalizeArea((phong as any).DienTich)} m²` : '—'}</p>
                  </div>
                  
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Mô tả</p>
                      <p className="font-medium dark:text-gray-100">{(phong as any).MoTaPhong || '—'}</p>
                  </div>
                  {Array.isArray(tienIchList) && tienIchList.length > 0 && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Tiện ích</p>
                      <div className="flex flex-wrap gap-2">
                        {tienIchList.map((item, i) => (
                          <span key={i} className="px-2 py-1 text-xs rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })()}
          </div>
        </div>

        {/* CCCD Images (moved below room info, before terms) */}
        {khachHang && (khachHang.CCCDMT || khachHang.CCCDMS) && (
          <div className="mb-6">
            <h3 className="font-semibold text-black dark:text-gray-100 mb-3">Ảnh CCCD</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {khachHang.CCCDMT && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Mặt trước CCCD</p>
                  <img
                    src={khachHang.CCCDMT as any}
                    alt="CCCD Mặt trước"
                    className="w-full h-auto max-h-64 object-cover border border-gray-200 dark:border-gray-700 rounded"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                  />
                </div>
              )}
              {khachHang.CCCDMS && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Mặt sau CCCD</p>
                  <img
                    src={khachHang.CCCDMS as any}
                    alt="CCCD Mặt sau"
                    className="w-full h-auto max-h-64 object-cover border border-gray-200 dark:border-gray-700 rounded"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payment Information */}
        <div className="mb-6">
          <h3 className="font-semibold text-black dark:text-gray-100 mb-3">Tiền Phòng & Tiền Cọc</h3>
          <div className="p-0">
            {(() => {
              const currentContract: any = (hopDong || []).find((c: any) => c.TrangThaiHopDong === 'HoatDong') || (hopDong || [])[0] || null
              const matchedPhong = khachHang?.HopDongsDangThue?.find((hd) => hd.HopDongID === currentContract?.HopDongID)?.Phong
              const giaPhongFromPhong = matchedPhong?.GiaPhong
              const roomFeeValue = (typeof giaPhongFromPhong === 'number' ? String(giaPhongFromPhong) : (giaPhongFromPhong ?? formData.roomFee)) as string
              const depositRaw = currentContract?.TienDatCoc
              const depositValue = (typeof depositRaw === 'number' ? String(depositRaw) : (depositRaw ?? formData.deposit)) as string
              const chuKyText = currentContract?.ChuKy || currentContract?.ThoiHanHopDong || ''
              const formatVndText = (val: any) => (typeof val === 'number' ? val : Number(val || 0)).toLocaleString('vi-VN')
              const formatVndWords = (val: any) => toVietnameseNumberText(typeof val === 'number' ? val : Number(val || 0))
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="roomFee">Số tiền phòng (VND) *</Label>
                    <Input
                      id="roomFee"
                      value={roomFeeValue}
                      onChange={(e) => handleInputChange('roomFee', e.target.value)}
                      placeholder="Nhập số tiền phòng"
                      type="number"
                      readOnly={giaPhongFromPhong !== undefined && giaPhongFromPhong !== null}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">Hiển thị: {formatVndText(roomFeeValue)} VND</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Bằng chữ: {formatVndWords(roomFeeValue)} đồng</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deposit">Số tiền cọc (VND) *</Label>
                    <Input
                      id="deposit"
                      value={depositValue}
                      onChange={(e) => handleInputChange('deposit', e.target.value)}
                      placeholder="Nhập số tiền cọc"
                      type="number"
                      readOnly={depositRaw !== undefined && depositRaw !== null}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">Hiển thị: {formatVndText(depositValue)} VND</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Bằng chữ: {formatVndWords(depositValue)} đồng</p>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    {chuKyText ? (
                      <>
                        <Label>Chu kỳ (theo hợp đồng)</Label>
                        <Input value={chuKyText} readOnly />
                      </>
                    ) : (
                      <>
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
                      </>
                    )}
                  </div>
                </div>
              )
            })()}
          </div>
        </div>

        {/* Contract Terms */}
        <div className="mb-6">
          <h3 className="font-semibold text-black dark:text-gray-100 mb-3">Điều Khoản Hợp Đồng</h3>
          <div className="p-0">
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Điều khoản chính:</h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• Điều 1:
                  Bên B có trách nhiệm thanh toán tiền thuê phòng đúng hạn vào ngày 5 hàng tháng.</li>
                  <li>• Điều 2:
                  Bên B không được chuyển nhượng, cho thuê lại phòng trọ mà không có sự đồng ý của Bên A.</li>
                  <li>• Điều 3:
                  Bên B có trách nhiệm giữ gìn tài sản trong phòng và báo cáo kịp thời khi có hư hỏng.</li>
                  <li>• Điều 4:
                  Bên A có trách nhiệm cung cấp đầy đủ các dịch vụ như điện, nước, internet theo thỏa thuận.</li>
                  <li>• Điều 5:
                  Hợp đồng có thể được gia hạn theo thỏa thuận của hai bên.</li>
                  <li>• Điều 6:
                  Khi chấm dứt hợp đồng, Bên B phải trả lại phòng trong tình trạng ban đầu.</li>
                  <li>• Điều 7:
                  Mọi tranh chấp sẽ được giải quyết thông qua thương lượng, hòa giải hoặc tòa án có thẩm quyền.</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Trách nhiệm chung:</h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• Hai bên hỗ trợ nhau thực hiện hợp đồng</li>
                  <li>• Báo trước 30 ngày nếu muốn chấm dứt hợp đồng</li>
                  <li>• Hoàn trả tiền cọc khi kết thúc hợp đồng</li>
                  <li>• Hợp đồng có giá trị pháp lý</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="text-center">
                  <h5 className="font-semibold mb-4">Đại diện Bên A</h5>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 bg-gray-50 dark:bg-white/5">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Ký tên và ghi họ tên</p>
                  </div>
                </div>
                <div className="text-center">
                  <h5 className="font-semibold mb-4">Đại diện Bên B</h5>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 bg-gray-50 dark:bg-white/5">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Ký tên và ghi họ tên</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Black & White printable contract (text-only) */}
      {(() => {
        const currentContract: any = (hopDong || []).find((c: any) => c.TrangThaiHopDong === 'HoatDong') || (hopDong || [])[0] || null
        const phong = khachHang?.HopDongsDangThue?.find((hd) => hd.HopDongID === currentContract?.HopDongID)?.Phong || khachHang?.HopDongsDangThue?.[0]?.Phong
        const landlordName = currentContract?.HoTenQuanLi || '................................'
        const landlordPhone = currentContract?.SoDienThoaiDN || '................................'
        const landlordId = currentContract?.SoCCCD || '................................'
        const landlordAddr = currentContract?.DiaChiChiTiet || '................................'
        const tenantName = khachHang?.HoTenKhachHang || '................................'
        const tenantPhone = khachHang?.SoDienThoai || '................................'
        const tenantId = khachHang?.SoCCCD || '................................'
        const tenantBirth = khachHang?.NgaySinh ? new Date(khachHang.NgaySinh as any).toLocaleDateString('vi-VN') : '.../.../...'
        const tenantGender = khachHang?.GioiTinh || '........................'
        const tenantAddr = (khachHang?.DiaChiCuThe && khachHang?.PhuongXa && khachHang?.QuanHuyen && khachHang?.TinhThanh)
          ? `${khachHang.DiaChiCuThe}, ${khachHang.PhuongXa}, ${khachHang.QuanHuyen}, ${khachHang.TinhThanh}`
          : (khachHang?.DiaChiCuThe || '................................')
        const dayPhong = (phong as any)?.DayPhong || '...'
        const soPhong = (phong as any)?.SoPhong || '...'
        const giaPhong = (phong as any)?.GiaPhong ? Number((phong as any)?.GiaPhong).toLocaleString('vi-VN') : '........'
        const dienTich = (phong as any)?.DienTich ? String((phong as any)?.DienTich) : '........'
        const ngayBatDau = currentContract?.NgayBatDau ? new Date(currentContract.NgayBatDau).toLocaleDateString('vi-VN') : '.../.../...'
        const ngayKetThuc = currentContract?.NgayKetThuc ? new Date(currentContract.NgayKetThuc).toLocaleDateString('vi-VN') : '.../.../...'
        const datCoc = (currentContract as any)?.TienDatCoc ? Number((currentContract as any).TienDatCoc).toLocaleString('vi-VN') : '........'
        const chuKy = currentContract?.ChuKy || currentContract?.ThoiHanHopDong || ''
        const cccdFront = (khachHang as any)?.CCCDMT || ''
        const cccdBack = (khachHang as any)?.CCCDMS || ''
        const parseTienIch = (val: any): string[] => {
          if (Array.isArray(val)) return val
          if (typeof val === 'string') {
            try { const parsed = JSON.parse(val); if (Array.isArray(parsed)) return parsed } catch {}
            if (val.includes(',')) return val.split(',').map((s) => s.trim()).filter(Boolean)
            if (val.trim()) return [val.trim()]
          }
          return []
        }
        const tienIchList = parseTienIch((phong as any)?.TienIch)
        return (
          <div id="bw-print" className="mx-auto px-8 py-10 bg-white text-black" style={{maxWidth: 900}}>
            <div className="text-center mb-2">
              <h1 className="text-2xl font-bold">HỢP ĐỒNG THUÊ PHÒNG TRỌ</h1>
              <p className="text-sm">(Bản in đen trắng)</p>
            </div>
            <div className="mt-4 text-sm leading-6">
              <p><strong>Bên A (Chủ trọ):</strong> {landlordName}</p>
              <p><strong>CMND/CCCD:</strong> {landlordId}</p>
              <p><strong>SĐT:</strong> {landlordPhone}</p>
              <p><strong>Địa chỉ:</strong> {landlordAddr}</p>
              <div className="h-2" />
              <p><strong>Bên B (Khách thuê):</strong> {tenantName}</p>
              <p><strong>CMND/CCCD:</strong> {tenantId}</p>
              <p><strong>SĐT:</strong> {tenantPhone}</p>
              <p><strong>Giới tính:</strong> {tenantGender}</p>
              <p><strong>Ngày sinh:</strong> {tenantBirth}</p>
              <p><strong>Địa chỉ:</strong> {tenantAddr}</p>
              <div className="h-2" />
              <p><strong>Phòng thuê:</strong> Dãy {dayPhong}, Phòng {soPhong}</p>
              <p><strong>Giá phòng:</strong> {giaPhong} VND/tháng</p>
              <p><strong>Diện tích:</strong> {dienTich} m²</p>
              <p><strong>Tiền đặt cọc:</strong> {datCoc} VND</p>
              <p><strong>Chu kỳ thu tiền:</strong> {chuKy || 'Theo thỏa thuận'}</p>
              <p><strong>Thời hạn hợp đồng:</strong> {ngayBatDau} đến {ngayKetThuc}</p>
              {tienIchList && tienIchList.length > 0 && (
                <div className="mt-2">
                  <p><strong>Tiện ích đi kèm:</strong></p>
                  <ul className="list-disc pl-5">
                    {tienIchList.map((t, idx) => (<li key={idx}>{t}</li>))}
                  </ul>
                </div>
              )}

              {(cccdFront || cccdBack) && (
                <div className="mt-4">
                  <p><strong>Ảnh CCCD của Bên B:</strong></p>
                  <div className="grid grid-cols-2 gap-6 mt-2">
                    <div>
                      <p className="text-xs mb-1">Mặt trước</p>
                      {cccdFront ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={cccdFront} alt="CCCD Mặt trước" className="border border-black p-1 max-h-44 object-contain w-full" style={{filter: 'grayscale(100%)'}} />
                      ) : (
                        <div className="h-44 border border-black" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs mb-1">Mặt sau</p>
                      {cccdBack ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={cccdBack} alt="CCCD Mặt sau" className="border border-black p-1 max-h-44 object-contain w-full" style={{filter: 'grayscale(100%)'}} />
                      ) : (
                        <div className="h-44 border border-black" />
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4">
                <p><strong>Điều khoản chính:</strong></p>
                <ol className="list-decimal pl-5">
                  <li>Bên B thanh toán tiền phòng đúng hạn vào ngày 5 hàng tháng.</li>
                  <li>Không cho thuê lại/chuyển nhượng khi chưa có sự đồng ý của Bên A.</li>
                  <li>Giữ gìn tài sản, báo hư hỏng kịp thời.</li>
                  <li>Bên A cung cấp dịch vụ điện, nước, internet theo thỏa thuận.</li>
                  <li>Gia hạn/chấm dứt hợp đồng theo thỏa thuận hai bên.</li>
                  <li>Khi chấm dứt, Bên B trả lại phòng trong tình trạng ban đầu.</li>
                </ol>
              </div>
              <div className="mt-4">
                <p><strong>Trách nhiệm & cam kết:</strong></p>
                <ul className="list-disc pl-5">
                  <li>Hai bên hỗ trợ, phối hợp thực hiện đúng các điều khoản hợp đồng.</li>
                  <li>Báo trước 30 ngày nếu một trong hai bên muốn chấm dứt hợp đồng sớm.</li>
                  <li>Tiền đặt cọc được hoàn trả theo thỏa thuận sau khi trừ các chi phí phát sinh hợp lý (nếu có).</li>
                  <li>Hợp đồng có giá trị pháp lý; tranh chấp được giải quyết thông qua thương lượng, hòa giải hoặc cơ quan có thẩm quyền.</li>
                </ul>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-12">
                <div className="text-center">
                  <p><strong>ĐẠI DIỆN BÊN A</strong></p>
                  <div className="mt-8 border border-black border-dashed h-24" />
                  <p className="mt-2 text-xs">Ký, ghi rõ họ tên</p>
                </div>
                <div className="text-center">
                  <p><strong>ĐẠI DIỆN BÊN B</strong></p>
                  <div className="mt-8 border border-black border-dashed h-24" />
                  <p className="mt-2 text-xs">Ký, ghi rõ họ tên</p>
                </div>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Print styles: only show bw-print when printing */}
      <style jsx global>{`
        @media print {
          body { background: #fff !important; }
          #print-area { display: none !important; }
          #bw-print { display: block !important; }
          .screen-only { display: none !important; }
          * { color: #000 !important; box-shadow: none !important; text-shadow: none !important; }
        }
        @media screen {
          #bw-print { display: none; }
        }
      `}</style>
    </div>
  )
}
