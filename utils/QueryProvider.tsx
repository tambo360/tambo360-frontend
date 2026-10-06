'use client'
import { QueryClient } from '@tanstack/react-query'
import {
  PersistQueryClientProvider,
  type PersistedClient,
  type Persister,
} from '@tanstack/react-query-persist-client'
import { del, get, set } from 'idb-keyval'
import { useState } from 'react'

/** Clave del caché persistido (usada también para purgar en logout). */
export const OFFLINE_QUERY_CACHE_KEY = 'tambo360-rq-cache'

/**
 * Persister IndexedDB manual (idb-keyval). Sin dependencias extra:
 */
function createIdbPersister(throttleTime = 1000): Persister {
  // En SSR no hay ventana: persister neutro que no rompe la hidratación.
  if (typeof window === 'undefined') {
    return {
      persistClient: async () => undefined,
      restoreClient: async () => undefined,
      removeClient: async () => undefined,
    }
  }
  let lastWrite = 0
  let pending: PersistedClient | undefined
  let timer: ReturnType<typeof setTimeout> | undefined
  const flush = () => {
    timer = undefined
    if (pending === undefined) return
    const client = pending
    pending = undefined
    lastWrite = Date.now()
    set(OFFLINE_QUERY_CACHE_KEY, client).catch(() => undefined)
  }

  return {
    // Guarda en cache con set.
    persistClient: async (client: PersistedClient) => {
      pending = client
      const elapsed = Date.now() - lastWrite
      if (elapsed >= throttleTime) {
        flush()
        return
      }
      if (!timer) timer = setTimeout(flush, throttleTime - elapsed)
    },
    // Lee lo guardado con get.
    restoreClient: async () => {
      try {
        return (
          (await get<PersistedClient>(OFFLINE_QUERY_CACHE_KEY)) ?? undefined
        )
      } catch {
        return undefined
      }
    },
    // Borra o purga el cache con del.
    removeClient: async () => {
      await del(OFFLINE_QUERY_CACHE_KEY)
    },
  }
}

/**
 * Solo se persiste lo visitado que permite sobrevivir offline:
 * Todo lo de batch, y establecimiento solo (list y configuration).
 */
function shouldDehydrateQuery(query: { queryKey: unknown }) {
  const key = query.queryKey as unknown[]
  if (key[0] === 'batch') return true
  if (
    key[0] === 'establishment' &&
    (key[1] === 'configuration' || key[1] === 'list')
  ) {
    return true
  }
  return false
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 3,
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 10,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  )

  const [persister] = useState(createIdbPersister)

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 1000 * 60 * 60 * 48,
        buster: 'tambo360-v1',
        dehydrateOptions: { shouldDehydrateQuery },
      }}
    >
      {children}
    </PersistQueryClientProvider>
  )
}
