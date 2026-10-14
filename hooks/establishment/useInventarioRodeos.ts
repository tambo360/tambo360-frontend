'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { getCatalogo, getMovimientos } from '@/utils/api/catalog.api'
import { getCurrentMonth } from '@/utils/api/dashboard.api'
import type { Transferencia } from '@/components/shared/dashboard/organization/configuration/TransferenciasTable'

// CAMBIO 1: 'MASTITIS' -> 'Mastitis', 'PROBLEMA_PODAL' -> 'Problema podal'
const formatearValor = (v?: string | null) => {
  if (!v) return '—'
  const t = v.replace(/_/g, ' ').toLowerCase()
  return t.charAt(0).toUpperCase() + t.slice(1)
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

  // ─── Transferencias con UUID → nombre ─────────
  const transferencias: Transferencia[] = useMemo(() => {
    if (!Array.isArray(movimientos)) return []

    // Indexar rodeos por idRodeo → label (ej: "Rodeo Único de Ordeñe")
    const rodeosById: Record<string, string> = {}
    ;(catalogo?.rodeos ?? []).forEach((r: any) => {
      rodeosById[r.idRodeo] = r.label
    })

    return (
      movimientos
        .filter((m: any) => m.tipo === 'TRANSFERENCIA')
        // CAMBIO 2: más nuevas primero (los ids son UUID v7, ordenados por tiempo)
        .sort((a: any, b: any) =>
          String(b.idMovimiento).localeCompare(String(a.idMovimiento))
        )
        .map((m: any) => {
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
            origen: m.rodeoOrigen
              ? (rodeosById[m.rodeoOrigen] ?? m.rodeoOrigen)
              : '—',
            destino: m.rodeoDestino
              ? (rodeosById[m.rodeoDestino] ?? m.rodeoDestino)
              : '—',
            cantidad: m.cantidad || 0,
            plazoRetornoDias,
            causa: formatearValor(m.causa), // CAMBIO 1
            motivo: m.motivo || '',
            estado: m.estado || 'EN CURSO',
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
