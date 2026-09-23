'use client'

import React, { useState } from 'react'
import {
  Plus,
  Search,
  Milk,
  Eye,
  DropletOff,
  Ellipsis,
  Pencil,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  X,
  CloudOff,
  PackageCheck,
  MapPin,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import ChangeBatch from '@/components/shared/dashboard/batch/ChangeBatch'
import { Lote } from '@/types/batch'
import { DecreaseData } from '@/types/decrease'
import { useBatches } from '@/hooks/batch/useBatches'
import { useCreateDecrease } from '@/hooks/decrease/useCreateDecrease'
import { useErrorMessage } from '@/hooks/useErrorMessage'
import DeleteBatch from '@/components/shared/dashboard/batch/DeleteBatch'
import { useDebounce } from 'use-debounce'
import { HighlightMatch } from '@/components/shared/dashboard/batch/HighlightMatch'
import { WeatherIndicator } from '@/components/weather/WeatherIndicator'

// Modales
import BatchDetailModal from '@/components/shared/dashboard/batch/BatchDetailModal'
import RegisterMermaModal from '@/components/shared/dashboard/organization/configuration/modals/RegisterMermaidModal'
import { CompleteBatchModal } from '@/components/shared/dashboard/batch/CompleteBatchModal'
import { BatchSuccessScreen } from '@/components/shared/dashboard/batch/BatchSuccessScreen'

const Produccion: React.FC = () => {
  // Estados de modales
  const [isChangeBatchOpen, setIsChangeBatchOpen] = useState(false)
  const [isCompleteBatchOpen, setIsCompleteBatchOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isRegisterMermaOpen, setIsRegisterMermaOpen] = useState(false)

  // Estados de datos seleccionados
  const [selectedBatch, setSelectedBatch] = useState<Lote | null>(null)
  const [selectedBatchId, setSelectedBatchId] = useState('')

  // Estados de filtros y paginación
  const [nombre, setNombre] = useState('')
  const [orden, setOrden] = useState<'asc' | 'desc'>('desc')
  const [pagina, setPagina] = useState(1)

  // Estado para pantalla de éxito
  const [showSuccessScreen, setShowSuccessScreen] = useState(false)
  const [completedBatchId, setCompletedBatchId] = useState<string | null>(null)

  const [nameDebounced] = useDebounce(nombre, 300)
  const searchFilter = nameDebounced?.replace(/^0+/, '')
  const highlightQuery = nombre.replace(/^0+/, '')

  // Hook de datos
  const { data, isPending, error, refetch } = useBatches({
    filters: {
      nombre: searchFilter || undefined,
      orden,
      page: String(pagina),
    },
  })

  // Hook de merma (crear desde la lista)
  const { mutateAsync: createDecrease, isPending: isCreatingMerma } =
    useCreateDecrease()
  const { showErrorMessage } = useErrorMessage()

  // Transformación de datos
  const lotes = (data?.data?.lotes?.map((item: any) => item.lote) ||
    []) as Lote[]
  const totalPaginas: number = data?.data?.totalPaginas ?? 1

  // Ubicación real de la base de datos
  const ubicacionEstablecimiento =
    data?.data?.organizacion?.ubicacion ||
    data?.data?.establecimiento?.ubicacion ||
    data?.data?.ubicacion

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNombre(e.target.value)
    setPagina(1)
  }

  const toggleOrden = () => {
    setOrden((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    setPagina(1)
  }

  const handleOpenDetail = (id: string) => {
    setSelectedBatchId(id)
    setIsDetailModalOpen(true)
  }

  // Registrar merma desde la lista
  const handleSaveMermaFromList = async (data: DecreaseData) => {
    if (!selectedBatch?.idLote) return
    try {
      await createDecrease({ ...data, idLote: selectedBatch.idLote })
      setIsRegisterMermaOpen(false)
      setSelectedBatch(null)
      refetch()
    } catch (err) {
      showErrorMessage(
        'No se pudo registrar la merma. Verifica los datos e intenta de nuevo.'
      )
    }
  }

  // Helper para calcular la merma total
  const calcularMerma = (batch: Lote) => {
    return (
      (batch as any).mermas?.reduce((total: number, m: any) => {
        const qty =
          typeof m.cantidad === 'string'
            ? parseFloat(m.cantidad)
            : (m.cantidad ?? 0)
        return total + qty
      }, 0) || 0
    )
  }

  // Estado visible: si tiene al menos una merma
  const hasMermas = (batch: Lote) => {
    const mermas = (batch as any).mermas
    return Array.isArray(mermas) && mermas.length > 0
  }

  // Estado real del backend: si el usuario ya cerró el lote
  const isLocked = (batch: Lote) => Boolean((batch as any).estado)

  const getRodeoDisplay = (batch: Lote) => {
    const b = batch as any
    const directo = b.rodeo?.tipoRodeo || b.rodeo?.nombre
    if (directo) return directo

    if (b.cantAnimales && Number(b.cantAnimales) > 0) {
      return 'Rodeo único'
    }

    return '—'
  }

  return (
    <div
      className="flex flex-col w-full gap-8 animate-in fade-in duration-500"
      id="top"
    >
      {/* HEADER PRINCIPAL */}
      <div className="flex items-center justify-between gap-2 w-full">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Lotes de producción
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0 flex-nowrap">
          {ubicacionEstablecimiento && (
            <div className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
              <MapPin className="w-4 h-4 text-gray-500 shrink-0" />
              <span className="max-w-[120px] sm:max-w-xs truncate">
                {ubicacionEstablecimiento}
              </span>
            </div>
          )}
          <WeatherIndicator />
        </div>
      </div>

      {/* Botón Registrar */}
      <div className="flex justify-end">
        <Button
          className="flex items-center gap-2 h-12 px-5 bg-[#2E7D53] hover:bg-[#236342] text-white rounded-xl font-semibold shadow-sm"
          onClick={() => setIsChangeBatchOpen(true)}
        >
          Registrar lote <Plus className="w-5 h-5" />
        </Button>
      </div>

      <Card className="border-gray-200 shadow-sm rounded-2xl bg-white gap-0 py-0 overflow-hidden">
        <CardHeader className="border-b border-gray-100 bg-white p-4 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <CardTitle className="text-lg font-bold text-gray-900">
                Listado de lotes
              </CardTitle>
              <CardDescription className="capitalize">
                {new Date().toLocaleDateString('es-ES', {
                  month: 'long',
                  year: 'numeric',
                })}
              </CardDescription>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative group flex-1 md:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                <Input
                  className="pl-10 w-full md:w-60 bg-gray-50 border-gray-200 rounded-lg"
                  placeholder="Buscar lote..."
                  value={nombre}
                  onChange={handleNombreChange}
                />
                {nombre && (
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 group-focus-within:text-black transition-colors"
                    onClick={() => setNombre('')}
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="border-gray-200 bg-gray-50 rounded-lg h-10 w-10 shrink-0"
                onClick={toggleOrden}
                title={
                  orden === 'asc' ? 'Orden ascendente' : 'Orden descendente'
                }
              >
                {orden === 'asc' ? (
                  <ArrowUp className="w-4 h-4 text-gray-600" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-gray-600" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* ============ VISTA TABLA ============ */}
          <div className="hidden sm:block hide-scrollbar">
            <Table className="w-full">
              <TableHeader className="bg-slate-100/60">
                <TableRow className="border-b border-slate-200/70 hover:bg-slate-100/60">
                  <TableHead className="text-left font-bold text-gray-500 uppercase text-xs tracking-wider pl-6">
                    Lote
                  </TableHead>
                  <TableHead className="text-left font-bold text-gray-500 uppercase text-xs tracking-wider">
                    Fecha
                  </TableHead>
                  <TableHead className="text-left font-bold text-gray-500 uppercase text-xs tracking-wider">
                    Rodeo
                  </TableHead>
                  <TableHead className="text-left font-bold text-gray-500 uppercase text-xs tracking-wider">
                    Cantidad
                  </TableHead>
                  <TableHead className="text-left font-bold text-gray-500 uppercase text-xs tracking-wider">
                    Merma
                  </TableHead>
                  <TableHead className="text-left font-bold text-gray-500 uppercase text-xs tracking-wider">
                    Estado
                  </TableHead>
                  <TableHead className="pr-20 text-right font-bold text-gray-500 uppercase text-xs tracking-wider">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isPending
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <TableRow key={i} className="animate-pulse">
                        <TableCell className="pl-6">
                          <div className="h-4 w-12 bg-gray-200 rounded" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-20 bg-gray-200 rounded" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-14 bg-gray-200 rounded" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-14 bg-gray-200 rounded" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-14 bg-gray-200 rounded" />
                        </TableCell>
                        <TableCell>
                          <div className="h-6 w-20 bg-gray-200 rounded-full" />
                        </TableCell>
                        <TableCell className="pr-20 text-right">
                          <div className="h-8 w-8 bg-gray-200 rounded ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  : lotes.length > 0 && !error
                    ? lotes.map((batch: Lote, index: number) => {
                        const loteDisplay = batch.numeroLote
                          ? `L-${String(batch.numeroLote).padStart(4, '0')}`
                          : `L-${String(index + 1).padStart(4, '0')}`

                        const totalMerma = calcularMerma(batch)
                        const tipoRodeo = getRodeoDisplay(batch)
                        const isComplete = hasMermas(batch)
                        const locked = isLocked(batch)

                        return (
                          <TableRow
                            key={batch.idLote || index}
                            className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                          >
                            <TableCell className="text-left pl-6 font-medium text-gray-900">
                              <HighlightMatch
                                text={loteDisplay}
                                query={highlightQuery}
                              />
                            </TableCell>
                            <TableCell
                              className="text-gray-600 text-sm whitespace-nowrap"
                              suppressHydrationWarning
                            >
                              {batch.fechaProduccion
                                ? new Date(
                                    batch.fechaProduccion
                                  ).toLocaleDateString('es-AR')
                                : '-'}
                            </TableCell>
                            <TableCell className="text-gray-600 text-sm">
                              {tipoRodeo}
                            </TableCell>
                            <TableCell className="text-gray-600 text-sm">
                              {batch.cantidad
                                ? `${Number(batch.cantidad).toLocaleString('es-AR')} L`
                                : '0 L'}
                            </TableCell>
                            <TableCell className="text-gray-600 text-sm">
                              <button
                                onClick={() => handleOpenDetail(batch.idLote)}
                                className="hover:underline text-left"
                              >
                                {totalMerma > 0
                                  ? `${totalMerma.toLocaleString('es-AR')} L`
                                  : '-'}
                              </button>
                            </TableCell>
                            <TableCell>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="p-0 h-auto hover:bg-transparent"
                                    onClick={() => {
                                      if (locked) return
                                      setSelectedBatch(batch)
                                      setIsCompleteBatchOpen(true)
                                    }}
                                    disabled={locked}
                                    asChild
                                  >
                                    <span
                                      className={`text-sm font-semibold cursor-pointer ${
                                        isComplete
                                          ? 'text-emerald-600'
                                          : 'text-rose-500'
                                      }`}
                                    >
                                      {isComplete ? 'Completado' : 'Incompleto'}
                                    </span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    {isComplete
                                      ? 'Lote con mermas registradas'
                                      : 'Click para completar'}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TableCell>
                            <TableCell className="text-right pr-20">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-gray-400 hover:text-gray-600"
                                  >
                                    <Ellipsis className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-48"
                                >
                                  <DropdownMenuGroup>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleOpenDetail(batch.idLote)
                                      }
                                      className="flex items-center gap-2 cursor-pointer"
                                    >
                                      <Eye className="w-4 h-4" /> Ver Detalles
                                    </DropdownMenuItem>
                                  </DropdownMenuGroup>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuGroup>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedBatch(batch)
                                        setIsCompleteBatchOpen(true)
                                      }}
                                      disabled={locked}
                                      className="cursor-pointer"
                                    >
                                      <PackageCheck className="w-4 h-4 mr-2" />{' '}
                                      Completar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedBatch(batch)
                                        setIsChangeBatchOpen(true)
                                      }}
                                      disabled={locked}
                                      className="cursor-pointer"
                                    >
                                      <Pencil className="w-4 h-4 mr-2" /> Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedBatch(batch)
                                        setIsRegisterMermaOpen(true)
                                      }}
                                      disabled={locked}
                                      className="cursor-pointer"
                                    >
                                      <DropletOff className="w-4 h-4 mr-2" />{' '}
                                      Registrar merma
                                    </DropdownMenuItem>
                                  </DropdownMenuGroup>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuGroup>
                                    <DeleteBatch batch={batch} />
                                  </DropdownMenuGroup>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    : null}
              </TableBody>
            </Table>
          </div>

          {/* ============ VISTA CARDS (Mobile) ============ */}
          <div className="block sm:hidden divide-y divide-gray-100">
            {isPending
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-4 space-y-3 animate-pulse">
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-3 w-24 bg-gray-200 rounded" />
                      <div className="h-3 w-24 bg-gray-200 rounded" />
                      <div className="h-3 w-24 bg-gray-200 rounded" />
                      <div className="h-3 w-24 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))
              : lotes.length > 0 && !error
                ? lotes.map((batch: Lote, index: number) => {
                    const loteDisplay = batch.numeroLote
                      ? `L-${String(batch.numeroLote).padStart(4, '0')}`
                      : `L-${String(index + 1).padStart(4, '0')}`

                    const totalMerma = calcularMerma(batch)
                    const tipoRodeo = getRodeoDisplay(batch)
                    const isComplete = hasMermas(batch)
                    const locked = isLocked(batch)

                    return (
                      <div
                        key={batch.idLote || index}
                        className="p-4 hover:bg-gray-50/50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-bold text-gray-900">
                            <HighlightMatch
                              text={loteDisplay}
                              query={highlightQuery}
                            />
                          </span>
                          <button
                            onClick={() => {
                              if (locked) return
                              setSelectedBatch(batch)
                              setIsCompleteBatchOpen(true)
                            }}
                            disabled={locked}
                            className={`text-xs font-semibold px-2 py-1 rounded-md ${
                              isComplete
                                ? 'text-emerald-600 bg-emerald-50'
                                : 'text-rose-500 bg-rose-50'
                            }`}
                          >
                            {isComplete ? 'Completado' : 'Incompleto'}
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-y-3 gap-x-3 text-xs">
                          <div>
                            <p className="text-gray-400 uppercase text-[10px] font-bold mb-1">
                              Fecha
                            </p>
                            <p
                              className="text-gray-700 font-medium"
                              suppressHydrationWarning
                            >
                              {batch.fechaProduccion
                                ? new Date(
                                    batch.fechaProduccion
                                  ).toLocaleDateString('es-AR')
                                : '-'}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 uppercase text-[10px] font-bold mb-1">
                              Rodeo
                            </p>
                            <p className="text-gray-700 font-medium">
                              {tipoRodeo}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 uppercase text-[10px] font-bold mb-1">
                              Cantidad
                            </p>
                            <p className="text-gray-700 font-medium">
                              {batch.cantidad
                                ? `${Number(batch.cantidad).toLocaleString('es-AR')} L`
                                : '0 L'}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 uppercase text-[10px] font-bold mb-1">
                              Merma
                            </p>
                            <button
                              onClick={() => handleOpenDetail(batch.idLote)}
                              className="text-gray-700 font-medium hover:underline"
                            >
                              {totalMerma > 0
                                ? `${totalMerma.toLocaleString('es-AR')} L`
                                : '-'}
                            </button>
                          </div>
                          <div className="col-span-2 flex items-end justify-end">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-gray-400"
                                >
                                  <Ellipsis className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuGroup>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleOpenDetail(batch.idLote)
                                    }
                                    className="flex items-center gap-2 cursor-pointer"
                                  >
                                    <Eye className="w-4 h-4" /> Ver Detalles
                                  </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedBatch(batch)
                                      setIsCompleteBatchOpen(true)
                                    }}
                                    disabled={locked}
                                    className="cursor-pointer"
                                  >
                                    <PackageCheck className="w-4 h-4 mr-2" />{' '}
                                    Completar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedBatch(batch)
                                      setIsChangeBatchOpen(true)
                                    }}
                                    disabled={locked}
                                    className="cursor-pointer"
                                  >
                                    <Pencil className="w-4 h-4 mr-2" /> Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedBatch(batch)
                                      setIsRegisterMermaOpen(true)
                                    }}
                                    disabled={locked}
                                    className="cursor-pointer"
                                  >
                                    <DropletOff className="w-4 h-4 mr-2" />{' '}
                                    Registrar merma
                                  </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                  <DeleteBatch batch={batch} />
                                </DropdownMenuGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    )
                  })
                : null}
          </div>

          {/* Estado Vacío */}
          {lotes.length === 0 && !isPending && !error && (
            <div className="flex flex-col items-center justify-center py-16 px-6 gap-6 bg-white w-full">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                <Milk className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Tu listado de producción está vacío
              </h3>
              <p className="text-sm text-gray-500 text-center max-w-sm">
                Comienza registrando tu primer lote para ver aquí el detalle de
                tu producción láctea.
              </p>
            </div>
          )}

          {/* Estado de Error */}
          {error && (
            <div className="flex flex-col items-center justify-center py-16 px-6 gap-6 bg-white w-full">
              <div className="w-20 h-20 bg-slate-100 rounded-md flex items-center justify-center">
                <CloudOff className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                No pudimos cargar los lotes
              </h3>
              <p className="text-sm text-slate-400 text-center">
                Hubo un problema al conectar con el servidor. Por favor, revisa
                tu conexión e intenta nuevamente.
              </p>
            </div>
          )}

          {/* Paginación */}
          {!isPending && lotes.length > 0 && (
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-t border-gray-100 bg-white">
              <span className="text-[11px] sm:text-xs text-gray-500">
                Página {pagina} de {totalPaginas} · {data?.data.totalLotes ?? 0}{' '}
                lotes
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 border-gray-200 bg-gray-50 rounded-lg"
                  disabled={pagina <= 1}
                  onClick={() => {
                    setPagina((p) => Math.max(1, p - 1))
                    document
                      .getElementById('top')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 border-gray-200 bg-gray-50 rounded-lg"
                  disabled={pagina >= totalPaginas}
                  onClick={() => {
                    setPagina((p) => Math.min(totalPaginas, p + 1))
                    document
                      .getElementById('top')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ================= MODALES ================= */}
      <ChangeBatch
        open={isChangeBatchOpen}
        onClose={() => {
          setIsChangeBatchOpen(false)
          setSelectedBatch(null)
        }}
        onOpen={() => setIsChangeBatchOpen(true)}
        batch={selectedBatch ? selectedBatch : undefined}
      />

      <CompleteBatchModal
        open={isCompleteBatchOpen}
        onClose={() => {
          setIsCompleteBatchOpen(false)
          setSelectedBatch(null)
        }}
        batchId={selectedBatch?.idLote || ''}
        onSuccess={() => {
          if (selectedBatch?.idLote) {
            setCompletedBatchId(selectedBatch.idLote)
            setShowSuccessScreen(true)
          }
        }}
      />

      <BatchDetailModal
        open={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        batchId={selectedBatchId}
        onEditRequest={(batch) => {
          setIsDetailModalOpen(false)
          setSelectedBatch(batch)
          setIsChangeBatchOpen(true)
        }}
        onCompleteRequest={(batch) => {
          setIsDetailModalOpen(false)
          setSelectedBatch(batch)
          setIsCompleteBatchOpen(true)
        }}
        onDeleted={() => {
          refetch()
        }}
      />

      {/* Registrar merma desde la lista */}
      <RegisterMermaModal
        open={isRegisterMermaOpen}
        onClose={() => {
          setIsRegisterMermaOpen(false)
          setSelectedBatch(null)
        }}
        onSave={handleSaveMermaFromList}
        isLoading={isCreatingMerma}
      />

      {/* Pantalla de éxito */}
      {showSuccessScreen && completedBatchId && (
        <BatchSuccessScreen
          batchId={completedBatchId}
          onGoToDetail={() => {
            setShowSuccessScreen(false)
            setCompletedBatchId(null)
            handleOpenDetail(completedBatchId)
          }}
          onCreateAnother={() => {
            setShowSuccessScreen(false)
            setCompletedBatchId(null)
            setIsChangeBatchOpen(true)
          }}
          onReturnToDashboard={() => {
            setShowSuccessScreen(false)
            setCompletedBatchId(null)
            window.location.href = '/dashboard'
          }}
        />
      )}
    </div>
  )
}

export default Produccion
