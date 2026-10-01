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

export function limitDecimalDigitsKeyDown(
  e: React.KeyboardEvent<HTMLInputElement>,
  conPunto: React.MutableRefObject<boolean>,
  maxInt = 4,
  maxDec = 4
) {
  if (e.key === '.' || e.key === ',') conPunto.current = true
  const [int, dec = ''] = e.currentTarget.value.split('.')
  const excedeInt = !conPunto.current && int.length >= maxInt
  const excedeDec = conPunto.current && dec.length >= maxDec
  if (!isNaN(Number(e.key)) && (excedeInt || excedeDec)) e.preventDefault()
}

export function sanitizeDecimalChange(
  e: React.ChangeEvent<HTMLInputElement>,
  conPunto: React.MutableRefObject<boolean>
) {
  if (!e.target.value) conPunto.current = false
  if (e.target.value !== '' && Number(e.target.value) < 0) e.target.value = ''
}
