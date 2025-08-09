import { useState, useEffect } from 'react'

interface HoaDonInfo {
  ChiSoID: string
  ThangNam: string
  SoDienDaTieuThu: number
  SoNuocDaTieuThu: number
  GiaDienMoi: number
  GiaNuocMoi: number
  TienPhong: number
  PhiSuaChua: number
  PhiTru: number
  TongTien: number
  TrangThaiThanhToan: string
  TienTra: number
  TienNo: number
  DayPhong: string
  SoPhong: string
}

interface ChiTietHoaDonInfo {
  chiSoID: string
  phong: string
  thangNam: string
  ngayVao: string
  tenKhachHang: string
  soDienThoai: string
  tienPhong: number
  tienDien: number
  tienNuoc: number
  suaChua: number
  phiTru: number
  tienNo: number
  tienTra: number
  dsDichVu: Array<{ ten: string; gia: number }>
  tongCong: number
  trangThai: string
}

export function useHoaDon() {
  const [hoaDon, setHoaDon] = useState<HoaDonInfo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchHoaDon = async () => {
    const token = localStorage.getItem('userToken')
    if (!token) {
      setError('Không tìm thấy token xác thực')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const tryFetch = async (url: string) => {
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        let body: any = null
        try { body = await res.json() } catch { body = null }
        return { res, body }
      }

      const candidates = [
        'https://all-oqry.onrender.com/api/k_hoadon/khoadon',
        'https://all-oqry.onrender.com/api/k_hoadon/hoa-don-cua-khach-hang',
        'https://all-oqry.onrender.com/api/k_hoadon/hoa-don'
      ]

      let lastErrMsg = 'Không thể lấy thông tin hóa đơn'
      for (const url of candidates) {
        const { res, body } = await tryFetch(url)
        if (res.ok) {
          const data = (Array.isArray(body) ? body : (body?.data ?? body)) as HoaDonInfo[]
          setHoaDon(data || [])
          return
        }
        lastErrMsg = (body && (body.message as string)) || `HTTP ${res.status}`
        if (res.status !== 404) break
      }
      setError(lastErrMsg)
    } catch (err) {
      console.error('Lỗi khi lấy thông tin hóa đơn:', err)
      setError('Không thể kết nối đến máy chủ')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHoaDon()
  }, [])

  return {
    hoaDon,
    loading,
    error,
    refreshHoaDon: fetchHoaDon
  }
}

export function useChiTietHoaDon(chiSoID?: string) {
  const [chiTietHoaDon, setChiTietHoaDon] = useState<ChiTietHoaDonInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchChiTietHoaDon = async (id: string) => {
    if (!id) return

    const token = localStorage.getItem('userToken')
    if (!token) {
      setError('Không tìm thấy token xác thực')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const tryFetch = async (url: string) => {
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        let body: any = null
        try { body = await res.json() } catch { body = null }
        return { res, body }
      }

      const candidates = [
        `https://all-oqry.onrender.com/api/k_hoadon/khoadon/${id}`,
        `https://all-oqry.onrender.com/api/k_hoadon/chi-tiet-hoa-don/${id}`,
        `https://all-oqry.onrender.com/api/k_hoadon/chi-tiet/${id}`
      ]

      let lastErrMsg = 'Không thể lấy chi tiết hóa đơn'
      for (const url of candidates) {
        const { res, body } = await tryFetch(url)
        if (res.ok) {
          setChiTietHoaDon((body as ChiTietHoaDonInfo) || null)
          return
        }
        lastErrMsg = (body && (body.message as string)) || `HTTP ${res.status}`
        if (res.status !== 404) break
      }
      setError(lastErrMsg)
    } catch (err) {
      console.error('Lỗi khi lấy chi tiết hóa đơn:', err)
      setError('Không thể kết nối đến máy chủ')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (chiSoID) {
      fetchChiTietHoaDon(chiSoID)
    }
  }, [chiSoID])

  return {
    chiTietHoaDon,
    loading,
    error,
    refreshChiTietHoaDon: () => chiSoID && fetchChiTietHoaDon(chiSoID)
  }
} 