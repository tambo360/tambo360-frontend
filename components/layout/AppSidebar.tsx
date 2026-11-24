'use client'
import {
  LayoutDashboard,
  Milk,
  Cpu,
  Settings,
  Wallet,
  User,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { useConfiguration } from '@/hooks/establishment/useConfiguration'
import { useNoViewedAlerts } from '@/hooks/alerts/useNoViewedAlerts'

interface AppSidebarProps {
  forcedCollapsed?: boolean
}

export function AppSidebar({ forcedCollapsed }: AppSidebarProps) {
  const pathname = usePathname()
  const params = useParams()
  const { data: configData } = useConfiguration()
  const { data: noViewedAlerts } = useNoViewedAlerts({
    id: configData?.data.idEstablecimiento,
  })
  const isCollapsed = forcedCollapsed

  const orgId = params?.orgId as string
  const estId = params?.id as string
  const baseUrl =
    orgId && estId
      ? `/organizaciones/${orgId}/${estId}`
      : pathname.split('/').slice(0, 4).join('/')

  const perfilUrl = baseUrl + '/perfil'
  const isPerfilActive = pathname.includes(perfilUrl)

  const mainMenuItems = [
    {
      title: 'Tablero',
      icon: LayoutDashboard,
      url: baseUrl + '/analisis',
      data: "data-test-id='dashboard'",
    },
    {
      title: 'Producción',
      icon: Milk,
      url: baseUrl + '/produccion',
      data: "data-test-id='produccion'",
    },
    {
      title: 'Costos Generales',
      icon: Wallet,
      url: baseUrl + '/costos',
      data: "data-test-id='costos-generales'",
    },
    {
      title: 'Configuración',
      icon: Settings,
      url: baseUrl + '/configuracion',
      data: "data-test-id='perfil'",
    },
    {
      title: 'TamboEngine',
      icon: Cpu,
      url: baseUrl + '/alertas',
      data: "data-test-id='tambo-engine'",
    },
  ]

  return (
    <Sidebar className="w-full border-none h-full bg-[#F1F5F9]/20">
      <SidebarHeader
        className={`transition-all duration-300 ${isCollapsed ? 'p-4' : 'p-8'}`}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center">
            <img
              src="/logos/isotipo_tambo_1.png"
              alt="Isotipo"
              className="h-full w-full object-contain"
            />
          </div>
          {!isCollapsed && (
            <div className="flex items-center animate-in fade-in duration-300">
              <img
                src="/logotipo 1.png"
                alt="Tambo360"
                className="h-6 w-auto"
              />
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 flex flex-col justify-between h-full pb-8">
        <SidebarMenu>
          {mainMenuItems.map((item) => {
            const isActive =
              item.url === '/' ? pathname === '/' : pathname.includes(item.url)
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className={`py-4 transition-all duration-200 rounded-lg shadow-none! flex items-center ${
                    isCollapsed ? 'justify-center' : 'justify-start'
                  } ${isActive ? 'bg-[#D7ECAF] hover:bg-[#D7ECAF]/60 hover:text-[#669213]/60' : 'bg-transparent text-gray-400 hover:bg-gray-100'}`}
                >
                  <Link
                    href={item.url}
                    className={`flex items-center gap-3 w-full ${isCollapsed ? 'justify-center' : ''}`}
                    data-test-id={item.data}
                  >
                    <item.icon
                      className={`h-5 w-5 shrink-0 ${isActive ? 'text-[#669213]' : 'text-gray-400'}`}
                    />
                    {!isCollapsed && (
                      <span
                        className={`font-semibold flex justify-between w-full ${isActive ? 'text-[#669213]' : 'text-gray-400'}`}
                      >
                        {item.title}{' '}
                        {item.url === '/alertas' &&
                          noViewedAlerts?.data.cantidad > 0 && (
                            <span className="text-white bg-red-main rounded-full size-6 text-center text-[16px]">
                              {noViewedAlerts.data.cantidad}
                            </span>
                          )}
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={`relative overflow-hidden py-4 transition-all duration-200 rounded-lg shadow-none! flex items-center ${
                isCollapsed ? 'justify-center' : 'justify-start'
              } ${isPerfilActive ? 'bg-[#D7ECAF] hover:bg-[#D7ECAF]/60' : 'bg-transparent text-gray-400 hover:bg-gray-100'}`}
            >
              <Link
                href={perfilUrl}
                aria-label="Perfil"
                aria-current={isPerfilActive ? 'page' : undefined}
                title={isCollapsed ? 'Perfil' : undefined}
                className={`flex items-center gap-3 w-full ${isCollapsed ? 'justify-center' : ''}`}
                data-test-id="perfil-link"
              >
                {isPerfilActive && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-[#669213]" />
                )}
                <User
                  className={`h-5 w-5 shrink-0 ${isPerfilActive ? 'text-[#669213]' : 'text-gray-400'}`}
                />
                {!isCollapsed && (
                  <span
                    className={`font-semibold ${isPerfilActive ? 'text-[#669213]' : 'text-gray-400'}`}
                  >
                    Perfil
                  </span>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
