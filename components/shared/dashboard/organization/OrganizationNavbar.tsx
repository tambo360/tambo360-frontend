'use client'
import React from 'react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Bell, LogOut } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export const OrganizationNavbar = () => {
  const { user, logout } = useAuth()

  return (
    <nav className="sticky top-0 z-30 flex h-20 w-full items-center justify-between px-4 sm:px-8 bg-white">
      <div className="w-auto flex items-center justify-start gap-2">
        <img src="/logos/isotipo_tambo 1.png" alt="logo" className="h-12" />
        <img src="/logotipo 1.png" alt="tambo" className="h-6" />
      </div>

      <div className="flex items-center justify-end gap-2 sm:gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
        </Button>

        <Button variant="ghost" size="sm" onClick={logout}>
          <LogOut className="h-4 w-4" />
        </Button>

        <Avatar>
          <AvatarFallback>
            {user?.nombre ? user.nombre.slice(0, 2).toUpperCase() : 'U'}
          </AvatarFallback>
        </Avatar>
      </div>
    </nav>
  )
}
