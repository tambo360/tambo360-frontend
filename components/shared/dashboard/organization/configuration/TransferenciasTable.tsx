'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { usePagination } from '@/hooks/establishment/usePagination'

export type TipoMovimiento = 'TRANSFERENCIA' | 'ALTA' | 'BAJA' | 'OTRO'

export interface Transferencia {
  id: string
  tipo: TipoMovimiento
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

const PAGE_SIZE = 10

// Columnas según el diseño de Figma
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
  const {
    pageItems,
    page,
    totalPages,
    total,
    from,
    to,
    hasPrev,
    hasNext,
    prev,
    next,
  } = usePagination(transferencias, PAGE_SIZE)

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[800px] text-sm">
          <thead>
            <tr className="bg-[#E8EEF5] text-xs font-bold text-slate-700">
              <th className="px-6 py-4 text-left font-bold">Origen</th>
              <th className="px-6 py-4 text-left font-bold">Destino</th>
              <th className="px-6 py-4 text-center font-bold">Cantidad</th>
              <th className="px-6 py-4 text-center font-bold">
                Plazo de retorno
              </th>
              <th className="px-6 py-4 text-left font-bold">Causa</th>
              <th className="px-6 py-4 text-left font-bold">Motivo</th>
              <th className="px-6 py-4 text-center font-bold">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {total === 0 && (
              <tr>
                <td
                  colSpan={HEADERS.length}
                  className="px-6 py-8 text-center text-sm text-slate-400"
                >
                  No hay movimientos registrados.
                </td>
              </tr>
            )}

            {pageItems.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-5 text-xs font-bold text-slate-900">
                  {t.origen}
                </td>
                <td className="px-6 py-5 text-xs text-slate-700">
                  {t.destino}
                </td>
                <td className="px-6 py-5 text-sm font-bold text-slate-900 text-center">
                  {t.cantidad}
                </td>
                <td className="px-6 py-5 text-sm font-bold text-slate-900 text-center">
                  {t.plazoRetornoDias !== null
                    ? `${t.plazoRetornoDias}dias` // En Figma dice "5dias" junto, sin espacio
                    : '—'}
                </td>
                <td className="px-6 py-5 text-xs text-slate-700">{t.causa}</td>
                <td className="px-6 py-5 text-xs text-slate-700">{t.motivo}</td>
                <td className="px-6 py-5 text-xs font-semibold text-slate-500 text-center uppercase">
                  {t.estado}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {total > 0 && (
        <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-6 py-3">
          <p className="text-xs text-slate-500">
            Mostrando {from} de {total} registros
          </p>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={prev}
              disabled={!hasPrev}
              className="flex h-7 w-7 items-center justify-center rounded border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={next}
              disabled={!hasNext}
              className="flex h-7 w-7 items-center justify-center rounded border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
