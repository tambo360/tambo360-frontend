'use client'

import { Loader2, Plus, X } from 'lucide-react'
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

const LABEL = 'text-xs font-bold text-slate-900'
const TRIGGER = 'h-9 w-full rounded-lg text-sm'
const TEXTAREA =
  'w-full resize-none rounded-lg border border-input bg-transparent px-3 py-2 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-sm'

export function AltaAnimalModal({
  open,
  onClose,
  onSuccess,
  motivoInicial,
}: Props) {
  const f = useAltaForm({ open, onClose, onSuccess, motivoInicial })

  const bloqueado =
    f.submitting || f.loadingForm || !!f.formError || f.sinOpciones

  // No se puede repetir raza, así que no hay más filas que razas disponibles
  const puedeAgregarRaza = f.filas.length < f.razas.length

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[calc(100dvh-1rem)] gap-3 overflow-y-auto p-4 sm:max-w-xl sm:p-5">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-slate-900">
            Registro de Alta
          </DialogTitle>
        </DialogHeader>

        {f.loadingForm ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-[#2E7D53]" />
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
            <div
              className={`flex flex-col gap-1 ${
                f.esIndividual ? 'sm:col-span-2' : ''
              }`}
            >
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
                    className="h-9 rounded-lg"
                    placeholder="Ej: 1234"
                    value={f.animal.codigo}
                    onChange={(e) => f.setCampoAnimal('codigo', e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className={LABEL}>Nombre</label>
                  <Input
                    className="h-9 rounded-lg"
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
                  <label className={LABEL}>Estado Sanitario</label>
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
                    className="h-9 rounded-lg"
                    value={f.animal.fechaNacimiento}
                    onChange={(e) =>
                      f.setCampoAnimal('fechaNacimiento', e.target.value)
                    }
                  />
                </div>

                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className={LABEL}>Observación (opcional)</label>
                  <textarea
                    rows={2}
                    className={TEXTAREA}
                    value={f.observacion}
                    onChange={(e) => f.setObservacion(e.target.value)}
                  />
                </div>
              </>
            )}

            {/* ───── MODO RODEO ───── */}
            {!f.esIndividual && (
              <>
                {/* Rodeo destino */}
                <div className="flex flex-col gap-1">
                  <label className={LABEL}>Rodeo Destino</label>
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

                {/* Observación */}
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className={LABEL}>Observación (opcional)</label>
                  <textarea
                    rows={2}
                    className={TEXTAREA}
                    value={f.observacion}
                    onChange={(e) => f.setObservacion(e.target.value)}
                  />
                </div>

                {/* Razas y cantidades */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className={LABEL}>Razas y Cantidades</label>
                    {puedeAgregarRaza && (
                      <button
                        type="button"
                        onClick={f.agregarFila}
                        className="flex items-center gap-1 text-xs font-bold text-[#2E7D53] hover:underline"
                      >
                        <Plus size={14} /> Agregar raza
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {f.filas.map((fila, i) => {
                      // Oculta las razas que ya se eligieron en otras filas
                      const opciones = f.razas.filter(
                        (r) =>
                          r.value === fila.raza ||
                          !f.filas.some((x) => x.raza === r.value)
                      )

                      return (
                        <div key={i} className="flex items-center gap-2">
                          <div className="min-w-0 flex-1">
                            <Select
                              value={fila.raza}
                              onValueChange={(v) =>
                                f.actualizarFila(i, 'raza', v)
                              }
                            >
                              <SelectTrigger className={TRIGGER}>
                                <SelectValue placeholder="Raza" />
                              </SelectTrigger>
                              <SelectContent>
                                {opciones.map((r) => (
                                  <SelectItem key={r.value} value={r.value}>
                                    {r.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <Input
                            type="number"
                            inputMode="numeric"
                            min={1}
                            placeholder="Cant."
                            className="h-9 w-20 rounded-lg"
                            value={fila.cantidad}
                            onChange={(e) =>
                              f.actualizarFila(i, 'cantidad', e.target.value)
                            }
                          />
                          {f.filas.length > 1 && (
                            <button
                              type="button"
                              onClick={() => f.quitarFila(i)}
                              className="text-slate-400 hover:text-slate-600"
                              aria-label="Quitar raza"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
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
              className="h-9 rounded-full bg-[#2E7D53] text-white hover:bg-[#236342]"
            >
              {f.submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Guardar Alta'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
