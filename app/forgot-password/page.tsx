"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, ShieldAlert, Send } from 'lucide-react'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Theo API backend: chỉ cần KhachHangID, PhongID (optional), NoiDung
  const [form, setForm] = useState({
    KhachHangID: '',
    PhongID: '',
    NoiDung: ''
  })

  useEffect(() => {
    const kh = typeof window !== 'undefined' ? localStorage.getItem('userInfo') : null
    if (kh) {
      try {
        const obj = JSON.parse(kh || '{}')
        setForm(f => ({
          ...f,
          KhachHangID: String(obj?.KhachHangID || obj?.id || '')
        }))
      } catch {}
    }
  }, [])

  const update = (k: keyof typeof form) => (e: any) => setForm({ ...form, [k]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!form.KhachHangID) {
      setError('Vui lòng nhập KhachHangID (bắt buộc)')
      return
    }
    if (!form.NoiDung || form.NoiDung.trim() === '') {
      setForm({ ...form, NoiDung: 'Tôi quên mật khẩu, vui lòng hỗ trợ' })
    }

    setLoading(true)
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null
      const res = await fetch('https://all-oqry.onrender.com/api/k_khachhang/quen-mat-khau', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          KhachHangID: Number(form.KhachHangID),
          PhongID: form.PhongID ? Number(form.PhongID) : undefined,
          NoiDung: form.NoiDung && form.NoiDung.trim() !== '' ? form.NoiDung.trim() : 'Tôi quên mật khẩu, vui lòng hỗ trợ'
        }),
      })

      const data: any = await res.json().catch(() => null)
      if (!res.ok) {
        const msg = data?.message || `Gửi yêu cầu thất bại (HTTP ${res.status})`
        throw new Error(msg)
      }

      setSuccess('Đã gửi yêu cầu quên mật khẩu tới quản lý. Vui lòng chờ xác nhận!')
      setTimeout(() => router.replace('/login'), 1800)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể gửi yêu cầu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <ShieldAlert className="h-5 w-5 text-blue-600" /> Yêu cầu đặt lại mật khẩu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="KhachHangID">Khách hàng ID (bắt buộc)</Label>
                <Input id="KhachHangID" value={form.KhachHangID} onChange={update('KhachHangID')} placeholder="VD: 41" />
              </div>
              <div>
                <Label htmlFor="PhongID">Phòng ID (nếu có)</Label>
                <Input id="PhongID" value={form.PhongID} onChange={update('PhongID')} placeholder="VD: 82" />
              </div>
            </div>

            <div>
              <Label htmlFor="NoiDung">Nội dung</Label>
              <Textarea id="NoiDung" value={form.NoiDung} onChange={update('NoiDung')} placeholder="Tôi quên mật khẩu, vui lòng hỗ trợ" className="min-h-28" />
            </div>

            {error && (
              <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>
            )}
            {success && (
              <Alert className="bg-emerald-50 text-emerald-700 border-emerald-200"><AlertDescription>{success}</AlertDescription></Alert>
            )}

            <div className="flex items-center justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => router.back()}>Hủy</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {loading ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin"/>Đang gửi...</>) : (<><Send className="h-4 w-4 mr-2"/>Gửi yêu cầu</>)}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

