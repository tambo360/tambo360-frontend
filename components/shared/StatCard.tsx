import { AlertCircle } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

interface StatCardProps {
  title: string
  value: string | number
  trend?: { value: number; isPositive: boolean } | null
  description?: string
  icon?: React.ReactNode
  unit: string
  isPending?: boolean
}

export const StatCard = ({
  title,
  value,
  trend,
  description,
  icon,
  unit,
  isPending,
}: StatCardProps) => {
  return (
    <Card
      className={`${trend === null ? 'border-slate-200' : 'border-[#D7ECAF] text-green-main'} shadow-sm bg-white rounded-xl`}
    >
      <CardContent className="p-5">
        <div className="flex flex-col gap-4">
          {icon}

          <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider font-inter">
            {title}
          </span>

          <div className="flex flex-col gap-1">
            {isPending ? (
              <Skeleton className="h-8 w-[50%]" />
            ) : unit == '$ ' ? (
              <span className="text-3xl font-bold text-slate-900 tracking-tight font-inter line-clamp-2 leading-tight">
                <span className="whitespace-nowrap">{unit}</span>{' '}
                {Number(value).toLocaleString('es-AR')}
              </span>
            ) : (
              <span className="flex text-3xl font-bold text-slate-900 tracking-tight font-inter truncate">
                <span className="text-3xl font-bold text-slate-900 tracking-tight font-inter truncate">
                  {Number(value).toLocaleString('es-AR')}
                </span>
                <span className="whitespace-nowrap">{unit}</span>
              </span>
            )}

            <div className="flex items-center gap-1.5 mt-1">
              {trend != null ? (
                <div
                  className={`flex items-center gap-1 text-[13px] font-bold ${trend.isPositive || (trend.isPositive && (title == 'Mermas Totales' || title == 'Costos totales')) ? 'text-green-main' : 'text-red-main'}`}
                >
                  <span>
                    {trend.isPositive ||
                    title == 'Costos totales' ||
                    title == 'Mermas Totales'
                      ? '↑'
                      : '↓'}
                  </span>
                  <span>{trend.value?.toString().split('.')[0]}% </span>
                  <span className="text-[12px] text-slate-400 font-medium font-inter">
                    {description}
                  </span>
                </div>
              ) : trend === null ? (
                <span className="flex items-center gap-1 text-[12px] text-slate-400 font-medium font-inter">
                  <AlertCircle className="h-4 w-4" />
                  Sin datos suficientes
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
