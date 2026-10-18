'use client'

import { useEffect, useMemo, useState } from 'react'
import { getBajaFormData, deleteBajaAnimal } from '@/utils/api/catalog.api'

export interface Opcion {
  label: string
  value: string
}

export interface RazaOrigen {
  idRaza: string
  value: string
  label: string
  cantVacas: number
}

export interface RodeoOrigen {
  idRodeo: string
  label: string
  cantVacas: number
  razas: RazaOrigen[]
}

// 👇 NUEVA INTERFAZ PARA ANIMALES INDIVIDUALES
export interface AnimalOpcion {
  idAnimal: string
  nombre: string
  codigo: string
}

interface Params {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
  motivoInicial?: string
}

function leerLabel(x: any, fallback = ''): string {
  if (!x) return fallback
  if (typeof x === 'string') return x
  return x.label ?? x.nombre ?? x.value ?? fallback
}

function leerValue(x: any): string {
  return x && typeof x === 'object' ? (x.value ?? '') : ''
}

function aEnum(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '_')
}

function mensajeError(e: any, fallback: string): string {
  return e?.response?.data?.message ?? e?.message ?? fallback
}

function normalizarRodeo(r: any): RodeoOrigen {
  return {
    idRodeo: String(r.idRodeo ?? r.id),
    label: leerLabel(r.TipoRodeo ?? r.tipoRodeo) || r.label || 'Rodeo',
    cantVacas: Number(r.cantVacas ?? 0),
    razas: (r.razas ?? []).map((rz: any) => {
      const label = leerLabel(rz.nombre ?? rz.raza, 'Raza')
      return {
        idRaza: String(rz.idRaza ?? rz.id),
        value: leerValue(rz.nombre) || rz.value || aEnum(label),
        label,
        cantVacas: Number(rz.cantVacas ?? 0),
      }
    }),
  }
}

export function useBajaForm({
  open,
  onClose,
  onSuccess,
  motivoInicial,
}: Params) {
  const [loadingForm, setLoadingForm] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [tipoSeguimiento, setTipoSeguimiento] = useState('')
  const [tipoMovimiento, setTipoMovimiento] = useState('EGRESO')
  const [motivos, setMotivos] = useState<Opcion[]>([])
  const [rodeos, setRodeos] = useState<RodeoOrigen[]>([])

  // 👇 NUEVO ESTADO PARA ANIMALES INDIVIDUALES
  const [animales, setAnimales] = useState<AnimalOpcion[]>([])

  // Valores del formulario
  const [motivo, setMotivo] = useState('')
  const [observacion, setObservacion] = useState('')
  const [origen, setOrigen] = useState('')
  const [idRaza, setIdRaza] = useState('')
  const [cantidad, setCantidad] = useState('')

  // 👇 NUEVO ESTADO PARA EL ID DEL ANIMAL SELECCIONADO
  const [animalId, setAnimalId] = useState('')

  useEffect(() => {
    if (!open) return
    let activo = true

    const cargar = async () => {
      try {
        setLoadingForm(true)
        setFormError(null)
        setError(null)
        const data: any = await getBajaFormData()
        if (!activo) return

        const listaMotivos: Opcion[] = (data?.motivos ?? []).map((m: any) => ({
          label: m.label ?? m.value,
          value: m.value,
        }))

        setTipoSeguimiento(
          data?.tipoSeguimiento ?? data?.tipo_seguimiento ?? ''
        )
        setTipoMovimiento(data?.tipoMovimiento ?? 'EGRESO')
        setMotivos(listaMotivos)
        setRodeos((data?.rodeos ?? []).map(normalizarRodeo))

        // 👇 GUARDAMOS LOS ANIMALES SI VIENEN EN LA RESPUESTA
        const listaAnimales: AnimalOpcion[] = (data?.animales ?? []).map(
          (a: any) => ({
            idAnimal: String(a.idAnimal ?? a.id),
            nombre: a.nombre ?? '',
            codigo: a.codigo ?? '',
          })
        )
        setAnimales(listaAnimales)

        // Reinicia formulario
        setMotivo(
          motivoInicial && listaMotivos.some((m) => m.value === motivoInicial)
            ? motivoInicial
            : ''
        )
        setObservacion('')
        setOrigen('')
        setIdRaza('')
        setCantidad('')
        setAnimalId('') // 👈 Reiniciamos el animal
      } catch (e) {
        if (activo)
          setFormError(mensajeError(e, 'No se pudieron cargar las opciones.'))
      } finally {
        if (activo) setLoadingForm(false)
      }
    }

    cargar()
    return () => {
      activo = false
    }
  }, [open, motivoInicial])

  const cambiarOrigen = (v: string) => {
    setOrigen(v)
    setIdRaza('')
    setCantidad('')
  }
  const cambiarRaza = (v: string) => {
    setIdRaza(v)
    setCantidad('')
  }

  const esIndividual = tipoSeguimiento === 'INDIVIDUAL'
  const sinOpciones = !loadingForm && !formError && motivos.length === 0

  const rodeosConAnimales = useMemo(
    () => rodeos.filter((r) => r.cantVacas > 0),
    [rodeos]
  )

  const razasDisponibles = useMemo(
    () =>
      (rodeos.find((r) => r.idRodeo === origen)?.razas ?? []).filter(
        (rz) => rz.cantVacas > 0
      ),
    [rodeos, origen]
  )

  const grupo = razasDisponibles.find((rz) => rz.idRaza === idRaza)
  const maxCantidad = grupo?.cantVacas

  // ─── Enviar ────────────────────────────────────
  const submit = async () => {
    setError(null)

    if (!motivo) {
      setError('Seleccioná un motivo.')
      return
    }

    let payload: any = {
      tipoSeguimiento,
      tipo: tipoMovimiento,
      motivo,
      observacion: observacion.trim() || undefined,
    }

    // 👇 LÓGICA PARA INDIVIDUAL
    if (esIndividual) {
      if (!animalId) {
        setError('Seleccioná un animal para dar de baja.')
        return
      }
      // El backend está validando la propiedad "animal" (singular)
      payload.animal = animalId
    }
    // 👇 LÓGICA PARA RODEO
    else {
      if (!origen) {
        setError('Seleccioná el rodeo de origen.')
        return
      }
      if (!grupo) {
        setError('Seleccioná la raza a dar de baja.')
        return
      }
      const cant = Number(cantidad)
      if (!Number.isInteger(cant) || cant < 1) {
        setError('La cantidad debe ser un número entero mayor a 0.')
        return
      }
      if (cant > grupo.cantVacas) {
        setError(
          `Solo hay ${grupo.cantVacas} animales de esa raza en el rodeo.`
        )
        return
      }

      payload.origen = origen
      payload.raza = {
        idRaza: grupo.idRaza,
        raza: grupo.value,
        cantVacas: cant,
      }
    }

    try {
      setSubmitting(true)
      await deleteBajaAnimal(payload)
      onSuccess?.()
      onClose()
    } catch (e) {
      setError(mensajeError(e, 'No se pudo registrar la baja.'))
    } finally {
      setSubmitting(false)
    }
  }

  return {
    loadingForm,
    formError,
    sinOpciones,
    esIndividual,
    submitting,
    error,

    motivos,
    rodeosConAnimales,
    razasDisponibles,
    maxCantidad,

    // 👇 EXPONEMOS LOS ANIMALES Y SU ESTADO AL MODAL
    animales,
    animalId,
    setAnimalId,

    motivo,
    setMotivo,
    observacion,
    setObservacion,
    origen,
    cambiarOrigen,
    idRaza,
    cambiarRaza,
    cantidad,
    setCantidad,

    submit,
  }
}
