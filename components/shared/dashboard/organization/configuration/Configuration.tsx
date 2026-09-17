'use client'
import {
  configurationSchema,
  ConfigurationData,
  ConfigurationFormInput,
} from '@/types/establishment/configuration'
import {
  CategoriaAnimal,
  EstadoAnimal,
  RazasVacas,
  TipoOrdenie,
  TipoRodeo,
  TipoSeguimiento,
  VentaLeche,
} from '@/types/enums'
import { zodResolver } from '@hookform/resolvers/zod'
import { FieldErrors, useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
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
import { usePathname, useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import RodeoCategoriaCard, {
  RAZA_LABELS,
} from '@/components/shared/dashboard/organization/configuration/RodeoCategoriaCard'
import { toast } from 'sonner'

const TIPO_ORDENIE_OPTIONS: { value: TipoOrdenie; Label: string }[] = [
  { value: TipoOrdenie.BALDE, Label: 'Balde' },
  { value: TipoOrdenie.LINEA, Label: 'Línea' },
  { value: TipoOrdenie.ESPINA_DE_PESCADO, Label: 'Espina de pescado' },
  { value: TipoOrdenie.ROTATIVO, Label: 'Rotativo' },
  { value: TipoOrdenie.MANUAL, Label: 'Manual' },
  { value: TipoOrdenie.OTRO, Label: 'Otro' },
]

const DESTINO_PRODUCTO_OPTIONS: { value: VentaLeche; label: string }[] = [
  { value: VentaLeche.USINA, label: 'Usina' }, // ✅ Corregido typo
  { value: VentaLeche.COOPERATIVA, label: 'Cooperativa' },
  { value: VentaLeche.ELABORACION_PROPIA, label: 'Elaboración propia' },
  { value: VentaLeche.VENTA_DIRECTA_MERCADO_LOCAL, label: 'Mercado Local' },
]

const CATEGORIA_ANIMAL_OPTIONS: { value: CategoriaAnimal; label: string }[] = [
  { value: CategoriaAnimal.ORDENE, label: 'Ordeñe' },
  { value: CategoriaAnimal.SECAS, label: 'Secas' },
]

const ESTADO_ANIMAL_OPTIONS: { value: EstadoAnimal; label: string }[] = [
  { value: EstadoAnimal.SANO, label: 'Sano' },
  { value: EstadoAnimal.MASTITIS, label: 'Mastitis' }, // ✅ Corregido typo (era MATITIS)
  { value: EstadoAnimal.TRATAMIENTO, label: 'Tratamiento' },
  { value: EstadoAnimal.PREPARTO, label: 'Preparto' },
]

const RADIO_DOT_CLASS =
  'appearance-none w-5 h-5 shrink-0 rounded-full border-2 border-slate-300 bg-white ' +
  'checked:border-[#29845A] checked:bg-[#29845A] ' +
  'checked:shadow-[inset_0_0_0_3px_white] ' +
  'ring-0 checked:ring-4 checked:ring-[#29845A]/15 ' +
  'transition-all duration-150 cursor-pointer ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29845A]'

// Detecta submits bloqueados por validación (errores "silenciosos")
const collectErrorMessages = (
  errs: FieldErrors<ConfigurationFormInput>
): string[] => {
  const messages: string[] = []
  const walk = (node: unknown) => {
    if (!node || typeof node !== 'object') return
    if (Array.isArray(node)) {
      node.forEach(walk)
      return
    }
    const record = node as Record<string, unknown>
    if (typeof record.message === 'string' && record.message) {
      messages.push(record.message)
    }
    Object.keys(record).forEach((key) => {
      if (key !== 'message' && key !== 'ref' && key !== 'type') {
        walk(record[key])
      }
    })
  }
  walk(errs)
  return messages
}

// Validador de errores silenciosos
const handleInvalidSubmit = (errs: FieldErrors<ConfigurationFormInput>) => {
  const messages = collectErrorMessages(errs)
  console.warn('[Configuration] submit bloqueado por validación:', errs)
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
    clearErrors,
    formState: { errors },
  } = useForm<ConfigurationFormInput, any, ConfigurationData>({
    resolver: zodResolver(configurationSchema),
    defaultValues: {
      ubicacion: { provincia: '', localidad: '' },
    },
  })

  const animales = watch('animales')
  const promLitros = watch('promLitros')

  const esRodeoUnico = !Number.isNaN(promLitros) && promLitros < 2000
  const lastStep = esRodeoUnico && registrarRodeo ? 2 : 1

  useEffect(() => {
    if (!esRodeoUnico) setRegistrarRodeo(undefined)
    if (step > lastStep) setStep(lastStep)
  }, [esRodeoUnico, step, lastStep])

  useEffect(() => {
    const tipos = esRodeoUnico
      ? [TipoRodeo.UNICO_ORDENIE, TipoRodeo.UNICO_SECA]
      : [
          TipoRodeo.ALTA_PRODUCCION,
          TipoRodeo.BAJA_PRODUCCION,
          TipoRodeo.VACAS_SECAS,
        ]

    setValue('rodeos', tipos.map((tipoRodeo) => ({ tipoRodeo })) as any)
    for (let i = 0; i < tipos.length; i++) {
      setValue(`rodeos.${i}.costoRacion` as const, undefined as any, {
        shouldDirty: true,
      })
      setValue(`rodeos.${i}.razas` as const, undefined as any, {
        shouldDirty: true,
      })
    }
    tipos.forEach((tipoRodeo, i) => {
      setValue(`rodeos.${i}.tipoRodeo` as const, tipoRodeo)
    })
    clearErrors('rodeos')
  }, [esRodeoUnico, setValue, clearErrors])

  const onSubmit = (data: ConfigurationData) => {
    const selectedTipo = esRodeoUnico
      ? TipoSeguimiento.INDIVIDUAL
      : TipoSeguimiento.RODEO

    const rodeosCompletos = (data.rodeos ?? [])
      .filter((r) => Number.isFinite(r.costoRacion))
      .map((r) => ({
        tipoRodeo: r.tipoRodeo,
        costoRacion: r.costoRacion as number,
        razas: (r.razas ?? []).map((item) => ({
          raza: item.raza,
          cantVacas: item.cantVacas as number,
        })),
      }))

    const isIndividual = selectedTipo === TipoSeguimiento.INDIVIDUAL

    const payload = {
      TipoSeguimiento: selectedTipo,
      ...data,
      ...(isIndividual
        ? {
            rodeos: undefined,
            animales: data.animales ?? [
              {
                // ✅ CORREGIDO: Código dinámico para evitar colisiones en la BD
                codigo: `TEMP-${Date.now()}`,
                raza: 'JERSEY',
                categoria: 'ORDENE',
                estado: 'SANO',
                nombre: 'vaca-fallback',
              },
            ],
          }
        : { animales: undefined, rodeos: rodeosCompletos }),
    }

    sendConfiguration(payload, {
      onSuccess: () => {
        if (pathname.includes('/cuestionario')) {
          toast.success('Configuración guardada correctamente', {
            description:
              'Ya podés invitar a tu equipo o empezar a usar tu establecimiento',
            position: 'top-center',
            duration: 5000,
          })
          router.replace(pathname.replace('cuestionario', 'invitar'))
        } else {
          toast.success('Configuración guardada correctamente', {
            position: 'top-center',
            duration: 5000,
          })
        }
        router.push(pathname.replace('cuestionario', 'invitar'))
      },
    })
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

      <form
        onSubmit={handleSubmit(onSubmit, handleInvalidSubmit)}
        className="flex flex-col gap-8"
      >
        {step == 1 ? (
          <>
            <section className="flex flex-col gap-4 w-full">
              <p className="text-[15px] leading-6 text-slate-900">
                ¿Dónde está tu tambo?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-[15px] leading-6 text-slate-900">
                    Provincia*
                  </p>
                  <Combobox
                    onValueChange={(id: any) => {
                      const selectedProv = province?.provincias.find(
                        (p) => p.id === id
                      )
                      if (!selectedProv) return
                      setIdProvince(id)
                      setSearchProvince(selectedProv.nombre)
                      setValue('ubicacion.provincia', selectedProv.nombre, {
                        shouldValidate: true,
                      })
                      setSelectedLocalityName('')
                      setSearchLocality('')
                    }}
                  >
                    <ComboboxInput
                      className={`h-14 w-full max-w-110 ${errors.ubicacion?.provincia ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-[#29845A]'}`}
                      placeholder="Seleccione una provincia"
                      value={searchProvince}
                      onChange={(e) => {
                        const val = e.target.value
                        setSearchProvince(val)
                        if (val === '') {
                          setIdProvince('')
                          setValue('ubicacion.provincia', '', {
                            shouldValidate: true,
                          })
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
                    <p className="text-xs font-medium text-red-500">
                      {errors.ubicacion?.provincia.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-[15px] leading-6 text-slate-900">
                    Localidad*
                  </p>
                  <Combobox
                    disabled={!idProvince}
                    onValueChange={(id: any) => {
                      const selectedLoc = locality?.municipios.find(
                        (l) => l.id === id
                      )
                      if (!selectedLoc) return
                      setSelectedLocalityName(selectedLoc.nombre)
                      setSearchLocality(selectedLoc.nombre)
                      setValue('ubicacion.localidad', selectedLoc.nombre, {
                        shouldValidate: true,
                      })
                    }}
                  >
                    <ComboboxInput
                      className={`h-14 w-full max-w-110 ${errors.ubicacion?.localidad ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-[#29845A]'}`}
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
                          setValue('ubicacion.localidad', '', {
                            shouldValidate: true,
                          })
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
                    <p className="text-xs font-medium text-red-500">
                      {errors.ubicacion?.localidad.message}
                    </p>
                  )}
                </div>
              </div>
              {typeof (errors.ubicacion as any)?.message === 'string' && (
                <p className="text-xs font-medium text-red-500">
                  {(errors.ubicacion as any).message}
                </p>
              )}
            </section>

            <section className="flex flex-col gap-3">
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

            <section className="flex flex-col gap-3">
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
                      {...register('tipoOrdenie')}
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

            <section className="flex flex-col gap-3 w-full">
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

            <section className="flex flex-col gap-3">
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

            <section className="flex flex-col gap-3 w-full">
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

            <section className="flex flex-col gap-3 w-full">
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
              <section className="flex flex-col gap-3">
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
                  ? [
                      { titulo: 'Rodeo único', tipo: TipoRodeo.UNICO_ORDENIE },
                      { titulo: 'Rodeo en seca', tipo: TipoRodeo.UNICO_SECA },
                    ]
                  : [
                      { titulo: 'Rodeo Alto', tipo: TipoRodeo.ALTA_PRODUCCION },
                      { titulo: 'Rodeo Bajo', tipo: TipoRodeo.BAJA_PRODUCCION },
                      { titulo: 'Rodeo en seca', tipo: TipoRodeo.VACAS_SECAS },
                    ]
                ).map(({ titulo, tipo }, idx) => (
                  <RodeoCategoriaCard
                    key={`${titulo}-${tipo}`}
                    titulo={titulo}
                    index={idx}
                    tipoRodeo={tipo}
                    register={register}
                    setValue={setValue}
                    costoRacionError={
                      (errors.rodeos as any)?.[idx]?.costoRacion?.message
                    }
                    razasError={(errors.rodeos as any)?.[idx]?.razas?.message}
                  />
                ))}
              </div>
              {typeof (errors.rodeos as any)?.message === 'string' && (
                <p className="text-xs text-red-500">
                  {(errors.rodeos as any).message}
                </p>
              )}
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
                    <div className="col-span-2">Nombre</div>
                    <div className="col-span-2">Raza</div>
                    <div className="col-span-2">Categoría</div>
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
                      <div className="col-span-2">
                        <Input
                          className="w-full border rounded px-2 h-9"
                          {...register(`animales.${idx}.nombre` as const)}
                          defaultValue={a.nombre}
                        />
                      </div>
                      <div className="col-span-2">
                        <select
                          className="w-full border rounded px-2 h-9"
                          {...register(`animales.${idx}.raza` as const)}
                        >
                          <option value="" disabled>
                            Seleccioná
                          </option>
                          {Object.values(RazasVacas).map((v) => (
                            <option key={v} value={v}>
                              {RAZA_LABELS[v]}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-2">
                        <select
                          className="w-full border rounded px-2 h-9"
                          {...register(`animales.${idx}.categoria` as const)}
                        >
                          {CATEGORIA_ANIMAL_OPTIONS.map(({ value, label }) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-3">
                        <select
                          className="w-full border rounded px-2 h-9"
                          {...register(`animales.${idx}.estado` as const)}
                        >
                          {ESTADO_ANIMAL_OPTIONS.map(({ value, label }) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
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
                              raza: '',
                              categoria: CategoriaAnimal.ORDENE,
                              estado: EstadoAnimal.SANO,
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
                className="px-8 py-3.5 border border-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition-all cursor-pointer w-full sm:w-auto"
                onClick={() =>
                  step != 1 ? setStep(step - 1) : router.push('/organizaciones')
                }
                disabled={isPending}
              >
                {step != 1 ? 'Atras' : 'Cancelar'}
              </button>
            </div>
          )}

          <div className="flex gap-4 justify-end">
            <button
              type="button"
              disabled={
                isPending || (step === 2 && (animales ?? []).length === 0)
              }
              className="px-8 py-3.5 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800 flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer w-full sm:w-auto"
              onClick={() => {
                if (step !== lastStep) {
                  setStep(step + 1)
                } else {
                  handleSubmit(onSubmit, handleInvalidSubmit)()
                }
              }}
            >
              {isPending
                ? 'Guardando...'
                : step === lastStep
                  ? 'Finalizar Configuración'
                  : 'Siguiente'}
            </button>
          </div>
        </footer>
      </form>
    </div>
  )
}

export default Configuration
