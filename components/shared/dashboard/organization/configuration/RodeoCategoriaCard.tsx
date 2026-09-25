'use client'
import { ConfigurationFormInput } from '@/types/establishment/configuration'
import { RazasVacas, TipoRodeo } from '@/types/enums'
import { X } from 'lucide-react'
import { type UseFormRegister, type UseFormSetValue } from 'react-hook-form'
import { useEffect, useMemo, useState, useRef } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { limitDecimalDigitsKeyDown, sanitizeDecimalChange } from '@/lib/utils'

export const RAZA_LABELS: Record<RazasVacas, string> = {
  [RazasVacas.HOLANDO_ARGENTINO]: 'Raza Holando Argentino.',
  [RazasVacas.JERSEY]: 'Raza Jersey.',
  [RazasVacas.PARDO_SUIZO]: 'Raza Pardo Suizo.',
  [RazasVacas.GIR_LECHERO]: 'Raza Gir Lechero.',
  [RazasVacas.HOLANDO_JERSEY_CRUZA]: 'Cruza Holando-Jersey.',
  [RazasVacas.AYRSHIRE]: 'Raza Ayrshire.',
  [RazasVacas.NORMANDO]: 'Raza Normando.',
  [RazasVacas.BROWN_SWISS]: 'Raza Brown Swiss.',
  [RazasVacas.MONTBELIARDE]: 'Raza Montbeliarde.',
  [RazasVacas.SIMMENTAL_LECHERO]: 'Raza Simmental Lechero.',
  [RazasVacas.OTRAS]: 'Otra raza no listada.',
}

const formatRazaLabel = (value: string) =>
  (Object.values(RazasVacas) as string[]).includes(value)
    ? RAZA_LABELS[value as RazasVacas]
    : value

const formatRazaChip = (value: string) =>
  formatRazaLabel(value)
    .replace(/^Raza\s+/i, '')
    .replace(/\.\s*$/, '')

export const blockNegativeKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault()
}

const RAZAS_OPTIONS: { value: RazasVacas; label: string }[] = Object.values(
  RazasVacas
).map((value) => ({ value, label: RAZA_LABELS[value] }))

interface RodeoCategoriaCardProps {
  titulo: string
  index: number
  tipoRodeo: TipoRodeo
  register?: UseFormRegister<ConfigurationFormInput>
  setValue?: UseFormSetValue<ConfigurationFormInput>
  costoRacionError?: string
  razasError?: string
}

export default function RodeoCategoriaCard({
  titulo,
  index,
  tipoRodeo,
  register,
  setValue,
  costoRacionError,
  razasError,
}: RodeoCategoriaCardProps) {
  const [raza, setRaza] = useState('')
  const [cantidad, setCantidad] = useState('')
  const [cantidadError, setCantidadError] = useState('')
  const [razas, setRazas] = useState<{ raza: string; cantidad: string }[]>([])

  useEffect(() => {
    setValue?.(`rodeos.${index}.tipoRodeo` as const, tipoRodeo)
  }, [setValue, index, tipoRodeo])

  const totalAnimales = useMemo(
    () => razas.reduce((acc, item) => acc + Number(item.cantidad), 0),
    [razas]
  )

  const puedeAgregar = !!raza && cantidad !== '' && Number(cantidad) > 0

  const syncRazasToForm = (items: { raza: string; cantidad: string }[]) => {
    setValue?.(
      `rodeos.${index}.razas` as const,
      items.map((item) => ({
        raza: item.raza as RazasVacas,
        cantVacas: Number(item.cantidad),
      })),
      { shouldValidate: true, shouldDirty: true }
    )
  }

  const costoRacionField = register?.(`rodeos.${index}.costoRacion` as const, {
    valueAsNumber: true,
  })

  const handleAgregar = () => {
    if (!raza || cantidad === '' || Number(cantidad) <= 0) {
      setCantidadError('Seleccioná una raza e ingresá una cantidad válida')
      return
    }
    const next = [...razas, { raza, cantidad }]
    setRazas(next)
    syncRazasToForm(next)
    setRaza('')
    setCantidad('')
    setCantidadError('')
  }

  const handleQuitar = (i: number) => {
    const next = razas.filter((_, j) => j !== i)
    setRazas(next)
    syncRazasToForm(next)
  }

  const conPunto = useRef(false)

  return (
    <div className="flex flex-col gap-4 w-full lg:w-fit">
      <h3 className="text-[15px] font-semibold text-slate-900">{titulo}</h3>

      <div className="grid sm:grid-cols-2 items-start">
        <div className="flex min-w-0 flex-col gap-1.5">
          <Label className="flex min-h-8 items-end text-xs leading-tight font-normal wrap-break-words text-slate-900">
            Cantidad de animales
          </Label>
          <p className="flex w-full min-w-0 items-center px-3 font-semibold text-slate-900">
            {totalAnimales}
          </p>
        </div>
        <div className="flex min-w-0 flex-col gap-1.5">
          <Label className="flex min-h-8 items-end text-xs leading-tight font-normal wrap-break-words text-slate-900">
            Costo de Ración ($/cab/día)
          </Label>
          <div className="relative w-full min-w-0">
            <Input
              type="number"
              step={0.1}
              min={1}
              placeholder="1"
              {...costoRacionField}
              onKeyDown={(e) => {
                blockNegativeKeys(e)
                limitDecimalDigitsKeyDown(e, conPunto, 4, 4)
              }}
              onChange={(e) => {
                sanitizeDecimalChange(e, conPunto)
                costoRacionField?.onChange?.(e)
              }}
              className={`no-spinner h-10 w-full min-w-0 rounded-lg border bg-white px-3 pr-8 text-sm font-normal shadow-none placeholder:text-slate-300 ${costoRacionError ? 'border-red-400' : 'border-slate-200'}`}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-semibold text-slate-400">
              $
            </span>
          </div>
          {costoRacionError && (
            <p className="max-w-40 text-xs wrap-break-words text-red-500">
              {costoRacionError}
            </p>
          )}
        </div>
      </div>

      <p className="text-[13px] font-normal italic text-slate-400">
        ¿Qué razas hay en este rodeo?
      </p>

      <div className="grid sm:grid-cols-[minmax(0,1fr)_64px_auto] items-end gap-2">
        <div className="flex min-w-0 flex-col gap-1.5">
          <Label className="text-[13px] font-semibold text-slate-900">
            Raza
          </Label>
          <Select value={raza} onValueChange={setRaza}>
            <SelectTrigger className="w-full rounded-lg border border-slate-200 bg-white text-[13px] font-normal text-slate-900 shadow-none data-[size=default]:h-10 [&_span]:text-slate-900 [&_span[data-placeholder]]:text-slate-400">
              <SelectValue placeholder="Seleccioná una raza" />
            </SelectTrigger>
            <SelectContent className="border-slate-200 bg-white">
              {RAZAS_OPTIONS.map((o) => (
                <SelectItem
                  key={o.value}
                  value={o.value}
                  className="text-[13px] text-slate-900 hover:bg-slate-50"
                >
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-[13px] font-semibold text-slate-900">
            Cantidad
          </Label>
          <Input
            type="number"
            min={1}
            step={1}
            placeholder="1"
            value={cantidad}
            onKeyDown={(e) => {
              if (
                e.key === '.' ||
                e.key === ',' ||
                (e.currentTarget.value.length >= 3 && !isNaN(Number(e.key)))
              )
                e.preventDefault()
              blockNegativeKeys(e)
            }}
            onChange={(e) => {
              const val = e.target.value
              if (val !== '' && Number(val) < 0) return
              setCantidad(val)
              if (cantidadError) setCantidadError('')
            }}
            className="no-spinner h-10 rounded-lg border border-slate-200 bg-white px-3 text-[13px] shadow-none placeholder:text-slate-300"
          />
        </div>
        <button
          type="button"
          onClick={handleAgregar}
          disabled={!puedeAgregar}
          className="h-10 shrink-0 cursor-pointer rounded-lg bg-[#218A5B] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#1a6f49] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Agregar
        </button>
      </div>

      {razas.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {razas.map((item, i) => (
            <span
              key={`${item.raza}-${i}`}
              className="inline-flex items-center gap-1.5 rounded-md bg-[#82C9AC] py-1.5 pr-2 pl-3 text-xs font-semibold text-[#0B1001]"
            >
              {formatRazaChip(item.raza)} - {item.cantidad}
              <button
                type="button"
                onClick={() => handleQuitar(i)}
                className="flex h-4 w-4 cursor-pointer items-center justify-center rounded-full text-[#0B1001]/60 hover:bg-black/10 hover:text-[#0B1001]"
                aria-label={`Quitar ${formatRazaChip(item.raza)}`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
      {cantidadError && (
        <p className="max-w-40 text-xs wrap-break-words text-red-500">
          {cantidadError}
        </p>
      )}
      {razasError && (
        <p className="max-w-40 text-xs wrap-break-words text-red-500">
          {razasError}
        </p>
      )}
    </div>
  )
}
