import { useState, useEffect } from 'react'

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

export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState<string>('Sáng')

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('selectedTheme')
    if (savedTheme && themes.find(t => t.name === savedTheme)) {
      setCurrentTheme(savedTheme)
    }
  }, [])

  const changeTheme = (themeName: string) => {
    const theme = themes.find(t => t.name === themeName)
    if (theme) {
      setCurrentTheme(themeName)
      localStorage.setItem('selectedTheme', themeName)
      applyThemeToDocument(theme)
    }
  }

  const applyThemeToDocument = (theme: ThemeConfig) => {
    const root = document.documentElement
    
    // Apply theme classes
    root.className = theme.bgColor
    
    // Set CSS custom properties
    root.style.setProperty('--theme-primary-gradient', theme.primaryGradient)
    root.style.setProperty('--theme-secondary-gradient', theme.secondaryGradient)
    root.style.setProperty('--theme-text-color', theme.textColor)
    root.style.setProperty('--theme-border-color', theme.borderColor)
  }

  const getThemeClasses = () => {
    const theme = themes.find(t => t.name === currentTheme) || themes[0]
    return {
      bgClass: theme.bgColor,
      primaryGradientClass: theme.primaryGradient,
      secondaryGradientClass: theme.secondaryGradient,
      textClass: theme.textColor,
      borderClass: theme.borderColor
    }
  }

  const getThemeStyles = () => {
    const theme = themes.find(t => t.name === currentTheme) || themes[0]
    return {
      background: `linear-gradient(135deg, ${theme.primaryGradient.split(' ').join(' ')})`,
      color: theme.textColor
    }
  }

  const toggleTheme = () => {
    const newTheme = currentTheme === 'Sáng' ? 'Tối' : 'Sáng'
    changeTheme(newTheme)
  }

  // Apply theme on mount and theme change
  useEffect(() => {
    const theme = themes.find(t => t.name === currentTheme) || themes[0]
    applyThemeToDocument(theme)
  }, [currentTheme])

  return {
    currentTheme,
    themes,
    changeTheme,
    toggleTheme,
    getThemeClasses,
    getThemeStyles
  }
} 