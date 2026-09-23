'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import TamboEngineCardSkeleton from '@/components/shared/dashboard/tambo engine/skeletons/TamboEngineCardSkeleton'
import TamboEngineCard from '@/components/shared/dashboard/tambo engine/TamboEngineCard'
import { useAlerts } from '@/hooks/alerts/useAlerts'
import { Alert } from '@/types/alerts'
import { Bot, RotateCw } from 'lucide-react'
import React, { useCallback, useState } from 'react'
import { useParams } from 'next/navigation'
import { useEstablishment } from '@/hooks/establishment/useEstablishment'

const TamboEngine: React.FC = () => {
  const [range, setRange] = useState<'7' | '14' | '30'>('7')
  const params = useParams()
  const estId = params?.id as string
  const { data: establishment } = useEstablishment({
    id: estId,
  })
  const { data, isPending, refetch, isFetching } = useAlerts({
    id: establishment?.data.establecimiento?.idEstablecimiento,
    range: range,
  })

  const handleRefetch = useCallback(() => {
    if (!isPending) {
      refetch()
    }
  }, [isPending, refetch])

  return (
    <main className="flex flex-col gap-4">
      <h2 className="text-4xl font-bold">TamboEngine - IA</h2>
      <p>
        TamboEngine analiza automáticamente los datos históricos de producción,
        mermas y costos para identificar patrones atípicos y desvíos relevantes.
        Las alertas generadas son informativas y ayudan a comprender el
        comportamiento productivo sin sustituir el criterio del encargado.
      </p>
      <div className="flex gap-2 items-center">
        <Select
          onValueChange={(e) => setRange(e as '7' | '14' | '30')}
          defaultValue={range}
        >
          <SelectTrigger className="w-fit gap-3 pl-3 pr-2 justify-between">
            <span className="flex items-center gap-1.5">
              Fecha:
              <SelectValue />
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Últimos 7 días</SelectItem>
            <SelectItem value="14">Últimos 14 días</SelectItem>
            <SelectItem value="30">Último mes</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={handleRefetch}
          className={`size-12.5 transition-all duration-500 bg-[#F1F5F9] ${
            isPending || isFetching ? 'opacity-70' : ''
          }`}
          disabled={isPending || isFetching}
        >
          <RotateCw
            className={`transition-transform duration-500 ${
              isPending || isFetching ? 'animate-spin' : ''
            }`}
          />
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        {isPending ? (
          Array.from({ length: 3 }).map((_, i) => (
            <TamboEngineCardSkeleton key={i} />
          ))
        ) : data?.data.length > 0 ? (
          data?.data.map((alert: Alert) => (
            <TamboEngineCard alert={alert} key={alert.id} />
          ))
        ) : (
          <Card className="flex flex-col items-center justify-center gap-6 text-center">
            <div className="flex items-center justify-center">
              <div className="flex items-center justify-center size-16 bg-[#F1F5F9] rounded-md">
                <Bot className="size-6" />
              </div>
            </div>

            <CardContent>
              <h2 className="text-2xl font-semibold text-slate-700">
                Aun no hay análisis disponible
              </h2>

              <p className="text-md text-body-text leading-relaxed">
                TamboEngine necesita al menos 15 lotes <br /> registrados para
                empezar a identificar patrones y <br /> desvíos en tu produccion
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}

export default TamboEngine
