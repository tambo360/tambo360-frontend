import { useMemo } from 'react'
import { useGraph } from '@/hooks/dashboard/useGraph'
import type { GraphParams } from '@/types/dashboard'

export interface ProductionLossPoint {
  mes: string
  anio: number
  produccion: number
  merma: number
}

interface RawPoint {
  mes: string
  anio: number
  valor: number
}

/**
 * Combina dos llamadas a GET /dashboard/grafico (cantidad y mermas) en una
 * sola serie por mes, para dibujar producción y merma en la misma barra.
 */
export function useProductionVsLoss(producto: GraphParams['producto']) {
  const production = useGraph({ params: { producto, metrica: 'cantidad' } })
  const loss = useGraph({ params: { producto, metrica: 'mermas' } })

  const points: ProductionLossPoint[] = useMemo(() => {
    const prod: RawPoint[] = production.data?.data?.resultado ?? []
    const mermas: RawPoint[] = loss.data?.data?.resultado ?? []

    const mermaPorMes = new Map<string, number>(
      mermas.map((m) => [`${m.mes}-${m.anio}`, Number(m.valor) || 0])
    )

    return prod.map((p) => ({
      mes: p.mes,
      anio: p.anio,
      produccion: Number(p.valor) || 0,
      merma: mermaPorMes.get(`${p.mes}-${p.anio}`) ?? 0,
    }))
  }, [production.data, loss.data])

  // El backend manda `Lote: false` cuando el establecimiento no tiene lotes
  // (en ese caso `resultado` viene vacío).
  const lote = production.data?.data?.Lote
  const hasLots = !(lote === false || lote === 'false')

  return {
    points,
    hasLots,
    isPending: production.isPending || loss.isPending,
    isError: production.isError || loss.isError,
  }
}
