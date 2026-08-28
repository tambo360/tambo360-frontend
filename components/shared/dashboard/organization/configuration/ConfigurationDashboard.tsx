'use client'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import GeneralTab from '@/components/shared/dashboard/organization/configuration/tabs/GeneralTab'
import CatalogTab from '@/components/shared/dashboard/organization/configuration/tabs/CatalogTab'
// TODO: reactivar cuando "Equipo" entre en este lanzamiento
// import TeamTab from '@/components/shared/dashboard/organization/configuration/tabs/TeamTab'

const TABS = [
  { id: 'general', label: 'General' },
  { id: 'catalogo', label: 'Catálogo' },
  // TODO: reactivar cuando "Equipo" entre en este lanzamiento
  // { id: 'equipo', label: 'Equipo' },
]

export default function ConfigurationDashboard() {
  const [activeTab, setActiveTab] = useState('general')

  return (
    <div className="flex flex-col gap-6 w-full">
      <nav className="flex gap-1 border-b border-[#E5E7EB]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors rounded-t-md border',
              activeTab === tab.id
                ? 'border-[#29845A] text-[#29845A] bg-white -mb-px border-b-white'
                : 'border-transparent text-[#6B7280] hover:text-[#374151]'
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="w-full">
        {activeTab === 'general' && <GeneralTab />}
        {activeTab === 'catalogo' && <CatalogTab />}
        {/* TODO: reactivar cuando "Equipo" entre en este lanzamiento */}
        {/* {activeTab === 'equipo' && <TeamTab />} */}
      </div>
    </div>
  )
}
