'use client'
import React, { useState } from 'react'
import { Wallet, Search, X, ArrowUp, ArrowDown, CloudOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import { StatCard } from '@/components/shared/StatCard'
import { TIPO_COSTO_LABELS } from '@/types/cost'
import { TipoCosto } from '@/types/enums'

// TODO (pendiente de backend): no existe todavía un endpoint que agregue
// costos de TODOS los lotes de un establecimiento (solo hay costos por
// lote individual vía batch.costosDirectos, ver CostTable.tsx).
// Mientras tanto se usan datos mockeados para poder maquetar la vista
// según Figma. Reemplazar `mockCostos` por un hook real (ej. useCostosGenerales)
// apuntando a algo como GET /costos/establecimiento/:id cuando exista.

interface CostoGeneral {
  idCostoDirecto: string
  fechaCreacion: string
  tipoCosto: TipoCosto
  monto: number
  loteNombre: string
  observaciones?: string
}

const mockCostos: CostoGeneral[] = [
  {
    idCostoDirecto: '1',
    fechaCreacion: '2026-08-01',
    tipoCosto: 'ALIMENTACION' as TipoCosto,
    monto: 152000,
    loteNombre: '#001',
    observaciones: 'Compra de forraje mensual',
  },
  {
    idCostoDirecto: '2',
    fechaCreacion: '2026-08-02',
    tipoCosto: 'SANIDAD' as TipoCosto,
    monto: 48000,
    loteNombre: '#002',
    observaciones: 'Vacunación del rodeo',
  },
  {
    idCostoDirecto: '3',
    fechaCreacion: '2026-08-03',
    tipoCosto: 'MANO_OBRA' as TipoCosto,
    monto: 210000,
    loteNombre: '#001',
    observaciones: 'Pago quincenal personal de ordeñe',
  },
  {
    idCostoDirecto: '4',
    fechaCreacion: '2026-08-03',
    tipoCosto: 'ENERGIA' as TipoCosto,
    monto: 67500,
    loteNombre: '#003',
    observaciones: 'Consumo eléctrico tambo',
  },
  {
    idCostoDirecto: '5',
    fechaCreacion: '2026-08-04',
    tipoCosto: 'MANTENIMIENTO' as TipoCosto,
    monto: 39000,
    loteNombre: '#002',
    observaciones: 'Reparación ordeñadora',
  },
  {
    idCostoDirecto: '6',
    fechaCreacion: '2026-08-04',
    tipoCosto: 'LOGISTICA' as TipoCosto,
    monto: 58000,
    loteNombre: '#003',
    observaciones: 'Flete distribución',
  },
]

const CostosGenerales: React.FC = () => {
  const [busqueda, setBusqueda] = useState('')
  const [orden, setOrden] = useState<'asc' | 'desc'>('desc')

  const totalCostos = mockCostos.reduce((acc, c) => acc + c.monto, 0)

  const totalPorTipo = (tipo: TipoCosto) =>
    mockCostos
      .filter((c) => c.tipoCosto === tipo)
      .reduce((acc, c) => acc + c.monto, 0)

  const costosFiltrados = mockCostos
    .filter(
      (c) =>
        c.loteNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        (c.observaciones ?? '')
          .toLowerCase()
          .includes(busqueda.toLowerCase()) ||
        TIPO_COSTO_LABELS[c.tipoCosto]
          ?.toLowerCase()
          .includes(busqueda.toLowerCase())
    )
    .sort((a, b) =>
      orden === 'asc'
        ? a.fechaCreacion.localeCompare(b.fechaCreacion)
        : b.fechaCreacion.localeCompare(a.fechaCreacion)
    )

  return (
    <div className="flex flex-col w-full gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Costos Generales
          </h1>
          <p className="text-muted-foreground text-sm">
            Resumen de costos de todos los lotes del establecimiento
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <StatCard
          title="Costos totales"
          value={totalCostos}
          unit="$ "
          description="Mock — pendiente endpoint backend"
          isPending={false}
        />
        <StatCard
          title="Alimentación"
          value={totalPorTipo('ALIMENTACION' as TipoCosto)}
          unit="$ "
          isPending={false}
        />
        <StatCard
          title="Mano de Obra"
          value={totalPorTipo('MANO_OBRA' as TipoCosto)}
          unit="$ "
          isPending={false}
        />
        <StatCard
          title="Sanidad"
          value={totalPorTipo('SANIDAD' as TipoCosto)}
          unit="$ "
          isPending={false}
        />
      </div>

      <Card className="border-gray-200 shadow-sm overflow-hidden rounded-2xl bg-white gap-0 py-0">
        <CardHeader className="border-b border-gray-100 bg-white p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col gap-3">
              <CardTitle className="text-lg font-bold">
                Detalle de costos
              </CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString('es-ES', {
                  month: 'long',
                  year: 'numeric',
                })}
              </CardDescription>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                <Input
                  className="pl-10 w-full md:w-60 bg-gray-50 border-gray-200 rounded-lg"
                  placeholder="Buscar costo..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
                {busqueda && (
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400"
                    onClick={() => setBusqueda('')}
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="border-gray-200 bg-gray-50 rounded-lg"
                onClick={() =>
                  setOrden((prev) => (prev === 'asc' ? 'desc' : 'asc'))
                }
              >
                {orden === 'asc' ? (
                  <ArrowUp className="w-4 h-4 text-gray-600" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-gray-600" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {costosFiltrados.length === 0 ? (
            <div className="flex flex-col lg:flex-row items-center justify-center py-16 px-6 gap-12 bg-white w-full">
              <div className="flex flex-col items-center justify-center rounded-3xl p-12 text-center max-w-md w-full">
                <div className="w-20 h-20 bg-[#F1F5F9] rounded-md flex items-center justify-center mb-6">
                  <CloudOff className="w-10 h-10 text-[#94A3B8]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Sin resultados
                </h3>
                <p className="text-sm text-[#94A3B8]">
                  No se encontraron costos con ese criterio de búsqueda.
                </p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-tables">
                <TableRow>
                  <TableHead className="w-[10%] text-left font-bold text-gray-400 uppercase text-xs tracking-wider">
                    Fecha
                  </TableHead>
                  <TableHead className="w-[10%] text-left font-bold text-gray-400 uppercase text-xs tracking-wider">
                    Lote
                  </TableHead>
                  <TableHead className="w-[15%] text-left font-bold text-gray-400 uppercase text-xs tracking-wider">
                    Tipo
                  </TableHead>
                  <TableHead className="w-[15%] text-left font-bold text-gray-400 uppercase text-xs tracking-wider">
                    Monto
                  </TableHead>
                  <TableHead className="w-[50%] text-left font-bold text-gray-400 uppercase text-xs tracking-wider">
                    Observación
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {costosFiltrados.map((c) => (
                  <TableRow key={c.idCostoDirecto}>
                    <TableCell suppressHydrationWarning>
                      {c.fechaCreacion.split('-').reverse().join('/')}
                    </TableCell>
                    <TableCell>{c.loteNombre}</TableCell>
                    <TableCell>
                      {TIPO_COSTO_LABELS[c.tipoCosto] || c.tipoCosto}
                    </TableCell>
                    <TableCell>$ {c.monto.toLocaleString('es-AR')}</TableCell>
                    <TableCell>{c.observaciones || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default CostosGenerales
