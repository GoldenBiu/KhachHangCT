"use client"

import Lottie from 'lottie-react'
import { useRef } from 'react'

interface ReceiptIconProps {
  className?: string
  size?: number
  onHover?: boolean
}

export function ReceiptIcon({ className = "h-8 w-8", size = 32, onHover = true }: ReceiptIconProps) {
  const lottieRef = useRef<any>(null)

  const handleMouseEnter = () => {
    if (onHover && lottieRef.current) {
      lottieRef.current.play()
    }
  }

  const handleMouseLeave = () => {
    if (onHover && lottieRef.current) {
      lottieRef.current.stop()
    }
  }

  return (
    <div 
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={null} // Sẽ thay bằng file JSON từ AnimatedIcons.co
        loop={false}
        autoplay={false}
        style={{ width: size, height: size }}
      />
    </div>
  )
} 