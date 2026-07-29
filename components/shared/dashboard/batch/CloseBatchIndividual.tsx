'use client'

/*
  TODO GENERAL (pendiente de backend): mismo caso que
  ChangeBatchIndividual.tsx — no existe endpoint de animales, ni forma de
  saber si el establecimiento usa seguimiento INDIVIDUAL. La tabla de
  abajo usa `mockCierres`, 100% inventado para armar la vista. El botón
  "Cerrar" no llama a ningún hook real todavía.
*/

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '@/components/ui/table'

interface CloseBatchIndividualProps {
  open: boolean
  onClose: () => void
}

interface CierreMock {
  fecha: string
  hora: string
  vacasAsociadas: string
  produccionTotal: string
}

// Mock — pendiente de endpoint real (ver TODO arriba)
const mockCierres: CierreMock[] = [
  {
    fecha: '11Jun2026',
    hora: '7:00 am',
    vacasAsociadas: 'Margarita',
    produccionTotal: '300 Lts',
  },
  {
    fecha: '20Jun2026',
    hora: '7:00 am',
    vacasAsociadas: 'Margarita',
    produccionTotal: '300 Lts',
  },
  {
    fecha: '29Jun2026',
    hora: '7:00 am',
    vacasAsociadas: 'Margarita',
    produccionTotal: '300 Lts',
  },
]

const CloseBatchIndividual = ({ open, onClose }: CloseBatchIndividualProps) => {
  const handleCerrar = () => {
    // TODO: reemplazar por el hook real de cierre para el flujo INDIVIDUAL
    console.warn('Cerrar lote (individual): pendiente de conectar a backend')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader className="border-b p-2">
          <DialogTitle className="text-[28px] font-bold text-black">
            Cerrar Lote
          </DialogTitle>
          <DialogDescription>
            Revisa el resumen detallado antes de finalizar la jornada
            productiva.
          </DialogDescription>
        </DialogHeader>

        <div className="border rounded-xl overflow-hidden">
          <Table>
            <TableHeader className="bg-tables">
              <TableRow>
                <TableHead className="text-xs font-bold text-gray-400 uppercase">
                  Fecha
                </TableHead>
                <TableHead className="text-xs font-bold text-gray-400 uppercase">
                  Hora
                </TableHead>
                <TableHead className="text-xs font-bold text-gray-400 uppercase">
                  Vacas Asociadas
                </TableHead>
                <TableHead className="text-xs font-bold text-gray-400 uppercase">
                  Producción Total
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCierres.map((c, i) => (
                <TableRow key={i}>
                  <TableCell>{c.fecha}</TableCell>
                  <TableCell>{c.hora}</TableCell>
                  <TableCell>{c.vacasAsociadas}</TableCell>
                  <TableCell>{c.produccionTotal}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            className="w-full h-14 text-lg font-bold"
            onClick={onClose}
          >
            Cancelar
          </Button>

          <Button
            className="w-full h-14 text-lg font-bold"
            onClick={handleCerrar}
          >
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CloseBatchIndividual
