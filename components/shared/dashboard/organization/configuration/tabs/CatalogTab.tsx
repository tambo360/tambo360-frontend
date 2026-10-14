'use client'

import { useOpcionesSeguimiento } from '@/hooks/establishment/useOpcionesSeguimiento'
import InventarioRodeosTab from '@/components/shared/dashboard/organization/configuration/tabs/catalog/InventarioRodeostab'
import HerdInventoryPage from '@/components/shared/dashboard/organization/configuration/tabs/catalog/HerdInventoryPage'
import AnimalInventoryPage from '@/components/shared/dashboard/organization/configuration/tabs/catalog/AnimalInventoryPage'
import { AlertCircle } from 'lucide-react'

type TipoSeg = 'RODEO' | 'RODEO_UNICO' | 'INDIVIDUAL'

export default function CatalogTab() {
  const { data, isLoading, isError, error } = useOpcionesSeguimiento()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-6 w-48 bg-gray-100 rounded animate-pulse" />
        <div className="h-40 w-full bg-gray-50 rounded-2xl animate-pulse" />
      </div>
    )
  }

  const tipo: TipoSeg | undefined = data?.tipoSeguimiento

  if (isError || !tipo) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-700 space-y-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <p className="font-bold">
            No se pudo cargar la configuración del establecimiento.
          </p>
        </div>
        {isError && (
          <p className="text-xs">
            Error: {(error as Error)?.message ?? 'desconocido'}
          </p>
        )}
        <details>
          <summary className="cursor-pointer font-semibold text-xs">
            Ver respuesta cruda del backend
          </summary>
          <pre className="mt-2 text-xs bg-white border border-red-200 rounded p-3 overflow-auto max-h-80">
            {JSON.stringify(data, null, 2)}
          </pre>
        </details>
      </div>
    )
  }

  switch (tipo) {
    case 'RODEO':
      return <HerdInventoryPage />
    case 'RODEO_UNICO':
      return <InventarioRodeosTab />
    case 'INDIVIDUAL':
      return <AnimalInventoryPage />
    default:
      return (
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 text-sm text-gray-500">
          Tipo de seguimiento desconocido: <code>{tipo}</code>
        </div>
      )
  }
}
