'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { getAnimalesListar } from '@/utils/api/catalog.api'

export type EstadoSanitario = 'NORMAL' | 'MASTITIS' | 'TRATAMIENTO'
export type FiltroEstado = 'todos' | 'normal' | 'mastitis' | 'tratamiento'

export interface AnimalRow {
  id: string
  codigo: string
  nombre: string
  categoria: string // 'ORDENE' | 'SECAS'
  del: number | null // Días de leche
  produccionHoy: number | null // litros
  estado: EstadoSanitario
  observacion: string
}

const PAGE_SIZE = 10

// El establecimiento tiene tope de 70 animales activos y el endpoint acepta
// hasta 100 por página: los traemos todos juntos.
const LIMITE_LISTADO = 100

// ─── Helpers ───────────────────────────────────

function toNumber(v: unknown): number | null {
  if (v === null || v === undefined || v === '') return null
  const n = typeof v === 'number' ? v : parseFloat(String(v))
  return Number.isFinite(n) ? n : null
}

/** 'Ordeñe' -> 'ORDENE' (sin tildes ni ñ, en mayúsculas) */
function aEnum(v: unknown): string {
  return String(v ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .trim()
}

/** Busca el arreglo de animales sin importar cómo lo envuelva el backend */
function extraerLista(res: any): any[] {
  if (Array.isArray(res)) return res
  const candidatos = [
    res?.animales,
    res?.items,
    res?.data,
    res?.results,
    res?.rows,
  ]
  return candidatos.find(Array.isArray) ?? []
}

/**
 * ÚNICO lugar donde se leen los campos que vienen del backend.
 * TODO: confirmar nombres reales con la respuesta de GET /conf/animal/listar
 */
function normalizarAnimal(a: any): AnimalRow {
  const estadoRaw = aEnum(a.estado ?? 'NORMAL')
  const estado: EstadoSanitario =
    estadoRaw === 'MASTITIS' || estadoRaw === 'TRATAMIENTO'
      ? estadoRaw
      : 'NORMAL' // 'SANO', 'NORMAL' o cualquier otro valor sano

  const codigo = a.codigo ?? ''

  return {
    id: String(a.idAnimal ?? a.id ?? codigo),
    codigo,
    nombre: a.nombre ?? '',
    categoria: aEnum(a.categoria ?? a.situacion),
    del: toNumber(a.DEL ?? a.del ?? a.diasLeche),
    produccionHoy: toNumber(a.litros_hoy ?? a.litrosHoy ?? a.produccionHoy),
    estado,
    observacion: a.observacion ?? '',
  }
}

export function useInventarioAnimales() {
  const [animales, setAnimales] = useState<AnimalRow[]>([])
  const [loading, setLoading] = useState(true)

  const [searchTerm, setSearchTermState] = useState('')
  const [estadoFilter, setEstadoFilterState] = useState<FiltroEstado>('todos')
  const [page, setPage] = useState(1)

  const [isAltaOpen, setIsAltaOpen] = useState(false)
  const [isBajaOpen, setIsBajaOpen] = useState(false)

  const fetchAnimales = useCallback(async () => {
    try {
      setLoading(true)
      const res = await getAnimalesListar({
        limit: LIMITE_LISTADO,
        orden: 'asc',
      })
      setAnimales(extraerLista(res).map(normalizarAnimal))
    } catch (e) {
      console.error('Error al listar animales:', e)
      setAnimales([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAnimales()
  }, [fetchAnimales])

  // Al cambiar un filtro volvemos a la página 1
  const setSearchTerm = (value: string) => {
    setSearchTermState(value)
    setPage(1)
  }
  const setEstadoFilter = (value: FiltroEstado) => {
    setEstadoFilterState(value)
    setPage(1)
  }

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    return animales.filter((a) => {
      const matchSearch =
        !term ||
        a.codigo.toLowerCase().includes(term) ||
        a.nombre.toLowerCase().includes(term)
      const matchEstado =
        estadoFilter === 'todos' || a.estado.toLowerCase() === estadoFilter
      return matchSearch && matchEstado
    })
  }, [animales, searchTerm, estadoFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)

  const pageItems = useMemo(
    () =>
      filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage]
  )

  const stats = useMemo(() => {
    const enOrdene = animales.filter((a) => a.categoria.includes('ORDENE'))
    const secas = animales.filter((a) => a.categoria.includes('SECA'))
    const enTratamiento = animales.filter((a) => a.estado !== 'NORMAL')

    // Promedio: solo vacas en ordeñe, sanas y con producción registrada hoy
    const conLitros = enOrdene.filter(
      (a) => a.estado === 'NORMAL' && a.produccionHoy !== null
    )
    const promedio =
      conLitros.length > 0
        ? conLitros.reduce((acc, a) => acc + (a.produccionHoy ?? 0), 0) /
          conLitros.length
        : null

    return {
      total: animales.length,
      ordene: enOrdene.length,
      secas: secas.length,
      enTratamiento: enTratamiento.length,
      promedio,
    }
  }, [animales])

  return {
    loading,
    refetch: fetchAnimales,

    // datos
    pageItems,
    totalFiltrados: filtered.length,
    stats,

    // filtros
    searchTerm,
    setSearchTerm,
    estadoFilter,
    setEstadoFilter,

    // paginación
    currentPage,
    totalPages,
    goPrev: () => setPage(Math.max(1, currentPage - 1)),
    goNext: () => setPage(Math.min(totalPages, currentPage + 1)),

    // modales
    isAltaOpen,
    isBajaOpen,
    abrirAlta: () => setIsAltaOpen(true),
    cerrarAlta: () => setIsAltaOpen(false),
    abrirBaja: () => setIsBajaOpen(true),
    cerrarBaja: () => setIsBajaOpen(false),
  }
}
