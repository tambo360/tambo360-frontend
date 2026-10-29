'use client'

import type { QueryClient } from '@tanstack/react-query'
import { baseKeys, queryKeys } from '@/utils/queryKeys'
import type { BatchData, Lote } from '@/types/batch'
import { toISODate } from '@/lib/offlineId'

const LECHE_PRODUCTO_ID = '01a1838f-6023-79d0-abfc-3816e8a998e9'

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

export function getOfflineProduct(idProducto: string) {
  if (idProducto.toLowerCase() !== LECHE_PRODUCTO_ID) return undefined

  return {
    idProducto,
    nombre: 'Leche Entera',
    categoria: 'leches' as const,
  }
}

export function isLoteFromToday(lote: Lote): boolean {
  const date = new Date(lote.fechaProduccion)
  const today = new Date()
  return (
    !Number.isNaN(date.getTime()) &&
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  )
}

// Solo LISTAS (envelopes con data.lotes)
const BATCH_LIST_PREFIXES = [
  [...baseKeys.batch, 'filters'], // ['batch','filters',*]
  [...baseKeys.batch, 'today'], // ['batch','today']
] as const

function forEachBatchListCache(
  qc: QueryClient,
  fn: (
    key: readonly unknown[],
    envelope: ListEnvelope
  ) => ListEnvelope | undefined
) {
  for (const prefix of BATCH_LIST_PREFIXES) {
    const entries = qc
      .getQueryCache()
      .findAll({ queryKey: prefix, exact: false })
    for (const entry of entries) {
      const current = entry.state.data as ListEnvelope | undefined
      if (!current?.data?.lotes) continue
      const next = fn(entry.queryKey, current)
      if (next) qc.setQueryData(entry.queryKey, next)
    }
  }
}
export function applyOptimisticDashboardCurrent(qc: QueryClient, lote: Lote) {
  qc.setQueryData(queryKeys.dashboard.current(), (prev: any) => {
    if (!prev?.data) return prev
    return {
      ...prev,
      data: {
        ...prev.data,
        totalLitros: (prev.data.totalLitros ?? 0) + Number(lote.cantidad ?? 0),
        totalLotes: (prev.data.totalLotes ?? 0) + 1,
      },
    }
  })
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
export function createLoteOffline(
  qc: QueryClient,
  payload: BatchData & { idLote: string; numeroLote: number }
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
    numeroLote: payload.numeroLote,
    fechaProduccion: new Date().toISOString(),
    idProducto: payload.idProducto,
    producto: getOfflineProduct(payload.idProducto),
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
export function nextNumberProvisionalLote(
  qc: QueryClient,
  pendingNumbers: readonly (number | undefined)[] = []
): number {
  let max = 0
  for (const prefix of BATCH_LIST_PREFIXES) {
    const entries = qc
      .getQueryCache()
      .findAll({ queryKey: prefix, exact: false })
    for (const entry of entries) {
      const current = entry.state.data as ListEnvelope | undefined
      for (const item of current?.data?.lotes ?? []) {
        const n = Number(readLote(item).numeroLote)
        if (Number.isFinite(n) && n > max) max = n
      }
    }
  }

  for (const number of pendingNumbers) {
    if (number !== undefined && Number.isFinite(number) && number > max) {
      max = number
    }
  }

  return max + 1
}

export function applyOptimisticCreate(qc: QueryClient, lote: Lote) {
  forEachBatchListCache(qc, (key, envelope) => {
    if (key[1] === 'today' && !isLoteFromToday(lote)) return undefined
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

  if (isLoteFromToday(lote) && !qc.getQueryData(queryKeys.batch.day())) {
    qc.setQueryData(queryKeys.batch.day(), {
      data: { lotes: [{ lote }], totalLotes: 1 },
    })
  }
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
  forEachBatchListCache(qc, (_key, envelope) => ({
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
  forEachBatchListCache(qc, (_key, envelope) => {
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
  let touched = false
  forEachBatchListCache(qc, (_key, envelope) => {
    const lotes = envelope.data?.lotes ?? []
    if (lotes.some((item) => readLote(item).idLote === id)) touched = true
    return {
      ...envelope,
      data: {
        ...envelope.data,
        lotes: lotes.map((item) => {
          const lote = readLote(item)
          if (lote.idLote !== id) return item
          return { ...(item as object), lote: { ...lote, estado: true } }
        }),
      },
    }
  })
  // El modal de detalle lee `batch.detail(id)`: sin este parche seguiría
  // "Incompleto" offline aunque la tabla ya muestre Completado.
  qc.setQueryData(queryKeys.batch.detail(id), (prev: unknown) => {
    if (!prev || typeof prev !== 'object') return prev
    const holder = (prev as { data?: unknown }).data
    if (!holder || typeof holder !== 'object') return prev
    if ((holder as { lote?: Lote }).lote) {
      const lote = (holder as { lote: Lote }).lote
      if (lote.idLote !== id) return prev
      touched = true
      return {
        ...(prev as object),
        data: { ...(holder as object), lote: { ...lote, estado: true } },
      }
    }
    if ((holder as Lote).idLote) {
      if ((holder as Lote).idLote !== id) return prev
      touched = true
      return {
        ...(prev as object),
        data: { ...(holder as Lote), estado: true },
      }
    }
    return prev
  })
  if (
    !touched &&
    typeof process !== 'undefined' &&
    process.env.NODE_ENV !== 'production'
  ) {
    console.warn(
      `[offline] completar sin efecto sobre '${id}': ` +
        'lote no encontrado en listas ni detalle cacheados.'
    )
  }
}

/**
 * Overlay de completados pendientes: mientras la op `complete` siga encolada,
 * el lote se muestra con `estado: true` aunque el caché diga otra cosa
 * (recarga offline, refetch stale). Al drenar, la op sale y el servidor manda
 * lo real. Handoff sin parpadeo.
 */
export function hasPendingComplete(
  ops: Array<{ type: string; scope: string; targetId?: string | null }>,
  scope: string,
  idLote: string
): boolean {
  return ops.some(
    (o) => o.type === 'complete' && o.scope === scope && o.targetId === idLote
  )
}

/** Tras sincronizar un create: reemplaza el item temporal por el real. */
export function replaceTempLote(
  qc: QueryClient,
  tempId: string,
  real: Partial<Lote> & { idLote?: string; id?: string }
) {
  const realId = real.idLote ?? real.id ?? tempId
  forEachBatchListCache(qc, (_key, envelope) => ({
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
 * Busca un lote en las listas cacheadas cuando el `detail` nunca se visitó.
 * La consulta no está suscrita; el consumidor se actualiza al resolverse
 * `useBatch` y vuelve a leer la caché en ese render.
 */
export function findCachedLote(
  qc: QueryClient,
  idLote: string
): Lote | undefined {
  for (const prefix of BATCH_LIST_PREFIXES) {
    const entries = qc
      .getQueryCache()
      .findAll({ queryKey: prefix, exact: false })
    for (const entry of entries) {
      const current = entry.state.data as ListEnvelope | undefined
      for (const item of current?.data?.lotes ?? []) {
        const lote = readLote(item)
        if (lote.idLote === idLote) return lote
      }
    }
  }
  return undefined
}
