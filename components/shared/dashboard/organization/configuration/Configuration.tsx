'use client'
import {
  configurationSchema,
  ConfigurationData,
  ConfigurationFormInput,
  TIPOS_SEGUIMIENTO_RODEO,
} from '@/types/establishment/configuration'
import {
  TipoOrdenie,
  TipoSeguimiento,
  VentaLeche,
  TipoRodeo,
} from '@/types/enums'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import { useForm, type UseFormRegister } from 'react-hook-form'
import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import { cn } from '@/lib/utils'
import { useProvince } from '@/hooks/ubication/useProvince'
import { useLocality } from '@/hooks/ubication/useLocality'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'
import { Label } from '@/components/ui/label'
import { useDebounce } from 'use-debounce'
import { useUpdateConfiguration } from '@/hooks/establishment/useUpdateConfiguration'
import { useParams, usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'

const TIPO_ORDENIE_OPTIONS: { value: TipoOrdenie; Label: string }[] = [
  { value: TipoOrdenie.BALDE, Label: 'Balde' },
  { value: TipoOrdenie.LINEA, Label: 'Línea' },
  { value: TipoOrdenie.ESPINA_DE_PESCADO, Label: 'Espina de pescado' },
  { value: TipoOrdenie.ROTATIVO, Label: 'Rotativo' },
  { value: TipoOrdenie.MANUAL, Label: 'Manual' },
  { value: TipoOrdenie.OTRO, Label: 'Otro' },
]

const DESTINO_PRODUCTO_OPTIONS: { value: VentaLeche; label: string }[] = [
  { value: VentaLeche.USINA, label: 'Industria Grande' },
  { value: VentaLeche.COOPERATIVA, label: 'Cooperativa Lechera' },
  { value: VentaLeche.FABRICA_PROPIA, label: 'Quesería/ Elaboración propia' },
  { value: VentaLeche.VARIOS, label: 'Venta directa/Mercado Local' },
]

// Clase reutilizable para el look "puntico" del radio (aro + relleno al seleccionar)
const RADIO_DOT_CLASS =
  'appearance-none w-5 h-5 shrink-0 rounded-full border-2 border-slate-300 bg-white ' +
  'checked:border-[#29845A] checked:bg-[#29845A] ' +
  'checked:shadow-[inset_0_0_0_3px_white] ' +
  'ring-0 checked:ring-4 checked:ring-[#29845A]/15 ' +
  'transition-all duration-150 cursor-pointer ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29845A]'

// Clamp "al tipear": corrige a 0 ni bien el valor baja de 0 y reenvía el
// evento al onChange de RHF para que el form quede sincronizado.
// `min={0}` solo frena las flechitas del spinner, no el tipeo manual;
// el "-" intermedio (NaN) se deja pasar para no pelear el tipeo.
function clampNegativeToZero(
  e: ChangeEvent<HTMLInputElement>,
  rhfOnChange: (e: ChangeEvent<HTMLInputElement>) => void
) {
  const n = e.target.valueAsNumber
  if (e.target.value !== '' && !Number.isNaN(n) && n < 0) {
    e.target.value = '0'
  }
  rhfOnChange(e)
}

const RAZAS_OPTIONS = [
  'Holando Argentino',
  'Jersey',
  'Pardo Suizo',
  'Gir Lechero',
  'Cruzas',
]

function RodeoCategoriaCard({
  titulo,
  register,
  cantVacasError,
  costoRacionError,
}: {
  titulo: string
  register?: UseFormRegister<ConfigurationFormInput>
  cantVacasError?: string
  costoRacionError?: string
}) {
  const [raza, setRaza] = useState('')
  const [searchRaza, setSearchRaza] = useState('')
  const [cantidad, setCantidad] = useState('')
  const [razas, setRazas] = useState<{ raza: string; cantidad: string }[]>([])

  const filteredRazas = useMemo(
    () =>
      RAZAS_OPTIONS.filter((r) =>
        r.toLowerCase().includes(searchRaza.trim().toLowerCase())
      ),
    [searchRaza]
  )

  const handleAgregar = () => {
    if (!raza || !cantidad) return
    setRazas((prev) => [...prev, { raza, cantidad }])
    setRaza('')
    setSearchRaza('')
    setCantidad('')
  }

  const handleQuitar = (index: number) => {
    setRazas((prev) => prev.filter((_, i) => i !== index))
  }

  // Solo modo único (register definido): separamos el onChange de RHF
  // para envolverlo con el clamp a 0 sin perder el registro del campo.
  const cantVacasReg = register?.('rodeos.0.cantVacas', {
    valueAsNumber: true,
  })
  const { onChange: onCantVacasChange, ...cantVacasRest } = cantVacasReg ?? {}
  const costoRacionReg = register?.('rodeos.0.costoRacion', {
    valueAsNumber: true,
  })
  const { onChange: onCostoRacionChange, ...costoRacionRest } =
    costoRacionReg ?? {}

  return (
    <div className="flex flex-col gap-4 w-full lg:w-fit">
      <h3 className="text-[15px] font-semibold text-slate-900">{titulo}</h3>

      <div className="grid grid-cols-2 items-start gap-3">
        <div className="flex min-w-0 flex-col gap-1.5">
          <Label className="flex min-h-8 items-end text-xs leading-tight font-normal wrap-break-words text-slate-900">
            Cantidad de animales
          </Label>
          <Input
            type="number"
            min={0}
            placeholder="000"
            {...(register && onCantVacasChange
              ? {
                  ...cantVacasRest,
                  onChange: (e: ChangeEvent<HTMLInputElement>) =>
                    clampNegativeToZero(e, onCantVacasChange),
                }
              : {})}
            className="h-10 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal shadow-none placeholder:text-slate-300 focus-visible:border-[#29845A] focus-visible:ring-0"
          />
          {cantVacasError && (
            <p className="max-w-40 text-xs wrap-break-words text-red-500">
              {cantVacasError}
            </p>
          )}
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
            {...(register && onCostoRacionChange
              ? {
                  ...costoRacionRest,
                  onChange: (e: ChangeEvent<HTMLInputElement>) =>
                    clampNegativeToZero(e, onCostoRacionChange),
                }
              : {})}
            className="h-10 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal shadow-none placeholder:text-slate-300 focus-visible:border-[#29845A] focus-visible:ring-0"
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
              setSearchRaza(selected)
            }}
          >
            <ComboboxInput
              placeholder="Seleccioná una raza"
              value={searchRaza}
              onChange={(e) => {
                const val = e.target.value
                setSearchRaza(val)
                if (val === '' || val !== raza) setRaza('')
              }}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white text-[13px] shadow-none focus-within:border-[#29845A] focus-within:ring-0 [&_input]:bg-transparent [&_input]:text-[13px] [&_input]:text-slate-900 [&_input]:placeholder:text-slate-400"
            />
            <ComboboxContent className="border-slate-200 bg-white">
              {filteredRazas.length === 0 && (
                <ComboboxEmpty>No se encontraron razas</ComboboxEmpty>
              )}
              <ComboboxList>
                {filteredRazas.map((r) => (
                  <ComboboxItem
                    key={r}
                    value={r}
                    className="text-[13px] text-slate-900 hover:bg-slate-50"
                  >
                    {r}
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
              {item.raza} · {item.cantidad}
              <button
                type="button"
                onClick={() => handleQuitar(i)}
                className="flex h-4 w-4 cursor-pointer items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label={`Quitar ${item.raza}`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

const Configuration = () => {
  const [searchProvince, setSearchProvince] = useState('')
  const [idProvince, setIdProvince] = useState<string | undefined>('')
  const [searchLocality, setSearchLocality] = useState('')
  const [selectedLocalityName, setSelectedLocalityName] = useState('')
  const [searchP] = useDebounce(searchProvince, 300)
  const [searchL] = useDebounce(searchLocality, 300)
  const [registrarRodeo, setRegistrarRodeo] = useState<boolean | undefined>(
    undefined
  )
  const [step, setStep] = useState(1)
  const pathname = usePathname()
  const router = useRouter()
  const params = useParams()

  const idParam = params?.id
  const idEstablecimiento = Array.isArray(idParam)
    ? (idParam[0] ?? '')
    : (idParam ?? '')

  const { data: province } = useProvince({ name: searchP })
  const { data: locality } = useLocality({ id: idProvince, search: searchL })

  const {
    mutateAsync: sendConfiguration,
    isPending,
    error,
  } = useUpdateConfiguration()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm<ConfigurationFormInput, any, ConfigurationData>({
    resolver: zodResolver(configurationSchema),
  })

  const animales = watch('animales')
  const promLitros = watch('promLitros')

  const esRodeoUnico = !Number.isNaN(promLitros) && promLitros < 2000
  const lastStep = esRodeoUnico && registrarRodeo ? 2 : 1

  useEffect(() => {
    if (!esRodeoUnico) {
      // Normalizar: exactamente un rodeo por cada tipo de seguimiento
      // RODEO (sin UNICO_ORDENIE: no viaja en este modo), preservando
      // los valores ya presentes. Sin esto el superRefine RODEO
      // ("uno de cada tipo") bloquea el submit con rodeos heredados
      // del otro modo.
      const current = getValues('rodeos') ?? []
      const byTipo = new Map(current.map((r) => [r.tipoRodeo, r]))
      const normalized = TIPOS_SEGUIMIENTO_RODEO.map((tipo) => ({
        tipoRodeo: tipo,
        cantVacas: byTipo.get(tipo)?.cantVacas ?? 1,
        costoRacion: byTipo.get(tipo)?.costoRacion ?? 1,
      }))
      const same =
        current.length === normalized.length &&
        normalized.every(
          (n, i) =>
            current[i]?.tipoRodeo === n.tipoRodeo &&
            current[i]?.cantVacas === n.cantVacas &&
            current[i]?.costoRacion === n.costoRacion
        )
      if (!same) {
        setValue('rodeos', normalized, { shouldValidate: true })
      }

      if (getValues('animales') !== undefined) {
        setValue('animales', undefined)
      }
    }

    if (esRodeoUnico) {
      const current = getValues('rodeos')
      if (
        !current ||
        current.length !== 1 ||
        current[0]?.tipoRodeo !== TipoRodeo.UNICO_ORDENIE
      ) {
        setValue('rodeos', [{ tipoRodeo: TipoRodeo.UNICO_ORDENIE }] as any)
      }

      if (registrarRodeo === true) {
        const currentAnimales = getValues('animales')
        if (!currentAnimales || currentAnimales.length === 0) {
          setValue('animales', [
            { codigo: '', nombre: '', categoria: 'ORDENE', estado: 'SANA' },
          ])
        }
      } else {
        if (getValues('animales') !== undefined) {
          setValue('animales', undefined)
        }
      }
    }
  }, [esRodeoUnico, registrarRodeo, setValue, getValues])

  useEffect(() => {
    if (!esRodeoUnico) setRegistrarRodeo(undefined)

    if (step > lastStep) setStep(lastStep)
  }, [esRodeoUnico, step, lastStep])

  const onSubmit = (data: ConfigurationData) => {
    const inner = (data as any).data ?? data
    const selectedTipo = esRodeoUnico
      ? TipoSeguimiento.INDIVIDUAL
      : TipoSeguimiento.RODEO

    const payload = {
      TipoSeguimiento: selectedTipo,
      idEstablecimiento,
      ...inner,
    }

    console.log('PAYLOAD >>>', payload)
    // sendConfiguration(payload, {
    //   onSuccess: () => {
    //     if (pathname.includes('/cuestionario')) {
    //       toast.success('Configuración guardada correctamente', {
    //         description:
    //           'Ya podés invitar a tu equipo o empezar a usar tu establecimiento',
    //         position: 'top-center',
    //         duration: 5000,
    //       })
    //       router.replace(pathname.replace('cuestionario', 'invitar'))
    //     } else {
    //       toast.success('Configuración guardada correctamente', {
    //         position: 'top-center',
    //         duration: 5000,
    //       })
    //     }

    //     router.push(pathname.replace('cuestionario', 'invitar'))
    //   },
    // })
  }

  return (
    <div
      className={`flex flex-col gap-10 w-full ${pathname.includes('cuestionario') ? 'p-8' : ''}`}
    >
      <header className="flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <h1 className="text-4xl font-bold text-slate-900">
            Configura tu Perfil
          </h1>
        </div>
        <p className="text-slate-500 text-lg">
          Ayudanos a personalizar la experiencia de Tambo360 con los datos
          actuales de tu establecimiento
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-12">
        {step == 1 ? (
          <>
            <section className="flex flex-col gap-4 w-fit">
              <p className="text-[15px] leading-6 text-slate-900">
                ¿Dónde está tu tambo?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    className={`font-bold ${errors.ubicacion?.provincia ? 'text-[#B91C1C]' : 'text-[#0B1001]'}`}
                  >
                    Provincia*
                  </Label>
                  <Combobox
                    onValueChange={(id: any) => {
                      const selectedProv = province?.provincias.find(
                        (p) => p.id === id
                      )

                      if (!selectedProv) return

                      setIdProvince(id)

                      setSearchProvince(selectedProv.nombre)

                      setValue('ubicacion.provincia', selectedProv.nombre)

                      setSelectedLocalityName('')
                      setSearchLocality('')
                      setValue('ubicacion.localidad', '')
                    }}
                  >
                    <ComboboxInput
                      className={`h-14 w-full ${errors.ubicacion?.provincia ? 'border-[#F87171] bg-[#FCE8E5]/30' : 'bg-[#F9F9F7] border-[#D1CFCA]'}`}
                      placeholder="Seleccione una provincia"
                      value={searchProvince}
                      onChange={(e) => {
                        const val = e.target.value
                        setSearchProvince(val)

                        if (val === '') {
                          setIdProvince('')
                          setValue('ubicacion.provincia', '')
                        }
                      }}
                      data-testid="province-combobox-input"
                    />
                    <ComboboxContent
                      className="bg-white border-[#D1CFCA] z-100"
                      data-testid="province-combobox-content"
                    >
                      {!province?.provincias.length && (
                        <ComboboxEmpty>
                          No se encontraron provincias
                        </ComboboxEmpty>
                      )}
                      <ComboboxList>
                        {province?.provincias.map((item) => (
                          <ComboboxItem
                            key={item.id}
                            value={item.id}
                            className="hover:bg-[#0B1001]/5"
                            data-testid={`province-option-${item.id}`}
                          >
                            {item.nombre}
                          </ComboboxItem>
                        ))}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                  {errors.ubicacion?.provincia && (
                    <p className="text-xs font-medium text-[#B91C1C]">
                      {errors.ubicacion?.provincia.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    className={`font-bold ${errors.ubicacion?.localidad ? 'text-[#B91C1C]' : 'text-[#0B1001]'}`}
                  >
                    Localidad*
                  </Label>
                  <Combobox
                    disabled={!idProvince}
                    onValueChange={(id: any) => {
                      const selectedLoc = locality?.municipios.find(
                        (l) => l.id === id
                      )

                      if (!selectedLoc) return

                      setSelectedLocalityName(selectedLoc.nombre)
                      setSearchLocality(selectedLoc.nombre)

                      setValue('ubicacion.localidad', selectedLoc.nombre)
                    }}
                  >
                    <ComboboxInput
                      className={`h-14 w-full ${errors.ubicacion?.localidad ? 'border-[#F87171] bg-[#FCE8E5]/30' : 'bg-[#F9F9F7] border-[#D1CFCA]'}`}
                      placeholder={
                        idProvince
                          ? 'Seleccione una localidad'
                          : 'Primero seleccione una provincia'
                      }
                      value={searchLocality}
                      onChange={(e: { target: { value: any } }) => {
                        const val = e.target.value
                        setSearchLocality(val)
                        if (val !== selectedLocalityName) {
                          setSelectedLocalityName('')
                          setValue('ubicacion.localidad', '')
                        }
                      }}
                      disabled={!idProvince}
                      data-testid="locality-combobox-input"
                    />
                    <ComboboxContent
                      className="bg-white border-[#D1CFCA] z-100"
                      data-testid="locality-combobox-content"
                    >
                      {!locality?.municipios.length && (
                        <ComboboxEmpty>
                          No se encontraron localidades
                        </ComboboxEmpty>
                      )}
                      <ComboboxList>
                        {locality?.municipios.map((item) => (
                          <ComboboxItem
                            key={item.id}
                            value={item.id}
                            className="hover:bg-[#0B1001]/5"
                            data-testid={`locality-option-${item.id}`}
                          >
                            {item.nombre}
                          </ComboboxItem>
                        ))}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                  {errors.ubicacion?.localidad && (
                    <p className="text-xs font-medium text-[#B91C1C]">
                      {errors.ubicacion?.localidad.message}
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-7">
              <p className="text-[15px] leading-6 text-slate-900">
                ¿Cuántas veces al día ordeñás?
              </p>
              <div className="flex flex-wrap items-center gap-x-10 gap-y-3">
                {[1, 2, 3].map((n) => (
                  <Label
                    key={n}
                    className="flex items-center gap-3 cursor-pointer text-[15px] font-normal text-slate-900"
                  >
                    <input
                      type="radio"
                      value={n}
                      {...register('cantOrdenie', { valueAsNumber: true })}
                      className={RADIO_DOT_CLASS}
                    />
                    {n === 1 ? '1 vez' : `${n} veces`}
                  </Label>
                ))}
              </div>
              {errors.cantOrdenie && (
                <p className="text-xs text-red-500">
                  {errors.cantOrdenie.message}
                </p>
              )}
            </section>

            <section className="flex flex-col gap-7">
              <p className="text-[15px] leading-6 text-slate-900">
                ¿Que tipo de ordeñe usas?
              </p>
              <div className="flex flex-wrap items-center gap-x-10 gap-y-3">
                {TIPO_ORDENIE_OPTIONS.map(({ value, Label: label }) => (
                  <Label
                    key={value}
                    className="flex items-center gap-3 cursor-pointer text-[15px] font-normal text-slate-900"
                  >
                    <input
                      type="radio"
                      value={value}
                      {...register('tipoOrdenie', { valueAsNumber: true })}
                      className={RADIO_DOT_CLASS}
                    />
                    {label}
                  </Label>
                ))}
              </div>
              {errors.tipoOrdenie && (
                <p className="text-xs text-red-500">
                  {errors.tipoOrdenie.message}
                </p>
              )}
            </section>

            <section className="flex flex-col gap-7 w-fit">
              <p className="text-[15px] leading-6 text-slate-900">
                ¿Cuántos litros producís en promedio por día?
              </p>
              <div className="relative w-full max-w-4xl">
                <Input
                  type="number"
                  step="0.1"
                  min={0}
                  placeholder="000"
                  {...register('promLitros', { valueAsNumber: true })}
                  className={cn(
                    'w-full max-w-4xl no-spinner p-4 border-2 rounded-xl outline-none bg-slate-50/50 transition-colors',
                    errors.promLitros
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-slate-200 focus:border-[#29845A]'
                  )}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                  lts
                </span>
              </div>
              {errors.promLitros && (
                <p className="text-xs text-red-500">
                  {errors.promLitros.message}
                </p>
              )}
            </section>

            <section className="flex flex-col gap-7">
              <p className="text-[15px] leading-6 text-slate-900">
                ¿Cuál es el destino del producto?
              </p>
              <div className="flex flex-wrap items-center gap-x-10 gap-y-3">
                {DESTINO_PRODUCTO_OPTIONS.map(({ value, label }) => (
                  <Label
                    key={value}
                    className="flex items-center gap-3 cursor-pointer text-[15px] font-normal text-slate-900"
                  >
                    <input
                      type="radio"
                      value={value}
                      {...register('ventaLeche')}
                      className={RADIO_DOT_CLASS}
                    />
                    {label}
                  </Label>
                ))}
              </div>
              {errors.ventaLeche && (
                <p className="text-xs text-red-500">
                  {errors.ventaLeche.message}
                </p>
              )}
            </section>

            <section className="flex flex-col gap-7 w-fit">
              <div className="flex flex-col gap-1">
                <p className="text-[15px] leading-6 text-slate-900">
                  ¿Cuál es el DEL promedio de tu rodeo lechero hoy?
                </p>
                <p className="text-[13px] leading-5 text-slate-500">
                  *Recordá que un rodeo eficiente suele promediar entre 150 y
                  180 días.
                </p>
              </div>
              <div className="relative w-full max-w-4xl">
                <Input
                  type="number"
                  step={1}
                  min={0}
                  inputMode="numeric"
                  placeholder="000"
                  {...register('promDEL', { valueAsNumber: true })}
                  className={cn(
                    'w-full max-w-4xl no-spinner p-4 border-2 rounded-xl outline-none bg-slate-50/50 transition-colors',
                    errors.promDEL
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-slate-200 focus:border-[#29845A]'
                  )}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                  días
                </span>
              </div>
              {errors.promDEL && (
                <p className="text-xs text-red-500">{errors.promDEL.message}</p>
              )}
            </section>

            <section className="flex flex-col gap-7 w-fit">
              <p className="text-[15px] leading-6 text-slate-900">
                ¿Cuál es tu precio de venta actual por litro ($/Lts)?
              </p>
              <div className="relative w-full max-w-4xl">
                <Input
                  type="number"
                  step="0.1"
                  min={0}
                  placeholder="000"
                  {...register('precioLitro', { valueAsNumber: true })}
                  className={cn(
                    'w-full max-w-4xl no-spinner p-4 border-2 rounded-xl outline-none bg-slate-50/50 transition-colors',
                    errors.precioLitro
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-slate-200 focus:border-[#29845A]'
                  )}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                  $/Lts
                </span>
              </div>
              {errors.precioLitro && (
                <p className="text-xs text-red-500">
                  {errors.precioLitro.message}
                </p>
              )}
            </section>

            {esRodeoUnico && (
              <section className="flex flex-col gap-7">
                <p className="text-[15px] leading-6 text-slate-900">
                  ¿Querés registrar tu rodeo?
                </p>
                <div className="flex flex-wrap items-center gap-x-10 gap-y-3">
                  {[
                    { value: true, label: 'Aceptar' },
                    { value: false, label: 'Cancelar' },
                  ].map(({ value, label }) => (
                    <Label
                      key={label}
                      className="flex items-center gap-3 cursor-pointer text-[15px] font-normal text-slate-900"
                    >
                      <input
                        type="radio"
                        name="registrarRodeo"
                        checked={registrarRodeo === value}
                        onChange={() => setRegistrarRodeo(value)}
                        className={RADIO_DOT_CLASS}
                      />
                      {label}
                    </Label>
                  ))}
                </div>
              </section>
            )}

            <section className="flex flex-col gap-4">
              <p className="text-[15px] leading-6 text-slate-900">
                ¿Cuántos animales tenés por categoría?
              </p>
              <div className="flex gap-8 flex-col lg:flex-row rounded-2xl bg-[#F1F5F9] p-6 w-full lg:w-fit">
                {(esRodeoUnico
                  ? ['Rodeo único']
                  : ['Rodeo Alto', 'Rodeo Bajo', 'Rodeo en seca']
                ).map((categoria) => (
                  <RodeoCategoriaCard
                    key={categoria}
                    titulo={categoria}
                    register={esRodeoUnico ? register : undefined}
                    cantVacasError={
                      esRodeoUnico
                        ? (errors.rodeos as any)?.[0]?.cantVacas?.message
                        : undefined
                    }
                    costoRacionError={
                      esRodeoUnico
                        ? (errors.rodeos as any)?.[0]?.costoRacion?.message
                        : undefined
                    }
                  />
                ))}
              </div>
            </section>
          </>
        ) : (
          <div className="flex flex-col gap-6 py-8">
            {esRodeoUnico ? (
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  Registro Individual de Animales
                </h2>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="grid grid-cols-12 gap-4 items-center font-semibold text-sm py-2 border-b">
                    <div className="col-span-2">RP/N°</div>
                    <div className="col-span-3">Nombre</div>
                    <div className="col-span-3">Categoría</div>
                    <div className="col-span-3">Estado</div>
                    <div className="col-span-1" />
                  </div>

                  {(animales ?? []).map((a: any, idx: number) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-4 items-center py-3 border-b"
                    >
                      <div className="col-span-2">
                        <Input
                          className="w-full border rounded px-2 h-9"
                          {...register(`animales.${idx}.codigo` as const)}
                          defaultValue={a.codigo}
                        />
                      </div>
                      <div className="col-span-3">
                        <Input
                          className="w-full border rounded px-2 h-9"
                          {...register(`animales.${idx}.nombre` as const)}
                          defaultValue={a.nombre}
                        />
                      </div>
                      <div className="col-span-3">
                        <select
                          className="w-full border rounded px-2 h-9"
                          {...register(`animales.${idx}.categoria` as const)}
                        >
                          <option value="ORDENE">Ordeñe</option>
                          <option value="SECAS">Secas</option>
                          <option value="PREPARTO">Preparto</option>
                        </select>
                      </div>
                      <div className="col-span-3">
                        <select
                          className="w-full border rounded px-2 h-9"
                          {...register(`animales.${idx}.estado` as const)}
                        >
                          <option value="MATITIS">Mastitis</option>
                          <option value="PREPARTO">Preparto</option>
                          <option value="TRATAMIENTO">Tratamiento</option>
                          <option value="DESCARTE">Descarte</option>
                        </select>
                      </div>
                      <div className="col-span-1 flex justify-center">
                        <button
                          type="button"
                          onClick={() => {
                            const current = animales ?? []
                            const copy = [...current]
                            copy.splice(idx, 1)
                            setValue('animales', copy)
                          }}
                          className="text-red-500"
                        >
                          -
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 flex justify-between items-center">
                    <span className="text-sm text-slate-500">
                      Mostrando {(animales ?? []).length} registros
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const current = animales ?? []
                          setValue('animales', [
                            ...current,
                            {
                              codigo: '',
                              nombre: '',
                              categoria: 'ORDENE',
                              estado: 'SANA',
                            },
                          ])
                        }}
                        className="px-3 py-2 bg-emerald-100 rounded border text-emerald-700"
                      >
                        + Añadir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 items-center justify-center py-20"></div>
            )}
          </div>
        )}

        {error?.response?.data?.message && (
          <p className="text-xs text-red-500 text-center">
            {error.response.data.message}
          </p>
        )}

        {/* Footer de Navegación */}
        <footer className="flex flex-col sm:flex-row items-stretch justify-end sm:items-center gap-4 pt-8 border-t border-slate-100">
          {pathname.includes('cuestionario') && (
            <div className="flex gap-4 w-full sm:w-auto">
              <button
                type="button"
                className="px-12 py-4 bg-emerald-200 text-emerald-800 font-bold rounded-xl hover:bg-emerald-300 transition-all cursor-pointer w-full sm:w-auto"
                onClick={() =>
                  step != 1 ? setStep(step - 1) : router.push('/organizaciones')
                }
                disabled={isPending}
              >
                Atrás
              </button>
            </div>
          )}

          <div className="flex gap-4 justify-end">
            <button
              type="button"
              disabled={
                isPending || (step === 2 && (animales ?? []).length === 0)
              }
              className="px-12 py-4 bg-emerald-700 text-white font-bold rounded-xl hover:bg-emerald-800 flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer w-full sm:w-auto"
              onClick={() => {
                if (step !== lastStep) {
                  setStep(step + 1)
                } else {
                  handleSubmit(onSubmit)()
                }
              }}
            >
              {isPending
                ? 'Guardando...'
                : step === lastStep
                  ? 'Finalizar Configuración'
                  : 'Siguiente'}{' '}
            </button>
          </div>
        </footer>
      </form>
    </div>
  )
}

export default Configuration
