"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { User, FileText, Receipt, MessageCircle, LogOut, Home, Mail, Phone, ArrowLeft } from 'lucide-react'

// Demo user data
const demoUserInfo = {
  HoTen: 'Nguyễn Văn An',
  TenDangNhap: 'nguyenvanan',
  Email: 'nguyenvanan@email.com'
}

export default function DemoHomePage() {
  const router = useRouter()

  const menuItems = [
    {
      title: 'Hồ Sơ Cá Nhân',
      description: 'Xem và quản lý thông tin cá nhân',
      icon: User,
      href: '/demo/profile',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Hợp Đồng',
      description: 'Xem và quản lý hợp đồng thuê phòng',
      icon: FileText,
      href: '/demo/contract',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Hóa Đơn',
      description: 'Xem lịch sử và thanh toán hóa đơn',
      icon: Receipt,
      href: '/demo/invoice',
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Liên Hệ',
      description: 'Hỗ trợ và liên hệ với quản lý',
      icon: MessageCircle,
      href: '/demo/contact',
      color: 'from-purple-500 to-pink-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push('/')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Về trang chủ
            </Button>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Home className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Trang Chủ</h1>
                <p className="text-gray-600">Chào mừng trở lại!</p>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 px-3 py-1 rounded-full">
            <span className="text-red-600 text-sm font-medium">DEMO MODE</span>
          </div>
        </div>

        {/* User Info Card */}
        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 border-2 border-white/20">
                <AvatarFallback className="bg-white/20 text-white text-lg font-semibold">
                  {demoUserInfo.HoTen.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-bold">
                  Xin chào, {demoUserInfo.HoTen}!
                </h2>
                <div className="space-y-1 mt-2">
                  <div className="flex items-center text-white/90">
                    <User className="h-4 w-4 mr-2" />
                    <span className="text-sm">Tên đăng nhập: {demoUserInfo.TenDangNhap}</span>
                  </div>
                  <div className="flex items-center text-white/90">
                    <Mail className="h-4 w-4 mr-2" />
                    <span className="text-sm">Email: {demoUserInfo.Email}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <Card 
                key={index}
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg overflow-hidden"
                onClick={() => router.push(item.href)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
