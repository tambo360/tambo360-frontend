'use client'

import { useState } from 'react'
import {
  Pencil,
  ArrowRight,
  Plus,
  Minus,
  UserPlus,
  ArrowLeft,
  ChevronDown,
  TrendingUp,
  Droplet,
  Sun,
  ArrowRightLeft,
} from 'lucide-react'

// ==========================================
// 1. FUENTES DE DATOS (MOCKS)
// ==========================================
const RODEOS = [
  {
    id: 'alto',
    nombre: 'Rodeo Alto',
    subtitulo: 'Producción Intensiva',
    cabezas: 142,
    icon: <TrendingUp className="w-5 h-5 text-[#659711]" />,
  },
  {
    id: 'bajo',
    nombre: 'Rodeo Bajo',
    subtitulo: 'Recría y Mantenimiento',
    cabezas: 89,
    icon: <Droplet className="w-5 h-5 text-[#659711] fill-[#659711]" />,
  },
  {
    id: 'secas',
    nombre: 'Rodeo Secas',
    subtitulo: 'Período de Reposo',
    cabezas: 34,
    icon: <Sun className="w-5 h-5 text-[#659711]" />,
  },
]

// ==========================================
// 2. COMPONENTE EXPORTADO PRINCIPAL
// ==========================================
export default function InventarioRodeosTab() {
  const [vistaActiva, setVistaActiva] = useState<
    'inventario' | 'plantel' | 'transferencia'
  >('inventario')

  // Renderizado condicional de vistas secundarias
  if (vistaActiva === 'plantel') {
    return (
      <PlantelIndividualView onVolver={() => setVistaActiva('inventario')} />
    )
  }

  if (vistaActiva === 'transferencia') {
    return (
      <NuevaTransferenciaView onVolver={() => setVistaActiva('inventario')} />
    )
  }

  return (
    <div className="flex flex-col gap-6 w-full font-sans antialiased text-slate-800 animate-in fade-in duration-300">
      {/* 1. Encabezado de la sección */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Inventario de Rodeos
        </h1>
        <button className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#659711] hover:bg-[#537d0d] rounded-xl transition-all shadow-sm">
          <UserPlus size={16} />
          <span>Registrar Alta</span>
        </button>
      </div>

      {/* 2. Tarjetas de Rodeos (3 Columnas) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {RODEOS.map((rodeo) => (
          <div
            key={rodeo.id}
            onClick={() => setVistaActiva('plantel')}
            className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm relative hover:shadow-md transition-all cursor-pointer flex flex-col justify-between min-h-[160px]"
          >
            {/* Botón Editar */}
            <button
              onClick={(e) => {
                e.stopPropagation()
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <Pencil size={15} />
            </button>

            {/* Cabecera de Tarjeta */}
            <div className="flex flex-col gap-3">
              <div>{rodeo.icon}</div>
              <div>
                <h3 className="font-bold text-slate-900 text-base leading-tight">
                  {rodeo.nombre}
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  {rodeo.subtitulo}
                </p>
              </div>
            </div>

            {/* Conteo de cabezas */}
            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-2xl font-extrabold text-[#659711] tracking-tight">
                {rodeo.cabezas}
              </span>
              <span className="text-xs font-bold text-slate-800">cabezas</span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Sección Accesos Directos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Registro de Altas */}
        <div className="bg-[#DDECE2] rounded-2xl p-5 flex flex-col justify-between border border-[#CCE2D2]">
          <div className="flex items-center gap-2 text-[#0A5C36] font-bold text-sm mb-4">
            <div className="flex items-center justify-center w-5 h-5 rounded border border-[#0A5C36] text-[#0A5C36]">
              <Plus size={12} strokeWidth={3} />
            </div>
            <span>Registro de Altas</span>
          </div>

          <div className="flex flex-col gap-2.5">
            <button className="flex items-center justify-between bg-white px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-left">
              <span className="font-bold text-[#0A5C36] text-xs">
                Nacimientos
              </span>
              <ArrowRight size={14} className="text-[#0A5C36]" />
            </button>
            <button className="flex items-center justify-between bg-white px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-left">
              <span className="font-bold text-[#0A5C36] text-xs">
                Compras Externas
              </span>
              <ArrowRight size={14} className="text-[#0A5C36]" />
            </button>
          </div>
        </div>

        {/* Registro de Bajas */}
        <div className="bg-[#EBEBEB] rounded-2xl p-5 flex flex-col justify-between border border-[#E0E0E0]">
          <div className="flex items-center gap-2 text-[#D32F2F] font-bold text-sm mb-4">
            <div className="flex items-center justify-center w-5 h-5 rounded border border-[#D32F2F] text-[#D32F2F]">
              <Minus size={12} strokeWidth={3} />
            </div>
            <span className="text-slate-900">Registro de Bajas</span>
          </div>

          <div className="flex flex-col gap-2.5">
            <button className="flex items-center justify-between bg-white px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-left">
              <span className="font-bold text-[#D32F2F] text-xs">
                Venta de Animales
              </span>
              <ArrowRight size={14} className="text-[#D32F2F]" />
            </button>
            <button className="flex items-center justify-between bg-white px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-left">
              <span className="font-bold text-[#D32F2F] text-xs">
                Otras Causas
              </span>
              <ArrowRight size={14} className="text-[#D32F2F]" />
            </button>
          </div>
        </div>

        {/* Transferencia de Rodeo */}
        <div className="bg-[#EBEBEB] rounded-2xl p-5 flex flex-col justify-between border border-[#E0E0E0]">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-4">
            <div className="flex items-center justify-center w-5 h-5 rounded border border-slate-400 text-slate-600">
              <ArrowRightLeft size={12} strokeWidth={2.5} />
            </div>
            <span>Transferencia de Rodeo</span>
          </div>

          <div className="mt-auto">
            <button
              onClick={() => setVistaActiva('transferencia')}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-white bg-[#659711] hover:bg-[#537d0d] rounded-xl transition-all shadow-sm"
            >
              <span>Nueva Transferencia</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// 3. SUB-COMPONENTE: VISTA PLANTEL INDIVIDUAL
// ==========================================
function PlantelIndividualView({ onVolver }: { onVolver: () => void }) {
  return (
    <div className="flex flex-col gap-6 w-full font-sans antialiased text-slate-800">
      <button
        onClick={onVolver}
        className="self-start flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors mb-2"
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        <span>Volver a Inventario</span>
      </button>
      <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
        Plantel Individual
      </h2>
    </div>
  )
}

// ==========================================
// 4. SUB-COMPONENTE: NUEVA TRANSFERENCIA VIEW
// ==========================================
function NuevaTransferenciaView({ onVolver }: { onVolver: () => void }) {
  const [origen, setOrigen] = useState('')
  const [destino, setDestino] = useState('')
  const [cantidad, setCantidad] = useState('')
  const [plazos, setPlazos] = useState('')
  const [motivo, setMotivo] = useState('')

  return (
    <div className="flex flex-col gap-6 w-full font-sans antialiased text-slate-800">
      <button
        onClick={onVolver}
        className="self-start flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors mb-2"
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        <span>Volver a Inventario</span>
      </button>

      <div className="bg-white border border-slate-100 rounded-2xl p-8 max-w-xl w-full mx-auto shadow-sm flex flex-col gap-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
            Inventario de Rodeos
          </h2>
          <p className="text-xs font-bold text-slate-700 mt-4">
            Nueva Transferencia
          </p>
        </div>

        <div className="flex flex-col gap-4 text-xs">
          {/* Rodeo Origen */}
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-slate-700">Rodeo Origen</label>
            <div className="relative">
              <select
                value={origen}
                onChange={(e) => setOrigen(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-semibold text-slate-500 appearance-none focus:outline-none focus:border-slate-400 transition-colors"
              >
                <option value="">Seleccionar</option>
                <option value="Rodeo Alto">Rodeo Alto</option>
                <option value="Rodeo Bajo">Rodeo Bajo</option>
                <option value="Rodeo Secas">Rodeo Secas</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3.5 top-3.5 text-slate-400 pointer-events-none"
              />
            </div>
          </div>

          {/* Rodeo Destino */}
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-slate-700">Rodeo Destino</label>
            <div className="relative">
              <select
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-semibold text-slate-500 appearance-none focus:outline-none focus:border-slate-400 transition-colors"
              >
                <option value="">Seleccionar</option>
                <option value="Rodeo Alto">Rodeo Alto</option>
                <option value="Rodeo Bajo">Rodeo Bajo</option>
                <option value="Rodeo Secas">Rodeo Secas</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3.5 top-3.5 text-slate-400 pointer-events-none"
              />
            </div>
          </div>

          {/* Cantidad de Animales */}
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-slate-700">
              Cantidad de Animales
            </label>
            <div className="relative flex items-center">
              <input
                type="number"
                placeholder="00"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-semibold text-slate-700 focus:outline-none focus:border-slate-400 transition-colors placeholder-slate-300"
              />
              <span className="absolute right-4 font-bold text-slate-400">
                Cabezas
              </span>
            </div>
          </div>

          {/* Plazos de Retorno (Días) */}
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-slate-700">
              Plazos de Retorno (Días)
            </label>
            <input
              type="text"
              value={plazos}
              onChange={(e) => setPlazos(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-semibold text-slate-700 focus:outline-none focus:border-slate-400 transition-colors"
            />
          </div>

          {/* Motivo de transferencia */}
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-slate-700">
              Motivo de transferencia
            </label>
            <textarea
              rows={4}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl p-4 font-semibold text-slate-700 focus:outline-none focus:border-slate-400 transition-colors resize-none"
            />
          </div>

          {/* Botón Transferir */}
          <div className="flex justify-center mt-2">
            <button
              onClick={() => alert('Transferencia guardada con éxito')}
              className="px-8 py-2.5 text-xs font-bold text-white bg-[#659711] hover:bg-[#537d0d] rounded-xl transition-colors shadow-sm"
            >
              Transferir
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
