"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Receipt, Download, CreditCard, Calendar, User, Home, ArrowLeft } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const invoiceData = {
  collectionDate: '15/01/2024',
  fullName: 'Nguyễn Văn An',
  building: 'A',
  roomNumber: '101',
  roomFee: 3500000,
  electricityFee: 450000,
  waterFee: 120000,
  serviceFee: 200000,
  repairFee: 0,
  deductionFee: 0,
  total: 4270000,
  totalInWords: 'Bốn triệu hai trăm bảy mươi nghìn đồng',
  payer: 'Nguyễn Văn An',
}

export default function DemoInvoicePage() {
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState('current')

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + ' VND'
  }

  const handlePayment = () => {
    alert('Chức năng thanh toán đang được phát triển')
  }

  const handleDownload = () => {
    alert('Chức năng tải ảnh hóa đơn đang được phát triển')
  }

  const feeItems = [
    { label: 'Tiền phòng', amount: invoiceData.roomFee },
    { label: 'Tiền điện', amount: invoiceData.electricityFee },
    { label: 'Tiền nước', amount: invoiceData.waterFee },
    { label: 'Phí dịch vụ', amount: invoiceData.serviceFee },
    { label: 'Phí sửa chữa', amount: invoiceData.repairFee },
    { label: 'Phí trừ', amount: invoiceData.deductionFee },
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
            <h1 className="text-2xl font-bold text-gray-900">Hóa Đơn Tiền Trọ</h1>
          </div>
          
          <div className="bg-red-50 px-3 py-1 rounded-full">
            <span className="text-red-600 text-sm font-medium">DEMO MODE</span>
          </div>
        </div>

        {/* Time Selector */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Chọn thời gian:
                </label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-full md:w-64">
                    <SelectValue placeholder="Chọn thời gian" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Tháng hiện tại</SelectItem>
                    <SelectItem value="last">Tháng trước</SelectItem>
                    <SelectItem value="2months">2 tháng trước</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invoice Card */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="text-center text-2xl font-bold">
              HÓA ĐƠN TIỀN TRỌ
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Ngày thu:</p>
                    <p className="font-semibold">{invoiceData.collectionDate}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Họ tên:</p>
                    <p className="font-semibold">{invoiceData.fullName}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Home className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Dãy trọ:</p>
                    <p className="font-semibold">{invoiceData.building}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Home className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Số phòng:</p>
                    <p className="font-semibold">{invoiceData.roomNumber}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fee Details */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Receipt className="h-5 w-5 mr-2 text-blue-600" />
                Chi tiết phí:
              </h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="space-y-3">
                  {feeItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                      <span className="text-gray-700">{item.label}:</span>
                      <span className="font-semibold">{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="border-t-2 border-blue-600 pt-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-gray-900">Tổng cộng:</span>
                  <span className="text-2xl font-bold text-red-600">
                    {formatCurrency(invoiceData.total)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 italic mb-2">
                  Bằng chữ: {invoiceData.totalInWords}
                </p>
                <p className="text-sm text-gray-600">
                  Người thanh toán: {invoiceData.payer}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={handlePayment}
                className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Thanh Toán Ngay
              </Button>
              
              <Button 
                variant="outline"
                onClick={handleDownload}
                className="h-12 border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                <Download className="h-5 w-5 mr-2" />
                Tải Ảnh Hóa Đơn
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
