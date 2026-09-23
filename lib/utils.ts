import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const allowOnlyLettersKeyDown = (
  e: React.KeyboardEvent<HTMLInputElement>
) => {
  // deja pasar controles y atajos
  if (
    e.ctrlKey ||
    e.metaKey ||
    [
      'Backspace',
      'Delete',
      'Tab',
      'Enter',
      'Escape',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Home',
      'End',
    ].includes(e.key)
  )
    return
  if (e.key === 'Dead') return // tilde muerta (´)

  // tu regex literal tal cual pediste
  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]$/.test(e.key)) {
    e.preventDefault()
  }
}
