'use client'
import React, { useEffect, useMemo, useState } from 'react'
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useTransferFormData } from '@/hooks/transfer/useTransferFormData'
import { useTransferRodeo } from '@/hooks/transfer/useTransferRodeo'

// ─────────────────────────────────────────────────────────────
// Tipos del endpoint 10
// ─────────────────────────────────────────────────────────────
interface FormOption {
  label: string
  value: string
}

interface RazaFormData {
  idRaza: string
  cantVacas: number
  nombre: FormOption
}

interface RodeoFormData {
  idRodeo: string
  TipoRodeo: FormOption
  cantVacas: number
  razas: RazaFormData[]
}

interface AnimalFormData {
  idAnimal: string
  nombre: string
  codigo: string
  raza: FormOption
  categoria?: FormOption
}

interface TransferFormData {
  tipoMovimiento: string
  tipoSeguimiento: 'RODEO' | 'RODEO_UNICO' | 'INDIVIDUAL'
  motivos: FormOption[]
  causas: Record<string, string[]>
  rodeos?: RodeoFormData[]
  animales?: AnimalFormData[]
}

interface TransferModalProps {
  open: boolean
  onClose: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  animales?: any[]
  preselectedIds?: string[]
  // ✅ NUEVO: acepta la prop que pasa ChangeBatch (no se usa dentro del modal,
  //    el wrapper determina el modo según formData.tipoSeguimiento del backend)
  tipoSeguimiento?: string
  onSuccess?: () => void
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
const formatLabel = (s: string) =>
  s
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())

// ─────────────────────────────────────────────────────────────
// Wrapper
// ─────────────────────────────────────────────────────────────
export const TransferModal = ({
  open,
  onClose,
  onSuccess,
}: TransferModalProps) => {
  const { data, isLoading, isError, error } = useTransferFormData()
  const formData = data as TransferFormData | undefined

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md bg-white rounded-3xl p-6">
          <p className="text-sm text-gray-500">Cargando configuración...</p>
        </DialogContent>
      </Dialog>
    )
  }

  if (isError || !formData?.tipoSeguimiento) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md bg-white rounded-3xl p-6 space-y-2">
          <p className="text-sm font-bold text-red-600">
            No se pudo cargar el formulario de transferencia
          </p>
          <p className="text-xs text-gray-500">
            {(error as Error)?.message ?? 'Respuesta inválida del backend'}
          </p>
        </DialogContent>
      </Dialog>
    )
  }

  if (formData.tipoSeguimiento === 'INDIVIDUAL') {
    return (
      <IndividualTransferModal
        open={open}
        onClose={onClose}
        formData={formData}
        onSuccess={onSuccess}
      />
    )
  }

  return (
    <RodeoTransferModal
      open={open}
      onClose={onClose}
      formData={formData}
      onSuccess={onSuccess}
    />
  )
}

// ─────────────────────────────────────────────────────────────
// RODEO / RODEO_UNICO
// ─────────────────────────────────────────────────────────────
interface RodeoTransferModalProps {
  open: boolean
  onClose: () => void
  formData: TransferFormData
  onSuccess?: () => void
}

const RodeoTransferModal = ({
  open,
  onClose,
  formData,
  onSuccess,
}: RodeoTransferModalProps) => {
  const rodeos = formData.rodeos ?? []
  const motivos = formData.motivos ?? []
  const causasPorMotivo = formData.causas ?? {}
  const tipoSeguimiento = formData.tipoSeguimiento

  const [origenId, setOrigenId] = useState('')
  const [destinoId, setDestinoId] = useState('')
  const [razaId, setRazaId] = useState('')
  const [cantidades, setCantidades] = useState<Record<string, string>>({})
  const [plazos, setPlazos] = useState<Record<string, string>>({})
  const [motivo, setMotivo] = useState('')
  const [causa, setCausa] = useState('')
  const [observacion, setObservacion] = useState('')
  const [error, setError] = useState<string | null>(null)

  const { mutateAsync, isPending } = useTransferRodeo()

  const rodeoOrigen = rodeos.find((r) => r.idRodeo === origenId)
  const razas = rodeoOrigen?.razas ?? []

  const causas = useMemo(
    () => causasPorMotivo[motivo] ?? [],
    [causasPorMotivo, motivo]
  )

  useEffect(() => {
    setRazaId('')
    setCantidades({})
    setPlazos({})
  }, [origenId])

  useEffect(() => {
    if (!open) {
      setOrigenId('')
      setDestinoId('')
      setRazaId('')
      setCantidades({})
      setPlazos({})
      setMotivo('')
      setCausa('')
      setObservacion('')
      setError(null)
    }
  }, [open])

  const handleClose = () => {
    if (isPending) return
    onClose()
  }

  const setCant = (id: string, v: string) =>
    setCantidades((prev) => ({ ...prev, [id]: v.replace(/\D/g, '') }))
  const setPlazo = (id: string, v: string) =>
    setPlazos((prev) => ({ ...prev, [id]: v.replace(/\D/g, '') }))

  const handleTransfer = async () => {
    setError(null)
    if (!origenId) return setError('Elegí el estado de origen')
    if (!destinoId) return setError('Elegí el estado de destino')
    if (origenId === destinoId)
      return setError('Origen y destino deben ser distintos')
    if (!razaId) return setError('Elegí una raza')

    const razaSel = razas.find((r) => r.idRaza === razaId)
    if (!razaSel) return setError('Raza inválida')

    const cant = Number(cantidades[razaId] || 0)
    if (!cant || cant <= 0) return setError('Cantidad inválida')
    if (cant > razaSel.cantVacas)
      return setError(
        `Máximo ${razaSel.cantVacas} cabezas para ${razaSel.nombre.label}`
      )

    if (!motivo) return setError('Elegí un motivo')
    if (!causa) return setError('Elegí una causa')

    try {
      await mutateAsync({
        tipo: 'TRANSFERENCIA',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        motivo: motivo as any,
        causa,
        tipoSeguimiento: tipoSeguimiento as 'RODEO' | 'RODEO_UNICO',
        origen: origenId,
        destino: destinoId,
        animal: { raza: razaId, cantVacas: cant },
        // Bug backend: el validador rechaza string ISO para `retorno`.
        // Cuando lo arreglen, agregar:
        // retorno: dias > 0 ? new Date(Date.now() + dias*864e5).toISOString() : null,
        observacion: observacion || undefined,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)
      onSuccess?.()
      onClose()
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = e as any
      setError(
        err?.response?.data?.message ?? err?.message ?? 'Error al transferir'
      )
    }
  }

  const totalAnimales = razaId ? (cantidades[razaId] ?? '0') : '0'

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="
          w-[95vw] sm:w-full sm:max-w-md
          p-0 gap-0
          max-h-[92vh]
          flex flex-col
          bg-white rounded-3xl shadow-xl
          overflow-hidden
          [&>button]:hidden
        "
      >
        <DialogHeader className="space-y-1 px-5 pt-5 pb-3 shrink-0">
          <span className="text-[11px] text-gray-400 font-medium">
            Inventario de Rodeos
          </span>
          <DialogTitle className="text-lg font-bold text-gray-900">
            Nueva Transferencia
          </DialogTitle>
        </DialogHeader>

        <div className="px-5 pb-4 space-y-3 flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Estado Origen */}
          <div className="space-y-1.5">
            <Label className="font-bold text-[11px] text-gray-700">
              Estado Origen
            </Label>
            <Select value={origenId} onValueChange={setOrigenId}>
              <SelectTrigger className="w-full h-10 rounded-xl border-gray-200 bg-gray-50/50 text-sm text-gray-500">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {rodeos.map((r) => (
                  <SelectItem key={r.idRodeo} value={r.idRodeo}>
                    {r.TipoRodeo.label} · {r.cantVacas} cab.
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Estado Destino */}
          <div className="space-y-1.5">
            <Label className="font-bold text-[11px] text-gray-700">
              Estado Destino
            </Label>
            <Select value={destinoId} onValueChange={setDestinoId}>
              <SelectTrigger className="w-full h-10 rounded-xl border-gray-200 bg-gray-50/50 text-sm text-gray-500">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {rodeos
                  .filter((r) => r.idRodeo !== origenId)
                  .map((r) => (
                    <SelectItem key={r.idRodeo} value={r.idRodeo}>
                      {r.TipoRodeo.label} · {r.cantVacas} cab.
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tabla de razas */}
          <div className="space-y-1.5">
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="grid grid-cols-[1fr_70px_80px] bg-white text-[10px] font-semibold text-gray-500 px-3 py-2 border-b border-gray-100">
                <span className="text-center">Seleccionar animal</span>
                <span className="text-center">Cantidad</span>
                <span className="text-center leading-tight">
                  Plazos de Retorno (Días)
                </span>
              </div>

              {razas.length === 0 && (
                <p className="px-3 py-3 text-xs text-gray-400">
                  {origenId
                    ? 'Sin razas cargadas en este rodeo'
                    : 'Elegí un origen para ver las razas'}
                </p>
              )}

              {razas.map((r, i) => {
                const selected = razaId === r.idRaza
                const blocked = razaId !== '' && !selected
                return (
                  <div
                    key={r.idRaza}
                    className={`
                      grid grid-cols-[1fr_70px_80px] items-center gap-2
                      px-3 py-1.5 border-b border-gray-100 last:border-b-0
                      transition-opacity
                      ${selected ? 'bg-[#E8F5E9]' : ''}
                      ${blocked ? 'opacity-40' : ''}
                    `}
                  >
                    <label
                      className={`flex items-center gap-2 min-w-0 ${
                        blocked ? 'cursor-not-allowed' : 'cursor-pointer'
                      }`}
                    >
                      <input
                        type="radio"
                        name="raza"
                        value={r.idRaza}
                        checked={selected}
                        onChange={() => setRazaId(r.idRaza)}
                        disabled={blocked}
                        className="shrink-0 accent-[#29845a] disabled:cursor-not-allowed"
                      />
                      <span className="text-xs text-gray-800 truncate">
                        {String(i + 1).padStart(3, '0')} - {r.nombre.label}
                      </span>
                    </label>

                    <Input
                      inputMode="numeric"
                      placeholder="000"
                      value={cantidades[r.idRaza] ?? ''}
                      onChange={(e) => setCant(r.idRaza, e.target.value)}
                      disabled={!selected}
                      className="h-7 rounded-md text-center text-xs px-1 bg-white disabled:bg-gray-50 disabled:text-gray-400"
                    />

                    <div className="relative">
                      <Input
                        inputMode="numeric"
                        placeholder="0"
                        value={plazos[r.idRaza] ?? ''}
                        onChange={(e) => setPlazo(r.idRaza, e.target.value)}
                        disabled={!selected}
                        className="h-7 rounded-md text-center text-xs px-1 pr-8 bg-white disabled:bg-gray-50 disabled:text-gray-400"
                      />
                      <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[9px] text-gray-400 pointer-events-none">
                        Días
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Cantidad de Animales */}
          <div className="space-y-1.5">
            <Label className="font-bold text-[11px] text-gray-700">
              Cantidad de Animales
            </Label>
            <div className="relative">
              <Input
                readOnly
                inputMode="numeric"
                placeholder="0"
                value={totalAnimales}
                className="w-full h-10 rounded-xl border-gray-200 bg-gray-50/50 pr-16 text-sm text-gray-600 cursor-default"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-gray-400 pointer-events-none">
                Cabezas
              </span>
            </div>
          </div>

          {/* Motivo */}
          <div className="space-y-1.5">
            <Label className="font-bold text-[11px] text-gray-700">
              Motivo
            </Label>
            <Select
              value={motivo}
              onValueChange={(v) => {
                setMotivo(v)
                setCausa('')
              }}
            >
              <SelectTrigger className="w-full h-10 rounded-xl border-gray-200 bg-gray-50/50 text-sm text-gray-500">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {motivos.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Causa */}
          <div className="space-y-1.5">
            <Label className="font-bold text-[11px] text-gray-700">Causa</Label>
            <Select value={causa} onValueChange={setCausa} disabled={!motivo}>
              <SelectTrigger className="w-full h-10 rounded-xl border-gray-200 bg-gray-50/50 text-sm text-gray-500">
                <SelectValue
                  placeholder={motivo ? 'Seleccionar' : 'Elegí motivo primero'}
                />
              </SelectTrigger>
              <SelectContent>
                {causas.map((c) => (
                  <SelectItem key={c} value={c}>
                    {formatLabel(c)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Observación */}
          <div className="space-y-1.5">
            <Label className="font-bold text-[11px] text-gray-700">
              Observación
            </Label>
            <Textarea
              placeholder=""
              className="rounded-xl border-gray-200 bg-gray-50/50 resize-none h-20 text-sm"
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>

        <DialogFooter className="px-5 pb-5 pt-3 bg-white shrink-0">
          <Button
            type="button"
            disabled={isPending}
            className="
              w-full h-11 text-sm font-bold rounded-2xl
              bg-[#29845a] hover:bg-[#236342]
              text-white shadow-sm
            "
            onClick={handleTransfer}
          >
            {isPending ? 'Transfiriendo...' : 'Transferir'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─────────────────────────────────────────────────────────────
// INDIVIDUAL
// ─────────────────────────────────────────────────────────────
interface IndividualTransferModalProps {
  open: boolean
  onClose: () => void
  formData: TransferFormData
  onSuccess?: () => void
}

const IndividualTransferModal = ({
  open,
  onClose,
  formData,
  onSuccess,
}: IndividualTransferModalProps) => {
  const animales = formData.animales ?? []
  const motivos = formData.motivos ?? []
  const causasPorMotivo = formData.causas ?? {}

  const [animalId, setAnimalId] = useState('')
  const [origen, setOrigen] = useState('')
  const [destino, setDestino] = useState('')
  const [motivo, setMotivo] = useState('')
  const [causa, setCausa] = useState('')
  const [observacion, setObservacion] = useState('')
  const [error, setError] = useState<string | null>(null)

  const { mutateAsync, isPending } = useTransferRodeo()

  const causas = useMemo(
    () => causasPorMotivo[motivo] ?? [],
    [causasPorMotivo, motivo]
  )

  const CATEGORIAS: FormOption[] = [
    { value: 'ORDENE', label: 'Ordeñe' },
    { value: 'SECAS', label: 'Secas' },
  ]

  useEffect(() => {
    if (!open) {
      setAnimalId('')
      setOrigen('')
      setDestino('')
      setMotivo('')
      setCausa('')
      setObservacion('')
      setError(null)
    }
  }, [open])

  const handleClose = () => {
    if (isPending) return
    onClose()
  }

  const handleTransfer = async () => {
    setError(null)
    if (!animalId) return setError('Elegí un animal')
    if (!origen) return setError('Elegí la categoría de origen')
    if (!destino) return setError('Elegí la categoría de destino')
    if (origen === destino)
      return setError('Origen y destino deben ser distintos')
    if (!motivo) return setError('Elegí un motivo')
    if (!causa) return setError('Elegí una causa')

    try {
      await mutateAsync({
        tipo: 'TRANSFERENCIA',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        motivo: motivo as any,
        causa,
        tipoSeguimiento: 'INDIVIDUAL',
        origen,
        destino,
        animal: { id: animalId, categoria: origen },
        observacion: observacion || undefined,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)
      onSuccess?.()
      onClose()
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = e as any
      setError(
        err?.response?.data?.message ?? err?.message ?? 'Error al transferir'
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="
          w-[95vw] sm:w-full sm:max-w-md
          p-0 gap-0
          max-h-[92vh]
          flex flex-col
          bg-white rounded-3xl shadow-xl
          overflow-hidden
          [&>button]:hidden
        "
      >
        <DialogHeader className="space-y-1 px-5 pt-5 pb-3 shrink-0">
          <span className="text-[11px] text-gray-400 font-medium">
            Inventario por Animal
          </span>
          <DialogTitle className="text-lg font-bold text-gray-900">
            Nueva Transferencia
          </DialogTitle>
        </DialogHeader>

        <div className="px-5 pb-4 space-y-3 flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="space-y-1.5">
            <Label className="font-bold text-[11px] text-gray-700">
              Animal
            </Label>
            <Select value={animalId} onValueChange={setAnimalId}>
              <SelectTrigger className="w-full h-10 rounded-xl border-gray-200 bg-gray-50/50 text-sm text-gray-500">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {animales.map((a) => (
                  <SelectItem key={a.idAnimal} value={a.idAnimal}>
                    {a.codigo ? `${a.codigo} · ` : ''}
                    {a.nombre ?? a.idAnimal}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="font-bold text-[11px] text-gray-700">
              Estado Origen
            </Label>
            <Select value={origen} onValueChange={setOrigen}>
              <SelectTrigger className="w-full h-10 rounded-xl border-gray-200 bg-gray-50/50 text-sm text-gray-500">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIAS.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="font-bold text-[11px] text-gray-700">
              Estado Destino
            </Label>
            <Select value={destino} onValueChange={setDestino}>
              <SelectTrigger className="w-full h-10 rounded-xl border-gray-200 bg-gray-50/50 text-sm text-gray-500">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIAS.filter((c) => c.value !== origen).map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="font-bold text-[11px] text-gray-700">
              Motivo
            </Label>
            <Select
              value={motivo}
              onValueChange={(v) => {
                setMotivo(v)
                setCausa('')
              }}
            >
              <SelectTrigger className="w-full h-10 rounded-xl border-gray-200 bg-gray-50/50 text-sm text-gray-500">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {motivos.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="font-bold text-[11px] text-gray-700">Causa</Label>
            <Select value={causa} onValueChange={setCausa} disabled={!motivo}>
              <SelectTrigger className="w-full h-10 rounded-xl border-gray-200 bg-gray-50/50 text-sm text-gray-500">
                <SelectValue
                  placeholder={motivo ? 'Seleccionar' : 'Elegí motivo primero'}
                />
              </SelectTrigger>
              <SelectContent>
                {causas.map((c) => (
                  <SelectItem key={c} value={c}>
                    {formatLabel(c)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="font-bold text-[11px] text-gray-700">
              Observación
            </Label>
            <Textarea
              className="rounded-xl border-gray-200 bg-gray-50/50 resize-none h-20 text-sm"
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>

        <DialogFooter className="px-5 pb-5 pt-3 bg-white shrink-0">
          <Button
            type="button"
            disabled={isPending}
            className="
              w-full h-11 text-sm font-bold rounded-2xl
              bg-[#29845a] hover:bg-[#236342]
              text-white shadow-sm
            "
            onClick={handleTransfer}
          >
            {isPending ? 'Transfiriendo...' : 'Transferir'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default TransferModal
