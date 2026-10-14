'use client'

import {
  Pencil,
  ArrowRight,
  ArrowUpRight,
  Plus,
  Minus,
  UserPlus,
  Sun,
  ArrowRightLeft,
  Loader2,
} from 'lucide-react'
import { AltaAnimalModal as AltaModal } from '@/components/shared/dashboard/organization/configuration/modals/AltaAnimalModal'
import { BajaAnimalModal as BajaModal } from '@/components/shared/dashboard/organization/configuration/modals/BajaAnimalModal'
import { TransferModal } from '@/components/shared/dashboard/organization/configuration/modals/TransferModal'
import { TransferenciasTable } from '@/components/shared/dashboard/organization/configuration/TransferenciasTable'
import { useInventarioRodeos } from '@/hooks/establishment/useInventarioRodeos'

function esSeca(value?: string) {
  const v = (value || '').toUpperCase()
  return v.includes('SECA') || v.includes('REPOSO')
}

function getRodeoIcon(value?: string) {
  return esSeca(value) ? (
    <Sun className="w-4 h-4 text-[#659711]" />
  ) : (
    <ArrowUpRight className="w-4 h-4 text-[#659711]" />
  )
}

function getRodeoSubtitulo(value?: string) {
  return esSeca(value) ? 'Período de Reposo' : 'Producción Intensiva'
}

export default function InventarioRodeosTab() {
  const {
    loading,
    rodeos,
    promedioLitros,
    transferencias,
    refetch,
    isAltaOpen,
    isBajaOpen,
    isTransferOpen,
    motivoAlta,
    motivoBaja,
    abrirAlta,
    abrirBaja,
    cerrarAlta,
    cerrarBaja,
    abrirTransferencia,
    cerrarTransferencia,
  } = useInventarioRodeos()

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#659711]" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 w-full font-sans antialiased text-slate-800 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Rodeo Único
        </h1>
        <button
          onClick={() => abrirAlta()}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#659711] hover:bg-[#537d0d] rounded-lg transition-all shadow-sm"
        >
          <UserPlus size={18} />
          <span>Registrar Alta</span>
        </button>
      </div>

      {/* Tarjetas de rodeos + promedio */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rodeos.length === 0 && (
          <div className="md:col-span-2 bg-white rounded-xl p-6 text-center text-sm text-slate-400 shadow-md">
            No hay rodeos cargados todavía.
          </div>
        )}

        {rodeos.map((rodeo: any) => (
          <div
            key={rodeo.idRodeo}
            className="relative flex min-h-[170px] flex-col justify-between rounded-xl bg-white p-6 shadow-md"
          >
            <div className="flex items-start justify-between">
              {getRodeoIcon(rodeo.value)}
              <button
                type="button"
                className="text-slate-800 hover:text-slate-600 transition-colors"
                aria-label="Editar rodeo"
              >
                <Pencil size={16} />
              </button>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-base leading-tight">
                {rodeo.label}
              </h3>
              <p className="text-[11px] text-slate-700 mt-0.5">
                {getRodeoSubtitulo(rodeo.value)}
              </p>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-xl font-bold text-[#659711]">
                {rodeo.cantVacas}
              </span>
              <span className="text-xs text-slate-800">cabezas</span>
            </div>
          </div>
        ))}

        {/* Prod. Promedio/Vaca */}
        <div className="flex min-h-[110px] flex-col justify-between self-start rounded-xl bg-[#DDECE2] p-5 shadow-md">
          <h3 className="font-bold text-slate-900 text-sm">
            Prod. Promedio/Vaca
          </h3>
          <span className="text-2xl font-bold text-[#2E8B57] my-2">
            {promedioLitros !== null ? `${promedioLitros.toFixed(1)}L` : '—'}
          </span>
          <p className="text-xs text-slate-800">Vacas en ordeñe</p>
        </div>
      </div>

      {/* Accesos directos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Altas */}
        <div className="flex flex-col gap-4 rounded-xl bg-[#D0E4D8] p-5">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <div className="flex h-4 w-4 items-center justify-center rounded-[3px] border border-[#2E8B57] text-[#2E8B57]">
              <Plus size={10} strokeWidth={3} />
            </div>
            <span>Registro de Altas</span>
          </div>
          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => abrirAlta('INGRESO_NACIMIENTO')}
              className="flex items-center justify-between rounded-lg bg-white px-5 py-2.5 text-left shadow-sm transition-colors hover:bg-slate-50"
            >
              <span className="text-xs font-bold text-[#0A5C36]">
                Nacimientos
              </span>
              <ArrowRight size={14} className="text-[#0A5C36]" />
            </button>
            <button
              onClick={() => abrirAlta('INGRESO_COMPRA')}
              className="flex items-center justify-between rounded-lg bg-white px-5 py-2.5 text-left shadow-sm transition-colors hover:bg-slate-50"
            >
              <span className="text-xs font-bold text-[#0A5C36]">
                Compras Externas
              </span>
              <ArrowRight size={14} className="text-[#0A5C36]" />
            </button>
          </div>
        </div>

        {/* Bajas */}
        <div className="flex flex-col gap-4 rounded-xl bg-[#EBEBEB] p-5">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <div className="flex h-4 w-4 items-center justify-center rounded-[3px] border border-[#E53935] text-[#E53935]">
              <Minus size={10} strokeWidth={3} />
            </div>
            <span>Registro de Bajas</span>
          </div>
          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => abrirBaja('EGRESO_VENTA')}
              className="flex items-center justify-between rounded-lg bg-white px-5 py-2.5 text-left shadow-sm transition-colors hover:bg-slate-50"
            >
              <span className="text-xs font-bold text-[#E53935]">
                Venta de Animales
              </span>
              <ArrowRight size={14} className="text-[#E53935]" />
            </button>
            <button
              onClick={() => abrirBaja('EGRESO_MUERTE')}
              className="flex items-center justify-between rounded-lg bg-white px-5 py-2.5 text-left shadow-sm transition-colors hover:bg-slate-50"
            >
              <span className="text-xs font-bold text-[#E53935]">
                Otras Causas
              </span>
              <ArrowRight size={14} className="text-[#E53935]" />
            </button>
          </div>
        </div>

        {/* Transferencia */}
        <div className="flex flex-col gap-4 rounded-xl bg-[#EBEBEB] p-5">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <div className="flex h-4 w-4 items-center justify-center rounded-[3px] border border-[#F5A623] text-[#F5A623]">
              <ArrowRightLeft size={10} strokeWidth={2.5} />
            </div>
            <span>Transferencia de Rodeo</span>
          </div>
          <div className="mt-2">
            <button
              onClick={abrirTransferencia}
              className="flex items-center justify-center gap-2 rounded-lg bg-[#659711] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#537d0d]"
            >
              <span>Nueva Transferencia</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de transferencias */}
      <TransferenciasTable transferencias={transferencias} />

      {/* Modales */}
      <AltaModal
        open={isAltaOpen}
        onClose={cerrarAlta}
        onSuccess={refetch}
        motivoInicial={motivoAlta}
      />
      <BajaModal
        open={isBajaOpen}
        onClose={cerrarBaja}
        onSuccess={refetch}
        motivoInicial={motivoBaja}
      />
      <TransferModal
        open={isTransferOpen}
        onClose={cerrarTransferencia}
        onSuccess={refetch}
      />
    </div>
  )
}
