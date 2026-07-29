'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import ChangeBatch from '@/components/shared/dashboard/batch/ChangeBatch'
import CompleteBatch from '@/components/shared/dashboard/batch/CompleteBatch'
import { ConfirmDeleteDialog } from '@/components/shared/dashboard/batch/DeleteBatch'
import ChangeCost from '@/components/shared/dashboard/cost/ChangeCost'
import CostTable from '@/components/shared/dashboard/cost/CostTable'
import ChangeDecrease from '@/components/shared/dashboard/decrease/ChangeDecrease'
import DecreaseTable from '@/components/shared/dashboard/decrease/DecreaseTable'
import { StatCard } from '@/components/shared/StatCard'
import { AlertCardBatch } from '@/components/shared/dashboard/batch/AlertCardBatch'
import { useBatch } from '@/hooks/batch/useBatch'
import { useDeleteBatch } from '@/hooks/batch/useDeleteBatch'
import { Alert } from '@/types/alerts'
import { Droplet, Factory, TrendingDown, ChevronLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

interface BatchDetailsProps {
  id: string
}

export default function BatchDetails({ id }: BatchDetailsProps) {
  const [isChangeDecreaseOpen, setIsChangeDecreaseOpen] = useState(false)
  const [isChangeCostOpen, setIsChangeCostOpen] = useState(false)
  const [isChangeBatchOpen, setIsChangeBatchOpen] = useState(false)
  const [isCompleteBatchOpen, setIsCompleteBatchOpen] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState(false)

  const { data: batch, isPending, refetch } = useBatch({ id: id })
  const { mutateAsync, isPending: isPendingDelete, error } = useDeleteBatch()
  const navigate = useRouter()
  const pathname = usePathname()
  // Quita "/lote/[loteId]" del final para volver al listado de producción
  const produccionUrl = pathname.split('/').slice(0, -2).join('/')

  useEffect(() => {
    const hash = window.location.hash
    if (isPending || !hash) return

    const target = hash.replace('#', '')
    const timeout = setTimeout(() => {
      document
        .getElementById(target)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)

    return () => clearTimeout(timeout)
  }, [isPending])

  const handleDelete = async () => {
    try {
      await mutateAsync({ id: batch!.data.idLote })
      setDeleteDialog(false)
      navigate.push('/produccion')
    } catch (error) {
      console.warn('Error al eliminar:', error)
    }
  }

  if (isPending) {
    return (
      <div className="min-h-screen space-y-6 animate-pulse w-full">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 w-full">
            <div className="h-5 w-20 bg-gray-200 rounded-full" />
            <div className="h-9 w-72 bg-gray-200 rounded-lg" />
            <div className="h-4 w-40 bg-gray-200 rounded" />
          </div>
          <div className="flex items-center justify-end gap-2 w-full mt-2 sm:mt-0">
            <div className="h-12 w-36 bg-gray-200 rounded-lg" />
            <div className="h-12 w-36 bg-gray-200 rounded-lg" />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="border rounded-xl p-4 flex flex-col gap-3 bg-white"
              >
                <div className="h-8 w-8 bg-gray-200 rounded-lg" />
                <div className="h-4 w-28 bg-gray-200 rounded" />
                <div className="h-7 w-20 bg-gray-200 rounded" />
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <div className="h-16 w-full bg-gray-100 rounded-2xl" />
          </div>

          {[0, 1].map((i) => (
            <div key={i} className="border rounded-xl bg-white py-2">
              <div className="border-b border-gray-100 px-4 py-2 flex items-center justify-between">
                <div className="h-5 w-36 bg-gray-200 rounded" />
                <div className="flex gap-2">
                  <div className="h-10 w-10 bg-gray-200 rounded-lg" />
                  <div className="h-10 w-36 bg-gray-200 rounded-lg" />
                </div>
              </div>
              <div className="p-4 flex flex-col gap-3">
                {Array.from({ length: 2 }).map((_, j) => (
                  <div key={j} className="h-12 w-full bg-gray-100 rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const alertas: Alert[] = batch!.data?.alertas ?? []

  return (
    <div className="min-h-screen space-y-6 w-full">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-[#959595]">
          {batch!.data?.establecimiento?.nombre || 'Establecimiento'}
        </p>
        <Link
          href={produccionUrl}
          className="flex items-center gap-1 text-sm text-[#959595] hover:text-black transition-colors w-fit"
        >
          <ChevronLeft className="size-4" />
          Lista de producción
        </Link>
      </div>

      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-0.5 w-full">
          <Badge variant={batch!.data?.estado ? 'success' : 'destructive'}>
            {batch!.data?.estado ? 'Completo' : 'Incompleto'}
          </Badge>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-[32px] font-bold">
              Lote {String(batch!.data?.numeroLote).padStart(3, '0')} -{' '}
              {batch!.data?.producto?.nombre}
            </h1>
          </div>
          <p className="text-[#959595]">
            Inicio:{' '}
            {batch!.data?.fechaProduccion
              .slice(0, 10)
              .split('-')
              .reverse()
              .join('/')}
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 w-full">
          <Button
            className="h-12 w-full max-w-36"
            onClick={() => setIsCompleteBatchOpen(true)}
            disabled={batch!.data?.estado}
          >
            Completar lote
          </Button>

          <Button
            variant="outline"
            className="h-12 w-full max-w-36"
            onClick={() => setIsChangeBatchOpen(true)}
            disabled={batch!.data?.estado}
          >
            Editar lote
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatCard
            icon={<Droplet />}
            title="Cantidad Producida"
            value={batch!.data?.cantidad}
            unit=" L"
          />
          <StatCard
            icon={<Factory />}
            title="Costo Operativo Total"
            value={
              batch!.data?.costosDirectos
                ? batch!.data.costosDirectos
                    .reduce((total, costo) => total + Number(costo.monto), 0)
                    .toString()
                : '0'
            }
            unit="$ "
          />
          <StatCard
            icon={<TrendingDown />}
            title="Merma Registrada"
            value={
              batch!.data.mermas
                ? batch!.data.mermas
                    ?.reduce((total, m) => {
                      const qty =
                        typeof m.cantidad === 'string'
                          ? parseFloat(m.cantidad)
                          : (m.cantidad ?? 0)
                      return total + qty
                    }, 0)
                    .toString()
                : '0'
            }
            unit=" L"
          />
        </div>

        {alertas.length > 0 && (
          <div className="flex flex-col gap-2">
            {alertas.map((alert) => (
              <AlertCardBatch key={alert.id} alert={alert} />
            ))}
          </div>
        )}

        {/*
          TODO (pendiente de backend): no existe el campo "observaciones"
          en el modelo LoteProduccion (prisma/schema.prisma). Por ahora
          se muestra siempre "Sin observaciones." como placeholder visual
          hasta que backend agregue el campo y lo devuelva en /lote/buscar/:idLote.
        */}
        <Card className="p-4">
          <p className="text-md font-bold mb-1">Observaciones</p>
          <p className="text-sm text-[#959595]">Sin observaciones.</p>
        </Card>

        <Card className="py-2" id="mermas">
          <div className="px-4 py-2 flex items-center justify-between gap-3 flex-wrap">
            <p className="text-md font-bold">Historial de mermas</p>
            <div className="flex items-center gap-2">
              {/*  <Button variant="outline" className="h-10">
                <ListFilter className="size-4" />
              </Button> */}
              <Button
                onClick={() => setIsChangeDecreaseOpen(true)}
                disabled={batch!.data?.estado}
              >
                Agregar merma
              </Button>
            </div>
          </div>
          <DecreaseTable batch={batch!.data} isPending={isPending} />
        </Card>

        <Card className="py-2" id="costos">
          <div className="px-4 py-2 flex items-center justify-between gap-3 flex-wrap">
            <p className="text-md font-bold">Historial de costos</p>
            <div className="flex items-center gap-2">
              {/*               <Button variant="outline" className="h-10">
                <ListFilter className="size-4" />
              </Button> */}
              <Button
                onClick={() => setIsChangeCostOpen(true)}
                disabled={batch!.data?.estado}
              >
                Agregar costo
              </Button>
            </div>
          </div>
          <CostTable
            changeCost={() => setIsChangeCostOpen(true)}
            batch={batch!.data}
            disabled={batch!.data?.estado}
            isPending={isPending}
          />
        </Card>

        <Button
          variant="ghost"
          className="h-12 w-full border border-black"
          onClick={() => setDeleteDialog(true)}
          disabled={batch!.data?.estado}
        >
          Eliminar lote
        </Button>
      </div>

      <ConfirmDeleteDialog
        isOpen={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirm={handleDelete}
        isLoading={isPendingDelete}
        title="¿Deseas eliminar este lote?"
        description="Al eliminar este lote, toda su información dejará de estar disponible para consulta y edición. Los registros de costos y producción asociados se ocultarán del panel principal."
        buttonText="Eliminar lote"
        error={error?.response?.data.message}
      />

      <ChangeBatch
        open={isChangeBatchOpen}
        onOpen={() => setIsChangeBatchOpen(true)}
        onClose={() => setIsChangeBatchOpen(false)}
        batch={batch!.data != undefined ? batch!.data : undefined}
      />

      <ChangeDecrease
        open={isChangeDecreaseOpen}
        onClose={() => setIsChangeDecreaseOpen(false)}
        idBatch={batch!.data.idLote}
      />

      <ChangeCost
        open={isChangeCostOpen}
        onClose={() => setIsChangeCostOpen(false)}
        loteId={batch!.data.idLote}
      />

      <CompleteBatch
        open={isCompleteBatchOpen}
        onClose={() => setIsCompleteBatchOpen(false)}
        batchId={id}
        batch={batch!.data}
        refetch={refetch}
      />
    </div>
  )
}
