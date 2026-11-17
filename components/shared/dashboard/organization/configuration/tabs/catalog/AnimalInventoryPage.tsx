'use client'

import { useState } from 'react'
import {
  UserPlus,
  UserMinus,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
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

import { AltaAnimalModal as AltaModal } from '@/components/shared/dashboard/organization/configuration/modals/AltaAnimalModal'
import { BajaAnimalModal as BajaModal } from '@/components/shared/dashboard/organization/configuration/modals/BajaAnimalModal'
import { EditAnimalModal } from '@/components/shared/dashboard/organization/configuration/modals/EditAnimalModal'
import { TransferenciasTable } from '@/components/shared/dashboard/organization/configuration/TransferenciasTable'
import { useInventarioRodeos } from '@/hooks/establishment/useInventarioRodeos'

import {
  useInventarioAnimales,
  type AnimalRow,
  type FiltroEstado,
} from '@/hooks/establishment/useInventarioAnimales'
import { useAnimalMutations } from '@/hooks/establishment/useAnimalMutations'

// Función para formatear la categoría como en el Figma (Texto simple)
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

// Clases de tabla adaptadas al Figma
const HEAD_CLASS = 'text-center text-xs font-bold text-slate-700 py-4 px-4'
const CELL_CLASS = 'text-center text-xs px-4 py-5'

const BTN_BASE =
  'flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors'

export default function AnimalInventoryPage() {
  // Estado para controlar qué pestaña se ve
  const [activeTab, setActiveTab] = useState<'inventario' | 'transferencias'>(
    'inventario'
  )

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

  // Historial de movimientos
  const { transferencias } = useInventarioRodeos()

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
    <div className="flex flex-col gap-6 w-full font-sans antialiased text-slate-800 animate-in fade-in duration-300">
      {/* Título Principal */}
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Catálogo</h1>

      {/* Tarjetas de KPIs (Diseño Figma: Fondo Blanco) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h3 className="text-base font-bold leading-tight text-slate-900">
              Rodeo Alto
            </h3>
            <p className="mt-1 text-xs text-slate-500">Producción Intensiva</p>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-[#659711]">
              {stats.total}
            </span>
            <span className="text-sm font-semibold text-slate-700">
              cabezas
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h3 className="text-base font-bold leading-tight text-slate-900">
              Rodeo Secas
            </h3>
            <p className="mt-1 text-xs text-slate-500">Período de Reposo</p>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-[#659711]">
              {stats.secas}
            </span>
            <span className="text-sm font-semibold text-slate-700">
              cabezas
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h3 className="text-base font-bold leading-tight text-slate-900">
              Prod. Promedio/Vaca
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Recría y Mantenimiento
            </p>
          </div>
          <span className="text-3xl font-bold text-[#659711] mt-2">
            {stats.promedio !== null ? `${stats.promedio.toFixed(1)} Lts` : '—'}
          </span>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex flex-wrap items-center justify-end gap-3 mt-2">
        <button
          onClick={abrirAlta}
          className={`${BTN_BASE} bg-[#659711] hover:bg-[#537d0d]`}
        >
          <UserPlus size={18} />
          <span>Registrar alta</span>
          <Plus size={18} className="ml-1" />
        </button>

        <button
          onClick={abrirBaja}
          className={`${BTN_BASE} bg-[#E53935] hover:bg-[#c62f2c]`}
        >
          <UserMinus size={18} />
          <span>Registrar baja</span>
        </button>

        {/* Botón de Transferencias */}
        <button className={`${BTN_BASE} bg-[#D4A12A] hover:bg-[#b98a21]`}>
          <Plus size={18} />
          <span>Transferencias</span>
        </button>
      </div>

      {/* Historial de Movimientos con Tabs */}
      <div className="flex flex-col gap-4 mt-2">
        <h2 className="text-lg font-bold text-slate-900">
          Historial de Movimientos
        </h2>

        {/* Fila de Tabs y Filtros */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-2">
          {/* Pestañas */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('inventario')}
              className={`text-sm font-bold pb-2 transition-colors ${
                activeTab === 'inventario'
                  ? 'text-[#659711] border-b-2 border-[#659711]'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Inventario
            </button>
            <button
              onClick={() => setActiveTab('transferencias')}
              className={`text-sm font-bold pb-2 transition-colors ${
                activeTab === 'transferencias'
                  ? 'text-[#659711] border-b-2 border-[#659711]'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Transferencias
            </button>
          </div>

          {/* Filtros (Solo visibles en la pestaña de Inventario) */}
          {activeTab === 'inventario' && (
            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por RP o nombre..."
                  className="h-9 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-[#659711] focus:ring-1 focus:ring-[#659711]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full sm:w-48">
                <Select
                  value={estadoFilter}
                  onValueChange={(v) => setEstadoFilter(v as FiltroEstado)}
                >
                  <SelectTrigger className="h-9 w-full rounded-md border-slate-200 bg-white text-sm outline-none focus:border-[#659711] focus:ring-1 focus:ring-[#659711]">
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
          )}
        </div>

        {/* Renderizado Condicional de Tablas */}
        {activeTab === 'inventario' ? (
          <div className="flex flex-col gap-4 relative mt-2">
            {isDeleting && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-lg">
                <Loader2 className="w-8 h-8 animate-spin text-[#659711]" />
              </div>
            )}

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <Table className="table-fixed w-full">
                <TableHeader className="bg-[#E8EEF5]">
                  <TableRow className="hover:bg-[#E8EEF5] border-none">
                    <TableHead className={`${HEAD_CLASS} w-[12%]`}>
                      RP/N°
                    </TableHead>
                    <TableHead className={`${HEAD_CLASS} w-[15%]`}>
                      Nombre
                    </TableHead>
                    <TableHead className={`${HEAD_CLASS} w-[15%]`}>
                      Categoría
                    </TableHead>
                    <TableHead className={`${HEAD_CLASS} w-[15%]`}>
                      DEL (Días de Leche)
                    </TableHead>
                    <TableHead className={`${HEAD_CLASS} w-[12%]`}>
                      Promedio
                    </TableHead>
                    <TableHead className={`${HEAD_CLASS} w-[15%]`}>
                      Estado
                    </TableHead>
                    <TableHead className={`${HEAD_CLASS} w-[16%]`}>
                      OBS.
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageItems.map((a) => {
                    const sana = a.estado === 'NORMAL'
                    return (
                      <TableRow
                        key={a.id}
                        className="border-b border-slate-100 hover:bg-slate-50/50"
                      >
                        <TableCell
                          className={`${CELL_CLASS} font-bold text-slate-900`}
                        >
                          {a.codigo}
                        </TableCell>
                        <TableCell className={`${CELL_CLASS} text-slate-700`}>
                          {a.nombre}
                        </TableCell>
                        <TableCell
                          className={`${CELL_CLASS} font-bold text-slate-900`}
                        >
                          {getCategoriaLabel(a.categoria)}
                        </TableCell>
                        <TableCell
                          className={`${CELL_CLASS} font-bold text-slate-900`}
                        >
                          {a.del && a.del > 0 ? a.del : '—'}
                        </TableCell>
                        <TableCell
                          className={`${CELL_CLASS} font-bold text-slate-900`}
                        >
                          {sana
                            ? a.promedioLitros !== null
                              ? `${a.promedioLitros.toFixed(1)} L`
                              : '—'
                            : '—'}
                        </TableCell>
                        <TableCell
                          className={`${CELL_CLASS} font-bold ${
                            sana ? 'text-slate-900' : 'text-[#E8200C]'
                          }`}
                        >
                          {sana ? 'Sana' : 'Tratamiento'}
                        </TableCell>
                        <TableCell className={`${CELL_CLASS} text-slate-700`}>
                          {getObservacion(a)}
                        </TableCell>
                      </TableRow>
                    )
                  })}

                  {pageItems.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="py-8 text-center text-sm text-slate-400"
                      >
                        Sin animales para mostrar
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Paginación */}
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
              <span className="text-xs text-slate-500">
                Mostrando {pageItems.length} de {totalFiltrados} registros
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 rounded border-slate-200"
                  onClick={goPrev}
                  disabled={currentPage <= 1}
                  aria-label="Página anterior"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-500" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 rounded border-slate-200"
                  onClick={goNext}
                  disabled={currentPage >= totalPages}
                  aria-label="Página siguiente"
                >
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // Aquí se muestra la tabla de transferencias al hacer click en el tab
          <div className="mt-2">
            <TransferenciasTable transferencias={transferencias} />
          </div>
        )}
      </div>

      {/* Modales */}
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
