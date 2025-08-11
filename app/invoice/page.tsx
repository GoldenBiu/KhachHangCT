"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Receipt, Download, CreditCard, Calendar, User, Home, Loader2, AlertCircle, Eye, Printer, Share2, FileDown, Filter, Bell } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCurrentKhachHang } from '@/hooks/use-khachhang'
import { useHoaDon, useChiTietHoaDon } from '@/hooks/use-hoadon'
import { useLichSuThanhToan, isPaidRecord, toVnd } from '@/hooks/use-lichsu-thanh-toan'
import { toVietnameseNumberText } from '@/lib/utils'
import { toast } from 'react-hot-toast'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

// removed static invoiceData; page now binds to API data

export default function InvoicePage() {
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState('current')
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null)
  const [filterMonth, setFilterMonth] = useState<string>('')
  const [filterRoom, setFilterRoom] = useState<string>('')
  const { khachHang, loading: khachHangLoading, error: khachHangError } = useCurrentKhachHang()
  const { hoaDon, loading: hoaDonLoading, error: hoaDonError } = useHoaDon()

  useEffect(() => {
    const token = localStorage.getItem('userToken')
    if (!token) {
      router.replace('/login')
    }
  }, [router])

  const toNum = (v: any) => {
    if (typeof v === 'number' && Number.isFinite(v)) return v
    if (typeof v === 'string') {
      const s = v.trim()
      const decimalMatch = s.match(/([,\.])(\d{1,2})$/)
      if (decimalMatch) {
        const sep = decimalMatch[1]
        const normalized = sep === ',' ? s.replace(/\./g, '').replace(',', '.') : s.replace(/,/g, '')
        const n = Number(normalized)
        return Number.isFinite(n) ? Math.round(n) : 0
      }
      const n2 = Number(s.replace(/[.,]/g, ''))
      return Number.isFinite(n2) ? n2 : 0
    }
    const n = Number(v)
    return Number.isFinite(n) ? n : 0
  }
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
                <div className="flex flex-wrap gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <input
                      placeholder="Lọc theo tháng (MM/YYYY)"
                      value={filterMonth}
                      onChange={(e)=>setFilterMonth(e.target.value)}
                      className="px-3 py-2 border rounded-md text-sm"
                    />
                  </div>
                  <input
                    placeholder="Lọc theo phòng (ví dụ 118)"
                    value={filterRoom}
                    onChange={(e)=>setFilterRoom(e.target.value)}
                    className="px-3 py-2 border rounded-md text-sm"
                  />
                </div>
                {hoaDon
                  .filter(i => filterMonth ? String(i.ThangNam).includes(filterMonth) : true)
                  .filter(i => filterRoom ? String(i.SoPhong||'').includes(filterRoom) : true)
                  .map((invoice) => {
                  const isPaid = (
                    invoice.TrangThaiThanhToan === 'Y' ||
                    invoice.TrangThaiThanhToan === '1' ||
                    (invoice as any).TrangThaiThanhToan === 1 ||
                    (invoice as any).TrangThaiThanhToan === true ||
                    (invoice as any).TrangThaiThanhToan === 'true' ||
                    (invoice as any).TrangThaiThanhToan === 'Đã thanh toán' ||
                    (invoice as any).TrangThaiThanhToan === 'paid' ||
                    (invoice as any).TrangThaiThanhToan === 'PAID' ||
                    // additional rule: paid amount >= total
                    (toNum((invoice as any).TienTra ?? (invoice as any).Tientra) >= toNum((invoice as any).TongTien))
                  )
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
                             {formatCurrency(toNum(invoice.TongTien))}
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
                             <p className="font-medium">{formatCurrency(toNum(dien))}</p>
                           </div>
                           <div>
                             <p className="text-sm text-gray-600">Tiền nước:</p>
                             <p className="font-medium">{formatCurrency(toNum(nuoc))}</p>
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
  const { records: payRecords } = useLichSuThanhToan()
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

  const handlePrint = () => {
    if (!chiTietHoaDon) return
    const w = window.open('', '_blank')
    if (!w) return
    const style = `
      <style>
        body { font-family: Arial, sans-serif; color: #111; }
        .container { width: 800px; margin: 0 auto; }
        h1 { text-align: center; margin-bottom: 8px; }
        .muted { color: #555; font-size: 12px; text-align: center; margin-bottom: 16px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; margin-bottom: 16px; }
        .label { color: #555; font-size: 13px; }
        .value { font-weight: 600; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        th, td { border: 1px solid #ddd; padding: 8px; font-size: 13px; }
        th { background: #f5f5f5; text-align: left; }
        .right { text-align: right; }
        .total { font-weight: 700; font-size: 16px; }
        .footer { margin-top: 24px; display: flex; justify-content: space-between; font-size: 12px; }
      </style>
    `

    const rows = [
      { label: 'Tiền phòng', amount: chiTietHoaDon.tienPhong },
      { label: 'Tiền điện', amount: chiTietHoaDon.tienDien },
      { label: 'Tiền nước', amount: chiTietHoaDon.tienNuoc },
      ...chiTietHoaDon.dsDichVu.map((dv: { ten: string; gia: number }) => ({ label: dv.ten, amount: dv.gia })),
      { label: 'Phí sửa chữa', amount: chiTietHoaDon.suaChua },
      { label: 'Phí trừ', amount: -chiTietHoaDon.phiTru },
    ]
    const rowsHtml = rows
      .map(r => `<tr><td>${r.label}</td><td class="right">${formatCurrency(Math.abs(r.amount))}</td></tr>`) 
      .join('')

    const html = `
      <html>
        <head>
          <meta charSet="utf-8" />
          <title>Hóa đơn ${chiTietHoaDon.thangNam}</title>
          ${style}
        </head>
        <body onload="window.print(); window.close();">
          <div class="container">
            <h1>HÓA ĐƠN TIỀN TRỌ</h1>
            <div class="muted">Tháng/Năm: ${chiTietHoaDon.thangNam}</div>
            <div class="grid">
              <div>
                <div class="label">Khách hàng</div>
                <div class="value">${chiTietHoaDon.tenKhachHang}</div>
              </div>
              <div>
                <div class="label">Số điện thoại</div>
                <div class="value">${chiTietHoaDon.soDienThoai}</div>
              </div>
              <div>
                <div class="label">Phòng</div>
                <div class="value">${chiTietHoaDon.phong}</div>
              </div>
            </div>
            <table>
              <thead>
                <tr><th>Khoản phí</th><th class="right">Số tiền</th></tr>
              </thead>
              <tbody>
                ${rowsHtml}
                <tr>
                  <td class="total">Tổng cộng</td>
                  <td class="right total">${formatCurrency(totalAmount)}</td>
                </tr>
                <tr>
                  <td>Tiền đã trả</td>
                  <td class="right">${formatCurrency(paidAmount)}</td>
                </tr>
                <tr>
                  <td>Tiền nợ</td>
                  <td class="right">${formatCurrency(debtAmount)}</td>
                </tr>
              </tbody>
            </table>
            <div class="footer">
              <div>Khách hàng ký</div>
              <div>Ngày in: ${new Date().toLocaleString('vi-VN')}</div>
            </div>
          </div>
        </body>
      </html>
    `
    w.document.open()
    w.document.write(html)
    w.document.close()
  }

  const handleExportPdf = async () => {
    if (!chiTietHoaDon) return
    // Dynamic import without types to avoid type dependency
    const anyJsPdf: any = await import('jspdf')
    const doc = new anyJsPdf.jsPDF()
    // Try to embed a Vietnamese-capable font to avoid diacritics issues
    const fontName = 'RobotoVN'
    let hasVNFont = false
    try {
      const fontUrl = 'https://cdn.jsdelivr.net/npm/@fontsource/roboto/files/roboto-vietnamese-400-normal.ttf'
      const res = await fetch(fontUrl)
      const buf = await res.arrayBuffer()
      const base64 = btoa(String.fromCharCode(...new Uint8Array(buf)))
      doc.addFileToVFS(`${fontName}.ttf`, base64)
      doc.addFont(`${fontName}.ttf`, fontName, 'normal')
      doc.setFont(fontName, 'normal')
      hasVNFont = true
    } catch {
      // fallback: use a built-in font to avoid undefined widths
      doc.setFont('helvetica', 'normal')
    }
    // Verify current font has width metrics; if not, fallback to helvetica
    try {
      // getTextWidth will access font widths; if not available, it throws
      const w = doc.getTextWidth('A')
      if (!Number.isFinite(w)) throw new Error('invalid width')
    } catch {
      doc.setFont('helvetica', 'normal')
      hasVNFont = false
    }
    const line = (y: number) => doc.line(10, y, 200, y)
    let y = 14
    // If font VN không khả dụng, loại bỏ dấu để tránh lỗi hiển thị
    const removeDiacritics = (s: string) =>
      s
        .normalize('NFD')
        .replace(/\p{Diacritic}+/gu, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
    const txt = (s: string) => hasVNFont ? s : removeDiacritics(s)

    doc.setFontSize(16)
    doc.text(txt('HÓA ĐƠN TIỀN TRỌ'), 105, y, { align: 'center' })
    y += 8
    doc.setFontSize(10)
    doc.text(txt(`Tháng/Năm: ${chiTietHoaDon.thangNam}`), 10, y)
    y += 6
    doc.text(txt(`Khách hàng: ${chiTietHoaDon.tenKhachHang}`), 10, y)
    y += 6
    doc.text(txt(`Số điện thoại: ${chiTietHoaDon.soDienThoai}`), 10, y)
    y += 6
    doc.text(txt(`Phòng: ${chiTietHoaDon.phong}`), 10, y)
    y += 6
    line(y); y += 6
    const rows = [
      [txt('Tiền phòng'), chiTietHoaDon.tienPhong],
      [txt('Tiền điện'), chiTietHoaDon.tienDien],
      [txt('Tiền nước'), chiTietHoaDon.tienNuoc],
      ...chiTietHoaDon.dsDichVu.map((d:any)=>[txt(d.ten), d.gia]),
      [txt('Phí sửa chữa'), chiTietHoaDon.suaChua],
      [txt('Phí trừ'), -chiTietHoaDon.phiTru],
    ]
    doc.setFontSize(11)
    rows.forEach(([label, amount]) => {
      doc.text(String(label), 10, y)
      doc.text(formatCurrency(Math.abs(Number(amount))), 200, y, { align: 'right' })
      y += 6
    })
    line(y); y += 6
    // Emulate bold by increasing size slightly to avoid missing bold style for custom font
    const prevSize = doc.getFontSize()
    doc.setFont(hasVNFont ? fontName : 'helvetica', 'normal')
    doc.setFontSize(prevSize + 1)
    doc.text(txt('Tổng cộng'), 10, y)
    doc.text(formatCurrency(totalAmount), 200, y, { align: 'right' }); y += 6
    doc.setFontSize(prevSize)
    doc.text(txt('Tiền đã trả'), 10, y)
    doc.text(formatCurrency(paidAmount), 200, y, { align: 'right' }); y += 6
    doc.text(txt('Tiền nợ'), 10, y)
    doc.text(formatCurrency(Math.max(0, totalAmount - paidAmount)), 200, y, { align: 'right' }); y += 10
    doc.setFontSize(9)
    doc.text(txt(`Ngày xuất: ${new Date().toLocaleString('vi-VN')}`), 10, y)
    doc.save(`hoa-don-${chiTietHoaDon.thangNam}-${chiTietHoaDon.phong}.pdf`)
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

  // Determine paid state using latest payment history fallback
  const recordById = (payRecords || []).find((r:any) => String(r.ChiSoID) === String(chiSoID))
  let record: any = recordById
  if (!record && chiTietHoaDon) {
    const roomStr = String((chiTietHoaDon as any).phong || '')
    const parts = roomStr.split('-').map((s: string) => s.trim())
    const day = parts[0]
    const room = parts[1]?.replace(/^0+/, '')
    record = (payRecords || []).find((r: any) => {
      const rRoom = String(r.SoPhong || '').replace(/^0+/, '')
      return String(r.ThangNam) === String((chiTietHoaDon as any).thangNam) && rRoom === room
    })
  }

  const detailPaid = toVnd((chiTietHoaDon as any)?.tienTra ?? (chiTietHoaDon as any)?.TienTra) ?? 0
  const detailTotal = toVnd((chiTietHoaDon as any)?.tongCong ?? (chiTietHoaDon as any)?.TongCong ?? (chiTietHoaDon as any)?.TongTien) ?? 0
  const recordPaid = toVnd((record as any)?.TienTra ?? (record as any)?.Tientra) ?? 0
  const recordTotal = toVnd((record as any)?.TongTien) ?? 0

  const paidAmount = Math.max(detailPaid, recordPaid)
  const totalAmount = detailTotal || recordTotal
  const alreadyPaid = (totalAmount > 0 && paidAmount >= totalAmount) || (record ? isPaidRecord(record as any) : false)
  const debtAmount = Math.max(0, totalAmount - paidAmount)
  const displayStatus = alreadyPaid ? 'Đã thanh toán' : 'Chưa thanh toán'

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
              {formatCurrency(totalAmount)}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
                <p className="text-gray-600">Tiền nợ: <span className="font-semibold text-gray-900">{formatCurrency(debtAmount)}</span></p>
                <p className="text-gray-600">Tiền trả: <span className="font-semibold text-gray-900">{formatCurrency(paidAmount)}</span></p>
            </div>
            <div>
              <p className="text-gray-600">Trạng thái: 
                <span className={`font-semibold ml-1 ${
                  alreadyPaid ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {displayStatus}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button 
          onClick={() => setPaymentOpen(true)}
          disabled={paying || alreadyPaid}
          className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-70"
        >
          {paying ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Đang chuyển tới MoMo...
            </>
          ) : alreadyPaid ? (
            'Đã thanh toán đủ'
          ) : (
            <>
              <CreditCard className="h-5 w-5 mr-2" />
              Thanh Toán Ngay
            </>
          )}
        </Button>
        
          {/* <Button 
            variant="outline"
            onClick={() => alert('Chức năng tải ảnh hóa đơn đang được phát triển')}
            className="h-12 border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <Download className="h-5 w-5 mr-2" />
            Tải Ảnh Hóa Đơn
          </Button> */}

        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline"
            onClick={handlePrint}
            className="h-12 border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <Printer className="h-5 w-5 mr-2" />
            In hóa đơn
          </Button>
          <Button 
            variant="outline"
            onClick={handleExportPdf}
            className="h-12 border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <FileDown className="h-5 w-5 mr-2" />
            Xuất PDF
          </Button>
        </div>
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