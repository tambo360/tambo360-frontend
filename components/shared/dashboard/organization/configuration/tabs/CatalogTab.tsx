'use client'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import InventarioRodeosTab from '@/components/shared/dashboard/organization/configuration/tabs/catalog/InventarioRodeostab'
// Importa tus nuevas vistas aquí (ajusta la ruta según dónde las hayas guardado)
import HerdInventoryPage from '@/components/shared/dashboard/organization/configuration/tabs/catalog/HerdInventoryPage' // La vista de Rodeo Único / Tarjetas
import AnimalInventoryPage from '@/components/shared/dashboard/organization/configuration/tabs/catalog/AnimalInventoryPage' // La vista de Inventario por Animal (Tabla)

// Importaciones comentadas por si tienes más pendientes
// import HistMovimientoTab from '@/components/shared/dashboard/organization/configuration/tabs/catalog/HistMovimientoTab'
// import ParametrosTamboTab from '@/components/shared/dashboard/organization/configuration/tabs/catalog/ParametrosTamboTab'
// import ControlLecheroTab from '@/components/shared/dashboard/organization/configuration/tabs/catalog/ControlLecheroTab'
// import ProductosDestinoTab from '@/components/shared/dashboard/organization/configuration/tabs/catalog/ProductosDestinoTab'

const CATALOG_SUBTABS = [
  { id: 'inventario', label: 'Inventario de Rodeos' },
  { id: 'rodeos-cards', label: 'Rodeo Único' },
  { id: 'animales-tabla', label: 'Inventario por Animal' },
  // { id: 'movimientos', label: 'Hist. Movimientos' },
  // { id: 'parametros', label: 'Parámetros de Tambo' },
  // { id: 'control', label: 'Control Lechero Mensual' },
  // { id: 'productos', label: 'Productos Destino' },
]

export default function CatalogTab() {
  const [activeSubTab, setActiveSubTab] = useState('inventario')

  return (
    <div className="flex flex-col gap-4">
      {/* Subtabs navegación */}
      <nav className="flex gap-1 border-b border-[#E5E7EB] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CATALOG_SUBTABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium transition-colors border-b-2 whitespace-nowrap -mb-px',
              activeSubTab === tab.id
                ? 'border-[#29845A] text-[#29845A]'
                : 'border-transparent text-[#6B7280] hover:text-[#374151]'
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Contenido dinámico según la pestaña activa */}
      <div className="w-full">
        {activeSubTab === 'inventario' && <InventarioRodeosTab />}
        {activeSubTab === 'rodeos-cards' && <HerdInventoryPage />}
        {activeSubTab === 'animales-tabla' && <AnimalInventoryPage />}
        {/* {activeSubTab === 'movimientos' && <HistMovimientoTab />} */}
        {/* {activeSubTab === 'parametros' && <ParametrosTamboTab />} */}
        {/* {activeSubTab === 'control' && <ControlLecheroTab />} */}
        {/* {activeSubTab === 'productos' && <ProductosDestinoTab />} */}
      </div>
    </div>
  )
}
