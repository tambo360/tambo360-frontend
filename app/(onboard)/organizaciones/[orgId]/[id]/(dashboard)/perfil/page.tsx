'use client'

import type { ReactNode } from 'react'
import { ChevronRight, CircleHelp, LogOut, User } from 'lucide-react'
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
    correo,
    inicial,
    establecimiento,
    showDatos,
    toggleDatos,
    logout,
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
          <dl className="grid gap-3 rounded-lg border border-gray-100 px-4 py-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-gray-400">Nombre</dt>
              <dd className="wrap-break-word font-medium text-gray-800">
                {nombre}
              </dd>
            </div>
            <div>
              <dt className="text-gray-400">Correo</dt>
              <dd className="wrap-break-word font-medium text-gray-800">
                {correo}
              </dd>
            </div>
          </dl>
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
