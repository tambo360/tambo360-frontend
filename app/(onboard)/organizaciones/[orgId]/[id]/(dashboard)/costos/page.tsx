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
import RegisterNewCost from '@/components/shared/dashboard/generalCost/RegisterNewCost'
import { useGeneralCosts } from '@/hooks/generalCost/useGeneralCosts'
import { useGeneralCostsSummary } from '@/hooks/generalCost/useGeneralCostsSummary'
import { useMonthPeriod } from '@/hooks/generalCost/useMonthPeriod'
import { GeneralCost } from '@/types/generalCost'
import { formatShortDate } from '@/utils/formatDate'

const capitalize = (text: string): string => {
  if (!text) return text
  const lower = text.toLowerCase()
  return lower.charAt(0).toUpperCase() + lower.slice(1)
}

// Busca la lista de costos sin importar si el backend la devuelve
// directo, dentro de `data`, o dentro de otro campo de `data`.
const extractCosts = (payload: unknown): GeneralCost[] => {
  if (Array.isArray(payload)) return payload as GeneralCost[]
  const inner = (payload as { data?: unknown } | undefined)?.data
  if (Array.isArray(inner)) return inner as GeneralCost[]
  if (inner && typeof inner === 'object') {
    const found = Object.values(inner).find(Array.isArray)
    if (Array.isArray(found)) return found as GeneralCost[]
  }
  return []
}

export interface GeneralCostRow {
  id: string
  date: string
  costType: string
  description: string
  amount: number
}

const GeneralCosts = () => {
  const [openRegister, setOpenRegister] = useState(false)
  const { period, label, isCurrentMonth, goPrev, goNext } = useMonthPeriod()
  const { data: costsData, isPending: isCostsPending } = useGeneralCosts(period)
  const { data: summary } = useGeneralCostsSummary(period)

  // TEMPORAL: borrar cuando confirmemos la forma de la respuesta
  console.log('costsData:', costsData)

  const onNewCostClick = () => {
    setOpenRegister(true)
  }

  const rawCosts: GeneralCost[] = extractCosts(costsData)

  const rows: GeneralCostRow[] = rawCosts.map((c) => ({
    id: c.idCostoGeneral,
    date: formatShortDate(c.fecha),
    costType: c.tipoCosto,
    description: c.descripcion ?? '-',
    amount: Number(c.monto),
  }))

  const loading = isCostsPending
  const foodCostValue = summary?.gastoAlimentacion ?? 0
  const prorrateoValue = summary?.prorrateoPromedio ?? 0
  const generalCostsValue = summary?.gastoCostosGenerales ?? 0

  return (
    <div className="flex flex-col w-full gap-6 sm:gap-8 animate-in fade-in duration-500 bg-[#F9FAFB] p-4 sm:p-8 rounded-2xl">
      {/* TÍTULO PRINCIPAL + SELECTOR DE MES */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
          Costos Generales
        </h1>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-lg border-gray-200"
            onClick={goPrev}
            aria-label="Mes anterior"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </Button>
          <span className="min-w-36 text-center text-sm font-semibold text-gray-800">
            {label}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-lg border-gray-200"
            onClick={goNext}
            disabled={isCurrentMonth}
            aria-label="Mes siguiente"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </Button>
        </div>
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
              $ {foodCostValue.toLocaleString('es-AR')}
            </h2>
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
              $ {generalCostsValue.toLocaleString('es-AR')}
            </h2>
          </div>
        </div>

        {/* Tarjeta 3: Costo Prorrateo (Verde) */}
        <div className="bg-[#1B4D3E] border border-[#1B4D3E] rounded-2xl p-6 shadow-sm flex flex-col text-white relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="w-8 h-8 text-white" />
            <span className="bg-[#80B718] text-white text-[14px] font-bold px-3 py-1 rounded-full">
              Cálculo en vivo
            </span>
          </div>
          <div className="mt-4">
            <span className="font-semibold">Costo Prorrateo/Lote</span>
            <h2 className="text-xl font-semibold text-white mt-3">
              ${prorrateoValue.toFixed(2)}/ Lt
            </h2>
          </div>
          <div className="absolute right-5 bottom-4 flex items-end gap-1 opacity-20 pointer-events-none">
            <div className="w-5 h-14 bg-white rounded-t rounded-b"></div>
            <div className="w-5 h-10 bg-white rounded-t rounded-b"></div>
            <div className="w-5 h-22 bg-white rounded-t rounded-b"></div>
            <div className="w-5 h-22 bg-white rounded-t rounded-b"></div>
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
              onClick={onNewCostClick}
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
          ) : rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 gap-4 bg-white w-full text-center">
              <CloudOff className="w-10 h-10 text-gray-300" />
              <p className="text-sm text-gray-400 font-medium">
                No hay registros en el historial de gastos de {label}.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-155">
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
                      key={g.id}
                      className="border-b border-gray-100 hover:bg-gray-50/50"
                    >
                      <TableCell className="text-xs font-bold text-gray-800 py-4 pl-6">
                        {g.date}
                      </TableCell>
                      <TableCell className="text-xs">
                        <span className="inline-block bg-[#29845A80] text-black font-semibold px-3 py-1 rounded-full text-[11px]">
                          {capitalize(g.costType)}
                        </span>
                      </TableCell>
                      <TableCell
                        className="text-xs font-medium text-gray-600 max-w-60 truncate"
                        title={g.description}
                      >
                        {g.description}
                      </TableCell>
                      <TableCell className="text-xs font-extrabold text-gray-900 pr-6">
                        $ {g.amount.toLocaleString('es-AR')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <RegisterNewCost
        open={openRegister}
        onClose={() => setOpenRegister(false)}
      />
    </div>
  )
}

export default GeneralCosts
