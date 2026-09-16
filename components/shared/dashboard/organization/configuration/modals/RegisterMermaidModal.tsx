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
import { AlertCircle, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Schema de validación
const MermaSchema = z.object({
  motivo: z.string().min(1, 'Debe seleccionar un motivo'),
  cantidad: z.coerce.number().positive('La cantidad debe ser mayor a 0'),
})

type MermaFormData = z.infer<typeof MermaSchema>

interface RegisterMermaModalProps {
  open: boolean
  onClose: () => void
  onSave?: (data: MermaFormData) => void
  isLoading?: boolean
}

export const RegisterMermaModal = ({
  open,
  onClose,
  onSave,
  isLoading = false,
}: RegisterMermaModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<MermaFormData>({
    resolver: zodResolver(MermaSchema),
  })

  const onSubmit = (data: MermaFormData) => {
    if (onSave) {
      onSave(data)
    }
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white rounded-3xl p-6 shadow-xl">
        <DialogHeader className="space-y-1.5 pb-3 border-b border-gray-200">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Registrar merma
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-500">
            Ingresa los datos para asociar la merma a un lote de producción
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label className="font-bold text-xs text-gray-700">
              Motivo de merma *
            </Label>
            <Select
              value={watch('motivo')}
              onValueChange={(e) => setValue('motivo', e)}
            >
              <SelectTrigger className="w-full rounded-xl border-gray-200 bg-gray-50/50">
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
            {errors.motivo && (
              <span className="text-xs text-red-600">
                {errors.motivo.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <Label className="font-bold text-xs text-gray-700">
              Merma (Kg/L) *
            </Label>
            <Input
              type="number"
              inputMode="decimal"
              step="0.01"
              placeholder="0.00"
              className="rounded-xl border-gray-200 bg-gray-50/50"
              {...register('cantidad')}
            />
            {errors.cantidad && (
              <span className="text-xs text-red-600">
                {errors.cantidad.message}
              </span>
            )}
            <p className="text-[11px] text-gray-400 pt-0.5">
              Este valor se restará del stock disponible sin modificar la
              producción original
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-600 pt-1">
            <AlertCircle className="size-4 text-gray-500 shrink-0" />
            <span>
              Verifica que los datos sean correctos antes de registrar la merma
            </span>
          </div>

          <DialogFooter className="flex flex-row gap-3 w-full pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-12 text-base font-bold rounded-2xl border-gray-200 text-gray-700 hover:bg-gray-50"
              onClick={() => {
                reset()
                onClose()
              }}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 text-base font-bold rounded-2xl bg-[#2E7D53] hover:bg-[#236342] text-white shadow-sm disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Guardar'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default RegisterMermaModal
