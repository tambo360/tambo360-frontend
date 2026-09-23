import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AlertCard from '@/components/shared/dashboard/AlertCard'
import { AlertCardSkeleton } from '@/components/shared/dashboard/tambo engine/skeletons/AlertCardSkeleton'
import { useAuth } from '@/context/AuthContext'
import { useLastsAlerts } from '@/hooks/alerts/useLastsAlerts'
import { Alert } from '@/types/alerts'
import { ShieldAlert } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEstablishment } from '@/hooks/establishment/useEstablishment'

const AlertsSection = () => {
  const { user } = useAuth()
  const params = useParams()
  const estId = params?.id as string
  const { data: establishment } = useEstablishment({
    id: estId,
  })
  const { data, isPending } = useLastsAlerts({
    id: establishment?.data.establecimiento?.idEstablecimiento,
  })

  return (
    <Card className="w-full max-w-none">
      <CardContent className="space-y-6 px-0">
        <CardHeader className="flex items-center justify-between w-full">
          <CardTitle className="flex items-center gap-2 font-bold">
            <ShieldAlert
              className={`w-6 text-white ${data?.data.lenght > 0 ? ' fill-red-main' : 'fill-black'}`}
            />{' '}
            Alertas
          </CardTitle>

          {data?.data.length > 0 && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/alertas">Ver todas</Link>
            </Button>
          )}
        </CardHeader>

        <section className="flex flex-col gap-4">
          {isPending ? (
            <>
              <AlertCardSkeleton />
              <AlertCardSkeleton />
            </>
          ) : data?.data.length > 0 ? (
            data?.data.map((alert: Alert) => (
              <AlertCard alert={alert} key={alert.id} />
            ))
          ) : (
            <CardContent className="bg-tables rounded-lg space-y-4 p-4 mx-4">
              <p className="text-[14px]">
                Hola <b>{user!.nombre.split(' ')[0] || user!.nombre}</b>, soy
                TamboEngine.
              </p>
              <p className="text-[14px]">
                Analizare tu producción en búsqueda de desvíos una vez que
                comiences a cargar datos
              </p>
            </CardContent>
          )}
        </section>
      </CardContent>
    </Card>
  )
}
export default AlertsSection
