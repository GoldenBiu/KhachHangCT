"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Home } from 'lucide-react'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  // Simple math CAPTCHA
  const [challenge, setChallenge] = useState<{ q: string; a: number }>({ q: '', a: 0 })
  const [answer, setAnswer] = useState('')
  const router = useRouter()

  const genChallenge = () => {
    const ops: Array<"+" | "-" | "×"> = ["+", "-", "×"]
    const a = Math.floor(Math.random() * 9) + 1
    const b = Math.floor(Math.random() * 9) + 1
    const op = ops[Math.floor(Math.random() * ops.length)]
    const res = op === "+" ? a + b : op === "-" ? a - b : a * b
    setChallenge({ q: `${a} ${op} ${b} = ?`, a: res })
    setAnswer('')
  }

  useEffect(() => {
    genChallenge()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || !password) {
      setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu')
      return
    }

    // Validate CAPTCHA before sending request
    if (String(parseInt(answer, 10)) !== String(challenge.a)) {
      setError('Sai phép tính xác thực. Vui lòng thử lại')
      genChallenge()
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('https://all-oqry.onrender.com/api/k_khachhang/dang-nhap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          TenDangNhap: username,
          MatKhau: password,
        }),
      })

      const data = await response.json()

      if (response.ok && data.token) {
        localStorage.setItem('userToken', data.token)
        localStorage.setItem('userRole', 'khachhang')
        localStorage.setItem('userInfo', JSON.stringify(data.user))

        toast.success('Đăng nhập thành công! Đang chuyển hướng...')

        setTimeout(() => {
          router.replace('/home')
        }, 1500)
      } else {
        setError(data.message || 'Tên đăng nhập hoặc mật khẩu không đúng')
        genChallenge()
      }
    } catch (error) {
      console.error('Lỗi kết nối:', error)
      setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet.')
      genChallenge()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <Home className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Nhà trọ Cần Thơ - Khách Hàng
          </CardTitle>  
          <CardDescription className="text-base">
            Đăng nhập hệ thống quản lý phòng trọ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Tên đăng nhập</Label>
              <Input
                id="username"
                type="text"
                placeholder="Nhập tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-11"
                disabled={loading}
              />
            </div>
            {/* CAPTCHA */}
            <div className="space-y-2">
              <Label>Trả lời phép tính để xác thực</Label>
              <div className="flex items-center gap-2">
                <div className="px-3 py-2 rounded-md bg-slate-100 text-slate-700 min-w-[120px] text-center">
                  {challenge.q || '...'}
                </div>
                <Input
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Câu trả lời"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value.replace(/[^0-9-]/g, ''))}
                  className="h-11 max-w-[160px]"
                  disabled={loading}
                />
                <Button type="button" variant="outline" size="icon" onClick={genChallenge} title="Đổi phép tính">
                  ↻
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
                disabled={loading}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                'Đăng nhập'
              )}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                className="text-blue-600 hover:text-blue-700"
                onClick={() => router.push('/forgot-password')}
              >
                Quên mật khẩu?
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
