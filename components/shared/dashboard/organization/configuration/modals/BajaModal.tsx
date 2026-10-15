'use client'

import { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'
import { getBajaFormData, deleteBajaAnimal } from '@/utils/api/catalog.api'

interface Props {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  motivoInicial?: string
}

export function BajaModal({ open, onClose, onSuccess, motivoInicial }: Props) {
  const [formData, setFormData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [motivo, setMotivo] = useState(motivoInicial || '')
  const [observacion, setObservacion] = useState('')
  const [rodeoOrigen, setRodeoOrigen] = useState('')
  const [razaId, setRazaId] = useState('')
  const [razaValue, setRazaValue] = useState('')
  const [cantidad, setCantidad] = useState(0)
  const [animalId, setAnimalId] = useState('')

  useEffect(() => {
    if (!open) return
    setLoading(true)
    setError(null)
    setMotivo(motivoInicial || '')
    getBajaFormData()
      .then((res) => setFormData(res.data))
      .catch((e) => setError(e?.message || 'Error al cargar'))
      .finally(() => setLoading(false))
  }, [open, motivoInicial])

  if (!open) return null

  const esIndividual = formData?.tipoSeguimiento === 'INDIVIDUAL'
  const razasDelRodeo =
    formData?.rodeos?.find((r: any) => r.idRodeo === rodeoOrigen)?.razas || []

  const handleGuardar = async () => {
    setError(null)
    if (!motivo) return setError('Seleccioná un motivo')
    setEnviando(true)

    const payload: any = {
      tipoSeguimiento: formData?.tipoSeguimiento,
      tipo: 'EGRESO',
      motivo,
      observacion: observacion || '',
    }

    if (esIndividual) {
      if (!animalId) return setError('Seleccioná un animal')
      payload.animales = animalId
    } else {
      if (!rodeoOrigen) return setError('Seleccioná el rodeo origen')
      if (!razaId || !razaValue) return setError('Seleccioná una raza')
      if (!cantidad || cantidad <= 0) return setError('Cantidad inválida')
      payload.origen = rodeoOrigen
      payload.raza = { idRaza: razaId, raza: razaValue, cantVacas: cantidad }
    }

    try {
      await deleteBajaAnimal(payload)
      alert('Baja registrada con éxito')
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
          <h2 className="text-lg font-bold">Registro de Baja</h2>
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
                    Rodeo Origen
                  </label>
                  <select
                    value={rodeoOrigen}
                    onChange={(e) => {
                      setRodeoOrigen(e.target.value)
                      setRazaId('')
                      setRazaValue('')
                    }}
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
                {rodeoOrigen && (
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={razaId}
                      onChange={(e) => {
                        const r = razasDelRodeo.find(
                          (x: any) => x.idRaza === e.target.value
                        )
                        setRazaId(e.target.value)
                        setRazaValue(r?.nombre?.value || '')
                      }}
                      className="border rounded-lg p-2"
                    >
                      <option value="">Seleccionar Raza</option>
                      {razasDelRodeo.map((rz: any) => (
                        <option key={rz.idRaza} value={rz.idRaza}>
                          {rz.nombre?.label} ({rz.cantVacas} disp.)
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={cantidad || ''}
                      onChange={(e) => setCantidad(Number(e.target.value))}
                      placeholder="Cantidad"
                      className="border rounded-lg p-2"
                    />
                  </div>
                )}
              </>
            )}

            {esIndividual && (
              <div>
                <label className="font-bold text-xs block mb-1">Animal</label>
                <select
                  value={animalId}
                  onChange={(e) => setAnimalId(e.target.value)}
                  className="w-full border rounded-xl p-2.5"
                >
                  <option value="">Seleccionar animal</option>
                  {formData?.animales?.map((a: any) => (
                    <option key={a.idAnimal} value={a.idAnimal}>
                      {a.codigo} - {a.nombre}
                    </option>
                  ))}
                </select>
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
                className="px-6 py-2.5 text-xs font-bold text-white bg-rose-600 rounded-xl disabled:opacity-50"
              >
                {enviando ? 'Guardando...' : 'Guardar Baja'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
