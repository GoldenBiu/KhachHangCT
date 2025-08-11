"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'

export interface ThemeConfig {
  name: string
  description: string
  bgColor: string
  primaryGradient: string
  secondaryGradient: string
  textColor: string
  borderColor: string
}

export const themes: ThemeConfig[] = [
  {
    name: 'Sáng',
    description: 'Giao diện sáng, dễ nhìn',
    bgColor: 'bg-white',
    primaryGradient: 'from-blue-50 to-indigo-50',
    secondaryGradient: 'from-slate-50 to-gray-50',
    textColor: 'text-gray-900',
    borderColor: 'border-gray-200'
  },
  {
    name: 'Tối',
    description: 'Giao diện tối, bảo vệ mắt',
    bgColor: 'bg-gray-900',
    primaryGradient: 'from-gray-800 to-gray-900',
    secondaryGradient: 'from-gray-700 to-gray-800',
    textColor: 'text-gray-100',
    borderColor: 'border-gray-700'
  }
]

interface ThemeSelectorProps {
  currentTheme: string
  onThemeChange: (theme: string) => void
}

export default function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState<'left' | 'right'>('right')

  // Debug logging
  console.log('ThemeSelector rendered:', { currentTheme, isOpen, dropdownPosition })

  // Kiểm tra vị trí để tránh tràn ra ngoài
  const handleToggle = () => {
    if (!isOpen) {
      const button = document.querySelector('[data-theme-button]') as HTMLElement
      if (button) {
        const rect = button.getBoundingClientRect()
        const viewportWidth = window.innerWidth
        const dropdownWidth = 192 // w-48 = 12rem = 192px
        
        if (rect.right + dropdownWidth > viewportWidth) {
          setDropdownPosition('left')
        } else {
          setDropdownPosition('right')
        }
      }
    }
    setIsOpen(!isOpen)
  }

  return (
    <div className="relative shrink-0">
      <Button
        variant="outline"
        size="sm"
        onClick={handleToggle}
        className="flex items-center gap-2 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 min-w-[36px]"
        data-theme-button
      >
        {currentTheme === 'Tối' ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
        <span className="hidden sm:inline">{currentTheme}</span>
        <span className="sm:hidden">{currentTheme === 'Tối' ? '🌙' : '☀️'}</span>
      </Button>

      {isOpen && (
        <div className={`absolute top-full mt-2 w-40 sm:w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 ${
          dropdownPosition === 'left' 
            ? 'right-0' 
            : 'right-0 transform -translate-x-1/2 md:transform-none'
        }`}>
          {themes.map((theme) => (
            <button
              key={theme.name}
              onClick={() => {
                onThemeChange(theme.name)
                setIsOpen(false)
              }}
              className={`w-full p-2 sm:p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                currentTheme === theme.name ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
            >
              <div className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                {theme.name}
              </div>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {theme.description}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Backdrop để đóng dropdown khi click ngoài */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
} 