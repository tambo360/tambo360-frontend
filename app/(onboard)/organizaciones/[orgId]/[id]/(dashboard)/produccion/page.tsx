'use client'
import React, { useState } from 'react'
import {
  Plus,
  Search,
  Milk,
  Eye,
  DropletOff,
  BanknoteArrowUp,
  Ellipsis,
  Pencil,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  X,
  CloudOff,
  PackageCheck,
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
import ChangeDecrease from '@/components/shared/dashboard/decrease/ChangeDecrease'
import ChangeCost from '@/components/shared/dashboard/cost/ChangeCost'
import ChangeBatch from '@/components/shared/dashboard/batch/ChangeBatch'
import { Badge } from '@/components/ui/badge'
import { Lote } from '@/types/batch'
import { useBatches } from '@/hooks/batch/useBatches'
import DeleteBatch from '@/components/shared/dashboard/batch/DeleteBatch'
import { useDebounce } from 'use-debounce'
import { HighlightMatch } from '@/components/shared/dashboard/batch/HighlightMatch'
import CompleteBatch from '@/components/shared/dashboard/batch/CompleteBatch'
import Link from 'next/link'
import { getClosingStatus } from '@/utils/getClosingStatus'

const Produccion: React.FC = () => {
  const [isChangeDecreaseOpen, setIsChangeDecreaseOpen] = useState(false)
  const [isChangeCostOpen, setIsChangeCostOpen] = useState(false)
  const [isChangeBatchOpen, setIsChangeBatchOpen] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState<Lote | null>(null)
  const [isCompleteBatchOpen, setIsCompleteBatchOpen] = useState(false)
  const [loteId, setLoteId] = useState('')

  const [nombre, setNombre] = useState('')
  const [orden, setOrden] = useState<'asc' | 'desc'>('desc')
  const [pagina, setPagina] = useState(1)

  const [nameDebounced] = useDebounce(nombre, 300)

  const searchFilter = nameDebounced?.replace(/^0+/, '')

  const { data, isPending, error, refetch } = useBatches({
    filters: {
      nombre: searchFilter || undefined,
      orden,
      pagina: String(pagina),
    },
  })

  const totalPaginas: number = data?.data?.totalPaginas ?? 1

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNombre(e.target.value)
    setPagina(1)
  }

  const toggleOrden = () => {
    setOrden((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    setPagina(1)
  }

  const highlightQuery = nombre.replace(/^0+/, '')

  return (
    <div
      className="flex flex-col w-full gap-8 animate-in fade-in duration-500"
      id="top"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Lotes de producción
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            className="flex items-center gap-2 h-12 px-5 bg-[#2E7D53] hover:bg-[#236342] text-white rounded-xl font-semibold shadow-sm"
            onClick={() => setIsChangeBatchOpen(true)}
          >
            Registrar lote <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <Card className="border-gray-200 shadow-sm overflow-hidden rounded-2xl bg-white gap-0 py-0">
        <CardHeader className="border-b border-gray-100 bg-white p-6">
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
              <div className="relative group">
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
                className="border-gray-200 bg-gray-50 rounded-lg h-10 w-10"
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
          <Table>
            <TableHeader className="bg-gray-50/60">
              <TableRow>
                <TableHead className="text-left font-bold text-gray-400 uppercase text-xs tracking-wider pl-6">
                  Lote
                </TableHead>
                <TableHead className="text-left font-bold text-gray-400 uppercase text-xs tracking-wider">
                  Fecha
                </TableHead>
                <TableHead className="text-left font-bold text-gray-400 uppercase text-xs tracking-wider">
                  Turno
                </TableHead>
                <TableHead className="text-left font-bold text-gray-400 uppercase text-xs tracking-wider">
                  Producto
                </TableHead>
                <TableHead className="text-left font-bold text-gray-400 uppercase text-xs tracking-wider">
                  Cantidad (L)
                </TableHead>
                <TableHead className="text-left font-bold text-gray-400 uppercase text-xs tracking-wider">
                  Temperatura (°C)
                </TableHead>
                <TableHead className="text-left font-bold text-gray-400 uppercase text-xs tracking-wider">
                  Tipo de Rodeo
                </TableHead>
                <TableHead className="text-left font-bold text-gray-400 uppercase text-xs tracking-wider">
                  Merma (L)
                </TableHead>
                <TableHead className="text-left font-bold text-gray-400 uppercase text-xs tracking-wider">
                  Estado
                </TableHead>
                <TableHead className="pr-6 text-right font-bold text-gray-400 uppercase text-xs tracking-wider">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending
                ? Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i} className="animate-pulse">
                      <TableCell>
                        <div className="h-4 w-12 bg-gray-200 rounded" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-20 bg-gray-200 rounded" />
                      </TableCell>
                      <TableCell>
                        <div className="h-5 w-16 bg-gray-200 rounded-md" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-28 bg-gray-200 rounded" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-14 bg-gray-200 rounded" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-12 bg-gray-200 rounded" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-20 bg-gray-200 rounded" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-14 bg-gray-200 rounded" />
                      </TableCell>
                      <TableCell>
                        <div className="h-6 w-20 bg-gray-200 rounded-full" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="h-8 w-8 bg-gray-200 rounded ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                : data?.data.lotes.length > 0 &&
                  !error &&
                  data?.data?.lotes.map((batch: Lote) => {
                    const loteDisplay = `L-${String(batch.numeroLote).padStart(4, '0')}`
                    const closingStatus = getClosingStatus(
                      batch.fechaProduccion
                    )

                    const turnoText = (batch as any).turno || 'Mañana'
                    const rodeoText = batch.rodeo?.label ?? 'Rodeo Alto'

                    return (
                      <TableRow
                        key={batch.idLote}
                        className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                      >
                        <TableCell className="text-left pl-6 font-medium text-gray-900">
                          <HighlightMatch
                            text={loteDisplay}
                            query={highlightQuery}
                          />
                        </TableCell>

                        <TableCell
                          className="text-gray-600 text-sm"
                          suppressHydrationWarning
                        >
                          {batch.fechaProduccion
                            ? batch.fechaProduccion
                                .slice(0, 10)
                                .split('-')
                                .reverse()
                                .join('/')
                            : '-'}
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`border-0 text-white font-medium text-xs px-2.5 py-1 rounded-md ${
                              turnoText.toLowerCase() === 'noche'
                                ? 'bg-[#535C68]'
                                : 'bg-[#6AB04C]'
                            }`}
                          >
                            {turnoText}
                          </Badge>
                        </TableCell>

                        <TableCell className="font-medium">
                          <Link
                            href={`produccion/lote/${batch.idLote}`}
                            className="hover:underline text-gray-900"
                          >
                            <HighlightMatch
                              text={
                                batch.producto?.nombre || 'Producto desconocido'
                              }
                              query={highlightQuery}
                            />
                          </Link>
                        </TableCell>

                        <TableCell className="text-gray-600">
                          {Number(batch.cantidad).toLocaleString('es-AR')}
                        </TableCell>

                        <TableCell className="text-gray-600">
                          {batch.tempTanque ?? 'N/A'}
                        </TableCell>

                        <TableCell className="text-gray-600 font-medium">
                          {rodeoText}
                        </TableCell>

                        <TableCell className="text-gray-600">
                          <Link
                            href={`produccion/lote/${batch.idLote}/#mermas`}
                            className="hover:underline"
                          >
                            {batch.mermas
                              ?.reduce((total, m) => {
                                const qty =
                                  typeof m.cantidad === 'string'
                                    ? parseFloat(m.cantidad)
                                    : (m.cantidad ?? 0)
                                return total + qty
                              }, 0)
                              .toLocaleString('es-AR') ?? '0'}
                          </Link>
                        </TableCell>

                        <TableCell>
                          <Tooltip open={batch.estado ? false : undefined}>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                className="p-0 h-auto hover:bg-transparent"
                                onClick={() => {
                                  if (batch.estado) return
                                  setSelectedBatch(batch)
                                  setIsCompleteBatchOpen(true)
                                }}
                                disabled={batch.estado}
                                asChild
                              >
                                <div className="inline-flex items-center gap-1.5 cursor-pointer">
                                  <span
                                    className={`size-2.5 rounded-full ${
                                      batch.estado
                                        ? 'bg-emerald-500'
                                        : 'bg-rose-500'
                                    }`}
                                  />
                                  <span className="text-xs font-semibold text-gray-700">
                                    {batch.estado ? 'Completado' : 'Incompleto'}
                                  </span>
                                </div>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{closingStatus.text}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>

                        <TableCell className="text-right pr-6">
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
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuGroup>
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`produccion/lote/${batch.idLote}`}
                                    className="flex items-center gap-2 cursor-pointer w-full"
                                  >
                                    <Eye className="w-4 h-4" /> Ver Detalles
                                  </Link>
                                </DropdownMenuItem>
                              </DropdownMenuGroup>
                              <DropdownMenuSeparator />
                              <DropdownMenuGroup>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedBatch(batch)
                                    setIsCompleteBatchOpen(true)
                                  }}
                                  disabled={batch.estado}
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
                                  disabled={batch.estado}
                                  className="cursor-pointer"
                                >
                                  <Pencil className="w-4 h-4 mr-2" /> Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedBatch(batch)
                                    setIsChangeDecreaseOpen(true)
                                  }}
                                  disabled={batch.estado}
                                  className="cursor-pointer"
                                >
                                  <DropletOff className="w-4 h-4 mr-2" />{' '}
                                  Registrar merma
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setLoteId(batch.idLote)
                                    setIsChangeCostOpen(true)
                                  }}
                                  disabled={batch.estado}
                                  className="cursor-pointer"
                                >
                                  <BanknoteArrowUp className="w-4 h-4 mr-2" />{' '}
                                  Registrar costo
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
                  })}
            </TableBody>
          </Table>

          {data?.data.lotes.length === 0 && (
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

          {error && (
            <div className="flex flex-col items-center justify-center py-16 px-6 gap-6 bg-white w-full">
              <div className="w-20 h-20 bg-slate-100 rounded-md flex items-center justify-center">
                <CloudOff className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                No pudimos cargar los lotes
              </h3>
              <p className="text-sm text-slate-400 text-center">
                Hubo un problema al conectar el servidor. Por favor, revisa tu
                conexión e intenta nuevamente.
              </p>
            </div>
          )}

          {!isPending && (data?.data?.lotes?.length ?? 0) > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white">
              <span className="text-xs text-gray-500">
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

      <ChangeBatch
        open={isChangeBatchOpen}
        onClose={() => {
          setIsChangeBatchOpen(false)
          setSelectedBatch(null)
        }}
        onOpen={() => setIsChangeBatchOpen(true)}
        batch={selectedBatch ? selectedBatch : undefined}
      />

      <ChangeDecrease
        open={isChangeDecreaseOpen}
        onClose={() => setIsChangeDecreaseOpen(false)}
        onOpen={() => setIsChangeDecreaseOpen(true)}
        idBatch={selectedBatch?.idLote}
      />

      <ChangeCost
        open={isChangeCostOpen}
        onClose={() => setIsChangeCostOpen(false)}
        onOpen={() => setIsChangeCostOpen(true)}
        loteId={loteId}
      />

      <CompleteBatch
        open={isCompleteBatchOpen}
        onClose={() => {
          setIsCompleteBatchOpen(false)
          setSelectedBatch(null)
        }}
        batchId={selectedBatch?.idLote}
        batch={selectedBatch ?? undefined}
        refetch={refetch}
      />
    </div>
  )
}

export default Produccion
