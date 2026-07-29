'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Plus, Download } from 'lucide-react'
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

const DailyProductionLog = () => {
  const [open, setOpen] = useState(false)
  const { data, error } = useBatchesDay()

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

          {/*
            TODO (pendiente de backend): no existe endpoint de exportación.
            Botón visual mockeado por ahora, sin funcionalidad real todavía.
          */}
          <Button
            variant="darkGreen"
            className="p-6"
            onClick={() =>
              console.warn('Exportar CSV: pendiente de endpoint en backend')
            }
          >
            Exportar CSV
            <Download className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {(data?.data?.length > 0 || data?.data !== null || !error) && (
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
              {data?.data?.length > 0 &&
                data?.data?.map((batch: Lote) => (
                  <TableRow key={batch.idLote}>
                    <TableCell>
                      #{String(batch.numeroLote).padStart(3, '0')}
                    </TableCell>

                    <TableCell suppressHydrationWarning>
                      {batch.fechaProduccion.split('T')[1].slice(0, 5)}
                    </TableCell>
                    <TableCell>{batch.producto?.nombre}</TableCell>
                    <TableCell>
                      {batch.cantidad} {batch.unidad}
                    </TableCell>
                    <TableCell>
                      {batch.mermas?.reduce((total, m) => {
                        const qty =
                          typeof m.cantidad === 'string'
                            ? parseFloat(m.cantidad)
                            : (m.cantidad ?? 0)
                        return total + qty
                      }, 0)}
                    </TableCell>
                    <TableCell>
                      {(batch.costosDirectos &&
                        batch.costosDirectos.length > 0) ||
                        '$'}{' '}
                      {batch.costosDirectos?.reduce((total, m) => {
                        const qty =
                          typeof m.monto === 'string'
                            ? parseFloat(m.monto)
                            : (m.monto ?? 0)
                        return total + qty
                      }, 0)}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}

        {(data?.data?.length === 0 || data?.data === null || error) && (
          <div className="w-full h-36 flex justify-center items-center border border-dashed">
            <p className="text-center">Aún no hay producción registrada hoy</p>
          </div>
        )}
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
