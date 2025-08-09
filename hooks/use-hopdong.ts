import { useState, useEffect } from 'react'

interface HopDongInfo {
  HopDongID: number
  DayPhong?: string
  NgayBatDau: string
  NgayKetThuc: string
  ChuKy?: string
  TienDatCoc?: number | string
  NgayTaoHopDong?: string
  KhachHangID_id: number
  PhongID_id: number
  GhiChuHopDong?: string
  SoLuongThanhVien?: number
  ThoiHanHopDong?: string
  QuanLiID_id?: number
  // fields from JOIN myapp_quanli
  QuanLiID?: number
  SoDienThoaiDN?: string
  MatKhauDN?: string
  HoTenQuanLi?: string
  failed_attempts?: number
  lockout_time?: string | null
  DiaChiChiTiet?: string
  GioiTinh?: string
  NgaySinh?: string
  Phuong?: string
  Quan?: string
  SoCCCD?: string
  ThanhPho?: string
}

interface HopDongResponse {
  hopdong: HopDongInfo[]
  message?: string
}

export function useHopDong() {
  const [hopDong, setHopDong] = useState<HopDongInfo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchHopDong = async () => {
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
        try {
          body = await res.json()
        } catch {
          body = null
        }
        return { res, body }
      }

      // thử endpoint mới trước, nếu 404 fallback về endpoint cũ
      const primary = `https://all-oqry.onrender.com/api/k_hopdong/lay-hopdong-cua-khach-hang`
      const fallback = `https://all-oqry.onrender.com/api/k_hopdong/lay-hopdong`

      let { res, body } = await tryFetch(primary)
      if (res.status === 404) {
        ;({ res, body } = await tryFetch(fallback))
      }

      if (res.ok) {
        const data = (body || {}) as HopDongResponse | any
        // Chấp nhận nhiều dạng response: trực tiếp là mảng, hoặc có thuộc tính hopdong/hopDong/contracts/data
        const rawList: any[] = Array.isArray(data)
          ? data
          : (data.hopdong || data.hopDong || data.contracts || data.data?.hopdong || [])

        const normalize = (raw: any): HopDongInfo => {
          const tienDatCoc = raw.TienDatCoc ?? raw.TienCoc ?? raw.DatCoc
          
          const chuKy = raw.ChuKy ?? raw.ThoiHanHopDong ?? raw.ChuKyThu
          const ghiChu = raw.GhiChuHopDong ?? raw.GhiChu
          const ngayTao = raw.NgayTaoHopDong ?? raw.NgayKy ?? raw.createdAt

          return {
            HopDongID: raw.HopDongID ?? raw.hopDongId ?? raw.id,
            DayPhong: raw.DayPhong,
            NgayBatDau: raw.NgayBatDau,
            NgayKetThuc: raw.NgayKetThuc,
            ChuKy: chuKy,
            TienDatCoc: typeof tienDatCoc === 'string' && tienDatCoc !== '' ? Number(tienDatCoc) : tienDatCoc,
            
            NgayTaoHopDong: ngayTao,
            KhachHangID_id: raw.KhachHangID_id ?? raw.KhachHangID,
            PhongID_id: raw.PhongID_id ?? raw.PhongID,
            GhiChuHopDong: ghiChu,
            SoLuongThanhVien: raw.SoLuongThanhVien,
            ThoiHanHopDong: raw.ThoiHanHopDong ?? raw.ThoiHan,
            QuanLiID_id: raw.QuanLiID_id ?? raw.QuanLiID,
            QuanLiID: raw.QuanLiID,
            SoDienThoaiDN: raw.SoDienThoaiDN,
            MatKhauDN: raw.MatKhauDN,
            HoTenQuanLi: raw.HoTenQuanLi,
            failed_attempts: raw.failed_attempts,
            lockout_time: raw.lockout_time,
            DiaChiChiTiet: raw.DiaChiChiTiet,
            GioiTinh: raw.GioiTinh,
            NgaySinh: raw.NgaySinh,
            Phuong: raw.Phuong,
            Quan: raw.Quan,
            SoCCCD: raw.SoCCCD,
            ThanhPho: raw.ThanhPho,
          }
        }

        const normalizedList = rawList.map(normalize)
        setHopDong(normalizedList)
      } else {
        const msg = (body && (body.message as string)) || `Không thể lấy thông tin hợp đồng (HTTP ${res.status})`
        setError(msg)
      }
    } catch (err) {
      console.error('Lỗi khi lấy thông tin hợp đồng:', err)
      setError('Không thể kết nối đến máy chủ')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHopDong()
  }, [])

  return {
    hopDong,
    loading,
    error,
    refreshHopDong: fetchHopDong
  }
} 