import { useEffect, useMemo, useRef, useState } from 'react'

export interface LienHePhanHoiItem {
  LienHeID: number
  LyDoLienHe: string
  NoiDung: string
  TrangThai: string
  PhanHoi?: string | null
  ThoiGianPhanHoi?: string | null
  KhachHangID_id: number
  PhongID_id?: number | null
  Time: string
  TrangThaiHienThi: string
}

export function useLienHePhanHoi(pollMs: number = 30000) {
  const [items, setItems] = useState<LienHePhanHoiItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<number>(0)
  const prevIdsRef = useRef<Set<number>>(new Set())

  const fetchItems = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null
    if (!token) {
      setError('Không tìm thấy token xác thực')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('https://all-oqry.onrender.com/api/k_lienhe/phan-hoi', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      const body: any = await res.json().catch(() => null)
      if (!res.ok) {
        const msg = body?.message || `HTTP ${res.status}`
        throw new Error(msg)
      }
      const list: LienHePhanHoiItem[] = Array.isArray(body) ? body : (body?.data ?? [])
      setItems(list)
      setLastUpdated(Date.now())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể lấy danh sách liên hệ')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
    if (pollMs > 0) {
      const id = setInterval(fetchItems, pollMs)
      return () => clearInterval(id)
    }
  }, [pollMs])

  // Detect newly added responses
  const newCount = useMemo(() => {
    const currentIds = new Set(items.map(i => i.LienHeID))
    let added = 0
    currentIds.forEach(id => {
      if (!prevIdsRef.current.has(id)) added += 1
    })
    prevIdsRef.current = currentIds
    return added
  }, [items])

  return { items, loading, error, lastUpdated, newCount, refresh: fetchItems }
}

