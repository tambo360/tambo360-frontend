'use client'

import { useState, useMemo } from 'react'
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CloudOff,
  Pencil,
  Trash2,
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

const GeneralCosts = () => {
  const [openRegister, setOpenRegister] = useState(false)
  const { period, label, isCurrentMonth, goPrev, goNext } = useMonthPeriod()
  const { data: costsData, isPending: isCostsPending } = useGeneralCosts(period)
  const { data: summary } = useGeneralCostsSummary(period)

  // Paginación Local
  const [page, setPage] = useState(1)
  const ITEMS_PER_PAGE = 5

  const onNewCostClick = () => setOpenRegister(true)

  const rawCosts: GeneralCost[] = extractCosts(costsData)

  const rows: GeneralCostRow[] = rawCosts.map((c) => ({
    id: c.idCostoGeneral,
    date: formatShortDate(c.fecha),
    costType: c.tipoCosto,
    description: c.descripcion ?? '-',
    amount: Number(c.monto),
    isAutomatic:
      c.tipoCosto === 'ALIMENTACION' || c.idCostoGeneral === 'alimentacion',
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

  // Handlers para Editar y Eliminar
  const handleEdit = (id: string) => {
    alert(`Editar gasto ID: ${id}`)
  }

  const handleDelete = (id: string) => {
    if (confirm('¿Seguro que querés eliminar este gasto?')) {
      alert(`Eliminar gasto ID: ${id}`)
    }
  }

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
            className="h-8 w-8 rounded-lg border-gray-200 bg-white"
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
        <div className="bg-linear-to-br from-white to-[#f0f9ff] border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold text-gray-500">
            Costos de alimentación
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-2">
            $ {foodCostValue.toLocaleString('es-AR')}
          </h2>
          <span className="text-xs text-green-600 font-medium mt-2">
            +12% vs mes anterior
          </span>
        </div>

        <div className="bg-linear-to-br from-white to-[#f0f9ff] border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold text-gray-500">
            Otros costos
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-2">
            $ {generalCostsValue.toLocaleString('es-AR')}
          </h2>
          <span className="text-xs text-green-600 font-medium mt-2">
            Fijos 65% · Var 35%
          </span>
        </div>

        <div className="bg-linear-to-br from-white to-[#f0f9ff] border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold text-gray-500">
            Costo Prorrateo/Lote
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-2">
            ${prorrateoValue.toFixed(2)}/Lt
          </h2>
          <span className="text-xs text-green-600 font-medium mt-2">
            +12% vs mes anterior
          </span>
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
              className="bg-[#659711] hover:bg-[#537d0d] text-white font-semibold rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              Nuevo costo
            </Button>
          </div>
        </CardHeader>

        {/* FILTROS */}
        <div className="flex flex-wrap gap-3 p-6 bg-white border-b border-gray-100">
          <Select>
            <SelectTrigger className="w-45 h-9 rounded-lg border-gray-200 text-xs bg-white">
              <SelectValue placeholder="Todas las fechas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas las fechas</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-45 h-9 rounded-lg border-gray-200 text-xs bg-white">
              <SelectValue placeholder="Todos los valores" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los valores</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-45 h-9 rounded-lg border-gray-200 text-xs bg-white">
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
                  <TableRow>
                    <TableHead className="text-left font-bold text-gray-600 text-xs py-4 pl-6">
                      Fecha
                    </TableHead>
                    <TableHead className="text-left font-bold text-gray-600 text-xs">
                      Tipo de gasto
                    </TableHead>
                    <TableHead className="text-left font-bold text-gray-600 text-xs">
                      Descripción
                    </TableHead>
                    <TableHead className="text-right font-bold text-gray-600 text-xs">
                      Valor
                    </TableHead>
                    <TableHead className="text-center font-bold text-gray-600 text-xs pr-6">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentRows.map((g) => (
                    <TableRow
                      key={g.id}
                      className="border-b border-gray-100 hover:bg-gray-50/50"
                    >
                      <TableCell className="text-xs font-bold text-gray-800 py-4 pl-6">
                        {g.date}
                      </TableCell>
                      <TableCell className="text-xs">
                        <span className="inline-block bg-[#29845A]/10 text-[#29845A] font-semibold px-3 py-1 rounded-full text-[11px]">
                          {capitalize(g.costType)}
                        </span>
                      </TableCell>
                      <TableCell
                        className="text-xs font-medium text-gray-600 max-w-50 truncate"
                        title={g.description}
                      >
                        {g.description}
                      </TableCell>
                      <TableCell className="text-xs font-extrabold text-gray-900 text-right">
                        $ {g.amount.toLocaleString('es-AR')}
                      </TableCell>
                      <TableCell className="text-center pr-6">
                        {!g.isAutomatic ? (
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleEdit(g.id)}
                            >
                              <Pencil className="w-4 h-4 text-gray-500 hover:text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleDelete(g.id)}
                            >
                              <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-600" />
                            </Button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-gray-400 font-medium">
                            Automático
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* PAGINACIÓN */}
          {rows.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white">
              <span className="text-xs text-gray-500">
                Página {page} de {totalPages || 1}
              </span>
              <div className="flex gap-1.5">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 rounded border-gray-200"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="w-4 h-4 text-gray-500" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 rounded border-gray-200"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
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
