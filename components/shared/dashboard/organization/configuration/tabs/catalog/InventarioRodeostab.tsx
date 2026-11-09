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

// Título del rodeo: el seco se muestra como "Rodeo en seca" (Figma)
function getRodeoTitulo(rodeo: any) {
  return esSeca(rodeo.value) ? 'Rodeo en seca' : rodeo.label
}

const BTN_BASE =
  'flex items-center gap-2 rounded-md px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-colors'

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
    <div className="flex flex-col gap-8 w-full font-sans antialiased text-slate-800 animate-in fade-in duration-300">
      {/* Tarjetas: 2 rodeos + producción promedio */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {rodeosOrdenados.map((rodeo: any) => (
          <div
            key={rodeo.idRodeo}
            className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-md"
          >
            <h3 className="text-base font-bold leading-tight text-slate-900">
              {getRodeoTitulo(rodeo)}
            </h3>

            <div className="flex items-baseline gap-3">
              <span className="text-xl font-bold text-[#659711]">
                {rodeo.cantVacas ?? 0}
              </span>
              <span className="text-xs text-slate-800">cabezas</span>
            </div>
          </div>
        ))}

        {/* Prod. Promedio/Vaca */}
        <div className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-md">
          <div>
            <h3 className="text-base font-bold leading-tight text-slate-900">
              Prod. Promedio/Vaca
            </h3>
            <p className="mt-0.5 text-[11px] text-slate-700">Vacas en ordeñe</p>
          </div>

          <span className="text-xl font-bold text-[#659711]">
            {promedioLitros !== null && promedioLitros !== undefined
              ? `${promedioLitros.toFixed(1)} Lts`
              : '—'}
          </span>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex flex-wrap items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => abrirAlta()}
          className={`${BTN_BASE} bg-[#659711] hover:bg-[#537d0d]`}
        >
          <UserPlus size={16} />
          <span>Registrar alta</span>
          <Plus size={16} />
        </button>

        <button
          type="button"
          onClick={() => abrirBaja()}
          className={`${BTN_BASE} bg-[#E53935] hover:bg-[#c62f2c]`}
        >
          <UserMinus size={16} />
          <span>Registrar baja</span>
        </button>

        <button
          type="button"
          onClick={abrirTransferencia}
          className={`${BTN_BASE} bg-[#D4A12A] hover:bg-[#b98a21]`}
        >
          <Plus size={16} />
          <span>Transferencias</span>
        </button>
      </div>

      {/* Historial de movimientos */}
      <div className="flex flex-col gap-4">
        <h2 className="text-base font-bold text-slate-900">
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
