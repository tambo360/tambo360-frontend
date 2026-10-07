'use client'

import type { QueryClient } from '@tanstack/react-query'
import { baseKeys } from '@/utils/queryKeys'
import { useTransferOutbox } from '@/stores/useTransferOutbox'
import { currentScope } from '@/lib/offlineId'
import type {
  TransferAnimalPayload,
  TransferRodeoPayload,
} from '@/types/transfer'

/**
 * Parche optimista del caché `opciones-seguimiento` tras una transferencia
 * offline: los conteos cambian en pantalla al instante. Al sincronizar (o si
 * el servidor rechaza) se invalida y vuelve el estado real.
 */

interface RazaEntry {
  idRaza: string
  nombre?: string
  value?: string
  cantVacas: number
}

interface RodeoEntry {
  idRodeo: string
  cantVacas: number
  razas?: RazaEntry[]
}

interface AnimalEntry {
  idAnimal: string
  categoria: string
}

interface OpcionesShape {
  tipoSeguimiento?: string
  rodeos?: RodeoEntry[]
  animales?: AnimalEntry[]
}

interface FormDataRaza {
  idRaza: string
  cantVacas: number
  nombre?: { value?: string; label?: string } | string
}

interface FormDataRodeo {
  idRodeo: string
  cantVacas: number
  razas?: FormDataRaza[]
}

interface FormDataAnimal {
  idAnimal: string
  categoria?: { value?: string; label?: string } | string
}

interface FormDataShape {
  rodeos?: FormDataRodeo[]
  animales?: FormDataAnimal[]
}

/** Recorre cachés `establishment/<estId>/<variant>` tolerando envelope `data`. */
function forEachEstablishmentCache<T extends object>(
  qc: QueryClient,
  variant: string,
  fn: (data: T) => T | undefined
) {
  const entries = qc
    .getQueryCache()
    .findAll({ queryKey: baseKeys.establishment })
  for (const entry of entries) {
    const key = entry.queryKey as unknown[]
    if (key[2] !== variant) continue
    const raw = entry.state.data as T | { data?: T } | undefined
    if (!raw || typeof raw !== 'object') continue
    // La API a veces envuelve en `data`: se parchea donde viva la forma real.
    const holder = ((raw as { data?: T }).data ?? raw) as T
    if (!holder || typeof holder !== 'object') continue
    const next = fn(holder)
    if (!next) continue
    if ((raw as { data?: T }).data) {
      qc.setQueryData(entry.queryKey, { ...(raw as object), data: next })
    } else {
      qc.setQueryData(entry.queryKey, next)
    }
  }
}

function forEachOpcionesCache(
  qc: QueryClient,
  fn: (data: OpcionesShape) => OpcionesShape | undefined
) {
  forEachEstablishmentCache(qc, 'opciones-seguimiento', fn)
}

/** Igual que arriba pero sobre el form del modal (`transferir-form-data`). */
function forEachFormDataCache(
  qc: QueryClient,
  fn: (data: FormDataShape) => FormDataShape | undefined
) {
  forEachEstablishmentCache(qc, 'transferir-form-data', fn)
}

function applyRodeoTransfer(
  data: OpcionesShape,
  payload: TransferRodeoPayload
): OpcionesShape | undefined {
  const cant = Number(payload.animal.cantVacas)
  if (!cant || cant <= 0 || !data.rodeos) return undefined
  const origen = data.rodeos.find((r) => r.idRodeo === payload.origen)
  const destino = data.rodeos.find((r) => r.idRodeo === payload.destino)
  if (!origen || !destino) return undefined
  return {
    ...data,
    rodeos: data.rodeos.map((r) => {
      if (r.idRodeo === payload.origen) {
        return {
          ...r,
          cantVacas: Math.max(0, Number(r.cantVacas ?? 0) - cant),
          razas: (r.razas ?? []).map((z) =>
            z.idRaza === payload.animal.raza
              ? {
                  ...z,
                  cantVacas: Math.max(0, Number(z.cantVacas ?? 0) - cant),
                }
              : z
          ),
        }
      }
      if (r.idRodeo === payload.destino) {
        const razas = [...(r.razas ?? [])]
        const idx = razas.findIndex((z) => z.idRaza === payload.animal.raza)
        if (idx >= 0) {
          razas[idx] = {
            ...razas[idx],
            cantVacas: Number(razas[idx].cantVacas ?? 0) + cant,
          }
        } else {
          razas.push({
            idRaza: payload.animal.raza,
            nombre: '',
            value: '',
            cantVacas: cant,
          })
        }
        return { ...r, cantVacas: Number(r.cantVacas ?? 0) + cant, razas }
      }
      return r
    }),
  }
}

function applyIndividualTransfer(
  data: OpcionesShape,
  payload: TransferAnimalPayload
): OpcionesShape | undefined {
  if (!data.animales) return undefined
  const found = data.animales.some((a) => a.idAnimal === payload.animal.id)
  if (!found) return undefined
  return {
    ...data,
    animales: data.animales.map((a) =>
      a.idAnimal === payload.animal.id
        ? { ...a, categoria: payload.destino }
        : a
    ),
  }
}

function applyRodeoTransferToFormData(
  data: FormDataShape,
  payload: TransferRodeoPayload
): FormDataShape | undefined {
  const cant = Number(payload.animal.cantVacas)
  if (!cant || cant <= 0 || !data.rodeos) return undefined
  const origen = data.rodeos.find((r) => r.idRodeo === payload.origen)
  const destino = data.rodeos.find((r) => r.idRodeo === payload.destino)
  if (!origen || !destino) return undefined
  return {
    ...data,
    rodeos: data.rodeos.map((r) => {
      if (r.idRodeo === payload.origen) {
        return {
          ...r,
          cantVacas: Math.max(0, Number(r.cantVacas ?? 0) - cant),
          razas: (r.razas ?? []).map((z) =>
            z.idRaza === payload.animal.raza
              ? {
                  ...z,
                  cantVacas: Math.max(0, Number(z.cantVacas ?? 0) - cant),
                }
              : z
          ),
        }
      }
      if (r.idRodeo === payload.destino) {
        const razas = [...(r.razas ?? [])]
        const idx = razas.findIndex((z) => z.idRaza === payload.animal.raza)
        if (idx >= 0) {
          razas[idx] = {
            ...razas[idx],
            cantVacas: Number(razas[idx].cantVacas ?? 0) + cant,
          }
        } else {
          razas.push({
            idRaza: payload.animal.raza,
            cantVacas: cant,
            nombre: { value: '', label: '' },
          })
        }
        return { ...r, cantVacas: Number(r.cantVacas ?? 0) + cant, razas }
      }
      return r
    }),
  }
}

function applyIndividualTransferToFormData(
  data: FormDataShape,
  payload: TransferAnimalPayload
): FormDataShape | undefined {
  if (!data.animales) return undefined
  const found = data.animales.some((a) => a.idAnimal === payload.animal.id)
  if (!found) return undefined
  return {
    ...data,
    animales: data.animales.map((a) =>
      a.idAnimal === payload.animal.id
        ? {
            ...a,
            categoria: { value: payload.destino, label: payload.destino },
          }
        : a
    ),
  }
}

export function applyOptimisticTransfer(
  qc: QueryClient,
  payload: TransferRodeoPayload | TransferAnimalPayload
) {
  // Caché del form de lotes (lista seleccionable).
  forEachOpcionesCache(qc, (data) => {
    if (payload.tipoSeguimiento === 'INDIVIDUAL') {
      return applyIndividualTransfer(data, payload as TransferAnimalPayload)
    }
    return applyRodeoTransfer(data, payload as TransferRodeoPayload)
  })
  // Caché del propio modal (sus selects muestran conteos).
  forEachFormDataCache(qc, (data) => {
    if (payload.tipoSeguimiento === 'INDIVIDUAL') {
      return applyIndividualTransferToFormData(
        data,
        payload as TransferAnimalPayload
      )
    }
    return applyRodeoTransferToFormData(data, payload as TransferRodeoPayload)
  })
}

/**
 * Ruta offline directa (sin TanStack): parche optimista + cola.
 * La usan los modales cuando no hay red para no depender del ciclo
 * de vida de la mutación (pause/settle) en ese estado.
 */
export function submitTransferOffline(
  qc: QueryClient,
  payload: TransferRodeoPayload | TransferAnimalPayload
): { offline: true } {
  applyOptimisticTransfer(qc, payload)
  useTransferOutbox
    .getState()
    .enqueue({ type: 'transfer', scope: currentScope(), payload })
  return { offline: true }
}
