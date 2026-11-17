'use client'

import { Loader2, Plus, UserMinus, UserPlus } from 'lucide-react'
import { AltaAnimalModal as AltaModal } from '@/components/shared/dashboard/organization/configuration/modals/AltaAnimalModal'
import { BajaAnimalModal as BajaModal } from '@/components/shared/dashboard/organization/configuration/modals/BajaAnimalModal'
import { TransferModal } from '@/components/shared/dashboard/organization/configuration/modals/TransferModal'
import { TransferenciasTable } from '@/components/shared/dashboard/organization/configuration/TransferenciasTable'
import { useInventarioRodeos } from '@/hooks/establishment/useInventarioRodeos'

function esSeca(value?: string) {
  const v = (value || '').toUpperCase()
  return v.includes('SECA') || v.includes('REPOSO')
}

// Título del rodeo: el seco se muestra como "Rodeo Seca" (Figma)
function getRodeoTitulo(rodeo: any) {
  return esSeca(rodeo.value) ? 'Rodeo Secas' : 'Rodeo en Ordeñe' // Ajustado para que coincida con el estilo
}

const BTN_BASE =
  'flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors'

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

  // Ordeñe primero y seco después, como en el diseño
  const rodeosOrdenados = [...rodeos].sort(
    (a: any, b: any) => Number(esSeca(a.value)) - Number(esSeca(b.value))
  )

  return (
    <div className="flex flex-col gap-6 w-full font-sans antialiased text-slate-800 animate-in fade-in duration-300">
      {/* Título Principal */}
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Catálogo</h1>

      {/* Tarjetas: 2 rodeos + producción promedio */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {rodeosOrdenados.map((rodeo: any) => (
          <div
            key={rodeo.idRodeo}
            className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div>
              <h3 className="text-base font-bold leading-tight text-slate-900">
                {getRodeoTitulo(rodeo)}
              </h3>
              {/* Subtítulo genérico para mantener el diseño */}
              <p className="mt-1 text-xs text-slate-500">
                {esSeca(rodeo.value)
                  ? 'Período de Reposo'
                  : 'Producción Intensiva'}
              </p>
            </div>

            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-[#659711]">
                {rodeo.cantVacas ?? 0}
              </span>
              <span className="text-sm font-semibold text-slate-700">
                cabezas
              </span>
            </div>
          </div>
        ))}

        {/* Prod. Promedio/Vaca */}
        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h3 className="text-base font-bold leading-tight text-slate-900">
              Prod. Promedio/Vaca
            </h3>
            <p className="mt-1 text-xs text-slate-500">Vacas en ordeñe</p>
          </div>

          <span className="text-3xl font-bold text-[#659711] mt-2">
            {promedioLitros !== null && promedioLitros !== undefined
              ? `${promedioLitros.toFixed(1)} Lts`
              : '—'}
          </span>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex flex-wrap items-center justify-end gap-4 mt-2 mb-4">
        <button
          type="button"
          onClick={() => abrirAlta()}
          className={`${BTN_BASE} bg-[#659711] hover:bg-[#537d0d]`}
        >
          <UserPlus size={18} />
          <span>Registrar alta</span>
          <Plus size={18} className="ml-1" />
        </button>

        <button
          type="button"
          onClick={() => abrirBaja()}
          className={`${BTN_BASE} bg-[#E53935] hover:bg-[#c62f2c]`}
        >
          <UserMinus size={18} />
          <span>Registrar baja</span>
        </button>

        <button
          type="button"
          onClick={abrirTransferencia}
          className={`${BTN_BASE} bg-[#D4A12A] hover:bg-[#b98a21]`}
        >
          <Plus size={18} />
          <span>Transferencias</span>
        </button>
      </div>

      {/* Historial de movimientos */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-slate-900">
          Historial de Movimientos
        </h2>
        <TransferenciasTable transferencias={transferencias} />
      </div>

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
