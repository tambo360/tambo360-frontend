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
import { useAltaForm } from '@/hooks/establishment/useAltaForm'

interface Props {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
  motivoInicial?: string
}

// Estilos visuales idénticos al Figma
const LABEL = 'text-sm font-medium text-slate-900 mb-1.5 block'
const TRIGGER =
  'h-10 w-full rounded-lg border-none bg-white text-sm text-slate-500 placeholder:text-slate-400 focus:ring-2 focus:ring-[#659711]'
const INPUT =
  'h-10 w-full rounded-lg border-none bg-white text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#659711]'
const TEXTAREA =
  'w-full resize-none rounded-lg border-none bg-white px-3 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus-visible:ring-2 focus-visible:ring-[#659711]'
const CONTENT =
  'max-h-[calc(100dvh-2rem)] gap-5 overflow-y-auto bg-[#F0F0F0] p-6 sm:max-w-[480px] [&>button]:hidden rounded-xl'

export function AltaAnimalModal({
  open,
  onClose,
  onSuccess,
  motivoInicial,
}: Props) {
  const f = useAltaForm({ open, onClose, onSuccess, motivoInicial })

  const bloqueado =
    f.submitting || f.loadingForm || !!f.formError || f.sinOpciones

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className={CONTENT}>
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900">
            Registro de Alta
          </DialogTitle>
        </DialogHeader>

        {f.loadingForm ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-[#659711]" />
          </div>
        ) : f.formError ? (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {f.formError}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {f.sinOpciones && (
              <p className="rounded-lg bg-amber-50 p-2.5 text-xs text-amber-800 sm:col-span-2">
                El backend no devolvió motivos para este formulario.
              </p>
            )}

            {/* Motivo (Común para ambos) */}
            <div className="sm:col-span-2">
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

            {/* ───── MODO INDIVIDUAL ───── */}
            {f.esIndividual && (
              <>
                <div>
                  <label className={LABEL}>ID / RP</label>
                  <Input
                    className={INPUT}
                    placeholder="Seleccionar"
                    value={f.animal.codigo}
                    onChange={(e) => f.setCampoAnimal('codigo', e.target.value)}
                  />
                </div>

                <div>
                  <label className={LABEL}>Nombre</label>
                  <Input
                    className={INPUT}
                    placeholder="Seleccionar"
                    value={f.animal.nombre}
                    onChange={(e) => f.setCampoAnimal('nombre', e.target.value)}
                  />
                </div>

                <div>
                  <label className={LABEL}>Categoría</label>
                  <Select
                    value={f.animal.categoria}
                    onValueChange={(v) => f.setCampoAnimal('categoria', v)}
                  >
                    <SelectTrigger className={TRIGGER}>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {f.categorias.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className={LABEL}>Estado</label>
                  <Select
                    value={f.animal.estado}
                    onValueChange={(v) => f.setCampoAnimal('estado', v)}
                  >
                    <SelectTrigger className={TRIGGER}>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {f.estadosSanitarios.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className={LABEL}>Raza</label>
                  <Select
                    value={f.animal.raza}
                    onValueChange={(v) => f.setCampoAnimal('raza', v)}
                  >
                    <SelectTrigger className={TRIGGER}>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {f.razas.map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className={LABEL}>Fecha de nacimiento</label>
                  <Input
                    type="date"
                    className={INPUT}
                    value={f.animal.fechaNacimiento}
                    onChange={(e) =>
                      f.setCampoAnimal('fechaNacimiento', e.target.value)
                    }
                  />
                </div>
              </>
            )}

            {/* ───── MODO RODEO / RODEO ÚNICO ───── */}
            {!f.esIndividual && (
              <>
                <div className="sm:col-span-2">
                  <label className={LABEL}>Destino</label>
                  <Select value={f.destino} onValueChange={f.setDestino}>
                    <SelectTrigger className={TRIGGER}>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {f.rodeos.map((r) => (
                        <SelectItem key={r.idRodeo} value={r.idRodeo}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className={LABEL}>Categoría</label>
                  <Select
                    value={f.rodeoAnimal.categoria}
                    onValueChange={(v) => f.setCampoRodeo('categoria', v)}
                  >
                    <SelectTrigger className={TRIGGER}>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {f.categorias.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className={LABEL}>Estado</label>
                  <Select
                    value={f.rodeoAnimal.estado}
                    onValueChange={(v) => f.setCampoRodeo('estado', v)}
                  >
                    <SelectTrigger className={TRIGGER}>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {f.estadosSanitarios.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className={LABEL}>Raza</label>
                  <Select
                    value={f.rodeoAnimal.raza}
                    onValueChange={(v) => f.setCampoRodeo('raza', v)}
                  >
                    <SelectTrigger className={TRIGGER}>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {f.razas.map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className={LABEL}>Peso</label>
                  <Input
                    type="number"
                    className={INPUT}
                    placeholder="Seleccionar"
                    value={f.rodeoAnimal.peso}
                    onChange={(e) => f.setCampoRodeo('peso', e.target.value)}
                  />
                </div>
              </>
            )}

            {/* Observación (Común para ambos) */}
            <div className="sm:col-span-2 mt-2">
              <label className={LABEL}>Observación</label>
              <textarea
                rows={4}
                className={TEXTAREA}
                value={f.observacion}
                onChange={(e) => f.setObservacion(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Error + Botones */}
        <div className="flex flex-col gap-3 mt-2">
          {f.error && !f.loadingForm && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
              {f.error}
            </p>
          )}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-11 rounded-lg border-2 border-slate-900 bg-white text-sm font-bold text-slate-900 hover:bg-slate-50"
              onClick={onClose}
              disabled={f.submitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={f.submit}
              disabled={bloqueado}
              className="h-11 rounded-lg bg-[#659711] text-sm font-bold text-white hover:bg-[#537d0d]"
            >
              {f.submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Alta'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
