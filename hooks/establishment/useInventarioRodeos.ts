'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { getCatalogo, getMovimientos } from '@/utils/api/catalog.api'
import { getCurrentMonth } from '@/utils/api/dashboard.api'
import type { Transferencia } from '@/components/shared/dashboard/organization/configuration/TransferenciasTable'

// 'MASTITIS' -> 'Mastitis', 'PROBLEMA_PODAL' -> 'Problema podal'
const formatearValor = (v?: string | null) => {
  if (!v) return '—'
  const t = v.replace(/_/g, ' ').toLowerCase()
  return t.charAt(0).toUpperCase() + t.slice(1)
}

// El backend etiqueta el movimiento con `tipo`:
//   INGRESO       -> alta
//   EGRESO        -> baja
//   TRANSFERENCIA -> transferencia
// Cualquier otro valor se muestra como "Movimiento".
const normalizarTipo = (raw?: string | null): Transferencia['tipo'] => {
  switch ((raw ?? '').toUpperCase()) {
    case 'TRANSFERENCIA':
      return 'TRANSFERENCIA'
    case 'INGRESO':
      return 'ALTA'
    case 'EGRESO':
      return 'BAJA'
    default:
      return 'OTRO'
  }
}

export function useInventarioRodeos() {
  const [catalogo, setCatalogo] = useState<any>(null)
  const [movimientos, setMovimientos] = useState<any[]>([])
  const [mesActual, setMesActual] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [isAltaOpen, setIsAltaOpen] = useState(false)
  const [isBajaOpen, setIsBajaOpen] = useState(false)
  const [isTransferOpen, setIsTransferOpen] = useState(false)
  const [motivoAlta, setMotivoAlta] = useState<string | undefined>()
  const [motivoBaja, setMotivoBaja] = useState<string | undefined>()

  const fetchTodo = useCallback(async () => {
    try {
      setLoading(true)

      const [catalogoRes, movimientosRes, mesRes] = await Promise.allSettled([
        getCatalogo(),
        getMovimientos(),
        getCurrentMonth(),
      ])

      if (catalogoRes.status === 'fulfilled') {
        setCatalogo(catalogoRes.value)
      } else {
        console.error('Error catálogo:', catalogoRes.reason)
        setCatalogo(null)
      }

      if (movimientosRes.status === 'fulfilled') {
        const data = movimientosRes.value
        setMovimientos(Array.isArray(data) ? data : [])
      } else {
        console.warn(
          'Movimientos no disponibles:',
          movimientosRes.reason?.response?.status ??
            movimientosRes.reason?.message
        )
        setMovimientos([])
      }

      if (mesRes.status === 'fulfilled') {
        setMesActual(mesRes.value?.data?.data ?? null)
      } else {
        console.warn('mes-actual no disponible:', mesRes.reason)
        setMesActual(null)
      }
    } catch (e) {
      console.error('Error general:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTodo()
  }, [fetchTodo])

  // ─── Derivados ─────────────────────────────────
  const rodeos: any[] = catalogo?.rodeos ?? []

  const totalVacasOrdenie = useMemo(() => {
    return rodeos
      .filter((r: any) => {
        const v = (r.value || '').toUpperCase()
        return v.includes('ORDENE') || v.includes('ORDENIE')
      })
      .reduce((acc: number, r: any) => acc + (r.cantVacas || 0), 0)
  }, [rodeos])

  const totalLitros = mesActual?.actual?.leches ?? 0

  const promedioLitros = useMemo(() => {
    if (totalVacasOrdenie <= 0 || totalLitros <= 0) return null
    return totalLitros / totalVacasOrdenie
  }, [totalVacasOrdenie, totalLitros])

  // ─── Historial de movimientos (transferencias, altas y bajas) ─────────
  // El nombre `transferencias` se mantiene para no tocar las 3 vistas
  // del catálogo que ya usan este hook.
  const transferencias: Transferencia[] = useMemo(() => {
    if (!Array.isArray(movimientos)) return []

    // Indexar rodeos por idRodeo → label (ej: "Rodeo Único de Ordeñe")
    const rodeosById: Record<string, string> = {}
    ;(catalogo?.rodeos ?? []).forEach((r: any) => {
      rodeosById[r.idRodeo] = r.label
    })

    return (
      [...movimientos]
        // Más nuevos primero (los ids son UUID v7, ordenados por tiempo)
        .sort((a: any, b: any) =>
          String(b.idMovimiento).localeCompare(String(a.idMovimiento))
        )
        .map((m: any) => {
          const tipo = normalizarTipo(m.tipo)

          // `retorno` es la fecha futura en la que el tambero espera que
          // vuelva el animal; el plazo son los días hasta esa fecha.
          let plazoRetornoDias: number | null = null
          if (m.retorno && m.fechaCreacion) {
            const diffMs =
              new Date(m.retorno).getTime() -
              new Date(m.fechaCreacion).getTime()
            plazoRetornoDias = Math.max(
              0,
              Math.ceil(diffMs / (1000 * 60 * 60 * 24))
            )
          }

          return {
            id: m.idMovimiento,
            tipo,
            origen: m.rodeoOrigen
              ? (rodeosById[m.rodeoOrigen] ?? m.rodeoOrigen)
              : '—',
            destino: m.rodeoDestino
              ? (rodeosById[m.rodeoDestino] ?? m.rodeoDestino)
              : '—',
            cantidad: m.cantidad || 0,
            plazoRetornoDias,
            causa: formatearValor(m.causa),
            motivo: formatearValor(m.motivo),
            // "En curso" solo tiene sentido para transferencias
            estado: m.estado || (tipo === 'TRANSFERENCIA' ? 'EN CURSO' : '—'),
          }
        })
    )
  }, [movimientos, catalogo])

  // ─── Modales ───────────────────────────────────
  const abrirAlta = useCallback((motivo?: string) => {
    setMotivoAlta(motivo)
    setIsAltaOpen(true)
  }, [])
  const cerrarAlta = useCallback(() => setIsAltaOpen(false), [])

  const abrirBaja = useCallback((motivo?: string) => {
    setMotivoBaja(motivo)
    setIsBajaOpen(true)
  }, [])
  const cerrarBaja = useCallback(() => setIsBajaOpen(false), [])

  const abrirTransferencia = useCallback(() => setIsTransferOpen(true), [])
  const cerrarTransferencia = useCallback(() => setIsTransferOpen(false), [])

  return {
    loading,
    rodeos,
    promedioLitros,
    transferencias,
    refetch: fetchTodo,

    isAltaOpen,
    isBajaOpen,
    isTransferOpen,
    motivoAlta,
    motivoBaja,
    abrirAlta,
    abrirBaja,
    cerrarAlta,
    cerrarBaja,
    abrirTransferencia,
    cerrarTransferencia,
  }
}
