'use client'

import { AppSidebar } from '@/components/layout/AppSidebar'
import { Navbar } from '@/components/shared/dashboard/Navbar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { useOutboxSync } from '@/hooks/connection/useOutboxSync'
import { useState, useEffect } from 'react'

interface LayoutContentProps {
  children: React.ReactNode
}

const LayoutContent = ({ children }: LayoutContentProps) => {
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Drena la cola offline-first al montar y al recuperar conexión.
  useOutboxSync()

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (!mobile) setShowMobileMenu(false)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleToggleMenu = () => {
    if (isMobile) {
      setShowMobileMenu(!showMobileMenu)
    } else {
      setIsCollapsed(!isCollapsed)
    }
  }

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] overflow-hidden">
      {isMobile && showMobileMenu && (
        <div
          className="fixed inset-0 z-60 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      <div
        className={`h-full z-70 transition-all duration-300 ease-in-out shrink-0 bg-white border-r border-gray-200
          ${isMobile ? 'fixed left-0 top-0 shadow-2xl' : 'relative'}
          ${isMobile && !showMobileMenu ? '-translate-x-full' : 'translate-x-0'}
          ${!isMobile ? (isCollapsed ? 'w-20' : 'w-70') : 'w-70'}
        `}
      >
        <AppSidebar forcedCollapsed={!isMobile && isCollapsed} />
      </div>

      <div className="flex flex-col grow min-w-0 h-full">
        <Navbar onMenuClick={handleToggleMenu} />

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 mx-auto flex flex-1">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  )
}
