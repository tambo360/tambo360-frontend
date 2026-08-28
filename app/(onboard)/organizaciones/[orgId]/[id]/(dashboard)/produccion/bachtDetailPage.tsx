'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Plus, Filter, MoreHorizontal } from 'lucide-react'
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

const BatchDetailPage = () => {
  const params = useParams()
  const id = params?.id as string

  return (
    <div className="flex flex-col w-full gap-6 animate-in fade-in duration-300">
      {/* Miga de pan / Navegación superior */}
      <div className="flex flex-col gap-1">
        <span className="text-xs text-gray-400 font-medium">
          Tambo La Esperanza
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
            variant="destructive"
            className="bg-rose-100 text-rose-800 text-xs px-2.5 py-0.5 font-semibold hover:bg-rose-100"
          >
            Incompleto
          </Badge>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Lote {id || '001'} - Leche entera
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Inicio: 16/02/2026
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button className="bg-[#2E7D53] hover:bg-[#236342] text-white font-semibold rounded-xl h-11 px-5 shadow-sm">
            Completar lote
          </Button>
          <Button
            variant="outline"
            className="border-gray-200 text-gray-700 font-semibold rounded-xl h-11 px-5 hover:bg-gray-50"
          >
            Editar lote
          </Button>
        </div>
      </div>

      {/* Sección: Historial de Producción */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-900">
            Historial de Producción
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
              <Plus className="w-4 h-4" /> Agregar Producción
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="text-xs font-bold text-gray-400 uppercase py-3.5 pl-6">
                RP/Nº
              </TableHead>
              <TableHead className="text-xs font-bold text-gray-400 uppercase">
                Nombre
              </TableHead>
              <TableHead className="text-xs font-bold text-gray-400 uppercase">
                Litros
              </TableHead>
              <TableHead className="text-xs font-bold text-gray-400 uppercase">
                Estados
              </TableHead>
              <TableHead className="text-xs font-bold text-gray-400 uppercase text-right pr-6">
                Acción
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
              <TableCell className="text-xs font-medium text-gray-800 pl-6 py-4">
                001
              </TableCell>
              <TableCell className="text-xs text-gray-600 font-medium">
                Queso
              </TableCell>
              <TableCell className="text-xs text-gray-600 font-medium">
                80 L
              </TableCell>
              <TableCell className="text-xs text-gray-600 font-medium">
                Completado
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
          </TableBody>
        </Table>
      </div>

      {/* Sección: Historial de Mermas */}
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
                Observacion
              </TableHead>
              <TableHead className="text-xs font-bold text-gray-400 uppercase text-right pr-6">
                Acción
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
              <TableCell className="text-xs text-gray-600 font-medium pl-6 py-4">
                16/02/2026
              </TableCell>
              <TableCell className="text-xs text-gray-600 font-medium">
                Producto vencido
              </TableCell>
              <TableCell className="text-xs text-gray-600 font-medium">
                80 L
              </TableCell>
              <TableCell className="text-xs text-gray-600 font-medium max-w-xs truncate">
                Caducidad por falla en la cadena de frío durante almacenamiento.
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
          </TableBody>
        </Table>
      </div>

      {/* Botón Inferior de Eliminar Lote */}
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
