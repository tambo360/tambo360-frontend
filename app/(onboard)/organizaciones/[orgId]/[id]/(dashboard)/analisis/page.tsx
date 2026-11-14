'use client'
import ComparacionHistorica from '@/components/shared/dashboard/ComparacionHistorica'
import DailyProductionLog from '@/components/shared/dashboard/DailyProductionLog'
import AlertsSection from '@/components/shared/dashboard/AlertsSection'
import { useCurrentMonth } from '@/hooks/dashboard/useCurrentMonth'
import { useFreeLiters } from '@/hooks/dashboard/useFreeLiters'
import { useMarketPrice } from '@/hooks/dashboard/useMarketPrice'
import { useCurrentUser } from '@/hooks/auth/useCurrentUser'
import { useGeneralCostsSummary } from '@/hooks/generalCost/useGeneralCostsSummary'
import { useMonthPeriod } from '@/hooks/generalCost/useMonthPeriod'
import { StatCard } from '@/components/shared/StatCard'
import { useEstablishment } from '@/hooks/establishment/useEstablishment'
import { useParams } from 'next/navigation'

const Dashboard = () => {
  const { data, isPending } = useCurrentMonth()
  const {
    data: freeLiters,
    isPending: isFreeLitersPending,
    error: freeLitersError,
  } = useFreeLiters()
  const {
    data: marketPrice,
    isPending: isMarketPricePending,
    error: marketPriceError,
  } = useMarketPrice()
  const { period } = useMonthPeriod()
  const { data: costsSummary, isPending: isCostsPending } =
    useGeneralCostsSummary(period)
  const params = useParams()
  const estId = params?.id as string
  const { data: establishment } = useEstablishment({
    id: estId,
  })
  const { data: currentUser } = useCurrentUser()
  const primerNombre = currentUser?.data?.nombre?.split(' ')[0]
  const totalProduccion =
    (data?.data.actual.quesos || 0) + (data?.data.actual.leches || 0)

  const porcentajeMermas =
    totalProduccion > 0
      ? ((data?.data.actual.mermas || 0) / totalProduccion) * 100
      : 0

  // Costos del mes: costos directos de lotes (/dashboard/mes-actual)
  // + total del resumen de costos generales (alimentación + gastos manuales)
  const costosTotales =
    (Number(data?.data.actual.costos) || 0) + (costsSummary?.gastoTotal ?? 0)

  const freeLitersNote = freeLitersError
    ? (freeLitersError.response?.data?.message ??
      'No se pudo calcular los litros libres')
    : undefined

  // 503 = el backend todavía no tiene un precio nacional válido guardado
  const marketPriceNote = marketPriceError
    ? marketPriceError.response?.status === 503
      ? 'Aún no hay un precio de mercado disponible'
      : (marketPriceError.response?.data?.message ??
        'No se pudo obtener el precio de mercado')
    : undefined

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

      {/* Grid de 5 tarjetas, como en el diseño */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
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
            data?.data.variaciones.mermas != null
              ? {
                  value: data.data.variaciones.mermas,
                  isPositive: data.data.variaciones.mermas <= 0,
                }
              : null
          }
          description={`vs ${data?.data.mesPrevio}`}
          isPending={isPending}
        />

        <StatCard
          title="Costos totales"
          value={costosTotales}
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
          isPending={isPending || isCostsPending}
        />

        {/* Conectado a GET /dashboard/litros-libres (sin variación en el backend) */}
        <StatCard
          title="Litros Libres (100% Grasa)"
          value={Math.round(freeLiters?.litrosLibres ?? 0)}
          unit="L"
          note={freeLitersNote}
          isPending={isFreeLitersPending}
        />

        {/* Conectado a GET /dashboard/precio-mercado (precio nacional, ARS/L) */}
        <StatCard
          title="Precio de mercado hoy"
          value={marketPrice ? marketPrice.precioLitro.toFixed(2) : '—'}
          unit="$ "
          description={
            marketPrice
              ? `Precio nacional ${marketPrice.mes}/${marketPrice.anio}`
              : undefined
          }
          note={marketPriceNote}
          isPending={isMarketPricePending}
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
