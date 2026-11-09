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

// Estilos según el diseño de Figma: fondo gris, campos blancos con borde
// suave, etiquetas normales y botones del mismo ancho.
const LABEL = 'text-xs text-slate-900'
// `data-[size=default]:h-9` es necesario: el SelectTrigger define su altura
// con esa variante (h-12.5) y un `h-9` suelto no la reemplaza.
const TRIGGER =
  'h-9 w-full rounded-lg border-slate-200 bg-white text-sm data-[size=default]:h-9'
const INPUT = 'h-9 rounded-lg border-slate-200 bg-white'
const TEXTAREA =
  'w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-sm'
// `[&>button]:hidden` oculta la X del Dialog (el diseño no la tiene).
// Escape y clic fuera del modal siguen cerrándolo.
const CONTENT =
  'max-h-[calc(100dvh-1rem)] gap-3 overflow-y-auto bg-[#F0F0F0] p-5 sm:max-w-md [&>button]:hidden'

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
          <DialogTitle className="text-base font-bold text-slate-900">
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {f.sinOpciones && (
              <p className="rounded-lg bg-amber-50 p-2.5 text-xs text-amber-800 sm:col-span-2">
                El backend no devolvió motivos para este formulario. Revisá la
                respuesta de <code>/conf/animal/alta/form-data</code>.
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

            {/* ───── MODO INDIVIDUAL ───── */}
            {f.esIndividual && (
              <>
                <div className="flex flex-col gap-1">
                  <label className={LABEL}>Código / RP</label>
                  <Input
                    className={INPUT}
                    placeholder="Ej: 1234"
                    value={f.animal.codigo}
                    onChange={(e) => f.setCampoAnimal('codigo', e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className={LABEL}>Nombre</label>
                  <Input
                    className={INPUT}
                    placeholder="Ej: Lola"
                    value={f.animal.nombre}
                    onChange={(e) => f.setCampoAnimal('nombre', e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1">
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

                <div className="flex flex-col gap-1">
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

                <div className="flex flex-col gap-1">
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

                <div className="flex flex-col gap-1">
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

                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className={LABEL}>Observación</label>
                  <textarea
                    rows={4}
                    className={TEXTAREA}
                    value={f.observacion}
                    onChange={(e) => f.setObservacion(e.target.value)}
                  />
                </div>
              </>
            )}

            {/* ───── MODO RODEO / RODEO ÚNICO (diseño de Figma) ───── */}
            {!f.esIndividual && (
              <>
                {/* Destino */}
                <div className="flex flex-col gap-1 sm:col-span-2">
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

                {/* Categoría */}
                <div className="flex flex-col gap-1">
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

                {/* Estado */}
                <div className="flex flex-col gap-1">
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

                {/* Raza */}
                <div className="flex flex-col gap-1">
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

                {/* Peso */}
                <div className="flex flex-col gap-1">
                  <label className={LABEL}>Peso</label>
                  <Input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="any"
                    placeholder="Ej: 450"
                    className={INPUT}
                    value={f.rodeoAnimal.peso}
                    onChange={(e) => f.setCampoRodeo('peso', e.target.value)}
                  />
                </div>

                {/* Observación */}
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className={LABEL}>Observación</label>
                  <textarea
                    rows={4}
                    className={TEXTAREA}
                    value={f.observacion}
                    onChange={(e) => f.setObservacion(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* Error + botones */}
        <div className="flex flex-col gap-2">
          {f.error && !f.loadingForm && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
              {f.error}
            </p>
          )}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-10 rounded-md border-slate-900 bg-white text-xs font-bold text-slate-900 hover:bg-slate-50"
              onClick={onClose}
              disabled={f.submitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={f.submit}
              disabled={bloqueado}
              className="h-10 rounded-md bg-[#659711] text-xs font-bold text-white hover:bg-[#537d0d]"
            >
              {f.submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
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
