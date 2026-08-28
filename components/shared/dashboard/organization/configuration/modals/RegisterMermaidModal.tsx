'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AlertCircle } from 'lucide-react'
import { useState } from 'react'

interface RegisterMermaidModalProps {
  open: boolean
  onClose: () => void
  onSave?: (data: any) => void
}

export const RegisterMermaidModal = ({
  open,
  onClose,
  onSave,
}: RegisterMermaidModalProps) => {
  const [motivo, setMotivo] = useState('')
  const [cantidad, setCantidad] = useState('')

  const handleSave = () => {
    if (onSave) {
      onSave({ motivo, cantidad })
    }
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white rounded-3xl p-6 shadow-xl">
        <DialogHeader className="space-y-1.5 pb-3 border-b border-blue-400">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Registrar merma
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-500">
            Ingresa los datos para asociar la merma a un lote de produccion
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Motivo de merma */}
          <div className="space-y-2">
            <Label className="font-bold text-xs text-gray-700">
              Motivo de merma *
            </Label>
            <Select value={motivo} onValueChange={setMotivo}>
              <SelectTrigger className="w-full rounded-xl border-gray-200 bg-gray-50/50 text-gray-500">
                <SelectValue placeholder="Seleccionar tipo de merma" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="producto_vencido">
                    Producto vencido
                  </SelectItem>
                  <SelectItem value="falla_frio">
                    Falla en cadena de frío
                  </SelectItem>
                  <SelectItem value="rotura_envase">
                    Rotura de envase
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Merma (Kg/L) */}
          <div className="space-y-2">
            <Label className="font-bold text-xs text-gray-700">
              Merma (Kg/L) *
            </Label>
            <Input
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              className="rounded-xl border-gray-200 bg-gray-50/50"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
            />
            <p className="text-[11px] text-gray-400 pt-0.5">
              Este valor se restará del stock disponible sin modificar la
              producción original
            </p>
          </div>

          {/* Advertencia informativa */}
          <div className="flex items-center gap-2 text-xs text-gray-600 pt-1">
            <AlertCircle className="size-4 text-gray-500 shrink-0" />
            <span>
              Verifica que los datos sean correctos antes de registrar la merma
            </span>
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

export default RegisterMermaidModal
