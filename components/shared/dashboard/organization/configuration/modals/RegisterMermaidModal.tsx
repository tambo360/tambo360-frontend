'use client'

import React, { useState, useEffect } from 'react' // 👈 Agregamos useEffect
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
import { Info } from 'lucide-react'

export interface MermaFormData {
  fecha: string
  hora: string
  motivo: string
  cantidad: number
}

interface RegisterMermaModalProps {
  open: boolean
  onClose: () => void
  onSave: (data: MermaFormData) => Promise<void>
  isLoading?: boolean
}

const RegisterMermaModal = ({
  open,
  onClose,
  onSave,
  isLoading = false,
}: RegisterMermaModalProps) => {
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [motivo, setMotivo] = useState('')
  const [cantidad, setCantidad] = useState('')

  // ✅ Efecto para cargar la fecha y hora automáticamente al abrir el modal
  useEffect(() => {
    if (open) {
      const now = new Date()

      // Formatear Fecha a YYYY-MM-DD (local)
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      setFecha(`${year}-${month}-${day}`)

      // Formatear Hora a HH:MM (local)
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      setHora(`${hours}:${minutes}`)

      // Limpiar los otros campos por si quedaron datos de una apertura anterior
      setMotivo('')
      setCantidad('')
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fecha || !hora || !motivo || !cantidad) return

    await onSave({
      fecha,
      hora,
      motivo,
      cantidad: Number(cantidad),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95%] sm:max-w-[480px] p-0 overflow-hidden bg-white rounded-3xl border-0 shadow-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <DialogHeader className="p-6 pb-4 border-b border-gray-100">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Registrar merma
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mt-1">
              Ingresa los datos para asociar la merma a un lote de producción
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="fecha"
                  className="text-sm font-semibold text-gray-700"
                >
                  Fecha
                </Label>
                <Input
                  id="fecha"
                  type="date"
                  value={fecha}
                  readOnly // 👈 Solo lectura
                  disabled // 👈 Deshabilitado para que se vea gris
                  className="h-11 bg-gray-100 border-gray-200 rounded-xl text-gray-500 cursor-not-allowed focus-visible:ring-0"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="hora"
                  className="text-sm font-semibold text-gray-700"
                >
                  Hora
                </Label>
                <Input
                  id="hora"
                  type="time"
                  value={hora}
                  readOnly // 👈 Solo lectura
                  disabled // 👈 Deshabilitado
                  className="h-11 bg-gray-100 border-gray-200 rounded-xl text-gray-500 cursor-not-allowed focus-visible:ring-0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                Motivo de merma <span className="text-red-500">*</span>
              </Label>
              <Select value={motivo} onValueChange={setMotivo} required>
                <SelectTrigger className="h-11 bg-gray-50 border-gray-200 rounded-xl focus:ring-1 focus:ring-[#2E7D53]">
                  <SelectValue placeholder="Selecciona un motivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Rodeo alta producción (120cab)">
                    Rodeo alta producción (120cab)
                  </SelectItem>
                  <SelectItem value="Rodeo baja producción">
                    Rodeo baja producción
                  </SelectItem>
                  <SelectItem value="Mastitis">Mastitis</SelectItem>
                  <SelectItem value="Tratamiento">Tratamiento</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
                placeholder="Ej: 2450"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                className="h-11 bg-gray-50 border-gray-200 rounded-xl focus-visible:ring-1 focus-visible:ring-[#2E7D53]"
                required
              />
              <div className="flex items-start gap-2 mt-2 bg-gray-50 p-3 rounded-lg">
                <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-500 leading-relaxed">
                  Este valor se restará del stock disponible sin modificar la
                  producción original
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 pt-2 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-gray-100 bg-gray-50/50">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="h-11 rounded-xl px-6 border-gray-200 text-gray-700 font-semibold w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 rounded-xl px-6 bg-[#2E7D53] hover:bg-[#236342] text-white font-semibold w-full sm:w-auto shadow-sm"
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default RegisterMermaModal
