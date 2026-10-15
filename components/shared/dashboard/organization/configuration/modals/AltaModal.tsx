'use client'

import { useState, useEffect } from 'react'
import { X, Loader2, Plus, Trash2 } from 'lucide-react'
import { getAltaFormData, postAltaAnimal } from '@/utils/api/catalog.api'

interface Props {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  motivoInicial?: string
}

export function AltaModal({ open, onClose, onSuccess, motivoInicial }: Props) {
  const [formData, setFormData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [motivo, setMotivo] = useState(motivoInicial || '')
  const [observacion, setObservacion] = useState('')
  const [rodeoDestino, setRodeoDestino] = useState('')
  const [razas, setRazas] = useState<{ raza: string; cantVacas: number }[]>([
    { raza: '', cantVacas: 0 },
  ])
  const [animal, setAnimal] = useState({
    codigo: '',
    nombre: '',
    categoria: '',
    estado: '',
    raza: '',
    fechaNacimiento: '',
  })

  useEffect(() => {
    if (!open) return
    setLoading(true)
    setError(null)
    setMotivo(motivoInicial || '')
    getAltaFormData()
      .then((res) => setFormData(res.data))
      .catch((e) => setError(e?.message || 'Error al cargar'))
      .finally(() => setLoading(false))
  }, [open, motivoInicial])

  if (!open) return null

  const esIndividual = formData?.tipoSeguimiento === 'INDIVIDUAL'

  const handleGuardar = async () => {
    setError(null)
    if (!motivo) return setError('Seleccioná un motivo')
    setEnviando(true)

    const payload: any = {
      tipoSeguimiento: formData?.tipoSeguimiento,
      tipo: 'INGRESO',
      motivo,
      observacion: observacion || '',
    }

    if (esIndividual) {
      if (!animal.codigo && !animal.nombre)
        return setError('Ingresá código o nombre del animal')
      if (!animal.categoria || !animal.estado || !animal.raza)
        return setError('Completá categoría, estado y raza')
      payload.animales = [animal]
    } else {
      if (!rodeoDestino) return setError('Seleccioná el rodeo destino')
      const valid = razas.filter((r) => r.raza && r.cantVacas > 0)
      if (valid.length === 0)
        return setError('Agregá al menos una raza con cantidad')
      payload.destino = rodeoDestino
      payload.razas = valid
    }

    try {
      await postAltaAnimal(payload)
      alert('Alta registrada con éxito')
      onSuccess()
      onClose()
    } catch (e: any) {
      setError(e?.message || 'Error al guardar')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold">Registro de Alta</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {loading ? (
          <div className="p-10 flex justify-center">
            <Loader2 className="animate-spin text-[#2E7D53]" />
          </div>
        ) : (
          <div className="p-6 space-y-4 text-sm">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs">
                {error}
              </div>
            )}

            <div>
              <label className="font-bold text-xs block mb-1">Motivo</label>
              <select
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="w-full border rounded-xl p-2.5"
              >
                <option value="">Seleccionar</option>
                {formData?.motivos?.map((m: any) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-xs block mb-1">
                Observación (opcional)
              </label>
              <textarea
                value={observacion}
                onChange={(e) => setObservacion(e.target.value)}
                className="w-full border rounded-xl p-2.5 resize-none"
                rows={2}
              />
            </div>

            {!esIndividual && (
              <>
                <div>
                  <label className="font-bold text-xs block mb-1">
                    Rodeo Destino
                  </label>
                  <select
                    value={rodeoDestino}
                    onChange={(e) => setRodeoDestino(e.target.value)}
                    className="w-full border rounded-xl p-2.5"
                  >
                    <option value="">Seleccionar</option>
                    {formData?.rodeos?.map((r: any) => (
                      <option key={r.idRodeo} value={r.idRodeo}>
                        {r.TipoRodeo?.label || r.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-xs block mb-2">
                    Razas y Cantidades
                  </label>
                  {razas.map((item, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <select
                        value={item.raza}
                        onChange={(e) => {
                          const n = [...razas]
                          n[i].raza = e.target.value
                          setRazas(n)
                        }}
                        className="flex-1 border rounded-lg p-2"
                      >
                        <option value="">Raza</option>
                        {formData?.razas?.map((r: any) => (
                          <option key={r.value} value={r.value}>
                            {r.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={item.cantVacas || ''}
                        onChange={(e) => {
                          const n = [...razas]
                          n[i].cantVacas = Number(e.target.value)
                          setRazas(n)
                        }}
                        placeholder="Cant."
                        className="w-24 border rounded-lg p-2"
                      />
                      {razas.length > 1 && (
                        <button
                          onClick={() =>
                            setRazas(razas.filter((_, x) => x !== i))
                          }
                          className="text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      setRazas([...razas, { raza: '', cantVacas: 0 }])
                    }
                    className="text-[#2E7D53] text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Agregar raza
                  </button>
                </div>
              </>
            )}

            {esIndividual && (
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="Código"
                  value={animal.codigo}
                  onChange={(e) =>
                    setAnimal({ ...animal, codigo: e.target.value })
                  }
                  className="border rounded-lg p-2"
                />
                <input
                  placeholder="Nombre"
                  value={animal.nombre}
                  onChange={(e) =>
                    setAnimal({ ...animal, nombre: e.target.value })
                  }
                  className="border rounded-lg p-2"
                />
                <select
                  value={animal.categoria}
                  onChange={(e) =>
                    setAnimal({ ...animal, categoria: e.target.value })
                  }
                  className="border rounded-lg p-2"
                >
                  <option value="">Categoría</option>
                  {formData?.Categorias?.map((c: any) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <select
                  value={animal.estado}
                  onChange={(e) =>
                    setAnimal({ ...animal, estado: e.target.value })
                  }
                  className="border rounded-lg p-2"
                >
                  <option value="">Estado Sanitario</option>
                  {formData?.EstadoSanitarios?.map((c: any) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <select
                  value={animal.raza}
                  onChange={(e) =>
                    setAnimal({ ...animal, raza: e.target.value })
                  }
                  className="border rounded-lg p-2"
                >
                  <option value="">Raza</option>
                  {formData?.razas?.map((r: any) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={animal.fechaNacimiento}
                  onChange={(e) =>
                    setAnimal({ ...animal, fechaNacimiento: e.target.value })
                  }
                  className="border rounded-lg p-2"
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={onClose}
                className="px-5 py-2.5 text-xs font-bold border rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardar}
                disabled={enviando}
                className="px-6 py-2.5 text-xs font-bold text-white bg-[#2E7D53] rounded-xl disabled:opacity-50"
              >
                {enviando ? 'Guardando...' : 'Guardar Alta'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
