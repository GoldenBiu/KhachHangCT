import { useState, useEffect } from 'react'

interface KhachHangInfo {
  KhachHangID: number
  HoTenKhachHang: string
  SoDienThoai: string
  NgaySinh: string
  GioiTinh: string
  CongViec: string
  TinhThanh: string
  QuanHuyen: string
  PhuongXa: string
  DiaChiCuThe: string
  SoCCCD: string
  NgayCapCCCD: string
  NoiCapCCCD: string
  CCCDMT: string
  CCCDMS: string
  HopDongsDangThue?: Array<{
    HopDongID: number
    NgayBatDau: string
    NgayKetThuc: string
    TrangThaiHopDong: string
    Phong: {
      PhongID: number
      SoPhong: string | number
      DayPhong: string
      GiaPhong: number
      TrangThaiPhong: string
      MoTaPhong?: string
      DienTich?: string | number
      TienIch?: string
    }
  }>
}

interface KhachHangResponse {
  message: string
  khachHang: KhachHangInfo
}

export function useKhachHang(KhachHangID?: string) {
  const [khachHang, setKhachHang] = useState<KhachHangInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchKhachHangInfo = async (id: string) => {
    if (!id) return

    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem('userToken')
      
      const response = await fetch(`https://all-oqry.onrender.com/api/k_khachhang/thong-tin`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      const data: KhachHangResponse = await response.json()

      if (response.ok) {
        setKhachHang(data.khachHang)
      } else {
        setError(data.message || 'Không thể lấy thông tin khách hàng')
      }
    } catch (err) {
      console.error('Lỗi khi lấy thông tin khách hàng:', err)
      setError('Không thể kết nối đến máy chủ')
    } finally {
      setLoading(false)
    }
  }

  const refreshKhachHang = () => {
    if (KhachHangID) {
      fetchKhachHangInfo(KhachHangID)
    }
  }

  useEffect(() => {
    if (KhachHangID) {
      fetchKhachHangInfo(KhachHangID)
    }
  }, [KhachHangID])

  return {
    khachHang,
    loading,
    error,
    refreshKhachHang
  }
}

// Hook để lấy thông tin khách hàng từ userInfo trong localStorage
export function useCurrentKhachHang() {
  const [khachHang, setKhachHang] = useState<KhachHangInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCurrentKhachHang = async () => {
    const token = localStorage.getItem('userToken')
    if (!token) {
      setError('Không tìm thấy token xác thực')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`https://all-oqry.onrender.com/api/k_khachhang/thong-tin`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      const data: KhachHangResponse = await response.json()

      if (response.ok) {
        setKhachHang(data.khachHang)
      } else {
        setError(data.message || 'Không thể lấy thông tin khách hàng')
      }
    } catch (err) {
      console.error('Lỗi khi lấy thông tin khách hàng:', err)
      setError('Không thể kết nối đến máy chủ')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCurrentKhachHang()
  }, [])

  return {
    khachHang,
    loading,
    error,
    refreshKhachHang: fetchCurrentKhachHang
  }
} 