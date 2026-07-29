'use client'

/*
  TODO GENERAL (pendiente de backend + de definición de producto):
  Este componente es NUEVO — no existía ningún formulario para el flujo
  "INDIVIDUAL" (por animal) en el proyecto. ChangeBatch.tsx (el formulario
  que ya está conectado) solo soporta el flujo "RODEO".

  El backend SÍ soporta este modo (ver batch_README.md, POST /lote con
  tipoSeguimiento: "INDIVIDUAL" y un array `animales[]`), pero en el
  frontend falta:

  1. Saber si el establecimiento está configurado como RODEO o INDIVIDUAL
     (no hay ningún campo `tipoSeguimiento` leído en ningún hook/tipo
     del frontend todavía) — de eso depende cuál de los 2 formularios
     mostrar.
  2. Un endpoint + hook real para listar los animales del establecimiento
     con su estado (Sana/Mastitis/Preparto/etc). Hoy no existe
     `hooks/animal` ni `utils/api/animal.api.ts`. La lista de abajo
     (`mockVacas`) es 100% inventada para poder armar la vista.
  3. Extender `BatchSchema` (types/batch.ts) para aceptar el modo
     INDIVIDUAL (hoy exige `idRodeo` siempre, sin importar el modo).
  4. Conectar el submit real a `useCreateBatch` con el payload
     `tipoSeguimiento: 'INDIVIDUAL'` + `animales`.

  Por ahora el botón "Guardar" solo cierra el modal (ver handleGuardar).
*/

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { AlertCircle } from 'lucide-react'
import { useMemo, useState } from 'react'

interface ChangeBatchIndividualProps {
  open: boolean
  onClose: () => void
}

type EstadoVacaMock = 'Sana' | 'Mastitis' | 'Preparto'

interface VacaMock {
  id: string
  numero: string
  nombre: string
  estado: EstadoVacaMock
  litrosPromedio: number
}

// Mock — pendiente de un endpoint real de animales (ver TODO arriba)
const mockVacas: VacaMock[] = [
  {
    id: '1',
    numero: '001',
    nombre: 'Margarita',
    estado: 'Sana',
    litrosPromedio: 18,
  },
  {
    id: '2',
    numero: '002',
    nombre: 'Pinta',
    estado: 'Mastitis',
    litrosPromedio: 12,
  },
  {
    id: '3',
    numero: '003',
    nombre: 'Colorada',
    estado: 'Preparto',
    litrosPromedio: 0,
  },
]

const estadoColor: Record<EstadoVacaMock, string> = {
  Sana: 'text-green-main',
  Mastitis: 'text-red-main',
  Preparto: 'text-blue-500',
}

const ChangeBatchIndividual = ({
  open,
  onClose,
}: ChangeBatchIndividualProps) => {
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [seleccionadas, setSeleccionadas] = useState<string[]>([])
  const [produccionTotal, setProduccionTotal] = useState('')

  const toggleVaca = (id: string) => {
    setSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    )
  }

  const sumaSugerida = useMemo(
    () =>
      mockVacas
        .filter((v) => seleccionadas.includes(v.id))
        .reduce((total, v) => total + v.litrosPromedio, 0),
    [seleccionadas]
  )

  const handleGuardar = () => {
    // TODO: reemplazar por useCreateBatch real con tipoSeguimiento INDIVIDUAL
    console.warn('Crear lote (individual): pendiente de conectar a backend', {
      fecha,
      hora,
      vacas: seleccionadas,
      produccionTotal,
    })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader className="border-b p-2">
          <DialogTitle className="text-[32px] font-bold text-black">
            Crear nuevo lote
          </DialogTitle>
          <DialogDescription>
            Ingresa los datos para iniciar el seguimiento de producción.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2 w-full">
            <div className="space-y-2 w-full">
              <Label className="font-bold">Fecha</Label>
              <Input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
            </div>

            {/*
              TODO (pendiente de backend): el campo "Hora" tampoco existe
              en este flujo — mismo pendiente que en ChangeBatch.tsx.
            */}
            <div className="space-y-2 w-full">
              <Label className="font-bold">Hora</Label>
              <Input
                type="time"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-bold">Seleccionar vacas asociadas</Label>
            <div className="border rounded-lg divide-y">
              {mockVacas.map((vaca) => (
                <label
                  key={vaca.id}
                  className="flex items-center justify-between gap-3 px-3 py-2 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={seleccionadas.includes(vaca.id)}
                      onCheckedChange={() => toggleVaca(vaca.id)}
                    />
                    <span className="text-sm">
                      {vaca.numero} - {vaca.nombre}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold ${estadoColor[vaca.estado]}`}
                  >
                    {vaca.estado}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-bold">
              Producción Total Asociada (Litros)
            </Label>
            <Input
              type="text"
              inputMode="decimal"
              placeholder={
                sumaSugerida > 0 ? `Sugerido: ${sumaSugerida}` : '0.00'
              }
              value={produccionTotal}
              onChange={(e) => setProduccionTotal(e.target.value)}
            />
          </div>

          <span className="flex items-center gap-2 text-xs">
            <AlertCircle className="size-5" /> Verifica que los datos sean
            correctos antes de crear el lote.
          </span>

          <DialogFooter className="flex flex-row gap-2 w-full">
            <Button
              type="button"
              variant="outline"
              className="flex items-center justify-center w-full h-16 text-xl font-bold"
              onClick={onClose}
            >
              Cancelar
            </Button>

            <Button
              className="flex items-center justify-center w-full h-16 text-xl font-bold"
              onClick={handleGuardar}
            >
              Guardar
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ChangeBatchIndividual
