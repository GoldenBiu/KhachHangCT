import { useEffect, useState } from 'react'

export interface LichSuThanhToanRecord {
  ChiSoID: number
  DayPhong?: string
  ThangNam: string
  SoPhong?: string
  ChiSoDienCu?: number
  ChiSoNuocCu?: number
  ChiSoDienMoi?: number
  ChiSoNuocMoi?: number
  GiaDienCu?: number
  GiaDienMoi?: number
  GiaNuocCu?: number
  GiaNuocMoi?: number
  TienPhong?: number
  TongDichVu?: number
  DichVu?: number
  TongTien?: number
  TrangThaiThanhToan?: string
  Tientra?: number
  TienTra?: number
  TienNo?: number
  SoDienDaTieuThu?: number
  SoNuocDaTieuThu?: number
  TienDien?: number
  TienNuoc?: number
  PhiSuaChua?: number
  PhiTru?: number
  TenPhiSuaChua?: string | null
  TenPhiTru?: string | null
  PhongID_id?: number
}

interface LichSuResponseShape {
  chi_so_list?: LichSuThanhToanRecord[]
  so_lan_thanh_toan?: number
  tong_no?: number
  tong_da_thanh_toan?: number
  unique_months?: string[]
  hop_dong?: any
  khach_hang?: any
}

export function useLichSuThanhToan() {
  const [records, setRecords] = useState<LichSuThanhToanRecord[]>([])
  const [summary, setSummary] = useState<{
    soLanThanhToan: number
    tongNo: number
    tongDaThanhToan: number
    tongTongTien?: number
  }>({ soLanThanhToan: 0, tongNo: 0, tongDaThanhToan: 0, tongTongTien: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null
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
            Authorization: `Bearer ${token}`,
          },
        })
        let body: any = null
        try {
          body = await res.json()
        } catch {
          body = null
        }
        return { res, body }
      }

      // Thử các endpoint tiềm năng (mới -> cũ)
      const candidates = [
        'https://all-oqry.onrender.com/api/k_lichsuthanhtoan/lich-su-khach-hang',
        'https://all-oqry.onrender.com/api/k_lichsuthanhtoan/lich-su-thanh-toan',
        'https://all-oqry.onrender.com/api/lich-su-thanh-toan',
        'https://all-oqry.onrender.com/api/thanhtoan/lich-su',
        'https://all-oqry.onrender.com/api/k_lichsuthanhtoan',
      ]

      let fetched: any[] | null = null
      let lastErrMsg = 'Không thể lấy lịch sử thanh toán'
      let shape: LichSuResponseShape | any = null
      for (const url of candidates) {
        const { res, body } = await tryFetch(url)
        if (res.ok) {
          shape = body || {}
          fetched = Array.isArray(shape) ? shape : (shape.chi_so_list || shape.data || [])
          break
        }
        lastErrMsg = (body && (body.message as string)) || `HTTP ${res.status}`
        if (res.status !== 404) break
      }

      if (!fetched) {
        throw new Error(lastErrMsg)
      }

      // Chuẩn hóa nhiều dạng trả về: có thể là danh sách trực tiếp hoặc object chứa chi_so_list
      const list: any[] = fetched

      const normalized: LichSuThanhToanRecord[] = list.map((r: any) => ({
        ChiSoID: Number(r.ChiSoID ?? r.id ?? 0),
        DayPhong: r.DayPhong,
        ThangNam: r.ThangNam,
        SoPhong: r.SoPhong,
        ChiSoDienCu: toVnd(r.ChiSoDienCu),
        ChiSoNuocCu: toVnd(r.ChiSoNuocCu),
        ChiSoDienMoi: toVnd(r.ChiSoDienMoi),
        ChiSoNuocMoi: toVnd(r.ChiSoNuocMoi),
        GiaDienCu: toVnd(r.GiaDienCu),
        GiaDienMoi: toVnd(r.GiaDienMoi),
        GiaNuocCu: toVnd(r.GiaNuocCu),
        GiaNuocMoi: toVnd(r.GiaNuocMoi),
        TienPhong: toVnd(r.TienPhong),
        TongDichVu: toVnd(r.TongDichVu ?? r.DichVu),
        DichVu: toVnd(r.DichVu),
        TongTien: toVnd(r.TongTien),
        TrangThaiThanhToan: r.TrangThaiThanhToan,
        Tientra: toVnd(r.Tientra ?? r.TienTra),
        TienTra: toVnd(r.TienTra),
        TienNo: toVnd(r.TienNo),
        SoDienDaTieuThu: toVnd(r.SoDienDaTieuThu ?? r.TienDien),
        SoNuocDaTieuThu: toVnd(r.SoNuocDaTieuThu ?? r.TienNuoc),
        TienDien: toVnd(r.TienDien),
        TienNuoc: toVnd(r.TienNuoc),
        PhiSuaChua: toVnd(r.PhiSuaChua),
        PhiTru: toVnd(r.PhiTru),
        TenPhiSuaChua: r.TenPhiSuaChua ?? null,
        TenPhiTru: r.TenPhiTru ?? null,
        PhongID_id: toVnd(r.PhongID_id),
      }))

      setRecords(normalized)

      const soLan = toVnd(shape?.so_lan_thanh_toan) ?? normalized.filter(r => isPaidStatus(r.TrangThaiThanhToan)).length

      // Gọi thêm các API tổng hợp nếu có (tong-no, tong-da-thanh-toan)
      let tongNoFromApi: number | undefined
      let tongDaTTFromApi: number | undefined
      try {
        const [noRes, daTTRes] = await Promise.all([
          tryFetch('https://all-oqry.onrender.com/api/k_lichsuthanhtoan/tong-no'),
          tryFetch('https://all-oqry.onrender.com/api/k_lichsuthanhtoan/tong-da-thanh-toan'),
        ])
        if (noRes.res.ok) {
          const v = (noRes.body?.tongNo ?? noRes.body?.tong_no)
          const n = toVnd(v)
          if (typeof n === 'number') tongNoFromApi = n
        }
        if (daTTRes.res.ok) {
          const v = (daTTRes.body?.tongDaThanhToan ?? daTTRes.body?.tong_da_thanh_toan)
          const n = toVnd(v)
          if (typeof n === 'number') tongDaTTFromApi = n
        }
      } catch {
        // ignore summary API failures; fallback below
      }

      // Fallback tính toán từ danh sách nếu API tổng hợp không có
      const tongNo = (typeof tongNoFromApi === 'number'
        ? tongNoFromApi
        : (toVnd(shape?.tong_no) ?? normalized.reduce((sum, r) => sum + (r.TienNo ?? 0), 0)))
      const tongDaTT = (typeof tongDaTTFromApi === 'number'
        ? tongDaTTFromApi
        : (toVnd(shape?.tong_da_thanh_toan) ?? normalized.reduce((s, r) => s + (r.Tientra ?? r.TienTra ?? 0), 0)))
      const tongTongTien = normalized.reduce((s, r) => s + (r.TongTien ?? 0), 0)
      setSummary({ soLanThanhToan: soLan, tongNo, tongDaThanhToan: tongDaTT, tongTongTien })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Không thể tải lịch sử thanh toán'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { records, summary, loading, error, refresh: fetchData }
}

function toNum(v: any): number | undefined {
  if (v === null || v === undefined || v === '') return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}

// Some APIs may return numbers formatted as strings with dots/commas
export function toVnd(v: any): number | undefined {
  if (v === null || v === undefined || v === '') return undefined
  if (typeof v === 'number' && Number.isFinite(v)) return Math.round(v)
  if (typeof v === 'string') {
    const raw = v.trim()
    // Keep only digits, separators and minus if any
    const s = raw.replace(/[^\d,\.\-]/g, '')
    if (s === '') return undefined

    // If string ends with a decimal part like ",xx" or ".xx", treat that as decimals
    const decimalMatch = s.match(/([,\.])(\d{1,2})$/)
    if (decimalMatch) {
      const sep = decimalMatch[1]
      let normalized = s
      if (sep === ',') {
        // Common VND formats: 1.900.000,00 → 1900000
        normalized = normalized.replace(/\./g, '').replace(',', '.')
      } else {
        // Formats: 1,900,000.00 → 1900000
        normalized = normalized.replace(/,/g, '')
      }
      const n = Number(normalized)
      if (Number.isFinite(n)) return Math.round(n)
    }

    // Otherwise, treat all separators as thousands separators
    const n2 = Number(s.replace(/[.,]/g, ''))
    return Number.isFinite(n2) ? n2 : undefined
  }
  return undefined
}

export function isPaidStatus(v: any): boolean {
  return (
    v === 'Y' ||
    v === '1' ||
    v === 1 ||
    v === true ||
    v === 'true' ||
    v === 'Đã thanh toán' ||
    v === 'paid' ||
    v === 'PAID' ||
    v === '0' || // một số hệ thống dùng 0 = đã thanh toán
    v === 0
  )
}

export function isPaidRecord(r: LichSuThanhToanRecord): boolean {
  if (!r) return false
  const byStatus = isPaidStatus(r.TrangThaiThanhToan)
  const paid = toVnd(r.TienTra ?? r.Tientra) ?? 0
  const total = toVnd(r.TongTien) ?? 0
  const byAmount = total > 0 && paid >= total
  return byStatus || byAmount
}

