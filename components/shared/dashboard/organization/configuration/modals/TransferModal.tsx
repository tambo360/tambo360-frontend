'use client'
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
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
import { Textarea } from '@/components/ui/textarea'

interface TransferModalProps {
  open: boolean
  onClose: () => void
  onSave?: (data: any) => void
}

export const TransferModal = ({
  open,
  onClose,
  onSave,
}: TransferModalProps) => {
  const [estadoOrigen, setEstadoOrigen] = useState('')
  const [estadoDestino, setEstadoDestino] = useState('')
  const [cantidad, setCantidad] = useState('')
  const [plazosRetorno, setPlazosRetorno] = useState('')
  const [motivo, setMotivo] = useState('')

  const handleTransfer = () => {
    if (onSave) {
      onSave({ estadoOrigen, estadoDestino, cantidad, plazosRetorno, motivo })
    }
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white rounded-3xl p-6 shadow-xl">
        <DialogHeader className="space-y-1 pb-3 border-b">
          <span className="text-xs text-gray-400 font-medium">
            Inventario de Rodeos
          </span>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Nueva Transferencia
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Estado Origen */}
          <div className="space-y-2">
            <Label className="font-bold text-xs text-gray-700">
              Estado Origen
            </Label>
            <Select value={estadoOrigen} onValueChange={setEstadoOrigen}>
              <SelectTrigger className="w-full rounded-xl border-gray-200 bg-gray-50/50 text-gray-500">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="ordeñe">Ordeñe</SelectItem>
                  <SelectItem value="secas">Secas</SelectItem>
                  <SelectItem value="recría">Recría</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Estado Destino */}
          <div className="space-y-2">
            <Label className="font-bold text-xs text-gray-700">
              Estado Destino
            </Label>
            <Select value={estadoDestino} onValueChange={setEstadoDestino}>
              <SelectTrigger className="w-full rounded-xl border-gray-200 bg-gray-50/50 text-gray-500">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="ordeñe">Ordeñe</SelectItem>
                  <SelectItem value="secas">Secas</SelectItem>
                  <SelectItem value="recría">Recría</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Cantidad de Animales */}
          <div className="space-y-2">
            <Label className="font-bold text-xs text-gray-700">
              Cantidad de Animales
            </Label>
            <div className="relative">
              <Input
                type="text"
                inputMode="numeric"
                placeholder="00"
                className="rounded-xl border-gray-200 bg-gray-50/50 pr-16"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400 pointer-events-none">
                Cabezas
              </span>
            </div>
          </div>

          {/* Plazos de Retorno (Días) */}
          <div className="space-y-2">
            <Label className="font-bold text-xs text-gray-700">
              Plazos de Retorno (Días)
            </Label>
            <Input
              type="text"
              inputMode="numeric"
              placeholder="Ej. 30"
              className="rounded-xl border-gray-200 bg-gray-50/50"
              value={plazosRetorno}
              onChange={(e) => setPlazosRetorno(e.target.value)}
            />
          </div>

          {/* Motivo de transferencia */}
          <div className="space-y-2">
            <Label className="font-bold text-xs text-gray-700">
              Motivo de transferencia
            </Label>
            <Textarea
              placeholder="Escribe el motivo..."
              className="rounded-xl border-gray-200 bg-gray-50/50 resize-none h-20"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
            />
          </div>

          {/* Botón Transferir */}
          <DialogFooter className="pt-2">
            <Button
              type="button"
              className="w-full h-12 text-base font-bold rounded-2xl bg-[#a3e635] hover:bg-[#84cc16] text-gray-900 shadow-sm"
              onClick={handleTransfer}
            >
              Transferir
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TransferModal
