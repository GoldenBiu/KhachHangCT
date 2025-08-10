import { useEffect, useState } from 'react'

export interface DienNuocTheoThang {
  ThangNam: string
  DienDaSuDung: number
  NuocDaSuDung: number
  SoPhong?: string
  DayPhong?: string
}

export function useDienNuoc() {
  const [items, setItems] = useState<DienNuocTheoThang[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = async () => {
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
        try { body = await res.json() } catch { body = null }
        return { res, body }
      }

      const candidates = [
        'https://all-oqry.onrender.com/api/k_diennuoc',
        'https://all-oqry.onrender.com/api/dien-nuoc',
      ]

      let lastErr = 'Không thể lấy dữ liệu điện nước'
      for (const url of candidates) {
        const { res, body } = await tryFetch(url)
        if (res.ok) {
          const list: any[] = Array.isArray(body) ? body : (body?.data ?? [])
          const normalized: DienNuocTheoThang[] = list.map((r: any) => ({
            ThangNam: String(r.ThangNam ?? r.thangNam ?? ''),
            DienDaSuDung: Number(r.DienDaSuDung ?? r.dien ?? r.dienDaSuDung ?? 0),
            NuocDaSuDung: Number(r.NuocDaSuDung ?? r.nuoc ?? r.nuocDaSuDung ?? 0),
            SoPhong: r.SoPhong,
            DayPhong: r.DayPhong,
          }))
          setItems(normalized)
          return
        }
        lastErr = (body?.message as string) || `HTTP ${res.status}`
        if (res.status !== 404) break
      }

      setError(lastErr)
    } catch (err) {
      setError('Không thể kết nối đến máy chủ')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  return { items, loading, error, refresh: fetchItems }
}

