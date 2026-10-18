'use client'

import { useState } from 'react'
import {
  UserPlus,
  UserMinus,
  Search,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { AltaAnimalModal as AltaModal } from '@/components/shared/dashboard/organization/configuration/modals/AltaAnimalModal'
import { BajaAnimalModal as BajaModal } from '@/components/shared/dashboard/organization/configuration/modals/BajaAnimalModal'
import { EditAnimalModal } from '@/components/shared/dashboard/organization/configuration/modals/EditAnimalModal'

import {
  useInventarioAnimales,
  type AnimalRow,
  type FiltroEstado,
} from '@/hooks/establishment/useInventarioAnimales'
import { useAnimalMutations } from '@/hooks/establishment/useAnimalMutations'

function getCategoriaLabel(categoria: string) {
  if (categoria.includes('SECA')) return 'Secas'
  if (categoria.includes('ORDENE')) return 'Ordeñe'
  return categoria || '—'
}

function getObservacion(a: AnimalRow) {
  if (a.observacion) return a.observacion
  if (a.estado === 'MASTITIS') return 'Mastitis'
  if (a.estado === 'TRATAMIENTO') return 'Tratamiento'
  return '—'
}

// Clases ajustadas para evitar el scroll horizontal
const HEAD_CLASS = 'text-center text-xs font-semibold text-slate-700 py-3 px-2'
const CELL_CLASS = 'text-center text-[11px] px-2 py-4'

export default function AnimalInventoryPage() {
  const {
    loading,
    refetch,
    pageItems,
    totalFiltrados,
    stats,
    searchTerm,
    setSearchTerm,
    estadoFilter,
    setEstadoFilter,
    currentPage,
    totalPages,
    goPrev,
    goNext,
    isAltaOpen,
    isBajaOpen,
    abrirAlta,
    cerrarAlta,
    abrirBaja,
    cerrarBaja,
  } = useInventarioAnimales()

  const { deleteAnimal, isDeleting } = useAnimalMutations()

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalRow | null>(null)

  const handleEditar = (animal: AnimalRow) => {
    setSelectedAnimal(animal)
    setIsEditOpen(true)
  }

  const handleEliminar = async (animal: AnimalRow) => {
    const confirmar = window.confirm(
      `¿Estás seguro que querés dar de baja a ${animal.codigo} - ${animal.nombre}?`
    )
    if (!confirmar) return

    try {
      await deleteAnimal(animal.id, 'EGRESO_VENTA')
      alert('✅ Animal dado de baja correctamente')
      refetch()
    } catch (error: any) {
      alert(`❌ ${error.message}`)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#659711]" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-300">
      {/* Header: título + botones */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Inventario por animal
        </h1>
        <div className="flex items-center gap-3">
          <Button
            onClick={abrirAlta}
            className="h-10 gap-2 rounded-lg bg-[#659711] px-5 text-sm font-bold text-white shadow-sm hover:bg-[#537d0d]"
          >
            <UserPlus className="w-4 h-4" /> Registrar Alta
          </Button>
          <Button
            onClick={abrirBaja}
            className="h-10 gap-2 rounded-lg bg-[#E8200C] px-6 text-sm font-bold text-white shadow-sm hover:bg-[#c71b0a]"
          >
            <UserMinus className="w-4 h-4" /> Baja
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-1.5 rounded-xl bg-[#DDECE2] p-5 shadow-md">
          <h3 className="text-sm font-bold text-slate-900">Total Plantel</h3>
          <span className="text-lg font-bold text-slate-900">
            {stats.total} cab
          </span>
          <p className="text-xs text-slate-800">
            {stats.ordene} ordeñe - {stats.secas} secas
          </p>
        </div>

        <div className="flex flex-col gap-1.5 rounded-xl bg-[#DDECE2] p-5 shadow-md">
          <h3 className="text-sm font-bold text-slate-900">En Tratamiento</h3>
          <span className="text-lg font-bold text-[#E8200C]">
            {stats.enTratamiento} cab
          </span>
          <p className="text-xs text-slate-800">Leche descartada hoy</p>
        </div>

        <div className="flex flex-col gap-1.5 rounded-xl bg-[#DDECE2] p-5 shadow-md">
          <h3 className="text-sm font-bold text-slate-900">
            Prod. Promedio/Vaca
          </h3>
          <span className="text-xl font-bold text-[#2E8B57]">
            {stats.promedio !== null ? `${stats.promedio.toFixed(1)}L` : '—'}
          </span>
          <p className="text-xs text-slate-800">Vacas en ordeñe</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Buscar por RP o nombre..."
            className="rounded-lg bg-white pl-9 text-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-52">
          <Select
            value={estadoFilter}
            onValueChange={(v) => setEstadoFilter(v as FiltroEstado)}
          >
            <SelectTrigger className="w-full rounded-lg bg-white text-xs">
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="normal">Sana</SelectItem>
                <SelectItem value="mastitis">Mastitis</SelectItem>
                <SelectItem value="tratamiento">Tratamiento</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabla */}
      <div className="flex flex-col gap-4 relative">
        {isDeleting && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-lg">
            <Loader2 className="w-8 h-8 animate-spin text-[#659711]" />
          </div>
        )}

        {/* Quitamos overflow-hidden para que no corte y forzamos table-fixed */}
        <div className="rounded-lg border border-slate-100 bg-white">
          <Table className="table-fixed w-full">
            <TableHeader className="bg-[#E8EEF5]">
              <TableRow className="hover:bg-[#E8EEF5]">
                <TableHead className={`${HEAD_CLASS} w-[12%]`}>RP/N°</TableHead>
                <TableHead className={`${HEAD_CLASS} w-[15%]`}>
                  Nombre
                </TableHead>
                <TableHead className={`${HEAD_CLASS} w-[12%]`}>
                  Categoría
                </TableHead>
                <TableHead className={`${HEAD_CLASS} w-[10%]`}>DEL</TableHead>
                <TableHead className={`${HEAD_CLASS} w-[12%]`}>
                  Prod. Hoy
                </TableHead>
                <TableHead className={`${HEAD_CLASS} w-[15%]`}>
                  Estado
                </TableHead>
                <TableHead className={`${HEAD_CLASS} w-[18%]`}>OBS.</TableHead>
                <TableHead className="w-[6%]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.map((a) => {
                const sana = a.estado === 'NORMAL'
                return (
                  <TableRow key={a.id} className="border-b border-slate-100">
                    <TableCell
                      className={`${CELL_CLASS} font-bold text-slate-900`}
                    >
                      {a.codigo}
                    </TableCell>
                    <TableCell
                      className={`${CELL_CLASS} text-slate-800 truncate`}
                    >
                      {a.nombre}
                    </TableCell>
                    <TableCell className="text-center px-1 py-4">
                      <span className="inline-block rounded-full bg-[#9CC5AE] px-2 py-0.5 text-[10px] font-bold text-[#0A3D24] truncate max-w-full">
                        {getCategoriaLabel(a.categoria)}
                      </span>
                    </TableCell>
                    <TableCell
                      className={`${CELL_CLASS} font-bold text-slate-900`}
                    >
                      {a.del && a.del > 0 ? a.del : '—'}
                    </TableCell>
                    <TableCell className={`${CELL_CLASS} font-bold`}>
                      {sana ? (
                        <span className="text-slate-900">
                          {a.produccionHoy !== null
                            ? `${a.produccionHoy} L`
                            : '—'}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-[#E8200C]">
                          — (desc.)
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="px-1 py-4">
                      <span className="flex items-center justify-center gap-1.5">
                        <span
                          className={`h-2.5 w-2.5 shrink-0 rounded-full ${sana ? 'bg-[#659711]' : 'bg-[#E8200C]'}`}
                        />
                        <span
                          className={`truncate ${sana ? 'text-[11px] font-bold text-slate-900' : 'text-[10px] font-bold text-[#E8200C]'}`}
                        >
                          {sana ? 'Sana' : 'En trat.'}
                        </span>
                      </span>
                    </TableCell>
                    <TableCell
                      className={`${CELL_CLASS} text-slate-800 truncate`}
                    >
                      {getObservacion(a)}
                    </TableCell>
                    <TableCell className="text-right px-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            aria-label="Más opciones"
                            disabled={isDeleting}
                          >
                            <MoreVertical className="w-4 h-4 text-slate-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem
                            onClick={() => handleEditar(a)}
                            className="cursor-pointer gap-2 text-xs"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEliminar(a)}
                            className="cursor-pointer gap-2 text-xs text-red-600 focus:bg-red-50 focus:text-red-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}

              {pageItems.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-8 text-center text-xs text-slate-400"
                  >
                    Sin animales para mostrar
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Paginación */}
        <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-white px-5 py-3">
          <span className="text-[11px] text-slate-600">
            Mostrando {pageItems.length} de {totalFiltrados} registros
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={goPrev}
              disabled={currentPage <= 1}
              aria-label="Página anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={goNext}
              disabled={currentPage >= totalPages}
              aria-label="Página siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <AltaModal open={isAltaOpen} onClose={cerrarAlta} onSuccess={refetch} />
      <BajaModal open={isBajaOpen} onClose={cerrarBaja} onSuccess={refetch} />
      <EditAnimalModal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        animal={selectedAnimal}
        onSuccess={refetch}
      />
    </div>
  )
}
