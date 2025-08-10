"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Receipt, Download, CreditCard, Calendar, User, Home, Loader2, AlertCircle, Eye } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCurrentKhachHang } from '@/hooks/use-khachhang'
import { useHoaDon, useChiTietHoaDon } from '@/hooks/use-hoadon'
import { toVietnameseNumberText } from '@/lib/utils'
import { toast } from 'react-hot-toast'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

// removed static invoiceData; page now binds to API data

export default function InvoicePage() {
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState('current')
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null)
  const { khachHang, loading: khachHangLoading, error: khachHangError } = useCurrentKhachHang()
  const { hoaDon, loading: hoaDonLoading, error: hoaDonError } = useHoaDon()

  useEffect(() => {
    const token = localStorage.getItem('userToken')
    if (!token) {
      router.replace('/login')
    }
  }, [router])

  const toNum = (v: any) => typeof v === 'number' ? v : Number(v || 0)
  const formatCurrency = (amount: any) => {
    return toNum(amount).toLocaleString('vi-VN') + ' VND'
  }

  const handlePayment = () => {
    alert('Chức năng thanh toán đang được phát triển')
  }

  const handleDownload = () => {
    alert('Chức năng tải ảnh hóa đơn đang được phát triển')
  }

  // legacy placeholder removed; now computed from API values where needed

  // Hiển thị loading nếu đang tải dữ liệu
  if (khachHangLoading || hoaDonLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Đang tải thông tin hóa đơn...</p>
        </div>
      </div>
    )
  }

  // Hiển thị lỗi nếu có
  if (khachHangError || hoaDonError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-600" />
          <p className="text-red-600 mb-4">{khachHangError || hoaDonError}</p>
          <Button onClick={() => window.location.reload()}>
            Thử lại
          </Button>
        </div>
      </div>
    )
  }

  // choose current invoice to show in summary card: selected or first
  const current = (hoaDon || []).find(i => String(i.ChiSoID) === String(selectedInvoice)) || (hoaDon || [])[0] || null
  const currentBuilding = current?.DayPhong || '-'
  const currentRoom = current?.SoPhong || '-'
  const currentMonth = current?.ThangNam || '-'
  const feeRoom = toNum(current?.TienPhong)
  const feeElectric = toNum(current?.SoDienDaTieuThu) * toNum(current?.GiaDienMoi)
  const feeWater = toNum(current?.SoNuocDaTieuThu) * toNum(current?.GiaNuocMoi)
  const feeService = 0
  const feeRepair = toNum(current?.PhiSuaChua)
  const feeDeduction = toNum(current?.PhiTru)
  const total = feeRoom + feeElectric + feeWater + feeService + feeRepair - feeDeduction
  const totalInWords = toVietnameseNumberText(total)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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
            <h1 className="text-2xl font-bold text-gray-900">Hóa Đơn Tiền Trọ</h1>
          </div>
        </div>

        {/* Invoice List */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <Receipt className="h-5 w-5 mr-2" />
              Danh Sách Hóa Đơn
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {hoaDon && hoaDon.length > 0 ? (
              <div className="space-y-4">
                {hoaDon.map((invoice) => {
                  const isPaid = invoice.TrangThaiThanhToan === 'Y' || invoice.TrangThaiThanhToan === '1' || invoice.TrangThaiThanhToan === 'true'
                  const dien = toNum(invoice.SoDienDaTieuThu) * toNum(invoice.GiaDienMoi)
                  const nuoc = toNum(invoice.SoNuocDaTieuThu) * toNum(invoice.GiaNuocMoi)
                  const totalRow = toNum(invoice.TienPhong) + dien + nuoc + toNum(invoice.PhiSuaChua) - toNum(invoice.PhiTru)
                  return (
                  <div key={invoice.ChiSoID} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Tháng/Năm:</p>
                            <p className="font-semibold">{invoice.ThangNam}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Phòng:</p>
                            <p className="font-semibold">{invoice.DayPhong}-{invoice.SoPhong}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Tổng tiền:</p>
                            <p className="font-semibold text-red-600">
                            {formatCurrency(invoice.TongTien)}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                          <div>
                            <p className="text-sm text-gray-600">Tiền phòng:</p>
                            <p className="font-medium">{formatCurrency(invoice.TienPhong)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Tiền điện:</p>
                            <p className="font-medium">{formatCurrency(dien)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Tiền nước:</p>
                            <p className="font-medium">{formatCurrency(nuoc)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2 ml-4">
                        <Button
                          size="sm"
                          onClick={() => setSelectedInvoice(invoice.ChiSoID)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Xem chi tiết
                        </Button>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                        </div>
                      </div>
                    </div>
                  </div>
                )})}
              </div>
            ) : (
              <div className="text-center py-8">
                <Receipt className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Chưa có hóa đơn</h3>
                <p className="text-gray-500">Bạn chưa có hóa đơn nào. Hóa đơn sẽ xuất hiện sau khi có chỉ số điện nước.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Invoice Detail Modal */}
        {selectedInvoice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 text-gray-900">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Chi Tiết Hóa Đơn</h2>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedInvoice(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </Button>
                </div>
                <InvoiceDetail chiSoID={selectedInvoice} />
              </div>
            </div>
          </div>
        )}

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
                      <p className="text-sm text-gray-600">Tháng/Năm:</p>
                      <p className="font-semibold">{currentMonth}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Họ tên:</p>
                    <p className="font-semibold">{khachHang?.HoTenKhachHang || 'Đang tải...'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Số điện thoại:</p>
                    <p className="font-semibold">{khachHang?.SoDienThoai || 'Đang tải...'}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Home className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Dãy trọ:</p>
                      <p className="font-semibold">{currentBuilding}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Home className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Số phòng:</p>
                      <p className="font-semibold">{currentRoom}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Công việc:</p>
                    <p className="font-semibold">{khachHang?.CongViec || 'Đang tải...'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            {khachHang && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Thông tin chi tiết khách hàng:
                </h3>
                <div className="bg-gray-50 rounded-lg p-6 text-gray-900">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Ngày sinh:</p>
                      <p className="font-semibold">{khachHang.NgaySinh || 'Chưa cập nhật'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Giới tính:</p>
                      <p className="font-semibold">{khachHang.GioiTinh || 'Chưa cập nhật'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Địa chỉ:</p>
                      <p className="font-semibold">
                        {khachHang.DiaChiCuThe && khachHang.PhuongXa && khachHang.QuanHuyen && khachHang.TinhThanh 
                          ? `${khachHang.DiaChiCuThe}, ${khachHang.PhuongXa}, ${khachHang.QuanHuyen}, ${khachHang.TinhThanh}`
                          : 'Chưa cập nhật'
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">CCCD:</p>
                      <p className="font-semibold">{khachHang.SoCCCD || 'Chưa cập nhật'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Component để hiển thị chi tiết hóa đơn
function InvoiceDetail({ chiSoID }: { chiSoID: string }) {
  const { chiTietHoaDon, loading, error } = useChiTietHoaDon(chiSoID)
  const [paying, setPaying] = useState(false)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<string>('momo')

  const handleMomoPayment = async (amount: number) => {
    try {
      setPaying(true)
      const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null
      const response = await fetch('https://all-oqry.onrender.com/api/momo/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ amount }),
      })

      const data: any = await response.json().catch(() => null)

      if (!response.ok) {
        const serverMsg = data?.message || data?.error || `HTTP ${response.status}`
        if (response.status === 401) {
          toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.')
        }
        throw new Error(String(serverMsg))
      }

      const momoPayload = data?.data ?? data
      const payUrl = momoPayload?.payUrl || momoPayload?.pay_url || momoPayload?.deeplink || momoPayload?.deeplinkUrl || momoPayload?.shortLink || momoPayload?.url || momoPayload?.result?.payUrl

      if (payUrl) {
        toast.success('Chuyển tới MoMo để thanh toán')
        setTimeout(() => {
          window.location.href = payUrl
        }, 400)
        return
      }

      const html = momoPayload?.html
      if (html) {
        const newWindow = window.open('', '_blank')
        if (newWindow) {
          newWindow.document.write(html)
        } else {
          const blob = new Blob([html], { type: 'text/html' })
          const objectUrl = URL.createObjectURL(blob)
          window.location.href = objectUrl
        }
        return
      }

      console.log('Phản hồi MoMo:', momoPayload)
      toast.error('Không tìm thấy liên kết thanh toán trong phản hồi')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể khởi tạo thanh toán MoMo'
      console.error('MoMo create-payment error:', err)
      toast.error(message)
    } finally {
      setPaying(false)
    }
  }

  const handleConfirmPayment = async () => {
    if (!chiTietHoaDon) {
      toast.error('Không có dữ liệu hóa đơn để thanh toán')
      return
    }
    if (selectedMethod === 'momo') {
      await handleMomoPayment(chiTietHoaDon.tongCong)
    } else {
      toast.error('Phương thức thanh toán chưa được hỗ trợ')
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
        <p className="text-gray-600">Đang tải chi tiết hóa đơn...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-600" />
        <p className="text-red-600 mb-4">{error}</p>
      </div>
    )
  }

  if (!chiTietHoaDon) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Không tìm thấy thông tin hóa đơn</p>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + ' VND'
  }

  const feeItems = [
    { label: 'Tiền phòng', amount: chiTietHoaDon.tienPhong },
    { label: 'Tiền điện', amount: chiTietHoaDon.tienDien },
    { label: 'Tiền nước', amount: chiTietHoaDon.tienNuoc },
    ...chiTietHoaDon.dsDichVu.map((dv: { ten: string; gia: number }) => ({ label: dv.ten, amount: dv.gia })),
    { label: 'Phí sửa chữa', amount: chiTietHoaDon.suaChua },
    { label: 'Phí trừ', amount: -chiTietHoaDon.phiTru },
  ]

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Tháng/Năm:</p>
              <p className="font-semibold text-gray-900">{chiTietHoaDon.thangNam}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Họ tên:</p>
              <p className="font-semibold text-gray-900">{chiTietHoaDon.tenKhachHang}</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Home className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Phòng:</p>
              <p className="font-semibold text-gray-900">{chiTietHoaDon.phong}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Số điện thoại:</p>
              <p className="font-semibold text-gray-900">{chiTietHoaDon.soDienThoai}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fee Details */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Receipt className="h-5 w-5 mr-2 text-blue-600" />
          Chi tiết phí:
        </h3>
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="space-y-3">
            {feeItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                <span className="text-gray-700">{item.label}:</span>
                <span className={`font-semibold ${item.amount < 0 ? 'text-green-600' : ''}`}>
                  {formatCurrency(Math.abs(item.amount))}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="border-t-2 border-blue-600 pt-6">
          <div className="bg-blue-50 rounded-lg p-6 text-gray-900">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-bold text-gray-900">Tổng cộng:</span>
            <span className="text-2xl font-bold text-red-600">
              {formatCurrency(chiTietHoaDon.tongCong)}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Tiền nợ: <span className="font-semibold text-gray-900">{formatCurrency(chiTietHoaDon.tienNo)}</span></p>
              <p className="text-gray-600">Tiền trả: <span className="font-semibold text-gray-900">{formatCurrency(chiTietHoaDon.tienTra)}</span></p>
            </div>
            <div>
              <p className="text-gray-600">Trạng thái: 
                <span className={`font-semibold ml-1 ${
                  chiTietHoaDon.trangThai === 'Đã thanh toán' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {chiTietHoaDon.trangThai}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button 
          onClick={() => setPaymentOpen(true)}
          disabled={paying}
          className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-70"
        >
          {paying ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Đang chuyển tới MoMo...
            </>
          ) : (
            <>
              <CreditCard className="h-5 w-5 mr-2" />
              Thanh Toán Ngay
            </>
          )}
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => alert('Chức năng tải ảnh hóa đơn đang được phát triển')}
          className="h-12 border-blue-200 text-blue-600 hover:bg-blue-50"
        >
          <Download className="h-5 w-5 mr-2" />
          Tải Ảnh Hóa Đơn
        </Button>
      </div>

      {/* Payment method selection dialog */}
      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chọn phương thức thanh toán</DialogTitle>
            <DialogDescription>
              Vui lòng chọn phương thức để tiếp tục thanh toán hóa đơn.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
              <label className="flex items-center gap-3 rounded-md border p-3 cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="momo" id="pay-momo" />
                <div className="flex flex-col">
                  <span className="font-medium">MoMo</span>
                  <span className="text-sm text-gray-600">Thanh toán nhanh qua Ví MoMo</span>
                </div>
              </label>
            </RadioGroup>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentOpen(false)} disabled={paying}>
              Hủy
            </Button>
            <Button onClick={handleConfirmPayment} disabled={paying} className="bg-blue-600 hover:bg-blue-700">
              {paying ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                'Tiếp tục thanh toán'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

//Bực mình nhanha