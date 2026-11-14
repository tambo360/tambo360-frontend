'use client'

import { usePagination } from '@/hooks/establishment/usePagination'

export type TipoMovimiento = 'TRANSFERENCIA' | 'ALTA' | 'BAJA' | 'OTRO'

// Se mantiene el nombre `Transferencia` porque lo importan las vistas del
// catálogo; representa cualquier movimiento (transferencia, alta o baja).
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
    <div className="w-full rounded-lg border border-slate-100 bg-white">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[720px] text-center">
          <thead>
            <tr className="bg-[#E8EEF5] text-xs font-semibold text-slate-700">
              {HEADERS.map((h) => (
                <th key={h} className="px-4 py-4 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {total === 0 && (
              <tr>
                <td
                  colSpan={HEADERS.length}
                  className="px-4 py-8 text-sm text-slate-400"
                >
                  No hay movimientos registrados.
                </td>
              </tr>
            )}

            {pageItems.map((t) => (
              <tr
                key={t.id}
                className="border-b border-slate-100 last:border-0"
              >
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
                  {t.motivo}
                </td>
                <td className="px-4 py-5 text-[11px] uppercase text-slate-700">
                  {t.estado}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {total > 0 && (
        <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3">
          <p className="text-[11px] text-slate-500">
            Mostrando {from}–{to} de {total} registros
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prev}
              disabled={!hasPrev}
              className="rounded-md border border-slate-200 px-3 py-1 text-xs text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Anterior
            </button>
            <span className="text-[11px] text-slate-500">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              onClick={next}
              disabled={!hasNext}
              className="rounded-md border border-slate-200 px-3 py-1 text-xs text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
