"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Receipt, ArrowLeft, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { useLichSuThanhToan, isPaidRecord } from '@/hooks/use-lichsu-thanh-toan'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function PaymentHistoryPage() {
  const router = useRouter()
  const { records, summary, loading, error, refresh } = useLichSuThanhToan()
  const [actionColor, setActionColor] = useState<string>('blue')

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('payActionColor') : null
    if (saved) setActionColor(saved)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('payActionColor', actionColor)
  }, [actionColor])

  const solidClassesByColor: Record<string, string> = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    violet: 'bg-violet-600 hover:bg-violet-700',
    amber: 'bg-amber-600 hover:bg-amber-700',
    rose: 'bg-rose-600 hover:bg-rose-700',
    cyan: 'bg-cyan-600 hover:bg-cyan-700',
  }
  const outlineClassesByColor: Record<string, string> = {
    blue: 'border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20',
    green: 'border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20',
    violet: 'border-violet-600 text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950/20',
    amber: 'border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20',
    rose: 'border-rose-600 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20',
    cyan: 'border-cyan-600 text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-950/20',
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center text-gray-600">Đang tải lịch sử thanh toán...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-600" />
          <p className="text-red-600 mb-3">{error}</p>
          <Button onClick={refresh}>Thử lại</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Lịch Sử Thanh Toán</h1>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">Số lần thanh toán đủ</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{summary.soLanThanhToan}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">Tổng số tiền đã thanh toán</p>
              <p className="text-2xl font-bold text-emerald-600 break-words">{summary.tongDaThanhToan.toLocaleString('vi-VN')} VND</p>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 italic">{
                numberToVietnameseWords(summary.tongDaThanhToan)
              } đồng</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">Tổng số tiền nợ</p>
              <p className="text-2xl font-bold text-red-600 break-words">{summary.tongNo.toLocaleString('vi-VN')} VND</p>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 italic">{
                numberToVietnameseWords(summary.tongNo)
              } đồng</p>
            </CardContent>
          </Card>
          {/* Color picker */}
          <div className="md:col-span-3">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700 dark:text-gray-300">Màu nút hành động:</span>
              <Select value={actionColor} onValueChange={setActionColor}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Chọn màu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blue">Xanh dương</SelectItem>
                  <SelectItem value="green">Xanh lá</SelectItem>
                  <SelectItem value="violet">Tím</SelectItem>
                  <SelectItem value="amber">Hổ phách</SelectItem>
                  <SelectItem value="rose">Hồng</SelectItem>
                  <SelectItem value="cyan">Xanh ngọc</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Records list */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center"><Receipt className="h-5 w-5 mr-2"/>Danh sách giao dịch</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {records.length === 0 ? (
              <div className="p-6 text-center text-gray-600 dark:text-gray-300">Chưa có lịch sử thanh toán</div>
            ) : (
               <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {records.map((r, idx) => {
                  const paid = Number(r.TienTra ?? r.Tientra ?? 0)
                  const total = Number(r.TongTien ?? 0)
                  // Amount-based truth first. If total is known, trust amounts; else fallback to status helper
                  const isPaidAmount = total > 0 && paid >= total
                  const isPaid = total > 0 ? isPaidAmount : isPaidRecord(r as any)
                  const isPartial = !isPaid && paid > 0 && total > paid
                  const tong = Number(r.TongTien ?? 0).toLocaleString('vi-VN')
                  const thang = r.ThangNam
                  const dien = Number(r.TienDien ?? r.SoDienDaTieuThu ?? 0).toLocaleString('vi-VN')
                  const nuoc = Number(r.TienNuoc ?? r.SoNuocDaTieuThu ?? 0).toLocaleString('vi-VN')
                  const itemKey = `${r.ThangNam || 'NA'}-${r.SoPhong || r.DayPhong || 'X'}-${r.ChiSoID ?? idx}`
                  return (
                    <div key={itemKey} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isPaid ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'}`}>
                          {isPaid ? <CheckCircle2 className="h-5 w-5"/> : <Clock className="h-5 w-5"/>}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">Tháng {thang}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Điện: {dien} • Nước: {nuoc}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{tong} VND</p>
                        <p className={`text-sm ${isPaid ? 'text-emerald-600' : isPartial ? 'text-amber-600' : 'text-yellow-600'}`}>{isPaid ? 'Đã thanh toán' : isPartial ? 'Thanh toán còn nợ' : 'Chưa thanh toán'}</p>
                        {isPaid ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className={`mt-2 border ${outlineClassesByColor[actionColor]}`}
                            onClick={() => router.push(`/invoice?thang=${encodeURIComponent(thang)}&phong=${encodeURIComponent(r.SoPhong || '')}`)}
                          >
                            Xem chi tiết hóa đơn
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className={`mt-2 ${solidClassesByColor[actionColor]}`}
                            onClick={() => router.push(`/invoice?thang=${encodeURIComponent(thang)}&phong=${encodeURIComponent(r.SoPhong || '')}`)}
                          >
                            {isPartial ? 'Tiếp tục thanh toán' : 'Bấm để thanh toán'}
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
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

