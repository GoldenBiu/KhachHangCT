import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Convert a number to Vietnamese words (for VND). Returns text without the trailing "đồng".
export function toVietnameseNumberText(input: number | string): string {
  let n = Math.floor(Number(input) || 0)
  if (n === 0) return "không"

  const digits = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"]
  const units = ["", "ngàn", "triệu", "tỷ", "ngàn tỷ", "triệu tỷ"]

  const readThree = (num: number, hasHigher: boolean): string => {
    const hundred = Math.floor(num / 100)
    const ten = Math.floor((num % 100) / 10)
    const unit = num % 10
    const parts: string[] = []

    if (hundred > 0) {
      parts.push(`${digits[hundred]} trăm`)
    } else if (hasHigher && (ten > 0 || unit > 0)) {
      parts.push("không trăm")
    }

    if (ten === 0) {
      if (unit > 0) {
        if (hundred > 0 || hasHigher) parts.push("linh")
        // unit handling at ones place without tens
        parts.push(unit === 5 && (hundred > 0 || hasHigher) ? "lăm" : digits[unit])
      }
    } else if (ten === 1) {
      parts.push("mười")
      if (unit === 0) {
        // nothing
      } else if (unit === 5) {
        parts.push("lăm")
      } else {
        parts.push(digits[unit])
      }
    } else {
      parts.push(`${digits[ten]} mươi`)
      if (unit === 0) {
        // nothing
      } else if (unit === 1) {
        parts.push("mốt")
      } else if (unit === 4) {
        // Common reading keeps "bốn"; "tư" is also acceptable. We choose "bốn" for consistency.
        parts.push("bốn")
      } else if (unit === 5) {
        parts.push("lăm")
      } else {
        parts.push(digits[unit])
      }
    }

    return parts.join(" ").trim()
  }

  const groups: number[] = []
  while (n > 0) {
    groups.push(n % 1000)
    n = Math.floor(n / 1000)
  }

  const parts: string[] = []
  for (let i = groups.length - 1; i >= 0; i--) {
    const groupVal = groups[i]
    if (groupVal === 0) continue
    const hasHigher = i < groups.length - 1
    const groupWords = readThree(groupVal, hasHigher)
    const unitLabel = units[i] || ""
    parts.push(unitLabel ? `${groupWords} ${unitLabel}` : groupWords)
  }

  return parts.join(" ").replace(/\s+/g, " ").trim()
}
