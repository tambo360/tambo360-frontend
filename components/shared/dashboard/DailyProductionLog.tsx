'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useState } from 'react'
import ChangeBatch from '@/components/shared/dashboard/batch/ChangeBatch'
import { Lote } from '@/types/batch'
import { useBatchesDay } from '@/hooks/batch/useBatchesDay'

// Helper: formatea la hora de forma segura
const formatHora = (fecha?: string | null) => {
  if (!fecha) return '—'
  const hhmm = fecha.split('T')[1]
  return hhmm ? hhmm.slice(0, 5) : '—'
}

// Helper: suma de mermas
const calcularMerma = (batch: Lote) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mermas = (batch as any).mermas as
    | { cantidad?: string | number }[]
    | undefined
  if (!Array.isArray(mermas)) return 0
  return mermas.reduce((total, m) => {
    const qty =
      typeof m.cantidad === 'string'
        ? parseFloat(m.cantidad)
        : (m.cantidad ?? 0)
    return total + (isNaN(qty) ? 0 : qty)
  }, 0)
}

// Helper: suma de costos
const calcularCostoTotal = (batch: Lote) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const costos = (batch as any).costosDirectos as
    | { monto?: string | number }[]
    | undefined
  if (!Array.isArray(costos)) return 0
  return costos.reduce((total, c) => {
    const monto =
      typeof c.monto === 'string' ? parseFloat(c.monto) : (c.monto ?? 0)
    return total + (isNaN(monto) ? 0 : monto)
  }, 0)
}

const DailyProductionLog = () => {
  const [open, setOpen] = useState(false)
  const { data, error, isLoading } = useBatchesDay()

  // ✅ El array está en data.data.lotes (o data.data dependiendo del hook)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = data as any
  const lotes: Lote[] = Array.isArray(raw?.data?.lotes)
    ? raw.data.lotes.map((item: any) => item.lote ?? item)
    : Array.isArray(raw?.data)
      ? raw.data
      : []

  const hasLotes = lotes.length > 0
  const isEmpty = !isLoading && !error && lotes.length === 0

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold">Producción de hoy</h2>
          <p className="text-xs">
            {new Date().toLocaleDateString('es-ES', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            className="p-6"
            onClick={() => setOpen(true)}
          >
            Crear lote
            <Plus className="size-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {hasLotes ? (
          <Table className="rounded-md border">
            <TableHeader className="bg-tables">
              <TableRow className="border-none">
                <TableHead className="w-18 text-sm font-light text-[#707070]">
                  Lote
                </TableHead>
                <TableHead className="w-18 text-sm font-light text-[#707070]">
                  Hora
                </TableHead>
                <TableHead className="w-60 text-sm font-light text-[#707070]">
                  Producto
                </TableHead>
                <TableHead className="text-sm font-light text-[#707070]">
                  Cantidad
                </TableHead>
                <TableHead className="text-sm font-light text-[#707070]">
                  Merma
                </TableHead>
                <TableHead className="text-sm font-light text-[#707070]">
                  Costo total
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lotes.map((batch: Lote) => (
                <TableRow key={batch.idLote}>
                  <TableCell>
                    #{String(batch.numeroLote).padStart(3, '0')}
                  </TableCell>
                  <TableCell suppressHydrationWarning>
                    {formatHora(batch.fechaProduccion)}
                  </TableCell>
                  <TableCell>{batch.producto?.nombre || '—'}</TableCell>
                  <TableCell>
                    {batch.cantidad
                      ? `${Number(batch.cantidad).toLocaleString('es-AR')} ${batch.unidad || ''}`
                      : '—'}
                  </TableCell>
                  <TableCell>
                    {calcularMerma(batch).toLocaleString('es-AR')}
                  </TableCell>
                  <TableCell>
                    ${calcularCostoTotal(batch).toLocaleString('es-AR')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : null}

        {isEmpty ? (
          <div className="w-full h-36 flex justify-center items-center border border-dashed rounded-md">
            <p className="text-center text-sm text-gray-500">
              Aún no hay producción registrada hoy
            </p>
          </div>
        ) : null}

        {error ? (
          <div className="w-full h-36 flex justify-center items-center border border-dashed rounded-md">
            <p className="text-center text-sm text-red-500">
              No pudimos cargar la producción de hoy
            </p>
          </div>
        ) : null}
      </CardContent>

      <ChangeBatch
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
      />
    </Card>
  )
}

export default DailyProductionLog
