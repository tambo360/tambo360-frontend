'use client'
import { ConfigurationFormInput } from '@/types/establishment/configuration'
import { RazasVacas, TipoRodeo } from '@/types/enums'
import { X } from 'lucide-react'
import { type UseFormRegister, type UseFormSetValue } from 'react-hook-form'
import { useEffect, useMemo, useState } from 'react'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

const RAZA_LABELS: Record<RazasVacas, string> = {
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
  const [searchRaza, setSearchRaza] = useState('')
  const [cantidad, setCantidad] = useState('')
  const [razas, setRazas] = useState<{ raza: string; cantidad: string }[]>([])

  useEffect(() => {
    setValue?.(`rodeos.${index}.tipoRodeo` as const, tipoRodeo)
  }, [setValue, index, tipoRodeo])

  const totalAnimales = useMemo(
    () => razas.reduce((acc, item) => acc + Number(item.cantidad), 0),
    [razas]
  )

  const filteredRazas = useMemo(
    () =>
      RAZAS_OPTIONS.filter((o) =>
        o.label.toLowerCase().includes(searchRaza.trim().toLowerCase())
      ),
    [searchRaza]
  )

  const syncRazasToForm = (items: { raza: string; cantidad: string }[]) => {
    setValue?.(
      `rodeos.${index}.razas` as const,
      items.map((item) => ({
        raza: item.raza as RazasVacas,
        cantRazaVacas: Number(item.cantidad),
      })),
      { shouldValidate: true, shouldDirty: true }
    )
  }

  const handleAgregar = () => {
    if (!raza || cantidad === '') return
    const cant = Number(cantidad)
    if (!Number.isFinite(cant) || cant <= 0) return
    const next = [...razas, { raza, cantidad }]
    setRazas(next)
    syncRazasToForm(next)
    setRaza('')
    setSearchRaza('')
    setCantidad('')
  }

  const handleQuitar = (i: number) => {
    const next = razas.filter((_, j) => j !== i)
    setRazas(next)
    syncRazasToForm(next)
  }

  return (
    <div className="flex flex-col gap-4 w-full lg:w-fit">
      <h3 className="text-[15px] font-semibold text-slate-900">{titulo}</h3>

      <div className="grid grid-cols-2 items-start gap-3">
        <div className="flex min-w-0 flex-col gap-1.5">
          <Label className="flex min-h-8 items-end text-xs leading-tight font-normal wrap-break-words text-slate-900">
            Cantidad de animales
          </Label>
          <p className="flex h-10 w-full min-w-0 items-center px-3 text-sm font-semibold text-slate-900">
            {totalAnimales}
          </p>
        </div>
        <div className="flex min-w-0 flex-col gap-1.5">
          <Label className="flex min-h-8 items-end text-xs leading-tight font-normal wrap-break-words text-slate-900">
            Costo de Ración ($/cab/día)
          </Label>
          <Input
            type="number"
            min={0}
            step="0.01"
            placeholder="000"
            {...register?.(`rodeos.${index}.costoRacion` as const, {
              valueAsNumber: true,
            })}
            className={`h-10 w-full min-w-0 rounded-lg border bg-white px-3 text-sm font-normal shadow-none placeholder:text-slate-300 focus-visible:border-[#29845A] focus-visible:ring-0 ${costoRacionError ? 'border-red-400' : 'border-slate-200'}`}
          />
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

      <div className="grid grid-cols-[minmax(0,1fr)_64px_auto] items-end gap-2">
        <div className="flex min-w-0 flex-col gap-1.5">
          <Label className="text-[13px] font-semibold text-slate-900">
            Raza
          </Label>
          <Combobox
            onValueChange={(value: string | null) => {
              const selected = value ?? ''
              setRaza(selected)
              setSearchRaza(selected ? formatRazaLabel(selected) : '')
            }}
          >
            <ComboboxInput
              placeholder="Seleccioná una raza"
              value={searchRaza}
              onChange={(e) => {
                const val = e.target.value
                setSearchRaza(val)
                if (val === '' || val !== formatRazaLabel(raza)) setRaza('')
              }}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white text-[13px] shadow-none focus-within:border-[#29845A] focus-within:ring-0 [&_input]:bg-transparent [&_input]:text-[13px] [&_input]:text-slate-900 [&_input]:placeholder:text-slate-400"
            />
            <ComboboxContent className="border-slate-200 bg-white">
              {filteredRazas.length === 0 && (
                <ComboboxEmpty>No se encontraron razas</ComboboxEmpty>
              )}
              <ComboboxList>
                {filteredRazas.map((o) => (
                  <ComboboxItem
                    key={o.value}
                    value={o.value}
                    className="text-[13px] text-slate-900 hover:bg-slate-50"
                  >
                    {o.label}
                  </ComboboxItem>
                ))}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-[13px] font-semibold text-slate-900">
            Cantidad
          </Label>
          <Input
            type="number"
            min={0}
            placeholder="000"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-[13px] shadow-none placeholder:text-slate-300 focus-visible:border-[#29845A] focus-visible:ring-0"
          />
        </div>
        <button
          type="button"
          onClick={handleAgregar}
          className="h-10 shrink-0 cursor-pointer rounded-lg bg-[#218A5B] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#1a6f49]"
        >
          Agregar
        </button>
      </div>

      {razas.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {razas.map((item, i) => (
            <span
              key={`${item.raza}-${i}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#29845A]/20 bg-white py-1 pr-1.5 pl-3 text-xs font-medium text-slate-700"
            >
              {formatRazaLabel(item.raza)} · {item.cantidad}
              <button
                type="button"
                onClick={() => handleQuitar(i)}
                className="flex h-4 w-4 cursor-pointer items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label={`Quitar ${formatRazaLabel(item.raza)}`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
      {razasError && (
        <p className="max-w-40 text-xs wrap-break-words text-red-500">
          {razasError}
        </p>
      )}
    </div>
  )
}
