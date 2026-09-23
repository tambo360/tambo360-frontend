'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Info, Calendar, Clock } from 'lucide-react'
import { DecreaseData } from '@/types/decrease'
import { useDecreaseForm } from '@/hooks/decrease/useDecreaseForm'

interface RegisterMermaModalProps {
  open: boolean
  onClose: () => void
  onSave: (data: DecreaseData) => Promise<void>
  isLoading?: boolean
}

const RegisterMermaModal = ({
  open,
  onClose,
  onSave,
  isLoading = false,
}: RegisterMermaModalProps) => {
  const {
    types,
    typesLoading,
    fecha,
    hora,
    tipo,
    setTipo,
    cantidad,
    setCantidad,
    observacion,
    setObservacion,
    errors,
    handleSubmit,
  } = useDecreaseForm({ open, onSave })

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95%] sm:max-w-[560px] p-0 overflow-hidden bg-white rounded-3xl border-0 shadow-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Header */}
          <DialogHeader className="px-8 pt-8 pb-2">
            <DialogTitle className="text-3xl font-bold text-gray-900">
              Registrar merma
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mt-1">
              Ingresa los datos para asociar la merma a un lote de producción
            </DialogDescription>
            <div className="w-full border-b border-gray-100 pt-3" />
          </DialogHeader>

          {/* Body */}
          <div className="px-8 py-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Fecha + Hora con Iconos */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="fecha"
                  className="text-sm font-semibold text-gray-700"
                >
                  Fecha
                </Label>
                <div className="relative flex items-center">
                  <Input
                    id="fecha"
                    type="date"
                    value={fecha}
                    readOnly
                    tabIndex={-1}
                    className="h-11 w-full bg-gray-50 border-gray-200 rounded-xl text-gray-700 cursor-default focus-visible:ring-0 focus-visible:ring-offset-0 pr-10"
                  />
                  <Calendar className="absolute right-3 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="hora"
                  className="text-sm font-semibold text-gray-700"
                >
                  Hora
                </Label>
                <div className="relative flex items-center">
                  <Input
                    id="hora"
                    type="time"
                    value={hora}
                    readOnly
                    tabIndex={-1}
                    className="h-11 w-full bg-gray-50 border-gray-200 rounded-xl text-gray-700 cursor-default focus-visible:ring-0 focus-visible:ring-offset-0 pr-10"
                  />
                  <Clock className="absolute right-3 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Motivo */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                Motivo de merma <span className="text-red-500">*</span>
              </Label>
              <Select
                value={tipo}
                onValueChange={setTipo}
                disabled={typesLoading}
              >
                <SelectTrigger className="h-11 w-full bg-gray-50 border-gray-200 rounded-xl focus:ring-1 focus:ring-[#2E7D53] focus:ring-offset-0 text-gray-700">
                  <SelectValue
                    placeholder={
                      typesLoading
                        ? 'Cargando motivos...'
                        : 'Selecciona un motivo'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {types.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.tipo && (
                <span className="text-xs text-red-600">{errors.tipo}</span>
              )}
            </div>

            {/* Cantidad */}
            <div className="space-y-2">
              <Label
                htmlFor="cantidad"
                className="text-sm font-semibold text-gray-700"
              >
                Merma (Litros)
              </Label>
              <Input
                id="cantidad"
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                placeholder="Ej: 2450"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                className="h-11 w-full bg-gray-50 border-gray-200 rounded-xl placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-[#2E7D53] focus-visible:ring-offset-0"
              />
              {errors.cantidad && (
                <span className="text-xs text-red-600">{errors.cantidad}</span>
              )}
            </div>

            {/* ✅ NUEVO: Observación (opcional) */}
            <div className="space-y-2">
              <Label
                htmlFor="observacion"
                className="text-sm font-semibold text-gray-700"
              >
                Observación
              </Label>
              <textarea
                id="observacion"
                value={observacion}
                onChange={(e) => setObservacion(e.target.value)}
                maxLength={100}
                rows={2}
                placeholder="Opcional (máx. 100 caracteres)"
                className="w-full text-sm text-gray-700 leading-relaxed p-3 border border-gray-200 rounded-xl bg-gray-50 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#2E7D53] focus:ring-offset-0 resize-none"
              />
              {errors.observacion && (
                <span className="text-xs text-red-600">
                  {errors.observacion}
                </span>
              )}
              <div className="flex justify-end">
                <span className="text-[10px] text-gray-400">
                  {observacion.length}/100
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="flex items-start gap-2 pt-1">
              <Info className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
              <p className="text-xs text-gray-600 leading-relaxed">
                Este valor se restará del stock disponible sin modificar la
                producción original
              </p>
            </div>

            {/* Botones 50/50 */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="h-12 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 font-semibold text-base shadow-none"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading || typesLoading}
                className="h-12 rounded-xl bg-[#C7E276] hover:bg-[#B6D266] text-[#3F5C1F] font-semibold text-base shadow-none"
              >
                {isLoading ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default RegisterMermaModal
