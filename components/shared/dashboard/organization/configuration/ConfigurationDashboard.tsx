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
      <nav className="flex gap-8 border-[#E5E7EB]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'transition-colors -mb-px border-b-2 cursor-pointer',
              activeTab === tab.id
                ? 'font-bold text-[#29845A] border-[#29845A]'
                : 'font-normal text-[#6B7280] border-transparent hover:text-[#374151]'
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
