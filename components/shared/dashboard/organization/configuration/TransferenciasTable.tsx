'use client'

import { MoreVertical } from 'lucide-react'

export interface Transferencia {
  id: string
  origen: string
  destino: string
  cantidad: number
  plazoRetornoDias: number | null
  causa: string
  motivo: string
  estado: string
}

interface Props {
  transferencias: Transferencia[]
}

const HEADERS = [
  'Origen',
  'Destino',
  'Cantidad',
  'Plazo de retorno',
  'Causa',
  'Motivo',
  'Estado',
]

export function TransferenciasTable({ transferencias }: Props) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-slate-100 bg-white">
      <table className="w-full min-w-[720px] text-center">
        <thead>
          <tr className="bg-[#E8EEF5] text-xs font-semibold text-slate-700">
            {HEADERS.map((h) => (
              <th key={h} className="px-4 py-4 font-semibold">
                {h}
              </th>
            ))}
            <th className="w-10" />
          </tr>
        </thead>
        <tbody>
          {transferencias.length === 0 && (
            <tr>
              <td
                colSpan={HEADERS.length + 1}
                className="px-4 py-8 text-sm text-slate-400"
              >
                No hay transferencias registradas.
              </td>
            </tr>
          )}

          {transferencias.map((t) => (
            <tr key={t.id} className="border-b border-slate-100 last:border-0">
              <td className="px-4 py-5 text-[11px] font-bold text-slate-900">
                {t.origen}
              </td>
              <td className="px-4 py-5 text-[11px] text-slate-700">
                {t.destino}
              </td>
              <td className="px-4 py-5 text-sm font-bold text-slate-900">
                {t.cantidad}
              </td>
              <td className="px-4 py-5 text-sm font-bold text-slate-900">
                {t.plazoRetornoDias !== null
                  ? `${t.plazoRetornoDias} días`
                  : '—'}
              </td>
              <td className="px-4 py-5 text-[11px] text-slate-700">
                {t.causa}
              </td>
              <td className="px-4 py-5 text-[11px] text-slate-700">
                {t.motivo || ''}
              </td>
              <td className="px-4 py-5 text-[11px] uppercase text-slate-700">
                {t.estado}
              </td>
              <td className="px-2 py-5">
                <button
                  type="button"
                  className="text-slate-400 transition-colors hover:text-slate-600"
                  aria-label="Más opciones"
                >
                  <MoreVertical size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
