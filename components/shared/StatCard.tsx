import { AlertCircle } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { formatStatValue } from '@/utils/formatStatValue'

interface StatCardProps {
  title: string
  value?: string | number | null
  /**
   * value: variación con signo (determina la flecha ↑ / ↓)
   * isPositive: si el cambio es "bueno" (determina el color verde / rojo)
   */
  trend?: { value: number; isPositive: boolean } | null
  description?: string
  note?: string
  icon?: React.ReactNode
  unit: string
  isPending?: boolean
}

export const StatCard = ({
  title,
  value,
  trend,
  description,
  note,
  icon,
  unit,
  isPending,
}: StatCardProps) => {
  const { display, full } = formatStatValue(value)
  const isPrefixUnit = unit.trim() === '$'
  const hasValue = display !== '—'

  return (
    <Card
      className={`${trend === null ? 'border-slate-200' : 'border-[#D7ECAF] text-green-main'} min-w-0 overflow-hidden shadow-sm bg-white rounded-xl`}
    >
      <CardContent className="min-w-0 p-5">
        <div className="flex min-w-0 flex-col gap-4">
          {icon}

          <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider font-inter">
            {title}
          </span>

          <div className="flex min-w-0 flex-col gap-1">
            {isPending ? (
              <Skeleton className="h-8 w-[50%]" />
            ) : (
              <span
                className="flex min-w-0 items-baseline gap-1 text-3xl font-bold text-slate-900 tracking-tight font-inter leading-tight"
                title={
                  hasValue
                    ? `${isPrefixUnit ? '$ ' : ''}${full}${isPrefixUnit ? '' : ` ${unit.trim()}`}`
                    : undefined
                }
              >
                {isPrefixUnit && (
                  <span className="shrink-0 whitespace-nowrap">$</span>
                )}
                <span className="min-w-0 truncate">{display}</span>
                {!isPrefixUnit && hasValue && (
                  <span className="shrink-0 whitespace-nowrap">
                    {unit.trim()}
                  </span>
                )}
              </span>
            )}

            {/* Mientras carga no mostramos nada: aún no hay valores para comparar */}
            {!isPending && (trend || note) && (
              <div className="flex items-center gap-1.5 mt-1">
                {trend ? (
                  <div
                    className={`flex items-center gap-1 text-[13px] font-bold ${trend.isPositive ? 'text-green-main' : 'text-red-main'}`}
                  >
                    <span>{trend.value >= 0 ? '↑' : '↓'}</span>
                    <span>{Math.round(Math.abs(trend.value))}%</span>
                    <span className="text-[12px] text-slate-400 font-medium font-inter">
                      {description}
                    </span>
                  </div>
                ) : (
                  <span className="flex items-center gap-1 text-[12px] text-slate-400 font-medium font-inter">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {note}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
