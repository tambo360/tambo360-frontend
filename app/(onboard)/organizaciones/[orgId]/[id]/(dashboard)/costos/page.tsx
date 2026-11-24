'use client'

import { useState, useMemo } from 'react'
import {
  Plus,
  ChevronLeft,
  ChevronRight,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const capitalize = (text: string): string => {
  if (!text) return text
  const lower = text.toLowerCase()
  return lower.charAt(0).toUpperCase() + lower.slice(1)
}

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
  isAutomatic?: boolean
}

// Cantidad de registros por página en el historial de gastos
const ITEMS_PER_PAGE = 20

// Formatos de número (es-AR): 4.850.200 y 27,55
const formatMoney = (value: number) => value.toLocaleString('es-AR')
const formatDecimal = (value: number) =>
  value.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

const GeneralCosts = () => {
  const [openRegister, setOpenRegister] = useState(false)
  const { period, label, isCurrentMonth, goPrev, goNext } = useMonthPeriod()
  const { data: costsData, isPending: isCostsPending } = useGeneralCosts(period)
  const { data: summary } = useGeneralCostsSummary(period)

  // Paginación Local
  const [page, setPage] = useState(1)

  const onNewCostClick = () => setOpenRegister(true)

  // Al cambiar de mes, volvemos a la página 1
  const handlePrevMonth = () => {
    setPage(1)
    goPrev()
  }

  const handleNextMonth = () => {
    setPage(1)
    goNext()
  }

  const rawCosts: GeneralCost[] = extractCosts(costsData)

  const rows: GeneralCostRow[] = rawCosts.map((c) => ({
    id: c.idCostoGeneral,
    date: formatShortDate(c.fecha),
    costType: c.tipoCosto,
    description: c.descripcion ?? '-',
    amount: Number(c.monto),
  }))

  // Lógica de paginación
  const totalPages = Math.ceil(rows.length / ITEMS_PER_PAGE)
  const currentRows = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE
    return rows.slice(start, start + ITEMS_PER_PAGE)
  }, [rows, page])

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
            className="h-8 w-8 rounded-lg border-gray-200 bg-white"
            onClick={handlePrevMonth}
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
            className="h-8 w-8 rounded-lg border-gray-200 bg-white"
            onClick={handleNextMonth}
            disabled={isCurrentMonth}
            aria-label="Mes siguiente"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </Button>
        </div>
      </div>

      {/* TARJETAS SUPERIORES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-linear-to-br from-white to-[#f0f9ff] border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-medium text-gray-500">
            Costos de alimentación
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-2">
            ${formatMoney(foodCostValue)}
          </h2>
        </div>

        <div className="bg-linear-to-br from-white to-[#f0f9ff] border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-medium text-gray-500">
            Otros costos
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-2">
            ${formatMoney(generalCostsValue)}
          </h2>
        </div>

        <div className="bg-linear-to-br from-white to-[#f0f9ff] border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-medium text-gray-500">
            Costo Prorrateo/Lote
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-2">
            ${formatDecimal(prorrateoValue)}/Lt
          </h2>
        </div>
      </div>

      {/* HISTORIAL DE GASTOS */}
      <Card className="border-gray-200 shadow-sm overflow-hidden rounded-2xl bg-white gap-0 py-0">
        <CardHeader className="bg-white p-6 pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-lg font-bold text-gray-900">
              Historial de Gastos
            </CardTitle>

            <Button
              onClick={onNewCostClick}
              className="bg-[#659711] hover:bg-[#537d0d] text-white font-semibold rounded-md px-8 h-12 flex items-center gap-2 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              Nuevo costo
            </Button>
          </div>
        </CardHeader>

        {/* FILTROS (alineados a la derecha) */}
        <div className="flex flex-wrap justify-end gap-3 px-6 pb-4 bg-white">
          <Select>
            <SelectTrigger className="w-40 h-9 rounded-md border-gray-200 text-xs bg-white shadow-sm">
              <SelectValue placeholder="Todas las fechas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas las fechas</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-40 h-9 rounded-md border-gray-200 text-xs bg-white shadow-sm">
              <SelectValue placeholder="Todos los valores" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los valores</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-44 h-9 rounded-md border-gray-200 text-xs bg-white shadow-sm">
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas las categorías</SelectItem>
            </SelectContent>
          </Select>
        </div>

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
              <Table className="min-w-full">
                <TableHeader className="bg-[#E8EEF5]">
                  <TableRow className="border-0">
                    <TableHead className="text-left font-bold text-gray-900 text-xs py-4 pl-6">
                      Fecha
                    </TableHead>
                    <TableHead className="text-left font-bold text-gray-900 text-xs">
                      Tipo de gasto
                    </TableHead>
                    <TableHead className="text-left font-bold text-gray-900 text-xs">
                      Descripción
                    </TableHead>
                    <TableHead className="text-right font-bold text-gray-900 text-xs pr-6">
                      Valor
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentRows.map((g) => (
                    <TableRow
                      key={g.id}
                      className="border-b border-gray-100 hover:bg-gray-50/50"
                    >
                      <TableCell className="text-xs text-gray-800 py-4 pl-6">
                        {g.date}
                      </TableCell>
                      <TableCell className="text-xs font-bold text-[#14532D]">
                        {capitalize(g.costType)}
                      </TableCell>
                      <TableCell
                        className="text-xs text-gray-800 max-w-75 truncate"
                        title={g.description}
                      >
                        {g.description}
                      </TableCell>
                      <TableCell className="text-xs text-gray-900 text-right pr-6">
                        $ {formatMoney(g.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* PAGINACIÓN */}
          {rows.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 bg-white">
              <span className="text-xs text-gray-500">
                Página {page} de {totalPages || 1} • {rows.length} registros
              </span>
              <div className="flex gap-1.5">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 rounded border-[#B6C8E0] bg-[#EEF3FA]"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  aria-label="Página anterior"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-500" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 rounded border-[#B6C8E0] bg-[#EEF3FA]"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  aria-label="Página siguiente"
                >
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </Button>
              </div>
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
