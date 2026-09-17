'use client'
import { useState } from 'react'
import { Trash } from 'lucide-react'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useDeleteBatch } from '@/hooks/batch/useDeleteBatch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Lote } from '@/types/batch'

interface DeleteBatchProps {
  batch: Lote
  onSuccess?: () => void
}

const DeleteBatch = ({ batch, onSuccess }: DeleteBatchProps) => {
  const [showDialog, setShowDialog] = useState(false)
  const { mutateAsync, isPending, error } = useDeleteBatch()

  const handleDelete = async () => {
    try {
      await mutateAsync({ id: batch.idLote })
      setShowDialog(false)
      onSuccess?.()
    } catch (error) {
      console.warn('Error al eliminar:', error)
    }
  }
  console.log(
    isPending,
    batch.costosDirectos != undefined,
    batch.mermas != undefined,
    batch.estado
  )
  return (
    <>
      <DropdownMenuItem
        onSelect={(e) => {
          e.preventDefault()
          setShowDialog(true)
        }}
        disabled={
          isPending ||
          batch.costosDirectos != undefined ||
          (batch.mermas?.length ?? 0) > 0 ||
          batch.estado
        }
      >
        <Trash className="h-4 w-4" />
        Eliminar
      </DropdownMenuItem>

      <ConfirmDeleteDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={handleDelete}
        isLoading={isPending}
        title="¿Deseas eliminar este lote?"
        description="Al eliminar este lote, toda su información dejará de estar disponible para consulta y edición. Los registros de costos y producción asociados se ocultarán del panel principal."
        buttonText="Eliminar lote"
        error={error?.response?.data.message}
      />
    </>
  )
}

export default DeleteBatch

export interface ConfirmDeleteDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isLoading?: boolean
  title: string
  description: string
  error?: string
  buttonText?: string
}

export const ConfirmDeleteDialog = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  title,
  description,
  error,
  buttonText = 'Eliminar',
}: ConfirmDeleteDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-10 flex flex-col items-center text-center bg-[#FFFBF1]">
        <img src="/alertIcon.svg" className="size-36" />

        <DialogHeader>
          <DialogTitle className="text-[32px] font-bold leading-tight mb-4 text-center">
            {title}
          </DialogTitle>

          <DialogDescription className="text-center text-base text-gray-600">
            {description}
          </DialogDescription>

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </DialogHeader>

        <div className="flex flex-col w-full gap-3 mt-8">
          <Button
            variant="warning"
            className="h-14 text-lg"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Eliminando...' : buttonText}
          </Button>

          <Button
            variant="ghost"
            className="h-14 text-lg font-bold border border-black"
            onClick={onClose}
          >
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
