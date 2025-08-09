import { useEffect, useState } from 'react'

export interface LichSuThanhToanRecord {
  ChiSoID: number
  DayPhong?: string
  ThangNam: string
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
  TongTien?: number
  TrangThaiThanhToan?: string
  Tientra?: number
  TienNo?: number
  SoDienDaTieuThu?: number
  SoNuocDaTieuThu?: number
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
      const res = await fetch('https://all-oqry.onrender.com/api/k_lichsuthanhtoan', {
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

      if (!res.ok) {
        const msg = body?.message || `Không thể lấy lịch sử thanh toán (HTTP ${res.status})`
        throw new Error(msg)
      }

      // Chuẩn hóa nhiều dạng trả về: có thể là danh sách trực tiếp hoặc object chứa chi_so_list
      const shape = (body || {}) as LichSuResponseShape | any
      const list: any[] = Array.isArray(shape) ? shape : (shape.chi_so_list || shape.data || [])

      const normalized: LichSuThanhToanRecord[] = list.map((r: any) => ({
        ChiSoID: Number(r.ChiSoID ?? r.id ?? 0),
        DayPhong: r.DayPhong,
        ThangNam: r.ThangNam,
        ChiSoDienCu: toVnd(r.ChiSoDienCu),
        ChiSoNuocCu: toVnd(r.ChiSoNuocCu),
        ChiSoDienMoi: toVnd(r.ChiSoDienMoi),
        ChiSoNuocMoi: toVnd(r.ChiSoNuocMoi),
        GiaDienCu: toVnd(r.GiaDienCu),
        GiaDienMoi: toVnd(r.GiaDienMoi),
        GiaNuocCu: toVnd(r.GiaNuocCu),
        GiaNuocMoi: toVnd(r.GiaNuocMoi),
        TienPhong: toVnd(r.TienPhong),
        TongDichVu: toVnd(r.TongDichVu),
        TongTien: toVnd(r.TongTien),
        TrangThaiThanhToan: r.TrangThaiThanhToan,
        Tientra: toVnd(r.Tientra),
        TienNo: toVnd(r.TienNo),
        SoDienDaTieuThu: toVnd(r.SoDienDaTieuThu),
        SoNuocDaTieuThu: toVnd(r.SoNuocDaTieuThu),
        PhiSuaChua: toVnd(r.PhiSuaChua),
        PhiTru: toVnd(r.PhiTru),
        TenPhiSuaChua: r.TenPhiSuaChua ?? null,
        TenPhiTru: r.TenPhiTru ?? null,
        PhongID_id: toVnd(r.PhongID_id),
      }))

      setRecords(normalized)

      const soLan = toVnd(shape.so_lan_thanh_toan) ?? normalized.filter(r => r.TrangThaiThanhToan === 'Y').length
      // Bám đúng logic backend mẫu: tổng nợ = sum(TienNo), tổng đã thanh toán = sum(Tientra)
      const tongNo = toVnd(shape.tong_no) ?? normalized.reduce((sum, r) => sum + (r.TienNo ?? 0), 0)
      const tongDaTT = toVnd(shape.tong_da_thanh_toan) ?? normalized.reduce((s, r) => s + (r.Tientra ?? 0), 0)
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
function toVnd(v: any): number | undefined {
  if (v === null || v === undefined || v === '') return undefined
  if (typeof v === 'number') return v
  if (typeof v === 'string') {
    const cleaned = v.replace(/[.,\s]/g, '')
    const n = Number(cleaned)
    return Number.isFinite(n) ? n : undefined
  }
  return undefined
}

function isPaidStatus(v: any): boolean {
  return v === 'Y' || v === '1' || v === 1 || v === true || v === 'true'
}

