'use client'

/*
  TODO GENERAL (pendiente de backend):
  Esta vista completa es NUEVA — no existía ruta /historial en el proyecto.
  Todo lo que se ve acá está armado con datos MOCKEADOS (hardcodeados abajo),
  no hay conexión real a ningún endpoint todavía. Falta:

  1. Un endpoint que devuelva el historial de lotes (puede ser el mismo
     /lote/listar reutilizado, o uno nuevo). Ninguno de los dos existe con
     los campos que pide este diseño.
  2. El campo "Turno" — no existe en el modelo LoteProduccion (ver
     prisma/schema.prisma del backend). Mismo tema pendiente que en
     produccion/page.tsx.
  3. El estado "Revisión" — hoy el backend solo maneja `estado: boolean`
     (Completo/Incompleto). Un tercer estado "Revisión" no existe,
     habría que definir qué significa y cómo se calcula.
  4. La alerta de "TamboEngine: Anomalía Detectada" — no hay ningún
     endpoint de alertas de anomalías de temperatura. Existe un módulo de
     Alertas general (hooks/alerts) pero no este tipo de alerta específica.
  5. El botón "Exportar CSV" — no existe endpoint de exportación (mismo
     pendiente que en produccion/page.tsx y en el Tablero).

  Cuando backend tenga esto listo, hay que reemplazar `mockLotes` por un
  hook real (useBatches-style) y borrar este bloque de comentarios.
*/

import React, { useState } from 'react'
import {
  AlertTriangle,
  Download,
  Search,
  X,
  ArrowUp,
  ArrowDown,
  Ellipsis,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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

type EstadoMock = 'INCOMPLETO' | 'COMPLETADO' | 'REVISIÓN'

interface LoteMock {
  idLote: string
  fecha: string
  turno: 'Mañana' | 'Noche'
  producto: string
  cantidad: number
  temperatura: number
  temperaturaFueraDeRango?: boolean
  merma: number
  estado: EstadoMock
}

// Datos mockeados (pendiente reemplazar por hook real, ver TODO arriba)
const mockLotes: LoteMock[] = [
  {
    idLote: 'L-8942',
    fecha: '20/04/2026',
    turno: 'Mañana',
    producto: 'Leche entera',
    cantidad: 12500,
    temperatura: 6.8,
    temperaturaFueraDeRango: true,
    merma: 145.2,
    estado: 'INCOMPLETO',
  },
  {
    idLote: 'L-8941',
    fecha: '15/04/2026',
    turno: 'Noche',
    producto: 'Leche Descremada',
    cantidad: 950,
    temperatura: 3.8,
    merma: 8,
    estado: 'COMPLETADO',
  },
  {
    idLote: 'L-8940',
    fecha: '15/04/2026',
    turno: 'Mañana',
    producto: 'Leche entera',
    cantidad: 1150,
    temperatura: 7.2,
    merma: 15,
    estado: 'REVISIÓN',
  },
]

const estadoBadgeClasses: Record<EstadoMock, string> = {
  INCOMPLETO: 'bg-red-main text-white',
  COMPLETADO: 'bg-green-main text-white',
  REVISIÓN: 'bg-yellow-500 text-white',
}

const HistorialLotes: React.FC = () => {
  const [nombre, setNombre] = useState('')
  const [orden, setOrden] = useState<'asc' | 'desc'>('desc')
  const [alertaVisible, setAlertaVisible] = useState(true)

  const toggleOrden = () =>
    setOrden((prev) => (prev === 'asc' ? 'desc' : 'asc'))

  const lotesFiltrados = mockLotes.filter((l) =>
    l.producto.toLowerCase().includes(nombre.toLowerCase())
  )

  return (
    <div className="flex flex-col w-full gap-6 animate-in fade-in duration-500">
      {/* Banner de alerta TamboEngine — mockeado, ver TODO arriba */}
      {alertaVisible && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-red-200 bg-[#FDECEC] p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="size-5 text-red-main shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-main text-sm">
                Alerta TamboEngine: Anomalía Detectada
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Se ha detectado una desviación de temperatura fuera de rango
                (+2.4°) en el lote L-8942. La merma proyectada supera el umbral
                permitido del 0.5% en un 12%.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="destructive" size="sm">
              Intervenir ahora
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAlertaVisible(false)}
            >
              Descartar Alerta
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Historial de Lotes
          </h1>
        </div>

        {/* TODO: sin endpoint de exportación real todavía, ver bloque de arriba */}
        <Button
          variant="darkGreen"
          className="flex items-center gap-2 h-11"
          onClick={() =>
            console.warn('Exportar CSV: pendiente de endpoint en backend')
          }
        >
          Exportar CSV <Download className="w-4 h-4" />
        </Button>
      </div>

      <Card className="border-gray-200 shadow-sm overflow-hidden rounded-2xl bg-white gap-0 py-0">
        <CardHeader className="border-b border-gray-100 bg-white p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <CardTitle className="text-lg font-bold text-green-main">
                Historial de Lotes
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
                  onChange={(e) => setNombre(e.target.value)}
                />
                {nombre && (
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400"
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
                <TableHead className="text-left font-bold text-gray-400 uppercase text-xs tracking-wider">
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
                  Cantidad(L)
                </TableHead>
                <TableHead className="text-left font-bold text-gray-400 uppercase text-xs tracking-wider">
                  TemperaturaA(°C)
                </TableHead>
                <TableHead className="text-left font-bold text-gray-400 uppercase text-xs tracking-wider">
                  Merma(L)
                </TableHead>
                <TableHead className="text-left font-bold text-gray-400 uppercase text-xs tracking-wider">
                  Estado
                </TableHead>
                <TableHead className="text-right pr-6 font-bold text-gray-400 uppercase text-xs tracking-wider">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lotesFiltrados.map((lote) => (
                <TableRow key={lote.idLote}>
                  <TableCell className="font-medium">{lote.idLote}</TableCell>
                  <TableCell>{lote.fecha}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        lote.turno === 'Mañana'
                          ? 'bg-green-main text-white border-none'
                          : 'bg-gray-500 text-white border-none'
                      }
                    >
                      {lote.turno}
                    </Badge>
                  </TableCell>
                  <TableCell>{lote.producto}</TableCell>
                  <TableCell>{lote.cantidad.toLocaleString('es-AR')}</TableCell>
                  <TableCell
                    className={
                      lote.temperaturaFueraDeRango
                        ? 'text-red-main font-bold'
                        : ''
                    }
                  >
                    {lote.temperatura}°
                  </TableCell>
                  <TableCell>{lote.merma}</TableCell>
                  <TableCell>
                    <Badge
                      className={`${estadoBadgeClasses[lote.estado]} border-none font-bold`}
                    >
                      {lote.estado}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Button variant="ghost" size="sm">
                      <Ellipsis />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white">
            <span className="text-xs text-gray-400">
              Página 1 de 1 · {lotesFiltrados.length} lote
              {lotesFiltrados.length !== 1 ? 's' : ''}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8 border-gray-200 bg-gray-50 rounded-lg"
                disabled
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8 border-gray-200 bg-gray-50 rounded-lg"
                disabled
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default HistorialLotes
