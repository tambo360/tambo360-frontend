import React from 'react'
import { MapPin, Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useConfiguration } from '@/hooks/establishment/useConfiguration'
import { useEstablishment } from '@/hooks/establishment/useEstablishment'

interface NavbarProps {
  onMenuClick: () => void
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user } = useAuth()
  const pathname = usePathname()
  const { data: configData } = useConfiguration()
  const { data: estData } = useEstablishment({
    id: configData?.data.idEstablecimiento,
  })

  const [isOnline, setIsOnline] = React.useState(navigator.onLine)
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <nav className="sticky top-0 z-30 flex h-20 w-full items-center justify-between px-4 sm:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg transition-colors duration-200 hover:bg-[#4A4A4A] hover:text-white text-[#4A4A4A]"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="hidden sm:flex flex-col">
          {pathname == '/analisis' ? (
            <h3 className="text-lg sm:text-xl font-bold text-black truncate">
              ¡Hola, {user?.nombre?.split(' ')[0] || 'Raul'}!
            </h3>
          ) : (
            <h3 className="text-[16px] font-bold text-[#959595] truncate">
              {estData?.data?.nombre || 'Establecimiento'}
            </h3>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {configData?.data.provincia && configData?.data.localidad && (
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5">
            <MapPin className="h-4 w-4 text-black" />
            <span className="text-xs font-semibold text-gray-700">
              {configData.data.provincia + ', ' + configData.data.localidad}
            </span>
          </div>
        )}
        <div className="items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 flex">
          {isOnline ? (
            <>
              <div className="size-4 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-gray-700">
                Conectado
              </span>
            </>
          ) : (
            <>
              <div className="size-4 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-gray-700">
                Sin conexión
              </span>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
