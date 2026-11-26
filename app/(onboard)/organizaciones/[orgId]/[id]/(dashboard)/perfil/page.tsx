'use client'

import type { ReactNode } from 'react'
import { ChevronRight, CircleHelp, Loader2, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { usePerfil } from '@/hooks/profile/usePerfil'

interface PerfilRowProps {
  icon: ReactNode
  label: string
  onClick?: () => void
  disabled?: boolean
  expanded?: boolean
  testId: string
  variant?: 'default' | 'danger'
  showChevron?: boolean
}

function PerfilRow({
  icon,
  label,
  onClick,
  disabled,
  expanded,
  testId,
  variant = 'default',
  showChevron = true,
}: PerfilRowProps) {
  const isDanger = variant === 'danger'

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-expanded={expanded}
      data-test-id={testId}
      className={`flex w-full items-center gap-3 rounded-lg p-2 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
        isDanger
          ? 'bg-red-50 font-bold text-red-600 hover:bg-red-100'
          : 'bg-[#F1F5F9] text-gray-600 hover:bg-gray-200/70'
      }`}
    >
      <span
        className={`flex size-9 shrink-0 items-center justify-center rounded-md ${
          isDanger ? 'bg-red-100 text-red-600' : 'bg-slate-200/70 text-gray-500'
        }`}
      >
        {icon}
      </span>
      <span className="grow">{label}</span>
      {showChevron && (
        <ChevronRight
          className={`size-5 shrink-0 text-gray-400 transition-transform ${
            expanded ? 'rotate-90' : ''
          }`}
        />
      )}
    </button>
  )
}

export default function PerfilPage() {
  const {
    nombre,
    inicial,
    establecimiento,
    verificado,
    showDatos,
    toggleDatos,
    logout,
    register,
    errors,
    onSubmit,
    isPending,
    hasChanges,
    correoCambio,
    notice,
  } = usePerfil()

  return (
    <section className="mx-auto flex w-full max-w-xl flex-col items-center gap-6 py-4 sm:py-10">
      <div
        aria-hidden
        className="flex size-20 items-center justify-center rounded-full bg-[#D7ECAF] text-3xl font-semibold text-[#669213] sm:size-24 sm:text-4xl"
      >
        {inicial}
      </div>

      <div className="text-center">
        <h1 className="wrap-break-word text-2xl font-bold text-gray-900 sm:text-3xl">
          {nombre}
        </h1>
        <p className="mt-1 text-sm text-gray-500 sm:text-base">
          {establecimiento}
        </p>
      </div>

      <div className="flex w-full flex-col gap-2 rounded-xl bg-white p-3 shadow-sm">
        <PerfilRow
          icon={<User className="size-4" />}
          label="Datos personales"
          onClick={toggleDatos}
          expanded={showDatos}
          testId="perfil-datos-personales"
        />

        {showDatos && (
          <form
            onSubmit={onSubmit}
            noValidate
            className="flex flex-col gap-4 rounded-lg border border-gray-100 px-4 py-4"
          >
            {!verificado && (
              <p
                role="status"
                className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800"
              >
                Tu correo está pendiente de verificación. Revisa tu bandeja de
                entrada y confirma con el link que te enviamos.
              </p>
            )}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="perfil-nombre" className="text-sm text-gray-600">
                Nombre
              </Label>
              <Input
                id="perfil-nombre"
                autoComplete="name"
                disabled={isPending}
                {...register('nombre')}
              />
              {errors.nombre && (
                <small className="text-red-700">{errors.nombre.message}</small>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="perfil-correo" className="text-sm text-gray-600">
                Correo
              </Label>
              <Input
                id="perfil-correo"
                type="email"
                autoComplete="email"
                disabled={isPending}
                {...register('correo')}
              />
              {errors.correo && (
                <small className="text-red-700">{errors.correo.message}</small>
              )}
            </div>

            {correoCambio && (
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="perfil-contrasena"
                  className="text-sm text-gray-600"
                >
                  Contraseña actual
                </Label>
                <Input
                  id="perfil-contrasena"
                  type="password"
                  autoComplete="current-password"
                  disabled={isPending}
                  {...register('contraseñaActual')}
                />
                <small className="text-gray-500">
                  La necesitamos para confirmar el cambio de correo. Te
                  enviaremos un link de verificación al correo nuevo.
                </small>
                {errors.contraseñaActual && (
                  <small className="text-red-700">
                    {errors.contraseñaActual.message}
                  </small>
                )}
              </div>
            )}

            {errors.root?.serverError && (
              <small role="alert" className="text-red-700">
                {errors.root.serverError.message}
              </small>
            )}

            {notice && (
              <p
                role="status"
                className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-800"
              >
                {notice}
              </p>
            )}

            <Button
              type="submit"
              disabled={isPending || !hasChanges}
              data-test-id="perfil-guardar"
              className="h-11 w-full bg-[#659711] font-semibold text-white hover:bg-[#537d0d]"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                'Guardar cambios'
              )}
            </Button>
          </form>
        )}

        <PerfilRow
          icon={<CircleHelp className="size-4" />}
          label="Ayuda y soporte"
          disabled
          testId="perfil-ayuda-soporte"
        />

        <PerfilRow
          icon={<LogOut className="size-4" />}
          label="Cerrar sesión"
          onClick={logout}
          variant="danger"
          showChevron={false}
          testId="perfil-cerrar-sesion"
        />
      </div>
    </section>
  )
}
