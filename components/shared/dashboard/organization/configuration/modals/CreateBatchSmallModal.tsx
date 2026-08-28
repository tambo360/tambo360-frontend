'use client'

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
import { useState } from 'react'

interface CowItem {
  id: string
  name: string
  status: 'Sana' | 'Mastitis' | 'Preparto'
}

interface CreateBatchSmallModalProps {
  open: boolean
  onClose: () => void
  onSave?: (data: any) => void
}

const mockCows: CowItem[] = [
  { id: '001', name: 'Margarita', status: 'Sana' },
  { id: '002', name: 'Pinta', status: 'Mastitis' },
  { id: '003', name: 'Colorada', status: 'Preparto' },
]

export const CreateBatchSmallModal = ({
  open,
  onClose,
  onSave,
}: CreateBatchSmallModalProps) => {
  const [selectedCows, setSelectedCows] = useState<string[]>([])
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [produccionTotal, setProduccionTotal] = useState('')

  const handleCheckboxChange = (id: string) => {
    setSelectedCows((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleSave = () => {
    if (onSave) {
      onSave({ fecha, hora, selectedCows, produccionTotal })
    }
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white rounded-3xl p-6 shadow-xl">
        <DialogHeader className="space-y-1.5 pb-2">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Crear nuevo lote
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-500">
            Ingresa los datos para iniciar el seguimiento de producción.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Fecha y Hora */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="font-bold text-xs text-gray-700">Fecha</Label>
              <Input
                type="date"
                className="rounded-xl border-gray-200 bg-gray-50/50"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-xs text-gray-700">Hora</Label>
              <Input
                type="time"
                className="rounded-xl border-gray-200 bg-gray-50/50"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
              />
            </div>
          </div>

          {/* Selección de vacas asociadas */}
          <div className="space-y-2">
            <Label className="font-bold text-xs text-gray-700">
              Seleccionar vacas asociadas
            </Label>
            <div className="border border-blue-400 rounded-2xl p-3 space-y-3 bg-white shadow-sm">
              {mockCows.map((cow) => (
                <div
                  key={cow.id}
                  className="flex items-center justify-between py-1 px-1 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={`cow-${cow.id}`}
                      checked={selectedCows.includes(cow.id)}
                      onCheckedChange={() => handleCheckboxChange(cow.id)}
                    />
                    <label
                      htmlFor={`cow-${cow.id}`}
                      className="text-xs font-medium text-gray-800 cursor-pointer"
                    >
                      {cow.id} - {cow.name}
                    </label>
                  </div>
                  <div>
                    {cow.status === 'Sana' && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Sana ▾
                      </span>
                    )}
                    {cow.status === 'Mastitis' && (
                      <span className="text-xs font-medium text-rose-600">
                        Mastitis
                      </span>
                    )}
                    {cow.status === 'Preparto' && (
                      <span className="text-xs font-medium text-blue-600">
                        Preparto
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Producción Total Asociada */}
          <div className="space-y-2">
            <Label className="font-bold text-xs text-gray-700">
              Producción Total Asociada (Litros)
            </Label>
            <Input
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              className="rounded-xl border-gray-200 bg-gray-50/50"
              value={produccionTotal}
              onChange={(e) => setProduccionTotal(e.target.value)}
            />
          </div>

          {/* Botones de acción */}
          <DialogFooter className="flex flex-row gap-3 w-full pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex items-center justify-center w-full h-12 text-base font-bold rounded-2xl border-gray-200 text-gray-700 hover:bg-gray-50"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              className="flex items-center justify-center w-full h-12 text-base font-bold rounded-2xl bg-[#a3e635] hover:bg-[#84cc16] text-gray-900 shadow-sm"
              onClick={handleSave}
            >
              Guardar
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CreateBatchSmallModal
