'use client'
import React, { useState } from 'react'
import {
  Plus,
  Trash2,
  Search,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
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

interface AnimalRow {
  rp: string
  nombre: string
  categoria: string
  del: number
  prodHoy: string
  estado: 'Sana' | 'En tratamiento'
  obs: string
}

const mockAnimals: AnimalRow[] = [
  {
    rp: '0001',
    nombre: 'Mancha',
    categoria: 'Ordeñe',
    del: 85,
    prodHoy: '11 L',
    estado: 'Sana',
    obs: '—',
  },
  {
    rp: '0002',
    nombre: 'Pintas',
    categoria: 'Ordeñe',
    del: 102,
    prodHoy: '9.5 L',
    estado: 'Sana',
    obs: '—',
  },
  {
    rp: '0003',
    nombre: 'Lucila',
    categoria: 'Ordeñe',
    del: 67,
    prodHoy: '12 L',
    estado: 'Sana',
    obs: '—',
  },
  {
    rp: '0004',
    nombre: 'Colorado',
    categoria: 'Ordeñe',
    del: 145,
    prodHoy: '— (descarte)',
    estado: 'En tratamiento',
    obs: 'Antibiótico • 3 días',
  },
  {
    rp: '0005',
    nombre: 'Flora',
    categoria: 'Ordeñe',
    del: 210,
    prodHoy: '— (descarte)',
    estado: 'En tratamiento',
    obs: 'Mastitis • 1 día',
  },
]

const AnimalInventoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [estadoFilter, setEstadoFilter] = useState('todos')

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-300">
      {/* Cabecera de sección */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Inventario por animal
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button className="bg-[#2E7D53] hover:bg-[#236342] text-white font-semibold rounded-xl h-11 px-5 shadow-sm gap-2">
            <Plus className="w-4 h-4" /> Registrar Alta
          </Button>
          <Button
            variant="destructive"
            className="bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl h-11 px-5 shadow-sm gap-2"
          >
            <Trash2 className="w-4 h-4" /> Baja
          </Button>
        </div>
      </div>

      {/* Tarjetas de Estadísticas (KPIs) con fondo verde suave */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tarjeta 1 */}
        <div className="bg-[#E8F5E9]/60 p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
            Total Plantel
          </span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-gray-900">44 cab</h3>
          </div>
          <p className="text-xs text-gray-500 font-medium">
            38 ordeñe - 6 secas
          </p>
        </div>

        {/* Tarjeta 2 */}
        <div className="bg-[#E8F5E9]/60 p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
            En Tratamiento
          </span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-rose-600">2 cab</h3>
          </div>
          <p className="text-xs text-rose-600 font-medium">
            Leche descartada hoy
          </p>
        </div>

        {/* Tarjeta 3 */}
        <div className="bg-[#E8F5E9]/60 p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
            Prod. Promedio/Vaca
          </span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-[#2E7D53]">10.0L</h3>
          </div>
          <p className="text-xs text-gray-500 font-medium">Vacas en ordeñe</p>
        </div>
      </div>

      {/* Filtros y Buscador */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar por RP o nombre..."
            className="pl-10 rounded-xl border-gray-200 bg-gray-50/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="w-full sm:w-64">
          <Select value={estadoFilter} onValueChange={setEstadoFilter}>
            <SelectTrigger className="w-full rounded-xl border-gray-200 bg-gray-50/50 text-gray-600">
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="sana">Sana</SelectItem>
                <SelectItem value="tratamiento">En tratamiento</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabla de Inventario */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/80">
            <TableRow>
              <TableHead className="text-xs font-bold text-gray-400 uppercase py-4 pl-6">
                RP/Nº
              </TableHead>
              <TableHead className="text-xs font-bold text-gray-400 uppercase">
                Nombre
              </TableHead>
              <TableHead className="text-xs font-bold text-gray-400 uppercase">
                Categoría
              </TableHead>
              <TableHead className="text-xs font-bold text-gray-400 uppercase">
                DEL (Días de Leche)
              </TableHead>
              <TableHead className="text-xs font-bold text-gray-400 uppercase">
                Prod. Hoy
              </TableHead>
              <TableHead className="text-xs font-bold text-gray-400 uppercase">
                Estado
              </TableHead>
              <TableHead className="text-xs font-bold text-gray-400 uppercase">
                OBS.
              </TableHead>
              <TableHead className="text-xs font-bold text-gray-400 uppercase text-right pr-6"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAnimals.map((animal) => (
              <TableRow
                key={animal.rp}
                className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
              >
                <TableCell className="text-xs font-semibold text-gray-800 pl-6 py-4">
                  {animal.rp}
                </TableCell>
                <TableCell className="text-xs text-gray-700 font-medium">
                  {animal.nombre}
                </TableCell>
                <TableCell className="text-xs">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {animal.categoria}
                  </span>
                </TableCell>
                <TableCell className="text-xs text-gray-700 font-medium pl-6">
                  {animal.del}
                </TableCell>
                <TableCell className="text-xs font-medium text-gray-800">
                  {animal.prodHoy.includes('descarte') ? (
                    <span className="text-rose-600 font-medium">
                      {animal.prodHoy}
                    </span>
                  ) : (
                    animal.prodHoy
                  )}
                </TableCell>
                <TableCell className="text-xs">
                  {animal.estado === 'Sana' ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>{' '}
                      Sana
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-600">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>{' '}
                      En tratamiento
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-xs text-gray-500 font-medium">
                  {animal.obs}
                </TableCell>
                <TableCell className="text-right pr-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-gray-600"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Paginación de la tabla */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 text-xs text-gray-500">
          <span>Mostrando 3 de 15 registros</span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-gray-200 text-gray-600 rounded-lg"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-gray-200 text-gray-600 rounded-lg"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnimalInventoryPage
