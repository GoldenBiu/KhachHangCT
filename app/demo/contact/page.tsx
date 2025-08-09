"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Phone, Mail, MapPin, MessageCircle, QrCode, Send, Info, ArrowLeft } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function DemoContactPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    reason: '',
    content: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.reason || !formData.content) {
      alert('Vui lòng điền đầy đủ thông tin')
      return
    }
    alert('Đã gửi liên hệ thành công!')
    setFormData({ reason: '', content: '' })
  }

  const contactInfo = [
    {
      icon: Phone,
      label: 'Số điện thoại',
      value: '0376539778',
      color: 'text-green-600'
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'support@quanlyphongtro.com',
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
            <h1 className="text-2xl font-bold text-gray-900">Liên Hệ & Hỗ Trợ</h1>
          </div>
          
          <div className="bg-red-50 px-3 py-1 rounded-full">
            <span className="text-red-600 text-sm font-medium">DEMO MODE</span>
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
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className={`h-5 w-5 ${item.color}`} />
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
              <div className="w-48 h-48 mx-auto mb-4 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-600">Mã QR Zalo</p>
                  <p className="text-xs text-gray-500 mt-1">Quét để liên hệ với quản lý</p>
                </div>
              </div>
              <p className="text-gray-700">
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
                className="w-full h-12 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              >
                <Send className="h-5 w-5 mr-2" />
                Gửi Liên Hệ
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Authentication Notice */}
        <Alert className="border-amber-200 bg-amber-50">
          <Info className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Lưu ý:</strong> Đây là chế độ demo. Trong phiên bản thực tế, bạn cần đăng nhập để sử dụng đầy đủ tính năng liên hệ.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
