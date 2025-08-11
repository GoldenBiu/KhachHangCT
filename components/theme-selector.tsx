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

  const currentThemeConfig = themes.find(t => t.name === currentTheme) || themes[0]

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        {currentTheme === 'Tối' ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
        {currentTheme}
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          {themes.map((theme) => (
            <button
              key={theme.name}
              onClick={() => {
                onThemeChange(theme.name)
                setIsOpen(false)
              }}
              className={`w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                currentTheme === theme.name ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
            >
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {theme.name}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {theme.description}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 