'use client'

import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useBajaForm } from '@/hooks/establishment/useBajaForm'

interface Props {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
  motivoInicial?: string
}

const LABEL = 'text-xs font-bold text-slate-900'
const TRIGGER = 'h-9 w-full rounded-lg text-sm'

export function BajaAnimalModal({
  open,
  onClose,
  onSuccess,
  motivoInicial,
}: Props) {
  const f = useBajaForm({ open, onClose, onSuccess, motivoInicial })

  const bloqueado =
    f.submitting ||
    f.loadingForm ||
    !!f.formError ||
    (f.esIndividual && !f.animalId) ||
    (!f.esIndividual && f.sinOpciones)

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[calc(100dvh-1rem)] gap-3 overflow-y-auto p-4 sm:max-w-xl sm:p-5">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-slate-900">
            Registro de Baja
          </DialogTitle>
        </DialogHeader>

        {f.loadingForm ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-[#E53935]" />
          </div>
        ) : f.formError ? (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {f.formError}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {f.sinOpciones && !f.esIndividual && (
              <p className="rounded-lg bg-amber-50 p-2.5 text-xs text-amber-800 sm:col-span-2">
                El backend no devolvió motivos para este formulario.
              </p>
            )}

            {/* Motivo */}
            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className={LABEL}>Motivo</label>
              <Select value={f.motivo} onValueChange={f.setMotivo}>
                <SelectTrigger className={TRIGGER}>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {f.motivos.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* VISTA INDIVIDUAL: Selector de Animales */}
            {f.esIndividual && (
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className={LABEL}>Seleccionar Animal</label>
                <Select value={f.animalId} onValueChange={f.setAnimalId}>
                  <SelectTrigger className={TRIGGER}>
                    <SelectValue placeholder="Seleccionar animal" />
                  </SelectTrigger>
                  <SelectContent>
                    {f.animales.map((a) => (
                      <SelectItem key={a.idAnimal} value={a.idAnimal}>
                        {a.codigo} - {a.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* VISTA RODEO: Rodeo, Raza, Cantidad */}
            {!f.esIndividual && (
              <>
                <div className="flex flex-col gap-1">
                  <label className={LABEL}>Rodeo Origen</label>
                  <Select value={f.origen} onValueChange={f.cambiarOrigen}>
                    <SelectTrigger className={TRIGGER}>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {f.rodeosConAnimales.map((r) => (
                        <SelectItem key={r.idRodeo} value={r.idRodeo}>
                          {r.label} ({r.cantVacas})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className={LABEL}>Raza</label>
                  <Select
                    value={f.idRaza}
                    onValueChange={f.cambiarRaza}
                    disabled={!f.origen}
                  >
                    <SelectTrigger className={TRIGGER}>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {f.razasDisponibles.map((rz) => (
                        <SelectItem key={rz.idRaza} value={rz.idRaza}>
                          {rz.label} ({rz.cantVacas})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className={LABEL}>Cantidad</label>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={f.maxCantidad}
                    className="h-9 rounded-lg"
                    value={f.cantidad}
                    onChange={(e) => f.setCantidad(e.target.value)}
                    disabled={!f.idRaza}
                  />
                </div>
              </>
            )}

            {/* Observación */}
            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className={LABEL}>Observación (opcional)</label>
              <textarea
                rows={2}
                className="w-full resize-none rounded-lg border border-input bg-transparent px-3 py-2 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-sm"
                value={f.observacion}
                onChange={(e) => f.setObservacion(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Error + botones */}
        <div className="flex flex-col gap-2">
          {f.error && !f.loadingForm && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
              {f.error}
            </p>
          )}
          <div className="grid grid-cols-2 gap-2 sm:flex sm:justify-end sm:gap-3">
            <Button
              variant="outline"
              className="h-9 rounded-full"
              onClick={onClose}
              disabled={f.submitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={f.submit}
              disabled={bloqueado}
              className="h-9 rounded-full bg-[#E53935] text-white hover:bg-[#c62828]"
            >
              {f.submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Guardar Baja'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
