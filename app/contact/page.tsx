"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toast } from 'react-hot-toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Phone, Mail, MapPin, MessageCircle, QrCode, Send, Info, Bell, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import zaloQr from '@/app/images/MãQR.jpg'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCurrentKhachHang } from '@/hooks/use-khachhang'
import { useLienHePhanHoi } from '@/hooks/use-lienhe-phanhoi'

export default function ContactPage() {
  const router = useRouter()
  const { khachHang } = useCurrentKhachHang()
  const { items, loading, error, newCount, refresh } = useLienHePhanHoi(45000)
  const [formData, setFormData] = useState({
    reason: '',
    content: '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('userToken')
    if (!token) {
      router.replace('/login')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.reason || !formData.content) {
      toast.error('Vui lòng điền đầy đủ thông tin', { duration: 2500 })
      return
    }

    const khachHangId = (khachHang as any)?.KhachHangID
    const phongId = (khachHang as any)?.HopDongsDangThue?.[0]?.Phong?.PhongID
      ?? (khachHang as any)?.HopDongsDangThue?.[0]?.PhongID

    if (!khachHangId || !phongId) {
      toast.error('Thiếu Khách hàng hoặc Phòng. Vui lòng đảm bảo bạn đang thuê phòng hiện tại.', { duration: 3000 })
      return
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null
    const payload = {
      KhachHangID: khachHangId,
      PhongID: phongId,
      LyDoLienHe: formData.reason,
      NoiDung: formData.content,
      TrangThai: 'Chưa xử lý',
      Time: new Date().toISOString().slice(0, 19).replace('T', ' '),
    }

    try {
      setSubmitting(true)
      const res = await fetch('https://all-oqry.onrender.com/api/lienhe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json().catch(() => null)
      if (!res.ok) {
        const msg = data?.message || data?.error || `HTTP ${res.status}`
        throw new Error(String(msg))
      }

      toast.success('Đã gửi liên hệ thành công! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.', {
        duration: 3500,
      })
      setFormData({ reason: '', content: '' })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gửi liên hệ thất bại'
      toast.error(msg, { duration: 3500 })
    } finally {
      setSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: Phone,
      label: 'Số điện thoại',
      value: '0399049778',
      color: 'text-green-600'
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'support@quanlyphongtroCT.com',
      color: 'text-blue-600'
    },
    {
      icon: MapPin,
      label: 'Địa chỉ',
      value: 'Hẻm 444, đường Cách Mạng Tháng 8, TP. Cần Thơ',
      color: 'text-red-600'
    }
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Liên Hệ & Hỗ Trợ</h1>
          </div>
        </div>

        {/* Contact Information */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              Thông Tin Liên Hệ
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contactInfo.map((item, index) => {
                const Icon = item.icon
                return (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className={`h-5 w-5 ${item.color}`} />
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

        {/* Notifications / Manager Responses */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Thông báo & Phản hồi từ quản lý {newCount > 0 ? `(mới: ${newCount})` : ''}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 text-gray-600">Đang tải phản hồi...</div>
            ) : error ? (
              <div className="p-6 text-center">
                <AlertCircle className="h-6 w-6 mx-auto mb-2 text-red-600" />
                <p className="text-red-600 mb-3">{error}</p>
                <Button onClick={refresh}>Thử lại</Button>
              </div>
            ) : (items && items.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {items.map((it) => {
                  const isDone = it.TrangThai === 'HoanThanh'
                  const isProcessing = it.TrangThai === 'DangXuLy'
                  const Icon = isDone ? CheckCircle2 : (isProcessing ? Clock : AlertCircle)
                  return (
                    <div key={it.LienHeID} className="p-4 flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDone ? 'bg-emerald-100 text-emerald-700' : isProcessing ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-gray-900">{it.LyDoLienHe || 'Liên hệ'}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">#{it.LienHeID}</span>
                          <span className="text-xs text-gray-500">{new Date(it.Time).toLocaleString('vi-VN')}</span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{it.NoiDung}</p>
                        {it.PhanHoi && (
                          <div className="mt-2 p-3 rounded-md bg-indigo-50">
                            <p className="text-xs text-indigo-700">Phản hồi quản lý:</p>
                            <p className="text-sm font-medium text-indigo-900">{it.PhanHoi}</p>
                            {it.ThoiGianPhanHoi && (
                              <p className="text-xs text-indigo-700 mt-1">Lúc: {new Date(it.ThoiGianPhanHoi).toLocaleString('vi-VN')}</p>
                            )}
                          </div>
                        )}
                        <p className="text-xs text-gray-600 mt-2">Trạng thái: <span className={`${isDone ? 'text-emerald-600' : isProcessing ? 'text-amber-600' : 'text-gray-700'} font-semibold`}>{it.TrangThaiHienThi}</span></p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="p-6 text-gray-600">Chưa có phản hồi nào</div>
            ))}
          </CardContent>
        </Card>

        {/* Zalo Contact */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              Liên Hệ Qua Zalo
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center">
              <a href={zaloQr.src} target="_blank" rel="noopener noreferrer" title="Mở ảnh mã QR">
                <div className="w-48 h-48 mx-auto mb-3 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg overflow-hidden shadow-sm flex items-center justify-center">
                  <Image
                    src={zaloQr}
                    alt="Mã QR Zalo"
                    width={192}
                    height={192}
                    className="w-full h-full object-contain"
                  />
                </div>
              </a>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Mã QR Zalo</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Quét để liên hệ với quản lý</p>
              <p className="text-gray-700 dark:text-gray-200 mt-3">
                Quét mã QR để liên hệ trực tiếp với quản lý qua Zalo
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Gửi Email Liên Hệ
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="reason">Lý do liên hệ</Label>
                <Select value={formData.reason} onValueChange={(value) => setFormData({...formData, reason: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn lý do liên hệ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Hỗ trợ kỹ thuật</SelectItem>
                    <SelectItem value="payment">Vấn đề thanh toán</SelectItem>
                    <SelectItem value="room">Hỏi về phòng trọ</SelectItem>
                    <SelectItem value="other">Lý do khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                 <Label htmlFor="content">Nội dung</Label>
                <Textarea
                  id="content"
                  placeholder="Mô tả chi tiết yêu cầu của bạn..."
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  rows={6}
                   className="resize-none"
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={submitting}
                className="w-full h-12 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:opacity-70"
              >
                <Send className="h-5 w-5 mr-2" />
                {submitting ? 'Đang gửi...' : 'Gửi Liên Hệ'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Authentication Notice */}
        <Alert className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30">
          <Info className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 dark:text-amber-300">
            <strong>Lưu ý:</strong> Vui lòng đăng nhập trước khi truy cập trang này để sử dụng đầy đủ tính năng liên hệ.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
