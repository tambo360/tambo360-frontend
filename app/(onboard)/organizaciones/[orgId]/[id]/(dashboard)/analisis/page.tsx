'use client'
import ComparacionHistorica from '@/components/shared/dashboard/ComparacionHistorica'
import DailyProductionLog from '@/components/shared/dashboard/DailyProductionLog'
import AlertsSection from '@/components/shared/dashboard/AlertsSection'
import { useCurrentMonth } from '@/hooks/dashboard/useCurrentMonth'
import { useCurrentUser } from '@/hooks/auth/useCurrentUser'
import { StatCard } from '@/components/shared/StatCard'
import { useEstablishment } from '@/hooks/establishment/useEstablishment'
import { usePathname } from 'next/navigation'

const Dashboard = () => {
  const { data, isPending } = useCurrentMonth()
  const pathname = usePathname()
  const { data: establishment } = useEstablishment({
    id: pathname.split('/')[3],
  })
  const { data: currentUser } = useCurrentUser()
  const primerNombre = currentUser?.data?.nombre?.split(' ')[0]
  const totalProduccion =
    (data?.data.actual.quesos || 0) + (data?.data.actual.leches || 0)

  const porcentajeMermas =
    totalProduccion > 0
      ? ((data?.data.actual.mermas || 0) / totalProduccion) * 100
      : 0

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Dashboard /{' '}
            {establishment?.data.establecimiento?.nombre || 'Establecimiento'}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#252525] tracking-tight">
            {primerNombre ? `¡Bienvenido ${primerNombre}!` : 'Reporte Mensual'}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        <StatCard
          title="Sólidos"
          value={data?.data.actual.quesos}
          unit=" Kg"
          trend={
            data?.data.variaciones.quesos != null
              ? {
                  value: data.data.variaciones.quesos,
                  isPositive: data.data.variaciones.quesos >= 0,
                }
              : null
          }
          description={'vs ' + data?.data.mesPrevio}
          isPending={isPending}
        />

        <StatCard
          title="Líquidos"
          value={data?.data.actual.leches}
          trend={
            data?.data.variaciones.leches != null
              ? {
                  value: data.data.variaciones.leches,
                  isPositive: data.data.variaciones.leches >= 0,
                }
              : null
          }
          unit="L"
          description={'vs ' + data?.data.mesPrevio}
          isPending={isPending}
        />

        <StatCard
          title="Mermas totales"
          value={porcentajeMermas.toFixed(2)}
          unit="%"
          trend={
            data?.data.variaciones.costos != null
              ? {
                  value: data?.data.variaciones.mermas,
                  isPositive: data?.data.variaciones.mermas <= 0,
                }
              : null
          }
          description={`vs ${data?.data.mesPrevio}`}
          isPending={isPending}
        />

        <StatCard
          title="Costos totales"
          value={data?.data.actual.costos}
          unit="$ "
          trend={
            data?.data.variaciones.costos != null
              ? {
                  value: data.data.variaciones.costos,
                  isPositive: data.data.variaciones.costos <= 0,
                }
              : null
          }
          description={'vs ' + data?.data.mesPrevio}
          isPending={isPending}
        />

        {/*
          TODO (pendiente de backend): "Litros Libres" y "Precio de mercado"
          no existen en /dashboard/mes-actual (dashboardService.listarPorMes).
          Se muestran mockeadas por ahora para respetar el diseño; falta que
          backend agregue estos 2 datos al endpoint.
        */}
        <StatCard
          title="Litros Libres (100% Grasa)"
          value={1850}
          unit="L"
          trend={{ value: 2.5, isPositive: true }}
          description="vs ayer (mock)"
          isPending={false}
        />

        <StatCard
          title="Precio de mercado hoy"
          value={385.5}
          unit="$ "
          isPending={false}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 w-full">
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          <ComparacionHistorica />
          <DailyProductionLog />
        </div>

        <aside className="w-full lg:w-80 shrink-0">
          <AlertsSection />
        </aside>
      </div>
    </div>
  )
}

export default Dashboard
