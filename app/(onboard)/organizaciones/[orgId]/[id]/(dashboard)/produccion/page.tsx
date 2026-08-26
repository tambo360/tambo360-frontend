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
            variant="secondary"
            className="flex items-center gap-2 h-12 w-40"
            disabled={isPending || (data?.data.lotes.length === 0 && !error)}
            asChild
          >
            <Link
              href="produccion/lote/nuevo"
              className="flex items-center gap-2"
            >
              Descargar Reporte
            </Link>
          </Button>

          <Button
            className="flex items-center gap-2 h-12 w-40"
            variant="darkGreen"
            onClick={() => setIsChangeBatchOpen(true)}
          >
            Registrar lote <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <Card className="border-gray-200 shadow-sm overflow-hidden rounded-2xl bg-white gap-0 py-0">
        <CardHeader className="border-b border-gray-100 bg-white p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col gap-3">
              <CardTitle className="text-lg font-bold">
                Listado de lotes
              </CardTitle>
              <CardDescription>
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
                className="border-gray-200 bg-gray-50 rounded-lg"
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
            <TableHeader className="bg-tables">
              <TableRow>
                <TableHead className="w-[8%] text-center font-bold text-gray-400 uppercase text-xs tracking-wider">
                  Lote
                </TableHead>
                <TableHead className="w-[10%] text-left font-bold text-gray-400 uppercase text-xs tracking-wider">
                  Fecha
                </TableHead>
                <TableHead className="w-[10%] text-left font-bold text-gray-400 uppercase text-xs tracking-wider">
                  Producto
                </TableHead>
                <TableHead className="w-[13%] text-left font-bold text-gray-400 uppercase text-xs tracking-wider">
                  Cantidad
                </TableHead>
                <TableHead className="w-[13%] text-left font-bold text-gray-400 uppercase text-xs tracking-wider">
                  TemperaturaA(°C)
                </TableHead>

                {/*
                  TODO (pendiente de backend):
                  Figma también pide columnas "Turno" y "Tipo de Rodeo".
                  - "Turno": no existe el campo en el modelo LoteProduccion (prisma/schema.prisma).
                    Falta que backend lo agregue a la tabla y al endpoint /lote/listar.
                  - "Tipo de Rodeo" (batch.rodeo.label): el campo idRodeo existe en el modelo,
                    pero la relación "rodeo" no está incluida en el include de listarLotes()
                    (src/services/batchService.ts). Falta que backend agregue `rodeo: true`
                    al include de esa consulta.
                  No se agregan estas columnas todavía para no mostrar datos undefined.
                */}

                <TableHead className="w-[10%] text-left font-bold text-gray-400 uppercase text-xs tracking-wider">
                  Merma
                </TableHead>
                <TableHead className="w-[10%] text-left font-bold text-gray-400 uppercase text-xs tracking-wider">
                  Estado
                </TableHead>
                <TableHead className="w-[5%] pr-6 pl-4 text-right font-bold text-gray-400 uppercase text-xs tracking-wider">
                  Acción
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending
                ? Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i} className="animate-pulse">
                      <TableCell>
                        <div className="h-4 w-10 bg-gray-200 rounded" />
                      </TableCell>

                      <TableCell>
                        <div className="h-4 w-20 bg-gray-200 rounded" />
                      </TableCell>

                      <TableCell>
                        <div className="h-4 w-32 bg-gray-200 rounded" />
                      </TableCell>

                      <TableCell>
                        <div className="h-4 w-16 bg-gray-200 rounded" />
                      </TableCell>

                      <TableCell>
                        <div className="h-4 w-20 bg-gray-200 rounded" />
                      </TableCell>

                      <TableCell>
                        <div className="h-4 w-12 bg-gray-200 rounded" />
                      </TableCell>

                      <TableCell>
                        <div className="h-6 w-20 bg-gray-200 rounded-full" />
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="h-8 w-8 bg-gray-200 rounded mx-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                : data?.data.lotes.length > 0 &&
                  !error &&
                  data?.data?.lotes.map((batch: Lote) => {
                    const loteDisplay = `#${String(batch.numeroLote).padStart(3, '0')}`
                    const closingStatus = getClosingStatus(
                      batch.fechaProduccion
                    )
                    return (
                      <TableRow key={batch.idLote}>
                        <TableCell className="text-center">
                          <HighlightMatch
                            text={loteDisplay}
                            query={highlightQuery}
                          />
                        </TableCell>

                        <TableCell suppressHydrationWarning>
                          {batch.fechaProduccion
                            ? batch.fechaProduccion
                                .slice(0, 10)
                                .split('-')
                                .reverse()
                                .join('/')
                            : '-'}
                        </TableCell>

                        <TableCell>
                          <Link href={`produccion/lote/${batch.idLote}`}>
                            <HighlightMatch
                              text={
                                batch.producto?.nombre || 'Producto desconocido'
                              }
                              query={highlightQuery}
                            />
                          </Link>
                        </TableCell>

                        <TableCell className="truncate">
                          {Number(batch.cantidad).toLocaleString('es-AR')}{' '}
                          {batch.unidad}
                        </TableCell>

                        <TableCell className="truncate">
                          {batch.tempTanque ?? 'N/A'}
                        </TableCell>

                        <TableCell className="truncate">
                          <Link
                            href={`produccion/lote/${batch.idLote}/#mermas`}
                          >
                            {batch.mermas
                              ?.reduce((total, m) => {
                                const qty =
                                  typeof m.cantidad === 'string'
                                    ? parseFloat(m.cantidad)
                                    : (m.cantidad ?? 0)
                                return total + qty
                              }, 0)
                              .toLocaleString('es-AR') +
                              ' ' +
                              batch.unidad}
                          </Link>
                        </TableCell>

                        {/*
                          TODO: columna "Costo" oculta para calzar con el Figma
                          (que no la muestra en el listado). El dato sigue disponible
                          en batch.costosDirectos por si se necesita reactivar,
                          y también se puede ver en el detalle del lote (#costos).
                        */}

                        <TableCell>
                          <Tooltip open={batch.estado ? false : undefined}>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                className={`${batch.estado ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                onClick={() => {
                                  if (batch.estado) return
                                  setSelectedBatch(batch)
                                  setIsCompleteBatchOpen(true)
                                }}
                                size="xs"
                                disabled={batch.estado}
                                asChild
                              >
                                <Badge
                                  variant={
                                    batch.estado ? 'success' : 'destructive'
                                  }
                                  className={`flex items-center gap-1 text-black font-bold ${batch.estado ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                  {!batch.estado && (
                                    <span
                                      className={`size-2 rounded-full ${closingStatus.color}`}
                                    />
                                  )}
                                  {batch.estado ? 'Completo' : 'Incompleto'}
                                </Badge>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{closingStatus.text}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>

                        <TableCell className="text-center mr-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Ellipsis />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuGroup>
                                <DropdownMenuItem>
                                  <Link
                                    href={`produccion/lote/${batch.idLote}`}
                                    className="flex items-center gap-2"
                                  >
                                    <Eye /> Ver Detalles
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
                                >
                                  <PackageCheck /> Completar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedBatch(batch)
                                    setIsChangeBatchOpen(true)
                                  }}
                                  disabled={batch.estado}
                                >
                                  <Pencil /> Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedBatch(batch)
                                    setIsChangeDecreaseOpen(true)
                                  }}
                                  disabled={batch.estado}
                                >
                                  <DropletOff /> Registrar merma
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setLoteId(batch.idLote)
                                    setIsChangeCostOpen(true)
                                  }}
                                  disabled={batch.estado}
                                >
                                  <BanknoteArrowUp /> Registrar costo
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
            <div className="flex flex-col lg:flex-row items-center justify-center py-16 px-6 gap-12 bg-white w-full">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-3xl p-12 text-center max-w-md w-full">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <Milk className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Tu listado de producción está vacío
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Comienza registrando tu primer lote para ver aquí el detalle
                  de tu producción láctea.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex flex-col lg:flex-row items-center justify-center py-16 px-6 gap-12 bg-white w-full">
              <div className="flex flex-col items-center justify-center rounded-3xl p-12 text-center max-w-md w-full">
                <div className="w-20 h-20 bg-[#F1F5F9] rounded-md flex items-center justify-center mb-6">
                  <CloudOff className="w-10 h-10 text-[#94A3B8]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  No pudimos cargar los lotes
                </h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  Hubo un problema al conectar el <br /> servidor. Por favor,
                  revisa tu conexión a <br /> internet e intenta nuevamente
                </p>
              </div>
            </div>
          )}

          {!isPending && data?.data.lotes.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white">
              <span className="text-xs text-gray-400">
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
