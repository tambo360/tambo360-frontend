'use client'
import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useProductionVsLoss } from '@/hooks/dashboard/useProductionVsLoss'
import { GraphParams } from '@/types/dashboard'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import ChangeBatch from '@/components/shared/dashboard/batch/ChangeBatch'

// Colores tomados del diseño de Figma
const COLOR_PRODUCCION = '#52C49A'
const COLOR_MERMA = '#2F3FD0'

const formatTick = (tick: number) =>
  tick >= 1000000
    ? `${(tick / 1000000).toFixed(1)}M`
    : tick >= 1000
      ? `${(tick / 1000).toFixed(0)}k`
      : String(tick)

const ComparacionHistorica = () => {
  const [open, setOpen] = useState(false)
  const [producto, setProducto] = useState<GraphParams['producto']>('leches')

  const { points, hasLots, isPending, isError } = useProductionVsLoss(producto)

  const hasData = hasLots && points.length > 0

  const { yMax, yTicks } = useMemo(() => {
    // La altura de cada barra es producción + merma (apiladas)
    const maxVal = Math.max(0, ...points.map((p) => p.produccion + p.merma))
    if (maxVal === 0) return { yMax: 100, yTicks: [0, 25, 50, 75, 100] }

    const ceiling = maxVal * 1.15
    const magnitude = Math.pow(10, Math.floor(Math.log10(ceiling)))
    const step = magnitude / 2 || 10
    const yMaxRounded = Math.ceil(ceiling / step) * step

    const ticks = Array.from({ length: 5 }, (_, i) =>
      Math.round((yMaxRounded / 4) * i)
    )

    return { yMax: yMaxRounded, yTicks: ticks }
  }, [points])

  const CHART_H = 200
  const BAR_W = 42
  const BAR_GAP = 30
  const Y_AXIS_W = 56
  const PAD_TOP = 20
  const PAD_RIGHT = 20
  const X_LABEL_H = 30

  const barAreaH = CHART_H - PAD_TOP
  const baseY = PAD_TOP + barAreaH
  const toY = (val: number) => PAD_TOP + barAreaH - (val / yMax) * barAreaH

  const svgW = Y_AXIS_W + (points.length || 6) * (BAR_W + BAR_GAP) + PAD_RIGHT
  const svgH = CHART_H + X_LABEL_H

  return (
    <Card className="w-full overflow-hidden">
      {isPending ? (
        <div className="h-60 flex items-center justify-center">
          <span className="text-sm text-muted-foreground animate-pulse">
            Cargando datos...
          </span>
        </div>
      ) : isError ? (
        <div className="h-60 flex items-center justify-center p-6 text-center">
          <span className="text-sm text-muted-foreground">
            No se pudo cargar el gráfico. Intenta de nuevo más tarde.
          </span>
        </div>
      ) : !hasData ? (
        <div className="flex flex-col items-center justify-center text-center p-6 bg-white rounded-b-lg ">
          <h3 className="text-xl font-bold text-black mb-2">
            Tu historial comienza aca
          </h3>
          <p className="text-slate-500 text-sm max-w-75 mb-6">
            Registra tu primer lote para ver comparativas históricas y el
            rendimiento de tu producción.
          </p>
          <Button onClick={() => setOpen(true)}>
            Registrar lote <Plus className="size-4" />
          </Button>
        </div>
      ) : (
        <>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold text-slate-800">
                Comparación histórica
              </CardTitle>
              <p className="text-muted-foreground text-xs">
                Producción y merma de los últimos 6 meses y el mes actual
              </p>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <Select
                value={producto}
                onValueChange={(v: GraphParams['producto']) => setProducto(v)}
              >
                <SelectTrigger size="sm" className="w-27.5 capitalize">
                  <SelectValue placeholder="Producto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="leches">Leches</SelectItem>
                  <SelectItem value="quesos">Quesos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="overflow-x-auto pb-4 custom-scrollbar">
              <svg
                viewBox={`0 0 ${svgW} ${svgH}`}
                className="block overflow-visible mx-auto min-w-125 w-full h-full"
              >
                {yTicks.map((tick) => (
                  <g key={tick}>
                    <line
                      x1={Y_AXIS_W}
                      y1={toY(tick)}
                      x2={svgW}
                      y2={toY(tick)}
                      className="stroke-slate-200"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={Y_AXIS_W - 8}
                      y={toY(tick) + 4}
                      textAnchor="end"
                      className="fill-slate-400 text-[10px] font-medium"
                    >
                      {formatTick(tick)}
                    </text>
                  </g>
                ))}

                {points.map((d, i) => {
                  const x = Y_AXIS_W + i * (BAR_W + BAR_GAP) + BAR_GAP / 2
                  const total = d.produccion + d.merma
                  const prodH = (d.produccion / yMax) * barAreaH
                  const mermaH = (d.merma / yMax) * barAreaH

                  return (
                    <g
                      key={`${d.mes}-${d.anio}`}
                      className="group cursor-default"
                    >
                      {total === 0 ? (
                        // Mes sin datos: una marca mínima para que no quede vacío
                        <rect
                          x={x}
                          y={baseY - 3}
                          width={BAR_W}
                          height={3}
                          fill="#E2E8F0"
                          rx="2"
                        />
                      ) : (
                        <>
                          {/* Producción (verde), abajo */}
                          <rect
                            x={x}
                            y={baseY - prodH}
                            width={BAR_W}
                            height={prodH}
                            fill={COLOR_PRODUCCION}
                            rx="3"
                          />
                          {/* Merma (azul), apilada encima */}
                          {d.merma > 0 && (
                            <rect
                              x={x}
                              y={baseY - prodH - mermaH}
                              width={BAR_W}
                              height={mermaH}
                              fill={COLOR_MERMA}
                              rx="3"
                            />
                          )}
                        </>
                      )}
                      <text
                        x={x + BAR_W / 2}
                        y={CHART_H + 20}
                        textAnchor="middle"
                        className="fill-slate-500 text-[10px] font-semibold"
                      >
                        {d.mes.substring(0, 3)}
                      </text>
                      <title>{`${d.mes} ${d.anio}: producción ${d.produccion}, merma ${d.merma}`}</title>
                    </g>
                  )
                })}
              </svg>
            </div>

            {/* Leyenda */}
            <div className="flex items-center justify-center gap-6 pb-2 text-xs text-slate-500">
              <span className="flex items-center gap-2">
                <span
                  className="inline-block size-2.5 rounded-sm"
                  style={{ backgroundColor: COLOR_PRODUCCION }}
                />
                Producción
              </span>
              <span className="flex items-center gap-2">
                <span
                  className="inline-block size-2.5 rounded-sm"
                  style={{ backgroundColor: COLOR_MERMA }}
                />
                Merma
              </span>
            </div>
          </CardContent>
        </>
      )}
      <ChangeBatch
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
      />
    </Card>
  )
}

export default ComparacionHistorica
