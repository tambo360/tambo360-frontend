'use client'
import {
  configurationSchema,
  ConfigurationData,
} from '@/types/establishment/configuration'
import {
  TipoOrdenie,
  TipoSeguimiento,
  VentaLeche,
  TipoRodeo,
} from '@/types/enums'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronRight, Minus, Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
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
import { usePathname } from 'next/navigation'
import { useConfiguration } from '@/hooks/establishment/useConfiguration'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'

const TIPO_ORDENIE_OPTIONS: { value: TipoOrdenie; Label: string }[] = [
  { value: TipoOrdenie.BALDE, Label: 'Balde' },
  { value: TipoOrdenie.LINEA, Label: 'Línea' },
  { value: TipoOrdenie.ESPINA_DE_PESCADO, Label: 'Espina de pescado' },
  { value: TipoOrdenie.ROTATIVO, Label: 'Rotativo' },
  { value: TipoOrdenie.MANUAL, Label: 'Manual' },
  { value: TipoOrdenie.OTRO, Label: 'Otro' },
]

const Configuration = () => {
  const [searchProvince, setSearchProvince] = useState('')
  const [idProvince, setIdProvince] = useState<string | undefined>('')
  const [searchLocality, setSearchLocality] = useState('')
  const [selectedLocalityName, setSelectedLocalityName] = useState('')
  const [searchP] = useDebounce(searchProvince, 300)
  const [searchL] = useDebounce(searchLocality, 300)
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
  const { data: config } = useConfiguration()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ConfigurationData>({
    defaultValues: {
      cantOrdenie: 2,
      tipoOrdenie: undefined,
      promLitros: undefined,
      empleados: false,
      cantEmpleados: 1,
      ubicacion: {
        provincia: '',
        localidad: '',
      },
    },
    resolver: zodResolver(configurationSchema),
  })

  useEffect(() => {
    if (!config?.data) return

    const data = config.data
    const savedRodeos = data.rodeos ?? []
    // Seteamos `rodeos` según el tipo de seguimiento guardado
    const initialRodeos =
      data.TipoSeguimiento === TipoSeguimiento.INDIVIDUAL
        ? undefined
        : data.TipoSeguimiento === TipoSeguimiento.RODEO_UNICO
          ? // Si es RODEO_UNICO mantenemos un único rodeo con tipo 'UNICO' (schema lo acepta)
            savedRodeos.length
            ? savedRodeos.map((r: any) => ({
                tipoRodeo: r.tipoRodeo || 'UNICO',
                cantVacas: r.cantVacas ?? 1,
                costoRacion: r.costoRacion ?? 1,
              }))
            : [
                {
                  tipoRodeo: 'UNICO',
                  cantVacas: 1,
                  costoRacion: 1,
                },
              ]
          : // Si es RODEO o no está definido, mapear los tipos estándar
            Object.values(TipoRodeo).map((tipo) => {
              const saved = savedRodeos.find((r: any) => r.tipoRodeo === tipo)
              return {
                tipoRodeo: tipo,
                cantVacas: saved?.cantVacas ?? 1,
                costoRacion: saved?.costoRacion ?? 1,
              }
            })

    reset({
      TipoSeguimiento: data.TipoSeguimiento,
      rodeos: initialRodeos,
      animales:
        data.TipoSeguimiento === TipoSeguimiento.INDIVIDUAL
          ? (data.animales ?? [])
          : undefined,
      cantOrdenie: data.ordeñe_por_dia ?? 2,
      tipoOrdenie: data.tipo_ordeñe,
      ventaLeche: data.venta_leche,
      promLitros: data.litros_por_dia,
      empleados: data.empleados ?? false,
      cantVacas: data.cantidad_vacas !== null ? data.cantidad_vacas : 1,
      cantEmpleados:
        data.cantidad_empleados !== null ? data.cantidad_empleados : 1,
      ubicacion: {
        provincia: data.provincia ?? '',
        localidad: data.localidad ?? '',
      },
    })

    setSearchProvince(data.provincia ?? '')
    setSearchLocality(data.localidad ?? '')
  }, [config, reset])

  useEffect(() => {
    if (!config?.data || !province?.provincias) return

    const match = province.provincias.find(
      (p) => p.nombre.toLowerCase() === config.data.provincia?.toLowerCase()
    )

    if (match) {
      setIdProvince(match.id)
    }
  }, [config, province])

  const cantEmpleados = watch('cantEmpleados') ?? 1
  const tipoOrdenie = watch('tipoOrdenie')
  const cantOrdenie = watch('cantOrdenie')
  const ventaLeche = watch('ventaLeche')
  const empleados = watch('empleados')
  const cantVacas = watch('cantVacas')
  const tipoSeguimiento = watch('TipoSeguimiento')
  const rodeos = watch('rodeos')
  const animales = watch('animales')
  const lastStep = tipoSeguimiento === TipoSeguimiento.INDIVIDUAL ? 2 : 1

  useEffect(() => {
    if (tipoSeguimiento === TipoSeguimiento.RODEO) {
      const current = watch('rodeos')
      if (!current || current.length === 0) {
        setValue(
          'rodeos',
          Object.values(TipoRodeo).map((tipo) => ({
            tipoRodeo: tipo,
            cantVacas: 1,
            costoRacion: 1,
          })),
          { shouldValidate: true }
        )
      }
    }

    if (tipoSeguimiento === TipoSeguimiento.RODEO_UNICO) {
      const current = watch('rodeos')
      if (!current || current.length !== 1) {
        setValue(
          'rodeos',
          [{ tipoRodeo: 'UNICO', cantVacas: 1, costoRacion: 1 }],
          {
            shouldValidate: true,
          }
        )
      }
    }

    if (tipoSeguimiento === TipoSeguimiento.INDIVIDUAL) {
      const current = watch('animales')
      if (!current || current.length === 0) {
        setValue('animales', [
          { codigo: '', nombre: '', categoria: 'ORDENE', estado: 'SANA' },
        ])
      }
      // Al seleccionar INDIVIDUAL, removemos `rodeos` para no romper la validación discriminada
      setValue('rodeos', undefined)
    }
  }, [tipoSeguimiento])

  const onSubmit = (data: ConfigurationData) => {
    // `data` here contains a nested `data` property (ConfigurationData -> { data: {...} })
    // spread the inner object to match the expected ConfigurationRequest shape
    const inner = (data as any).data ?? data
    const selectedTipo =
      inner.TipoSeguimiento ??
      inner.tipoSeguimiento ??
      tipoSeguimiento ??
      TipoSeguimiento.RODEO

    const payload = {
      TipoSeguimiento: selectedTipo,
      tipoSeguimiento: selectedTipo,
      idEstablecimiento: config?.data?.idEstablecimiento ?? '',
      ...inner,
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

  console.log(errors)

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
            {/* 7. Ubicación */}
            <section className="flex flex-col gap-4">
              <Label className="text-sm font-medium text-slate-700">
                7. ¿Dónde está tu tambo?
              </Label>

              <div className="grid grid-cols-2 gap-4">
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

            {/* 1. cantidad de vacas y costo de racion */}
            <section className="flex flex-col gap-4">
              <Label className="text-xs font-medium text-slate-700">
                Cantidad de vacas
              </Label>
              <Input
                type="number"
                min={1}
                {...register(`cantVacas` as const, {
                  valueAsNumber: true,
                })}
                className={cn(
                  'h-14 w-full border-2 rounded-xl px-4 outline-none transition-colors',
                  errors.cantVacas
                    ? 'border-red-500'
                    : 'border-slate-200 focus:border-slate-300'
                )}
              />
              {errors.cantVacas && (
                <p className="text-xs text-red-500">
                  {errors.cantVacas.message}
                </p>
              )}
            </section>

            {/* 2. Frecuencia de Ordeñe */}
            <section className="flex flex-col gap-4">
              <Label className="text-sm font-medium text-slate-700">
                2. ¿Cuántas veces al día ordeñás?
              </Label>
              <div className="flex gap-8">
                {[1, 2, 3].map((n) => (
                  <Label
                    key={n}
                    className="flex items-center gap-2 cursor-pointer text-sm"
                  >
                    <Input
                      type="radio"
                      value={n}
                      checked={cantOrdenie === n}
                      onChange={() =>
                        setValue('cantOrdenie', n, { shouldValidate: true })
                      }
                      className="w-4 h-4 accent-[#29845A]"
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

            {/* 3. Tipo de Ordeñe */}
            <section className="flex flex-col gap-4">
              <Label className="text-sm font-medium text-slate-700">
                3. ¿Qué tipo de ordeñe usás?
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {TIPO_ORDENIE_OPTIONS.map(({ value, Label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setValue('tipoOrdenie', value, { shouldValidate: true })
                    }
                    className={cn(
                      'p-4 rounded-xl border font-medium transition-all',
                      tipoOrdenie === value
                        ? 'bg-emerald-200 border-emerald-300 text-[#29845A]'
                        : 'bg-white border-slate-200 text-slate-500 shadow-sm'
                    )}
                  >
                    {Label}
                  </button>
                ))}
              </div>
              {errors.tipoOrdenie && (
                <p className="text-xs text-red-500">
                  {errors.tipoOrdenie.message}
                </p>
              )}
            </section>

            {/* 4. Producción Diaria */}
            <section className="flex flex-col gap-4">
              <Label className="text-sm font-medium text-slate-700">
                4. ¿Cuántos litros producís en promedio por día?
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.1"
                  placeholder="000"
                  {...register('promLitros', { valueAsNumber: true })}
                  className={cn(
                    'w-full p-4 border-2 rounded-xl outline-none bg-slate-50/50 transition-colors',
                    errors.promLitros
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-slate-200 focus:border-[#29845A]'
                  )}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                  LTS
                </span>
              </div>
              {errors.promLitros && (
                <p className="text-xs text-red-500">
                  {errors.promLitros.message}
                </p>
              )}
            </section>

            {/* 5. Frecuencia de Ordeñe */}
            <section className="flex flex-col gap-4">
              <Label className="text-sm font-medium text-slate-700">
                5. ¿A quién le vendes la leche?
              </Label>
              <div className="flex gap-8">
                {[
                  VentaLeche.USINA,
                  VentaLeche.FABRICA_PROPIA,
                  VentaLeche.COOPERATIVA,
                  VentaLeche.VARIOS,
                ].map((n) => (
                  <Label
                    key={n}
                    className="flex items-center gap-2 cursor-pointer text-sm"
                  >
                    <Input
                      type="radio"
                      value={n}
                      checked={ventaLeche === n}
                      onChange={() =>
                        setValue('ventaLeche', n, { shouldValidate: true })
                      }
                      className="w-4 h-4 accent-[#29845A] capitalize"
                    />
                    {n == 'fabrica_propia' ? 'Fábrica propia' : n}
                  </Label>
                ))}
              </div>
              {errors.ventaLeche && (
                <p className="text-xs text-red-500">
                  {errors.ventaLeche.message}
                </p>
              )}
            </section>

            {/* 6. Empleados y Plan */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
              <div className="flex flex-col gap-4">
                <Label className="text-sm font-medium text-slate-700">
                  6. ¿Tenés empleados que cargarían datos?
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setValue('empleados', false, { shouldValidate: true })
                    }
                    className={cn(
                      'p-4 rounded-xl border flex items-center gap-3 text-sm font-medium transition-all',
                      !empleados
                        ? 'border-2 border-[#29845A] bg-emerald-100'
                        : 'border-slate-200'
                    )}
                  >
                    <div
                      className={cn(
                        'w-4 h-4 rounded-full border-2',
                        !empleados
                          ? 'bg-[#29845A] border-[#669213]'
                          : 'border-slate-300'
                      )}
                    />
                    No, solo yo
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setValue('empleados', true, { shouldValidate: true })
                    }
                    className={cn(
                      'p-4 rounded-xl border-2 flex items-center justify-between text-sm font-medium transition-all',
                      empleados
                        ? 'border-[#29845A] bg-emerald-100'
                        : 'border-slate-200'
                    )}
                  >
                    Sí, tengo empleados
                    <div
                      className={cn(
                        'w-4 h-4 rounded-full',
                        empleados ? 'bg-[#29845A]' : 'bg-slate-300'
                      )}
                    />
                  </button>
                </div>
                {errors.empleados && (
                  <p className="text-xs text-red-500">
                    {errors.empleados.message}
                  </p>
                )}
              </div>

              {/* Plan Sugerido Card */}
              <div className="flex flex-col gap-3">
                <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                  Plan Sugerido
                </p>
                <div className="flex justify-between items-center bg-emerald-200/60 p-4 rounded-xl border border-emerald-300 ">
                  <span className="text-sm font-bold text-[#29845A]">
                    {empleados ? 'Plan Equipo/Multi' : 'Plan Individual'}
                  </span>
                  {empleados && (
                    <div className="flex items-center gap-4 bg-white px-3 py-1 rounded-lg border border-emerald-200">
                      <button
                        type="button"
                        onClick={() =>
                          setValue(
                            'cantEmpleados',
                            Math.max(1, cantEmpleados - 1),
                            {
                              shouldValidate: true,
                            }
                          )
                        }
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-bold">{cantEmpleados}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setValue('cantEmpleados', cantEmpleados + 1, {
                            shouldValidate: true,
                          })
                        }
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  )}
                </div>
                {errors.cantEmpleados && (
                  <p className="text-xs text-red-500">
                    {errors.cantEmpleados.message}
                  </p>
                )}
              </div>
            </section>

            {/* renderizado de rodeo unico o por rodeos */}
            {cantVacas !== undefined && cantVacas > 1 && (
              /* Si hay menos de 70 vacas 3 opciones de rodeo */
              <>
                <div className="flex flex-col gap-4">
                  <Label className="text-sm font-medium text-slate-700">
                    8. ¿Cómo querés registrar tu rodeo?
                  </Label>

                  {/* Unico */}
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setValue(
                          'TipoSeguimiento',
                          TipoSeguimiento.RODEO_UNICO,
                          {
                            shouldValidate: true,
                          }
                        )
                      }
                      className={cn(
                        'p-4 rounded-xl border flex items-center gap-3 text-sm font-medium transition-all',
                        tipoSeguimiento === TipoSeguimiento.RODEO_UNICO
                          ? 'border-2 border-[#29845A] bg-emerald-100'
                          : 'border-slate-200'
                      )}
                    >
                      <div
                        className={cn(
                          'w-4 h-4 rounded-full border-2',
                          tipoSeguimiento === TipoSeguimiento.RODEO_UNICO
                            ? 'bg-[#29845A] border-[#669213]'
                            : 'border-slate-300'
                        )}
                      />
                      Unico
                    </button>

                    {/* Individual */}
                    {/* Solo si tiene menos de 70 vacas */}
                    {cantVacas < 70 && (
                      <button
                        type="button"
                        onClick={() =>
                          setValue(
                            'TipoSeguimiento',
                            TipoSeguimiento.INDIVIDUAL,
                            {
                              shouldValidate: true,
                            }
                          )
                        }
                        className={cn(
                          'p-4 rounded-xl border flex items-center gap-3 text-sm font-medium transition-all',
                          tipoSeguimiento === TipoSeguimiento.INDIVIDUAL
                            ? 'border-2 border-[#29845A] bg-emerald-100'
                            : 'border-slate-200'
                        )}
                      >
                        <div
                          className={cn(
                            'w-4 h-4 rounded-full border-2',
                            tipoSeguimiento === TipoSeguimiento.INDIVIDUAL
                              ? 'bg-[#29845A] border-[#669213]'
                              : 'border-slate-300'
                          )}
                        />
                        Individual
                      </button>
                    )}

                    {/* Por Rodeos */}
                    <button
                      type="button"
                      onClick={() =>
                        setValue('TipoSeguimiento', TipoSeguimiento.RODEO, {
                          shouldValidate: true,
                        })
                      }
                      className={cn(
                        'p-4 rounded-xl border flex items-center gap-3 text-sm font-medium transition-all',
                        tipoSeguimiento === TipoSeguimiento.RODEO
                          ? 'border-2 border-[#29845A] bg-emerald-100'
                          : 'border-slate-200'
                      )}
                    >
                      <div
                        className={cn(
                          'w-4 h-4 rounded-full border-2',
                          tipoSeguimiento === TipoSeguimiento.RODEO
                            ? 'bg-[#29845A] border-[#669213]'
                            : 'border-slate-300'
                        )}
                      />
                      Por Rodeos
                    </button>
                  </div>
                  {errors.TipoSeguimiento && (
                    <p className="text-xs text-red-500">
                      {errors.TipoSeguimiento.message}
                    </p>
                  )}
                </div>
              </>
            )}

            {tipoSeguimiento === TipoSeguimiento.RODEO_UNICO && (
              <div className="flex flex-col gap-4">
                <Label className="text-sm font-medium text-slate-700">
                  9. ¿Cómo querés registrar tu rodeo?
                </Label>
                <p className="text-sm text-slate-500">
                  Vas a poder registrar tu rodeo como un único grupo de vacas.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {(
                    rodeos ?? [
                      {
                        tipoRodeo: 'UNICO',
                        cantVacas: 1,
                        costoRacion: 1,
                      },
                    ]
                  )
                    .slice(0, 1)
                    .map((r: any, idx: number) => (
                      <div
                        key={`UNICO-${idx}`}
                        className="p-4 rounded-xl border bg-white shadow-sm flex flex-col gap-3"
                      >
                        <Label className="text-sm font-semibold text-slate-700">
                          {String(r.tipoRodeo).replace('_', ' ')}
                        </Label>

                        <Input
                          type="hidden"
                          {...register(`rodeos.${idx}.tipoRodeo` as const)}
                          defaultValue={r.tipoRodeo}
                        />

                        <div className="flex flex-col gap-2">
                          <Label className="text-xs text-slate-600">
                            Cantidad de vacas
                          </Label>
                          <Input
                            type="number"
                            min={0}
                            {...register(`rodeos.${idx}.cantVacas` as const, {
                              valueAsNumber: true,
                            })}
                            className="h-12 w-full border rounded-lg px-3"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <Label className="text-xs text-slate-600">
                            Costo de ración
                          </Label>
                          <Input
                            type="number"
                            min={0}
                            step="0.01"
                            {...register(`rodeos.${idx}.costoRacion` as const, {
                              valueAsNumber: true,
                            })}
                            className="h-12 w-full border rounded-lg px-3"
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Muestra los rodeos por alta baja y seca */}
            {tipoSeguimiento === TipoSeguimiento.RODEO && (
              <div className="flex flex-col gap-4">
                <Label className="text-sm font-medium text-slate-700">
                  10. ¿Cuantos rodeos vas a registrar?
                </Label>
                <p className="text-sm text-slate-500">
                  Vas a poder registrar rodeos para Baja, Media y Alta
                  Producción.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {(
                    rodeos ??
                    Object.values(TipoRodeo).map((tipo) => ({
                      tipoRodeo: tipo,
                      cantVacas: 1,
                      costoRacion: 1,
                    }))
                  ).map((r: any, idx: number) => (
                    <div
                      key={r.tipoRodeo}
                      className="p-4 rounded-xl border bg-white shadow-sm flex flex-col gap-3"
                    >
                      <Label className="text-sm font-semibold text-slate-700">
                        {r.tipoRodeo.replace('_', ' ')}
                      </Label>

                      <Input
                        type="hidden"
                        {...register(`rodeos.${idx}.tipoRodeo` as const)}
                        defaultValue={r.tipoRodeo}
                      />

                      <div className="flex flex-col gap-2">
                        <Label className="text-xs text-slate-600">
                          Cantidad de vacas
                        </Label>
                        <Input
                          type="number"
                          min={0}
                          {...register(`rodeos.${idx}.cantVacas` as const, {
                            valueAsNumber: true,
                          })}
                          className="h-12 w-full border rounded-lg px-3"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label className="text-xs text-slate-600">
                          Costo de ración
                        </Label>
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          {...register(`rodeos.${idx}.costoRacion` as const, {
                            valueAsNumber: true,
                          })}
                          className="h-12 w-full border rounded-lg px-3"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col gap-6 py-8">
            {tipoSeguimiento === TipoSeguimiento.INDIVIDUAL ? (
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

        {/* Muestra errores del back */}
        {error?.response?.data?.message && (
          <p className="text-xs text-red-500 text-center">
            {error.response.data.message}
          </p>
        )}

        {/* Footer de Navegación */}
        <footer className="flex items-center justify-between gap-4 pt-8 border-t border-slate-100">
          {pathname.includes('cuestionario') && (
            <div className="flex gap-4 w-full">
              <button
                type="button"
                className="px-12 py-4 bg-emerald-200 text-emerald-800 font-bold rounded-xl hover:bg-emerald-300 transition-all cursor-pointer"
                onClick={() =>
                  step != 1 ? setStep(step - 1) : router.push('/organizaciones')
                }
                disabled={isPending}
              >
                Atrás
              </button>
            </div>
          )}

          <div className="flex gap-4 w-full justify-end">
            <button
              type="button"
              disabled={
                isPending ||
                (tipoSeguimiento === TipoSeguimiento.INDIVIDUAL &&
                  (animales ?? []).length === 0)
              }
              className="px-12 py-4 bg-emerald-700 text-white font-bold rounded-xl hover:bg-emerald-800 flex items-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              onClick={() => {
                if (step !== lastStep) {
                  setStep(step + 1)
                } else {
                  // ejecutar validación y submit sólo en el último paso
                  handleSubmit(onSubmit)()
                }
              }}
            >
              {isPending
                ? 'Guardando...'
                : step === lastStep
                  ? 'Finalizar Configuración'
                  : 'Siguiente'}{' '}
              <ChevronRight size={20} />
            </button>
          </div>
        </footer>
      </form>
    </div>
  )
}

export default Configuration
