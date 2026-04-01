import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMoney(value: number, showSign = false): string {
  const prefix = showSign && value > 0 ? '+' : ''
  return prefix + value.toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

export function formatPercent(value: number, showSign = false): string {
  const prefix = showSign && value > 0 ? '+' : ''
  return prefix + value.toFixed(2) + '%'
}

export function pnlColor(value: number): string {
  if (value > 0) return 'text-[#10b981]'
  if (value < 0) return 'text-[#ef4444]'
  return 'text-[#9ca3af]'
}
