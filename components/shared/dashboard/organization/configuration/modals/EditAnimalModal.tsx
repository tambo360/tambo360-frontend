'use client'

import { useEffect, useState } from 'react'
import { Loader2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { type AnimalRow } from '@/hooks/establishment/useInventarioAnimales'
import { useAnimalMutations } from '@/hooks/establishment/useAnimalMutations'

interface EditAnimalModalProps {
  open: boolean
  onClose: () => void
  animal: AnimalRow | null
  onSuccess: () => void
}

export function EditAnimalModal({
  open,
  onClose,
  animal,
  onSuccess,
}: EditAnimalModalProps) {
  const { updateAnimal, isUpdating } = useAnimalMutations()

  // Estados locales para los 3 campos editables
  const [codigo, setCodigo] = useState('')
  const [nombre, setNombre] = useState('')
  const [observacion, setObservacion] = useState('')

  // Sincronizamos los datos del animal cuando se abre el modal
  useEffect(() => {
    if (animal && open) {
      setCodigo(animal.codigo || '')
      setNombre(animal.nombre || '')
      setObservacion(animal.observacion || '')
    }
  }, [animal, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!animal) return

    // Validación básica
    if (!codigo.trim() || !nombre.trim()) {
      alert('El RP/N° y el Nombre son obligatorios.')
      return
    }

    try {
      await updateAnimal(
        animal.id,
        codigo.trim(),
        nombre.trim(),
        observacion.trim()
      )
      onSuccess() // Recarga la tabla
      onClose() // Cierra el modal
    } catch (error: any) {
      alert(`❌ ${error.message}`)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {/* max-w-md evita que sea muy ancho en PC. w-[95vw] se adapta a celus */}
      <DialogContent className="sm:max-w-[425px] w-[95vw] p-5 sm:p-6 overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900">
            Editar Animal
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Modifica los datos del animal. Los cambios se guardarán
            inmediatamente.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          {/* Campo: RP/N° */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">
              RP/N°
            </label>
            <Input
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Ej: A-001"
              className="h-9 text-sm"
              required
            />
          </div>

          {/* Campo: Nombre */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Nombre
            </label>
            <Input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Mancha"
              className="h-9 text-sm"
              required
            />
          </div>

          {/* Campo: Observación (Textarea compacto) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Observación (Opcional)
            </label>
            <textarea
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              placeholder="Ej: Mastitis en cuarto trasero..."
              // resize-none evita que el usuario lo agrande y genere scroll
              className="flex min-h-[70px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
          </div>

          <DialogFooter className="flex flex-row justify-end gap-2 mt-4 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isUpdating}
              className="h-9 text-xs"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isUpdating}
              className="h-9 text-xs bg-[#659711] hover:bg-[#537d0d] text-white gap-2"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
