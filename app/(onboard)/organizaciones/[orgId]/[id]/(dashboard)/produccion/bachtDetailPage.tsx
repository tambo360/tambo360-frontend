'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ChevronLeft,
  Plus,
  Filter,
  MoreHorizontal,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useBatch } from '@/hooks/batch/useBatch'
import { useConfiguration } from '@/hooks/establishment/useConfiguration'
import { TipoSeguimiento } from '@/types/enums'
import { Lote } from '@/types/batch'

interface LoteConAnimales extends Lote {
  animales?: Array<{
    idAnimal: string
    codigo: string
    nombre: string
    litros: number
    estado: 'SANO' | 'MASTITIS' | 'TRATAMIENTO' | 'PREPARTO'
  }>
}

const BatchDetailPage = () => {
  const params = useParams()
  const id = params?.id as string

  const { data: batchData, isLoading, error } = useBatch({ id })
  const { data: configData, isLoading: configLoading } = useConfiguration()

  const tipoSeguimiento = configData?.data?.tipo_seguimiento as
    | TipoSeguimiento
    | undefined
  const isIndividual = tipoSeguimiento === TipoSeguimiento.INDIVIDUAL

  if (isLoading || configLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error || !batchData?.data) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <p>No se pudo cargar el lote</p>
        <p className="text-sm">{error?.message || 'ID inválido'}</p>
      </div>
    )
  }

  const batch = batchData.data as LoteConAnimales

  return (
    <div className="flex flex-col w-full gap-6 animate-in fade-in duration-300 p-4 md:p-6">
      {/* Miga de pan */}
      <div className="flex flex-col gap-1">
        <span className="text-xs text-gray-400 font-medium">
          {batch.establecimiento?.nombre || 'Tambo'}
        </span>
        <Link
          href="/produccion"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors w-fit"
        >
          <ChevronLeft className="w-4 h-4" /> Lista de producción
        </Link>
      </div>

      {/* Cabecera del Lote */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="space-y-1.5">
          <Badge
            variant="outline"
            className={`${
              batch.estado
                ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                : 'bg-green-50 text-green-700 border-green-200'
            } text-xs px-2.5 py-0.5 font-semibold`}
          >
            {batch.estado ? 'Incompleto' : 'Completo'}
          </Badge>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Lote #{batch.numeroLote || batch.idLote.slice(0, 8)} -{' '}
            {batch.producto?.nombre || 'Sin producto'}
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Fecha:{' '}
            {batch.fechaProduccion
              ? new Date(batch.fechaProduccion).toLocaleDateString('es-AR')
              : '—'}
          </p>
          {batch.cantBajadas && (
            <p className="text-xs text-gray-400">
              Cantidad de bajadas: {batch.cantBajadas}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button className="bg-[#2E7D53] hover:bg-[#236342] text-white font-semibold rounded-xl h-11 px-5 shadow-sm w-full sm:w-auto">
            Completar lote
          </Button>
          <Button
            variant="outline"
            className="border-gray-200 text-gray-700 font-semibold rounded-xl h-11 px-5 hover:bg-gray-50 w-full sm:w-auto"
          >
            Editar lote
          </Button>
        </div>
      </div>

      {/* Cards de Resumen - RESPONSIVE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-green-50 rounded-lg">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <span className="text-xs text-gray-500 font-medium">
              Cantidad Producida
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {batch.cantidad || 0}{' '}
            <span className="text-sm font-normal text-gray-500">
              {batch.unidad || 'L'}
            </span>
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span className="text-xs text-gray-500 font-medium">
              Costo Operativo Total
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${' '}
            {batch.costosDirectos
              ?.reduce((acc, c) => acc + c.monto, 0)
              .toLocaleString('es-AR') || '0'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-orange-50 rounded-lg">
              <svg
                className="w-5 h-5 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <span className="text-xs text-gray-500 font-medium">
              Merma Registrada
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {batch.mermas
              ?.reduce((acc, m) => acc + m.cantidad, 0)
              .toLocaleString('es-AR') || 0}{' '}
            L
          </p>
        </div>
      </div>

      {/* Observaciones */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-base font-bold text-gray-900 mb-2">
          Observaciones
        </h3>
        <p className="text-sm text-gray-500">Sin observaciones.</p>
      </div>

      {/* Historial de Mermas - RESPONSIVE */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-900">
            Historial de Mermas
          </h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
            </Button>
            <Button className="bg-[#2E7D53] hover:bg-[#236342] text-white text-xs font-semibold h-9 rounded-lg gap-1.5 px-3.5 shadow-sm">
              <Plus className="w-4 h-4" /> Agregar Merma
            </Button>
          </div>
        </div>

        {/* Tabla Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="text-xs font-bold text-gray-400 uppercase py-3.5 pl-6">
                  Fecha
                </TableHead>
                <TableHead className="text-xs font-bold text-gray-400 uppercase">
                  Tipo
                </TableHead>
                <TableHead className="text-xs font-bold text-gray-400 uppercase">
                  Cantidad
                </TableHead>
                <TableHead className="text-xs font-bold text-gray-400 uppercase">
                  Observación
                </TableHead>
                <TableHead className="text-xs font-bold text-gray-400 uppercase text-right pr-6">
                  Acción
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batch.mermas && batch.mermas.length > 0 ? (
                batch.mermas.map((merma) => (
                  <TableRow
                    key={merma.idMerma}
                    className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                  >
                    <TableCell className="text-xs text-gray-600 font-medium pl-6 py-4">
                      {new Date(merma.fecha).toLocaleDateString('es-AR')}
                    </TableCell>
                    <TableCell className="text-xs text-gray-600 font-medium">
                      {merma.tipo || '—'}
                    </TableCell>
                    <TableCell className="text-xs text-gray-600 font-medium">
                      {merma.cantidad || 0} L
                    </TableCell>
                    <TableCell className="text-xs text-gray-600 font-medium max-w-xs truncate">
                      {merma.observacion || '—'}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-gray-600"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-gray-400"
                  >
                    No hay mermas registradas para este lote.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Cards Mobile */}
        <div className="md:hidden p-4 space-y-3">
          {batch.mermas && batch.mermas.length > 0 ? (
            batch.mermas.map((merma) => (
              <div
                key={merma.idMerma}
                className="border border-gray-200 rounded-xl p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {new Date(merma.fecha).toLocaleDateString('es-AR')}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-gray-400"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {merma.tipo || '—'}
                </p>
                <p className="text-sm text-gray-600">{merma.cantidad || 0} L</p>
                <p className="text-xs text-gray-500">
                  {merma.observacion || '—'}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center py-8 text-gray-400 text-sm">
              No hay mermas registradas.
            </p>
          )}
        </div>
      </div>

      {/* Historial de Costos - RESPONSIVE (mismo patrón) */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-900">
            Historial de Costos
          </h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
            </Button>
            <Button className="bg-[#2E7D53] hover:bg-[#236342] text-white text-xs font-semibold h-9 rounded-lg gap-1.5 px-3.5 shadow-sm">
              <Plus className="w-4 h-4" /> Agregar Costo
            </Button>
          </div>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="text-xs font-bold text-gray-400 uppercase py-3.5 pl-6">
                  Fecha
                </TableHead>
                <TableHead className="text-xs font-bold text-gray-400 uppercase">
                  Tipo
                </TableHead>
                <TableHead className="text-xs font-bold text-gray-400 uppercase">
                  Cantidad
                </TableHead>
                <TableHead className="text-xs font-bold text-gray-400 uppercase">
                  Observación
                </TableHead>
                <TableHead className="text-xs font-bold text-gray-400 uppercase text-right pr-6">
                  Acción
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batch.costosDirectos && batch.costosDirectos.length > 0 ? (
                batch.costosDirectos.map((costo) => (
                  <TableRow
                    key={costo.idCostoDirecto}
                    className="border-b border-gray-100 hover:bg-gray-50/50"
                  >
                    <TableCell className="text-xs text-gray-600 font-medium pl-6 py-4">
                      {new Date(costo.fechaCreacion).toLocaleDateString(
                        'es-AR'
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-gray-600 font-medium">
                      {costo.concepto || '—'}
                    </TableCell>
                    <TableCell className="text-xs text-gray-600 font-medium">
                      $ {costo.monto?.toLocaleString('es-AR') || 0}
                    </TableCell>
                    <TableCell className="text-xs text-gray-600 font-medium max-w-xs truncate">
                      {costo.observaciones || '—'}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-gray-600"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-gray-400"
                  >
                    No hay costos registrados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="md:hidden p-4 space-y-3">
          {batch.costosDirectos && batch.costosDirectos.length > 0 ? (
            batch.costosDirectos.map((costo) => (
              <div
                key={costo.idCostoDirecto}
                className="border border-gray-200 rounded-xl p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {new Date(costo.fechaCreacion).toLocaleDateString('es-AR')}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-gray-400"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {costo.concepto || '—'}
                </p>
                <p className="text-sm text-gray-600">
                  $ {costo.monto?.toLocaleString('es-AR') || 0}
                </p>
                <p className="text-xs text-gray-500">
                  {costo.observaciones || '—'}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center py-8 text-gray-400 text-sm">
              No hay costos registrados.
            </p>
          )}
        </div>
      </div>

      {/* Botón Eliminar */}
      <div className="flex justify-center pt-2 pb-6">
        <Button
          variant="outline"
          className="w-full max-w-md border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 h-12 rounded-xl transition-colors font-medium"
        >
          Eliminar lote
        </Button>
      </div>
    </div>
  )
}

export default BatchDetailPage
