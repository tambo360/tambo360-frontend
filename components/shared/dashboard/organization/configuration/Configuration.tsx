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
import { useEffect, useMemo, useState, useRef } from 'react'
import {
  cn,
  limitDecimalDigitsKeyDown,
  sanitizeDecimalChange,
} from '@/lib/utils'
import { useProvince } from '@/hooks/ubication/useProvince'
import { useLocality } from '@/hooks/ubication/useLocality'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useUpdateConfiguration } from '@/hooks/establishment/useUpdateConfiguration'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import RodeoCategoriaCard, {
  RAZA_LABELS,
  blockNegativeKeys,
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
  { value: VentaLeche.USINA, label: 'Usina' },
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
  { value: EstadoAnimal.MATITIS, label: 'Mastitis' },
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
  if (messages.length === 0) {
    console.warn('Revisá el formulario: hay campos pendientes')
    return
  }
  const [first, ...rest] = messages
  console.error(rest.length > 0 ? `${first} (+${rest.length} más)` : first)
}

const Configuration = () => {
  const [registrarRodeo, setRegistrarRodeo] = useState<boolean | undefined>(
    undefined
  )
  const [step, setStep] = useState(1)
  const [intentoFinalizar, setIntentoFinalizar] = useState(false)
  const pathname = usePathname()
  const params = useParams()
  const router = useRouter()

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

  const provinciaSeleccionada = watch('ubicacion.provincia')
  const localidadSeleccionada = watch('ubicacion.localidad')

  const { data: province } = useProvince({ name: '' })
  const idProvince = useMemo(
    () =>
      province?.provincias.find((p) => p.nombre === provinciaSeleccionada)?.id,
    [provinciaSeleccionada, province]
  )
  const { data: locality } = useLocality({ id: idProvince, search: '' })

  const {
    mutateAsync: sendConfiguration,
    isPending,
    error,
  } = useUpdateConfiguration()

  const animales = watch('animales')
  const promLitros = watch('promLitros')
  const rodeos = watch('rodeos')

  const totalVacasGeneral =
    rodeos?.reduce(
      (acc, rodeo) =>
        acc +
        (rodeo?.razas?.reduce(
          (sub, item) => sub + (Number(item?.cantVacas) || 0),
          0
        ) ?? 0),
      0
    ) ?? 0

  const esRodeoUnico = !Number.isNaN(promLitros) && promLitros <= 2000
  const animalesParaRodeoUnico =
    totalVacasGeneral > 0 && totalVacasGeneral <= 70

  const sugerirRodeoUnico =
    animalesParaRodeoUnico && !Number.isNaN(promLitros) && promLitros > 2000
  const bloqueadoPorFaltaDeRegistroDeRodeo =
    step === 1 && esRodeoUnico && registrarRodeo === undefined

  const mostrarBloqueRodeos = !esRodeoUnico || registrarRodeo === false

  const lastStep = esRodeoUnico && registrarRodeo ? 2 : 1

  const isrodeosLlenados =
    !!rodeos?.length &&
    rodeos.every(
      (r) =>
        Number.isFinite(r?.costoRacion) &&
        (r?.costoRacion as number) > 0 &&
        !!r?.razas?.length &&
        r.razas.every((item) => Number(item?.cantVacas) > 0)
    )

  const isAnimalesLlenados =
    !!animales?.length &&
    animales.every(
      (a: any) =>
        (a?.codigo ?? '').toString().trim() !== '' &&
        !!a?.raza &&
        !!a?.categoria &&
        !!a?.estado
    )

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
    const selectedTipo = !esRodeoUnico
      ? TipoSeguimiento.RODEO
      : registrarRodeo
        ? TipoSeguimiento.INDIVIDUAL
        : TipoSeguimiento.RODEO_UNICO

    const { rodeos: _rodeos, animales: _animales, ...rest } = data

    let payload

    if (selectedTipo === TipoSeguimiento.INDIVIDUAL) {
      const animales = (data.animales ?? []).map((a) => ({
        codigo: a.codigo,
        nombre: a.nombre,
        raza: a.raza,
        categoria: a.categoria,
        estado: a.estado,
        fechaNacimiento: a.fechaNacimiento,
      }))
      payload = {
        TipoSeguimiento: selectedTipo,
        ...rest,
        animales,
      }
    } else {
      const rodeos = (data.rodeos ?? [])
        .filter((r) => Number.isFinite(r.costoRacion))
        .map((r) => ({
          tipoRodeo: r.tipoRodeo,
          costoRacion: r.costoRacion as number,
          razas: (r.razas ?? []).map((item) => ({
            raza: item.raza,
            cantVacas: item.cantVacas as number,
          })),
        }))
      payload = {
        TipoSeguimiento: selectedTipo,
        ...rest,
        rodeos,
      }
    }

    // console.log('>> PAYLOAD', payload)
    sendConfiguration(payload, {
      onSuccess: () => {
        toast.success('Configuración guardada correctamente', {
          description: 'Tus datos ya están listos para usar en el sistema',
          position: 'top-center',
          duration: 5000,
        })
        const orgId = params?.orgId as string
        const estId = params?.id as string
        const dashboardUrl =
          orgId && estId
            ? `/organizaciones/${orgId}/${estId}/analisis`
            : `${pathname.split('/').slice(0, -1).join('/')}/analisis`
        router.replace(dashboardUrl)
      },
      onError: (e) => {
        toast.error(
          e?.response?.data?.message ??
            'No se pudo guardar. Revisá los datos e intentá de nuevo.',
          {
            position: 'top-center',
            duration: 5000,
          }
        )
      },
    })
  }

  const refPromLitro = useRef(false)
  const promLitrosField = register('promLitros', { valueAsNumber: true })

  const refPrecioLitro = useRef(false)
  const precioLitroField = register('precioLitro', { valueAsNumber: true })

  return (
    <div
      className={`flex flex-col gap-10 w-full ${pathname.includes('cuestionario') ? 'p-8' : ''}`}
    >
      <div className="h-12 lg:h-20 w-auto flex items-start gap-2">
        <img src="/logos/tambo-logo-360.png" alt="logo" className="h-18.75" />
      </div>
      <section className="flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-900">
            Configura tu Perfil
          </h1>
        </div>
        <p className="text-slate-500 text-base sm:text-lg">
          Ayudanos a personalizar la experiencia de Tambo360 con los datos
          actuales de tu establecimiento
        </p>
      </section>

      <form
        onSubmit={handleSubmit(onSubmit, handleInvalidSubmit)}
        className="flex flex-col gap-8"
      >
        {step == 1 ? (
          <>
            <section className="flex flex-col gap-3 w-full">
              <p className="text-[15px] leading-6 text-slate-900">
                ¿Dónde está tu tambo?
              </p>
              <div className="flex flex-col sm:flex-row w-full max-w-4xl items-start gap-x-10">
                <div className="relative min-w-0 w-full flex-1 space-y-2">
                  <p className="text-[15px] leading-6 text-slate-900">
                    Provincia*
                  </p>
                  <Select
                    value={provinciaSeleccionada ?? ''}
                    onValueChange={(nombre) => {
                      setValue('ubicacion.provincia', nombre, {
                        shouldValidate: true,
                      })
                      setValue('ubicacion.localidad', '', {
                        shouldDirty: true,
                      })
                    }}
                  >
                    <SelectTrigger
                      className={`"w-full rounded-lg border border-slate-200 bg-white text-[13px] font-normal text-slate-900 shadow-none data-[size=default]:h-10 [&_span]:text-slate-900 [&_span[data-placeholder]]:text-slate-400 w-full max-w-2xl ${errors.ubicacion?.provincia ? 'border-red-400 focus:border-red-500' : 'border-slate-200'}`}
                      data-testid="province-select-trigger"
                    >
                      <SelectValue placeholder="Seleccione una provincia" />
                    </SelectTrigger>
                    <SelectContent className="border-slate-200 bg-white">
                      {!province?.provincias.length && (
                        <SelectItem value="__empty" disabled>
                          No se encontraron provincias
                        </SelectItem>
                      )}
                      {province?.provincias.map((item) => (
                        <SelectItem
                          key={item.id}
                          value={item.nombre}
                          className="text-[13px] text-slate-900 hover:bg-slate-50"
                          data-testid={`province-option-${item.id}`}
                        >
                          {item.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.ubicacion?.provincia && (
                    <p className="text-xs font-medium text-red-500">
                      {errors.ubicacion?.provincia.message}
                    </p>
                  )}
                </div>

                <div className="relative min-w-0 w-full flex-1 space-y-2">
                  <p className="text-[15px] leading-6 text-slate-900">
                    Localidad*
                  </p>
                  <Select
                    value={localidadSeleccionada ?? ''}
                    disabled={!idProvince}
                    onValueChange={(nombre) => {
                      setValue('ubicacion.localidad', nombre, {
                        shouldValidate: true,
                      })
                    }}
                  >
                    <SelectTrigger
                      className={`w-full rounded-lg border border-slate-200 bg-white text-[13px] font-normal text-slate-900 shadow-none data-[size=default]:h-10 [&_span]:text-slate-900 [&_span[data-placeholder]]:text-slate-400 max-w-2xl ${errors.ubicacion?.localidad ? 'border-red-400 focus:border-red-500' : 'border-slate-200'}`}
                      disabled={!idProvince}
                      data-testid="locality-select-trigger"
                    >
                      <SelectValue
                        placeholder={
                          idProvince
                            ? 'Seleccione una localidad'
                            : 'Primero seleccione una provincia'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="border-slate-200 bg-white">
                      {!locality?.municipios.length && (
                        <SelectItem value="__empty" disabled>
                          No se encontraron localidades
                        </SelectItem>
                      )}
                      {locality?.municipios.map((item) => (
                        <SelectItem
                          key={item.id}
                          value={item.nombre}
                          className="text-[13px] text-slate-900 hover:bg-slate-50"
                          data-testid={`locality-option-${item.id}`}
                        >
                          {item.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                {[1, 2, 3, 4].map((n) => (
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
                  step={0.1}
                  min={1}
                  placeholder="1"
                  {...promLitrosField}
                  onKeyDown={(e) => {
                    blockNegativeKeys(e)
                    limitDecimalDigitsKeyDown(e, refPromLitro, 4, 4)
                  }}
                  onChange={(e) => {
                    sanitizeDecimalChange(e, refPromLitro)
                    promLitrosField.onChange(e) // sin esto RHF no guarda el valor
                  }}
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
                  min={1}
                  placeholder="1"
                  inputMode="numeric"
                  {...register('promDEL', { valueAsNumber: true })}
                  onKeyDown={(e) => {
                    if (
                      e.key === '.' ||
                      e.key === ',' ||
                      (e.currentTarget.value.length >= 4 &&
                        !isNaN(Number(e.key)))
                    )
                      e.preventDefault()
                    blockNegativeKeys(e)
                  }}
                  className={cn(
                    'w-full max-w-4xl no-spinner pr-16! p-4 border-2 rounded-xl outline-none bg-slate-50/50 transition-colors',
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
                  step={0.1}
                  min={1}
                  placeholder="1"
                  {...precioLitroField}
                  onKeyDown={(e) => {
                    blockNegativeKeys(e)
                    limitDecimalDigitsKeyDown(e, refPrecioLitro, 4, 4)
                  }}
                  onChange={(e) => {
                    sanitizeDecimalChange(e, refPrecioLitro)
                    precioLitroField.onChange(e) // sin esto RHF no guarda el valor
                  }}
                  className={cn(
                    'w-full max-w-4xl no-spinner pr-16! p-4 border-2 rounded-xl outline-none bg-slate-50/50 transition-colors',
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
                  ].map(({ value, label }, i) => (
                    <Label
                      key={`${value}-${i}-${label}`}
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

            <section
              className={`${mostrarBloqueRodeos ? '' : 'hidden'} flex flex-col gap-4`}
            >
              <p className="text-[15px] leading-6 text-slate-900">
                ¿Cuántos animales tenés por categoría?
              </p>
              {sugerirRodeoUnico && intentoFinalizar && (
                <p className="text-xs font-medium text-amber-600">
                  Con {totalVacasGeneral} vaca
                  {totalVacasGeneral === 1 ? '' : 's'} deberías superar las 70
                  para seguir con tu promedio de litros diarios normal, o bajar
                  tu promedio a 2000 lts o menos para tratarlo como rodeo único.
                </p>
              )}
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
              <div className="max-w-393">
                <h2 className="text-2xl font-bold mb-4">
                  Registro Individual de Animales
                </h2>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="overflow-x-auto">
                    <div className="min-w-[768px]">
                      <div className="grid grid-cols-12 gap-4 items-center font-semibold text-sm py-2 border-b">
                        <div className="col-span-2">RP/N°</div>
                        <div className="col-span-2">Nombre</div>
                        <div className="col-span-2">Raza</div>
                        <div className="col-span-2">Categoría</div>
                        <div className="col-span-3">Estado</div>
                        <div className="col-span-1" />
                      </div>

                      {(animales ?? []).map((a: any, idx: number) => {
                        const categoriaField = register(
                          `animales.${idx}.categoria` as const
                        )
                        const soloSano = a?.categoria === CategoriaAnimal.ORDENE
                        return (
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
                                {...categoriaField}
                                onChange={(e) => {
                                  categoriaField.onChange(e)
                                }}
                              >
                                <option value="" disabled>
                                  Seleccioná
                                </option>
                                {CATEGORIA_ANIMAL_OPTIONS.map(
                                  ({ value, label }) => (
                                    <option key={value} value={value}>
                                      {label}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>
                            <div className="col-span-3">
                              <select
                                className="w-full border rounded px-2 h-9"
                                {...register(`animales.${idx}.estado` as const)}
                              >
                                <option value="" disabled>
                                  Seleccioná
                                </option>
                                {(soloSano
                                  ? ESTADO_ANIMAL_OPTIONS.filter(
                                      ({ value }) => value === EstadoAnimal.SANO
                                    )
                                  : ESTADO_ANIMAL_OPTIONS
                                ).map(({ value, label }) => (
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
                        )
                      })}
                    </div>
                  </div>

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
                              categoria: '',
                              estado: '',
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
        <footer className="flex flex-col sm:flex-row items-stretch justify-end sm:items-center gap-4 pt-8 border-t border-slate-100 max-w-393">
          <div className="flex flex-col sm:flex-row gap-4 justify-end w-full sm:w-auto sm:items-center">
            {pathname.includes('cuestionario') && (
              <div
                className={`${esRodeoUnico && registrarRodeo ? '' : 'hidden'} flex gap-4 w-full sm:w-auto`}
              >
                <button
                  type="button"
                  className="px-8 py-3.5 border border-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition-all cursor-pointer w-full sm:w-auto"
                  onClick={() => {
                    if (step != 1) {
                      setStep(step - 1)
                      return
                    }
                  }}
                  disabled={isPending}
                >
                  Atras
                </button>
              </div>
            )}
            <div className="flex gap-4 justify-end">
              <button
                type="button"
                disabled={
                  isPending ||
                  bloqueadoPorFaltaDeRegistroDeRodeo ||
                  (mostrarBloqueRodeos && !isrodeosLlenados) ||
                  (step === 2 && !isAnimalesLlenados)
                }
                className="px-8 py-3.5 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800 flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer w-full sm:w-auto"
                onClick={() => {
                  setIntentoFinalizar(true)
                  if (sugerirRodeoUnico) return
                  if (step !== lastStep) {
                    if (esRodeoUnico && registrarRodeo) {
                      setValue('rodeos', undefined as any, {
                        shouldDirty: true,
                      })
                      clearErrors('rodeos')
                    }
                    setStep(step + 1)
                  } else {
                    if (esRodeoUnico && registrarRodeo) {
                      clearErrors('rodeos')
                    } else {
                      clearErrors('animales')
                    }
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
          </div>
        </footer>
      </form>
    </div>
  )
}

export default Configuration
