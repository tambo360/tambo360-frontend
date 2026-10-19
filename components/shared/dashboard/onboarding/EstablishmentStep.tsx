'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateOrganization } from '@/hooks/organization/useCreateOrganization'
import { createOrganization } from '@/types/organization'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

function EstablishmentStep() {
  const { mutate, isPending, error, isSuccess } = useCreateOrganization()
  const [url, setUrl] = useState('')
  const navigate = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { name: '' },
    resolver: zodResolver(createOrganization),
  })

  const onSubmit = handleSubmit((data) => {
    mutate(data.name, {
      onSuccess: (res) => {
        setUrl(
          '/organizaciones/' +
            res.data.idOrganizacion +
            '/' +
            res.data.idEstablecimiento +
            '/cuestionario'
        )
      },
    })
  })

  if (isSuccess) {
    return (
      <div className="rounded-[14px] relative max-w-150 p-10 bg-white flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-[#29845A33] pointer-events-none" />
        <div className="flex items-center justify-center">
          <img
            src="/logos/tambo-logo-360.png"
            alt="logo"
            width={320}
            height={76}
            className="h-10.75 w-auto"
          />
        </div>
        <img src="/successIcon.svg" alt="success" className="size-32" />
        <div className="grid place-items-center text-center space-y-2">
          <h2 className="text-3xl text-center w-full font-bold tracking-tight text-[#0B1001] max-w-81.25">
            Establecimiento creado correctamente!
          </h2>
          <p className="text-sm">
            Ya puedes comenzar a configurar tu establencimiento
          </p>
        </div>
        <Button
          variant="darkGreen"
          className="flex items-center gap-2 h-10 w-42 px-6 mt-8"
          onClick={() => navigate.push(url)}
        >
          Continuar <ArrowRight className="size-4" />
        </Button>
      </div>
    )
  }

  return (
    <>
      <Card className="w-full max-w-150 border-none shadow-2xl py-8 bg-white/95 backdrop-blur-md rounded-lg relative">
        <CardContent className="space-y-8">
          <div className="flex flex-col">
            <div className="flex items-center justify-center py-2">
              <img
                src="/logos/isotipo_tambo_1.png"
                alt="logo"
                width={786}
                height={786}
                className="w-22 h-auto"
              />
            </div>
            <h3 className="text-center text-2xl font-bold text-[#0B1001]">
              Crear Nuevo
            </h3>
          </div>
          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="org-name">Nombre del establecimiento</Label>
              <Input
                id="org-name"
                placeholder="Ingrese el nombre del establecimiento"
                {...register('name')}
                disabled={isPending}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {error?.response?.data?.message && (
              <p className="text-sm text-red-500">
                {error.response.data.message ||
                  'Ocurrió un error al crear la organización. Por favor, inténtelo de nuevo.'}
              </p>
            )}

            <div className="flex items-center justify-center w-full pt-2">
              <Button
                variant="darkGreen"
                className="w-33.25 h-12.5"
                type="submit"
                disabled={isPending}
              >
                {isPending ? 'Creando...' : 'Aceptar'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  )
}

export default EstablishmentStep
