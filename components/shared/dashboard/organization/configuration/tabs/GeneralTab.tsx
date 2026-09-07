'use client'
import { useMemo } from 'react'
import { Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEstablishmentForm } from '@/hooks/establishment/useEstablishmentForm'
import { useProvince } from '@/hooks/ubication/useProvince'
import { useLocality } from '@/hooks/ubication/useLocality'
import { Label } from '@/components/ui/label'
import { TipoOrdenie } from '@/types/enums'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// const CUENCA_LECHERA_OPTIONS = [
//   'Cuenca Oeste',
//   'Cuenca Abasto',
//   'Cuenca Mar y Sierras',
//   'Cuenca Norte',
// ]

const formatTipoOrdenieLabel = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, ' ')

export default function GeneralTab() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    errors,
    isPending,
    isLoading,
    onSubmit,
  } = useEstablishmentForm()

  // const cuencaLechera = watch('cuencaLechera')
  const tipoOrdene = watch('tipoOrdenie')
  const provincia = watch('provincia')
  const localidad = watch('localidad')

  const { data: province } = useProvince({ name: '' })
  const idProvince = useMemo(
    () => province?.provincias.find((p) => p.nombre === provincia)?.id,
    [provincia, province]
  )
  const { data: locality } = useLocality({ id: idProvince, search: '' })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-[#65A30D] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="w-full max-w-250 mx-auto p-4 bg-[#F8FAFC]">
      {/* Encabezado Principal */}
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-black tracking-tight">
          Datos del Establecimiento
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Gestione la información estructural de una unidad productiva para
          optimizar el seguimiento y los reportes de rendimiento.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        {/* Distribución en 2 Columnas principales */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Columna Izquierda: Formulario (Ocupa 7 de 12 columnas) */}
          <div className="md:col-span-7 flex flex-col gap-5">
            <h3 className="text-sm font-bold text-black tracking-tight">
              Identificación General
            </h3>

            {/* Campo: Nombre del Establecimiento */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-gray-700">
                Nombre del Establecimiento
              </Label>
              <input
                {...register('nombre')}
                placeholder="Tambo La Esperanza"
                className={cn(
                  'h-10 w-full px-3 rounded-lg border text-sm outline-none bg-[#F1F3F5] text-black transition-colors',
                  errors.nombre
                    ? 'border-red-500'
                    : 'border-gray-200/80 focus:border-lime-600'
                )}
              />
              {/* Alerta de Error obligatoria estilo Figma (image_36b9ff.png) */}
              {errors.nombre && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#E11D48] mt-0.5">
                  <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#E11D48] text-white text-[10px]">
                    !
                  </span>
                  Este campo es obligatorio para el registro del sistema
                </div>
              )}
            </div>

            {/* Campo: Cuenca Lechera */}
            {/* <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-gray-700">
                Cuenca Lechera
              </Label>
              <Select
                value={cuencaLechera}
                onValueChange={(val) =>
                  setValue('cuencaLechera', val, { shouldValidate: true })
                }
              >
                <SelectTrigger className="h-10 w-full bg-[#F1F3F5] text-sm text-black border-gray-200/80 shadow-none">
                  <SelectValue placeholder="Cuenca Oeste" />
                </SelectTrigger>
                <SelectContent>
                  {CUENCA_LECHERA_OPTIONS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}

            {/* Campo: Tipo de Ordeñe */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-gray-700">
                Tipo de ordeñe
              </Label>
              <Select
                value={tipoOrdene}
                onValueChange={(val) =>
                  setValue('tipoOrdenie', val, { shouldValidate: true })
                }
              >
                <SelectTrigger className="h-10 w-full bg-[#F1F3F5] text-sm text-black border-gray-200/80 shadow-none">
                  <SelectValue placeholder="Seleccione una" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TipoOrdenie).map((t) => (
                    <SelectItem key={t} value={t}>
                      {formatTipoOrdenieLabel(t)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Campos: Ordeñes por día y Promedio de litros */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-medium text-gray-700">
                  Ordeñes por día
                </Label>
                <input
                  type="number"
                  min={1}
                  max={3}
                  {...register('ordenie_dia', { valueAsNumber: true })}
                  placeholder="2"
                  className={cn(
                    'h-10 w-full px-3 rounded-lg border text-sm outline-none bg-[#F1F3F5] text-black transition-colors',
                    errors.ordenie_dia
                      ? 'border-red-500'
                      : 'border-gray-200/80 focus:border-lime-600'
                  )}
                />
                {errors.ordenie_dia && (
                  <p className="text-xs font-medium text-[#E11D48]">
                    {errors.ordenie_dia.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-medium text-gray-700">
                  Promedio de litros
                </Label>
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  {...register('promLitros', { valueAsNumber: true })}
                  placeholder="24.5"
                  className={cn(
                    'h-10 w-full px-3 rounded-lg border text-sm outline-none bg-[#F1F3F5] text-black transition-colors',
                    errors.promLitros
                      ? 'border-red-500'
                      : 'border-gray-200/80 focus:border-lime-600'
                  )}
                />
                {errors.promLitros && (
                  <p className="text-xs font-medium text-[#E11D48]">
                    {errors.promLitros.message}
                  </p>
                )}
              </div>
            </div>

            {/* Campos: Provincia y Localidad */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium text-black text-center">
                  Provincia
                </Label>
                <Select
                  value={provincia}
                  onValueChange={(val) => {
                    setValue('provincia', val)
                    setValue('localidad', '')
                  }}
                >
                  <SelectTrigger className="h-10 w-full bg-white rounded-full border-slate-300 text-sm text-gray-500 shadow-none">
                    <SelectValue placeholder="Seleccione una" />
                  </SelectTrigger>
                  <SelectContent>
                    {province?.provincias.map((p) => (
                      <SelectItem key={p.id} value={p.nombre}>
                        {p.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.provincia && (
                  <p className="text-xs font-medium text-[#E11D48]">
                    {errors.provincia.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium text-black text-center">
                  Localidad
                </Label>
                <Select
                  value={localidad}
                  disabled={!provincia}
                  onValueChange={(val) => setValue('localidad', val)}
                >
                  <SelectTrigger className="h-10 w-full bg-white rounded-full border-slate-300 text-sm text-gray-500 shadow-none">
                    <SelectValue
                      placeholder={
                        provincia
                          ? 'Seleccione una'
                          : 'Primero seleccione una provincia'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {locality?.municipios.map((l) => (
                      <SelectItem key={l.id} value={l.nombre}>
                        {l.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.localidad && (
                  <p className="text-xs font-medium text-[#E11D48]">
                    {errors.localidad.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Columna Derecha: Tarjeta informativa Diagnóstico Inicial (Ocupa 5 de 12 columnas) */}
          <div className="md:col-span-5 md:mt-7">
            <div className="bg-[#E6F4EA] rounded-md p-5 flex gap-3 border border-transparent">
              <Info size={16} className="text-[#0F766E] shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1.5">
                <h4 className="text-xs font-bold text-[#0F766E]">
                  Diagnóstico Inicial
                </h4>
                <p className="text-xs text-gray-700 font-medium leading-relaxed">
                  Los datos mostrados han sido recuperados automáticamente de su
                  diagnóstico completado 12 de febrero. Revisa la ubicación
                  exacta para asegurar la precisión de los reportes
                  meterológicos
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Botones inferiores de acción centrados */}
        <div className="flex items-center justify-center gap-4 mt-12 pt-4">
          <button
            type="button"
            className="w-40 h-10 text-xs font-bold text-white bg-[#94A3B8] rounded-md hover:bg-[#64748B] tracking-wider transition-colors shadow-sm"
          >
            CANCELAR
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="w-40 h-10 text-xs font-bold text-white bg-[#65A30D] rounded-md hover:bg-[#4D7C0F] tracking-wider transition-colors shadow-sm"
          >
            {isPending ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
          </button>
        </div>
      </form>
    </div>
  )
}
