'use client'

import { useMemo, useState } from 'react'

/**
 * Paginación en memoria. Recibe la lista completa y devuelve solo
 * los elementos de la página actual, más lo necesario para los controles.
 */
export function usePagination<T>(items: T[], pageSize = 10) {
  const [page, setPage] = useState(1)

  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  // Si la lista se acorta (por ejemplo, tras un refetch), no quedamos
  // en una página que ya no existe.
  const currentPage = Math.min(page, totalPages)

  const pageItems = useMemo(
    () => items.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [items, currentPage, pageSize]
  )

  const from = total === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const to = Math.min(currentPage * pageSize, total)

  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  const prev = () => {
    if (hasPrev) setPage(currentPage - 1)
  }
  const next = () => {
    if (hasNext) setPage(currentPage + 1)
  }

  return {
    page: currentPage,
    totalPages,
    total,
    from,
    to,
    pageItems,
    hasPrev,
    hasNext,
    prev,
    next,
  }
}
