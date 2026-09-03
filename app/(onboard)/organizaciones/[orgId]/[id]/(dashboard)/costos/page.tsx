'use client'

import React, { useState } from 'react'
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Utensils,
  FileText,
  TrendingUp,
  Loader2,
  CloudOff,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import RegisterNewGasto from '@/components/shared/dashboard/generalCosts/RegisterNewGasto'
import { useCostosGenerales } from '@/hooks/generalCost/useCostosGenerales'
import { CostoGeneral } from '@/types/generalCost'
import { formatFechaCorta } from '@/utils/formatDate'

const capitalizar = (texto: string): string => {
  if (!texto) return texto
  const lower = texto.toLowerCase()
  return lower.charAt(0).toUpperCase() + lower.slice(1)
}

export interface GastoGeneral {
  idGasto: string
  fecha: string
  tipoCosto: string
  descripcion: string
  valor: number
}

interface CostosGeneralesProps {
  gastoAlimentacion: number
  porcentajeAlimentacionMesAnterior: string
  otrosCostosFijos: number
  porcentajeFijos: number
  porcentajeVar: number
  costoProrrateo: number
  isLoading?: boolean
  onPaginaAnterior?: () => void
  onPaginaSiguiente?: () => void
}

const CostosGenerales = ({
  gastoAlimentacion = 0,
  porcentajeAlimentacionMesAnterior = '0%',
  otrosCostosFijos = 0,
  porcentajeFijos = 0,
  porcentajeVar = 0,
  costoProrrateo = 0,
  isLoading = false,
  onPaginaAnterior,
  onPaginaSiguiente,
}: CostosGeneralesProps) => {
  const [openRegister, setOpenRegister] = useState(false)
  const { data: costosData, isPending: isPendingCostos } = useCostosGenerales()

  const onNuevoGastoClick = () => {
    setOpenRegister(true)
  }

  const rawCostos: CostoGeneral[] = Array.isArray(costosData)
    ? costosData
    : (costosData?.data ?? [])

  const gastosRows: GastoGeneral[] = rawCostos.map((c) => ({
    idGasto: c.idCostoGeneral,
    fecha: formatFechaCorta(c.fecha),
    tipoCosto: c.tipoCosto,
    descripcion: c.descripcion ?? '-',
    valor: c.monto,
  }))
  const rows = gastosRows.length > 0 ? gastosRows : []
  const loading = isLoading || isPendingCostos

  return (
    <div className="flex flex-col w-full gap-8 animate-in fade-in duration-500 bg-[#F9FAFB] p-8 rounded-2xl">
      {/* TÍTULO PRINCIPAL */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Costos Generales
        </h1>
      </div>

      {/* TARJETAS SUPERIORES DINÁMICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tarjeta 1: Gasto Alimentación */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-gray-50 rounded-xl text-gray-700">
              <Utensils className="w-5 h-5" />
            </div>
            <TrendingUp className="w-4 h-4 text-gray-400" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Gasto Alimentación
            </span>
            <h2 className="text-2xl font-extrabold text-gray-900 mt-1">
              $ {gastoAlimentacion?.toLocaleString('es-AR') ?? '0'}
            </h2>
          </div>
          <div className="mt-4">
            <span className="inline-block bg-[#1B4D3E] text-white text-[11px] font-bold px-3 py-1 rounded-full">
              {porcentajeAlimentacionMesAnterior || '0%'}
            </span>
          </div>
        </div>

        {/* Tarjeta 2: Otros costos */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-gray-50 rounded-xl text-gray-700">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Otros costos (fijos/var)
            </span>
            <h2 className="text-2xl font-extrabold text-gray-900 mt-1">
              $ {otrosCostosFijos?.toLocaleString('es-AR') ?? '0'}
            </h2>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden flex">
              <div
                className="bg-gray-400 h-full"
                style={{ width: `${porcentajeFijos ?? 0}%` }}
              ></div>
              <div
                className="bg-gray-200 h-full"
                style={{ width: `${porcentajeVar ?? 0}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] font-semibold text-gray-400">
              <span>Fijos {porcentajeFijos ?? 0}%</span>
              <span>Var {porcentajeVar ?? 0}%</span>
            </div>
          </div>
        </div>

        {/* Tarjeta 3: Costo Prorrateo (Verde) */}
        <div className="bg-[#1B4D3E] border border-[#1B4D3E] rounded-2xl p-6 shadow-sm flex flex-col justify-between text-white relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-white/10 rounded-xl text-white">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="bg-[#84CC16] text-gray-900 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              Cálculo en vivo
            </span>
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">
              Costo Prorrateo/Lote
            </span>
            <h2 className="text-2xl font-extrabold text-white mt-1">
              $ {costoProrrateo?.toFixed(2) ?? '0.00'} / Lt
            </h2>
          </div>
          <div className="absolute right-4 bottom-4 flex items-end gap-1 opacity-20 pointer-events-none">
            <div className="w-2.5 h-6 bg-white rounded-t"></div>
            <div className="w-2.5 h-10 bg-white rounded-t"></div>
            <div className="w-2.5 h-14 bg-white rounded-t"></div>
          </div>
        </div>
      </div>

      {/* SECCIÓN HISTORIAL DE GASTOS Y TABLA */}
      <Card className="border-gray-200 shadow-sm overflow-hidden rounded-2xl bg-white gap-0 py-0">
        <CardHeader className="border-b border-gray-100 bg-white p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-lg font-bold text-gray-900">
              Historial de Gastos
            </CardTitle>

            <Button
              onClick={onNuevoGastoClick}
              className="bg-[#1B4D3E] hover:bg-[#153c31] text-white font-semibold rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              Nuevo Gasto
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20 bg-white w-full">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : !rows || rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 gap-4 bg-white w-full text-center">
              <CloudOff className="w-10 h-10 text-gray-300" />
              <p className="text-sm text-gray-400 font-medium">
                No hay registros en el historial de gastos.
              </p>
            </div>
          ) : (
            <div>
              <Table>
                <TableHeader className="bg-gray-50/70">
                  <TableRow>
                    <TableHead className="text-left font-bold text-gray-400 uppercase text-xs tracking-wider py-4 pl-6">
                      Fecha
                    </TableHead>
                    <TableHead className="text-left font-bold text-gray-400 uppercase text-xs tracking-wider">
                      Tipo de Gasto
                    </TableHead>
                    <TableHead className="text-left font-bold text-gray-400 uppercase text-xs tracking-wider">
                      Descripción
                    </TableHead>
                    <TableHead className="text-left font-bold text-gray-400 uppercase text-xs tracking-wider pr-6">
                      Valor
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((g) => (
                    <TableRow
                      key={g.idGasto}
                      className="border-b border-gray-100 hover:bg-gray-50/50"
                    >
                      <TableCell className="text-xs font-bold text-gray-800 py-4 pl-6">
                        {g.fecha}
                      </TableCell>
                      <TableCell className="text-xs">
                        <span className="inline-block bg-[#29845A80] text-blac font-semibold px-3 py-1 rounded-full text-[11px]">
                          {capitalizar(g.tipoCosto)}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs font-medium text-gray-600">
                        {g.descripcion}
                      </TableCell>
                      <TableCell className="text-xs font-extrabold text-gray-900 pr-6">
                        $ {g.valor?.toLocaleString('es-AR') ?? 0}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Paginador */}
              <div className="flex items-center justify-center py-4 border-t border-gray-100 gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-lg border-gray-200"
                  onClick={onPaginaAnterior}
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-lg border-gray-200"
                  onClick={onPaginaSiguiente}
                >
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <RegisterNewGasto
        open={openRegister}
        onClose={() => setOpenRegister(false)}
      />
    </div>
  )
}

export default CostosGenerales
