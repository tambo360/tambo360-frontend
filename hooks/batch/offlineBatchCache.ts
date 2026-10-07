'use client'

import type { QueryClient } from '@tanstack/react-query'
import { baseKeys, queryKeys } from '@/utils/queryKeys'
import type { BatchData, Lote } from '@/types/batch'
import { toISODate } from '@/lib/offlineId'

/**
 * La respuesta de `/lote/listar` es `{ data: { lotes: [{ lote } | Lote], ... } }`.
 * Estos helpers aplican cambios optimistas sobre TODAS las páginas/filtros
 * cacheados, para que la lista se vea idéntica online y offline.
 */

interface ListEnvelope {
  data?: {
    lotes?: Array<{ lote?: Lote } | Lote>
    totalLotes?: number
    [key: string]: unknown
  }
  [key: string]: unknown
}

const readLote = (item: { lote?: Lote } | Lote): Lote =>
  (item as { lote?: Lote }).lote ?? (item as Lote)

const FILTERS_PREFIX = [...baseKeys.batch, 'filters'] as const

function forEachFiltersCache(
  qc: QueryClient,
  fn: (
    key: readonly unknown[],
    envelope: ListEnvelope
  ) => ListEnvelope | undefined
) {
  const entries = qc.getQueryCache().findAll({ queryKey: FILTERS_PREFIX })
  for (const entry of entries) {
    const current = entry.state.data as ListEnvelope | undefined
    if (!current?.data?.lotes) continue
    const next = fn(entry.queryKey, current)
    if (next) qc.setQueryData(entry.queryKey, next)
  }
}

/**
 * Resuelve display del rodeo desde cachés (config → opciones).
 * El `idRodeo` del payload siempre salió de esas listas, así que acierta.
 */
function resolveRodeoFields(
  qc: QueryClient,
  idRodeo: string | undefined
): { rodeo: Lote['rodeo']; cantAnimales: number | undefined } {
  if (!idRodeo) return { rodeo: undefined, cantAnimales: undefined }
  const entries = qc
    .getQueryCache()
    .findAll({ queryKey: baseKeys.establishment })
  let tipoRodeo: string | undefined
  let nombre: string | undefined
  let cantVacas: number | undefined
  for (const entry of entries) {
    const key = entry.queryKey as unknown[]
    const raw = entry.state.data as any
    if (key[1] === 'configuration') {
      const hit = (raw?.data?.rodeos ?? raw?.rodeos ?? []).find(
        (r: any) => r?.idRodeo === idRodeo
      )
      if (hit) {
        tipoRodeo = hit.tipoRodeo ?? tipoRodeo
        if (hit.cantVacas != null) cantVacas = Number(hit.cantVacas)
      }
    }
    if (key[2] === 'opciones-seguimiento') {
      const holder = raw?.data ?? raw
      const hit = (holder?.rodeos ?? []).find(
        (r: any) => r?.idRodeo === idRodeo
      )
      if (hit) {
        nombre = nombre ?? hit.label
        if (cantVacas == null && hit.cantVacas != null) {
          cantVacas = Number(hit.cantVacas)
        }
      }
    }
    if (tipoRodeo && cantVacas != null) break
  }
  return {
    rodeo: {
      idRodeo,
      ...(tipoRodeo ? { tipoRodeo } : {}),
      ...(nombre ? { nombre } : {}),
    } as unknown as Lote['rodeo'],
    cantAnimales: cantVacas,
  }
}

/** Payload `animales` (create/edit) → shape que el edit lee (`produccionesIndividuales`). */
function mapAnimalesToProducciones(
  animales: Array<{
    idAnimal: string
    litros: number | string
    estado: string
  }>
): {
  produccionesIndividuales: Lote['produccionesIndividuales']
  cantAnimales: number
} {
  return {
    produccionesIndividuales: animales.map((a) => ({
      idAnimal: a.idAnimal,
      litros: String(a.litros ?? ''),
      estado: a.estado,
      idProduccionAnimal: '',
    })),
    cantAnimales: animales.length,
  }
}

/** Construye el `Lote` visible al instante tras un create offline. */
export function buildOptimisticLote(
  qc: QueryClient,
  payload: BatchData & { idLote: string },
  numeroLote: number
): Lote {
  const anyPayload = payload as unknown as {
    idRodeo?: string
    animales?: Array<{
      idAnimal: string
      litros: number
      estado: string
      destino?: string
    }>
  }
  const { rodeo, cantAnimales } = resolveRodeoFields(qc, anyPayload.idRodeo)
  const individual = Array.isArray(anyPayload.animales)
    ? mapAnimalesToProducciones(anyPayload.animales)
    : { produccionesIndividuales: undefined, cantAnimales: undefined }

  return {
    idLote: payload.idLote,
    numeroLote,
    fechaProduccion: toISODate(payload.fechaProduccion),
    idProducto: payload.idProducto,
    producto: undefined,
    cantidad: Number(payload.cantidad),
    unidad: payload.unidad,
    // Sin esto la lista muestra '—' en vez del rodeo (getRodeoDisplay).
    cantAnimales: cantAnimales ?? individual.cantAnimales,
    idEstablecimiento: '',
    estado: false,
    tempTanque: payload.tempTanque ? Number(payload.tempTanque) : undefined,
    destino: payload.destino,
    rodeo,
    mermas: [],
    cantBajadas: Number(payload.cantBajadas),
    tipoSeguimiento: payload.tipoSeguimiento,
    // Sin esto, editar el lote offline abre la lista de vacas vacía.
    produccionesIndividuales: individual.produccionesIndividuales,
  }
}

/** Próximo número de lote provisional (máximo local + 1). */
export function nextProvisionalNumero(qc: QueryClient): number {
  let max = 0
  const entries = qc.getQueryCache().findAll({ queryKey: FILTERS_PREFIX })
  for (const entry of entries) {
    const current = entry.state.data as ListEnvelope | undefined
    for (const item of current?.data?.lotes ?? []) {
      const n = Number(readLote(item).numeroLote)
      if (!Number.isNaN(n) && n > max) max = n
    }
  }
  return max + 1
}

export function applyOptimisticCreate(qc: QueryClient, lote: Lote) {
  forEachFiltersCache(qc, (_key, envelope) => {
    const lotes = envelope.data?.lotes ?? []
    // Evita duplicados si ya existe (reintento del mismo tempId)
    if (lotes.some((i) => readLote(i).idLote === lote.idLote)) return undefined
    return {
      ...envelope,
      data: {
        ...envelope.data,
        lotes: [{ lote }, ...lotes],
        totalLotes: (envelope.data?.totalLotes ?? lotes.length) + 1,
      },
    }
  })
}

export function applyOptimisticUpdate(
  qc: QueryClient,
  id: string,
  values: Partial<BatchData>
) {
  const anyValues = values as unknown as {
    idRodeo?: string
    animales?: Array<{
      idAnimal: string
      litros: number | string
      estado: string
    }>
  }
  const rodeoPatch = resolveRodeoFields(qc, anyValues.idRodeo)
  const hasRodeoPatch = Boolean(anyValues.idRodeo)
  const animalesPatch = Array.isArray(anyValues.animales)
    ? mapAnimalesToProducciones(anyValues.animales)
    : null
  forEachFiltersCache(qc, (_key, envelope) => ({
    ...envelope,
    data: {
      ...envelope.data,
      lotes: (envelope.data?.lotes ?? []).map((item) => {
        const lote = readLote(item)
        if (lote.idLote !== id) return item
        return {
          ...(item as object),
          lote: {
            ...lote,
            ...(values.cantidad !== undefined
              ? { cantidad: Number(values.cantidad) }
              : {}),
            ...(values.fechaProduccion
              ? { fechaProduccion: toISODate(values.fechaProduccion) }
              : {}),
            ...(values.destino ? { destino: values.destino } : {}),
            ...(values.unidad ? { unidad: values.unidad } : {}),
            ...(values.tempTanque !== undefined
              ? { tempTanque: Number(values.tempTanque) || undefined }
              : {}),
            ...(values.cantBajadas !== undefined
              ? { cantBajadas: Number(values.cantBajadas) }
              : {}),
            // Re-editar offline también refresca rodeo y vacas.
            ...(hasRodeoPatch
              ? {
                  rodeo: rodeoPatch.rodeo,
                  ...(rodeoPatch.cantAnimales != null
                    ? { cantAnimales: rodeoPatch.cantAnimales }
                    : {}),
                }
              : {}),
            ...(animalesPatch
              ? {
                  produccionesIndividuales:
                    animalesPatch.produccionesIndividuales,
                  cantAnimales: animalesPatch.cantAnimales,
                }
              : {}),
          },
        }
      }),
    },
  }))
}

export function removeOptimistic(qc: QueryClient, id: string) {
  forEachFiltersCache(qc, (_key, envelope) => {
    const lotes = envelope.data?.lotes ?? []
    if (!lotes.some((i) => readLote(i).idLote === id)) return undefined
    const next = lotes.filter((i) => readLote(i).idLote !== id)
    return {
      ...envelope,
      data: {
        ...envelope.data,
        lotes: next,
        totalLotes: Math.max(
          0,
          (envelope.data?.totalLotes ?? lotes.length) - 1
        ),
      },
    }
  })
  qc.removeQueries({ queryKey: queryKeys.batch.detail(id) })
}

export function markCompleteOptimistic(qc: QueryClient, id: string) {
  forEachFiltersCache(qc, (_key, envelope) => ({
    ...envelope,
    data: {
      ...envelope.data,
      lotes: (envelope.data?.lotes ?? []).map((item) => {
        const lote = readLote(item)
        if (lote.idLote !== id) return item
        return { ...(item as object), lote: { ...lote, estado: true } }
      }),
    },
  }))
}

/** Tras sincronizar un create: reemplaza el item temporal por el real. */
export function replaceTempLote(
  qc: QueryClient,
  tempId: string,
  real: Partial<Lote> & { idLote?: string; id?: string }
) {
  const realId = real.idLote ?? real.id ?? tempId
  forEachFiltersCache(qc, (_key, envelope) => ({
    ...envelope,
    data: {
      ...envelope.data,
      lotes: (envelope.data?.lotes ?? []).map((item) => {
        const lote = readLote(item)
        if (lote.idLote !== tempId) return item
        return {
          ...(item as object),
          lote: { ...lote, ...(real as object), idLote: realId },
        }
      }),
    },
  }))
}

/**
 * Busca un lote en las listas paginadas cacheadas (para el modal de detalle
 * offline cuando el `detail` nunca se visitó). Lectura no suscrita: llamarla
 * durante el render es suficiente porque el modal se remonta por `batchId`.
 */
export function findCachedLote(
  qc: QueryClient,
  idLote: string
): Lote | undefined {
  const entries = qc.getQueryCache().findAll({ queryKey: FILTERS_PREFIX })
  for (const entry of entries) {
    const current = entry.state.data as ListEnvelope | undefined
    for (const item of current?.data?.lotes ?? []) {
      const lote = readLote(item)
      if (lote.idLote === idLote) return lote
    }
  }
  return undefined
}
