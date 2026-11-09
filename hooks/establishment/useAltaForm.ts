'use client'

import { useCallback, useEffect, useState } from 'react'
import { getAltaFormData, postAltaAnimal } from '@/utils/api/catalog.api'

export interface Opcion {
  label: string
  value: string
}

export interface RodeoDestino {
  idRodeo: string
  label: string
}

// Campos del alta en modo RODEO / RODEO_UNICO (diseño de Figma)
export interface AnimalRodeoForm {
  categoria: string
  estado: string
  raza: string
  peso: string
}

export interface AnimalForm {
  codigo: string
  nombre: string
  categoria: string
  estado: string
  raza: string
  fechaNacimiento: string
}

interface Params {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
  motivoInicial?: string
}

/**
 * PENDIENTE DE BACKEND (Facu):
 * Mientras no confirme que `POST /conf/animal` acepta `categoria`, `estado`
 * y `peso` en modo rodeo, esos campos se muestran en el modal pero NO se
 * envían, para no recibir un 400 por campos desconocidos. Cuando lo
 * confirme, pasa esta constante a `true` y ajusta los nombres en `submit`.
 */
const ENVIAR_CAMPOS_DEL_DISENO = false

// ─── Helpers ───────────────────────────────────

function leerLabel(x: any, fallback = ''): string {
  if (!x) return fallback
  if (typeof x === 'string') return x
  return x.label ?? x.nombre ?? x.value ?? fallback
}

function mensajeError(e: any, fallback: string): string {
  return e?.response?.data?.message ?? e?.message ?? fallback
}

function aOpciones(lista: any): Opcion[] {
  if (!Array.isArray(lista)) return []
  return lista.map((x: any) => ({
    label: x.label ?? x.nombre ?? x.value,
    value: String(x.value ?? x.id),
  }))
}

const ANIMAL_RODEO_VACIO: AnimalRodeoForm = {
  categoria: '',
  estado: '',
  raza: '',
  peso: '',
}

const ANIMAL_VACIO: AnimalForm = {
  codigo: '',
  nombre: '',
  categoria: '',
  estado: '',
  raza: '',
  fechaNacimiento: '',
}

export function useAltaForm({
  open,
  onClose,
  onSuccess,
  motivoInicial,
}: Params) {
  const [loadingForm, setLoadingForm] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Opciones que vienen del backend (GET /conf/animal/alta/form-data)
  const [tipoSeguimiento, setTipoSeguimiento] = useState('')
  const [tipoMovimiento, setTipoMovimiento] = useState('INGRESO')
  const [motivos, setMotivos] = useState<Opcion[]>([])
  const [rodeos, setRodeos] = useState<RodeoDestino[]>([])
  const [razas, setRazas] = useState<Opcion[]>([])
  const [categorias, setCategorias] = useState<Opcion[]>([])
  const [estadosSanitarios, setEstadosSanitarios] = useState<Opcion[]>([])

  // Valores del formulario (comunes)
  const [motivo, setMotivo] = useState('')
  const [observacion, setObservacion] = useState('')

  // Valores del formulario (modo rodeo / rodeo único)
  const [destino, setDestino] = useState('')
  const [rodeoAnimal, setRodeoAnimal] = useState<AnimalRodeoForm>({
    ...ANIMAL_RODEO_VACIO,
  })

  // Valores del formulario (modo individual)
  const [animal, setAnimal] = useState<AnimalForm>({ ...ANIMAL_VACIO })

  useEffect(() => {
    if (!open) return
    let activo = true

    const cargar = async () => {
      try {
        setLoadingForm(true)
        setFormError(null)
        setError(null)
        const data: any = await getAltaFormData()
        if (!activo) return

        const listaMotivos = aOpciones(data?.motivos)

        setTipoSeguimiento(
          data?.tipoSeguimiento ?? data?.tipo_seguimiento ?? ''
        )
        setTipoMovimiento(data?.tipoMovimiento ?? 'INGRESO')
        setMotivos(listaMotivos)
        setRazas(aOpciones(data?.razas))
        setCategorias(aOpciones(data?.Categorias ?? data?.categorias))
        setEstadosSanitarios(
          aOpciones(
            data?.EstadoSanitarios ?? data?.estadosSanitarios ?? data?.estados
          )
        )
        setRodeos(
          (data?.rodeos ?? []).map((r: any) => ({
            idRodeo: String(r.idRodeo ?? r.id),
            label: leerLabel(r.TipoRodeo ?? r.tipoRodeo) || r.label || 'Rodeo',
          }))
        )

        // Reinicia el formulario; si el botón pasó un motivo, lo preselecciona
        setMotivo(
          motivoInicial && listaMotivos.some((m) => m.value === motivoInicial)
            ? motivoInicial
            : ''
        )
        setObservacion('')
        setDestino('')
        setRodeoAnimal({ ...ANIMAL_RODEO_VACIO })
        setAnimal({ ...ANIMAL_VACIO })
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

  // ─── Campos del animal (modo rodeo / rodeo único) ───
  const setCampoRodeo = (campo: keyof AnimalRodeoForm, valor: string) =>
    setRodeoAnimal((prev) => ({ ...prev, [campo]: valor }))

  // ─── Campos del animal (modo individual) ───────
  const setCampoAnimal = (campo: keyof AnimalForm, valor: string) =>
    setAnimal((prev) => ({ ...prev, [campo]: valor }))

  // ─── Derivados ─────────────────────────────────
  const esIndividual = tipoSeguimiento === 'INDIVIDUAL'
  const sinOpciones = !loadingForm && !formError && motivos.length === 0

  // ─── Enviar ────────────────────────────────────
  const submit = useCallback(async () => {
    setError(null)

    if (!motivo) {
      setError('Seleccioná un motivo.')
      return
    }

    let payload: any

    if (esIndividual) {
      if (!animal.codigo.trim() && !animal.nombre.trim()) {
        setError('Ingresá el código o el nombre del animal.')
        return
      }
      if (!animal.categoria || !animal.estado || !animal.raza) {
        setError('Completá categoría, estado sanitario y raza.')
        return
      }

      payload = {
        tipoSeguimiento,
        tipo: tipoMovimiento,
        motivo,
        observacion: observacion.trim() || undefined,
        animales: [
          {
            codigo: animal.codigo.trim(),
            nombre: animal.nombre.trim(),
            categoria: animal.categoria,
            estado: animal.estado,
            raza: animal.raza,
            fechaNacimiento: animal.fechaNacimiento || undefined,
          },
        ],
      }
    } else {
      if (!destino) {
        setError('Seleccioná el destino.')
        return
      }
      if (!rodeoAnimal.raza) {
        setError('Seleccioná la raza.')
        return
      }

      const peso = rodeoAnimal.peso.trim()
      if (peso && !(Number(peso) > 0)) {
        setError('El peso debe ser un número mayor a 0.')
        return
      }

      payload = {
        tipoSeguimiento,
        tipo: tipoMovimiento,
        motivo,
        destino,
        // El diseño no tiene cantidad: cada alta es de un animal.
        // (Pendiente de confirmar con Lorena y backend.)
        razas: [{ raza: rodeoAnimal.raza, cantVacas: 1 }],
        observacion: observacion.trim() || undefined,
      }

      if (ENVIAR_CAMPOS_DEL_DISENO) {
        payload.categoria = rodeoAnimal.categoria || undefined
        payload.estado = rodeoAnimal.estado || undefined
        payload.peso = peso ? Number(peso) : undefined
      }
    }

    try {
      setSubmitting(true)
      await postAltaAnimal(payload)
      onSuccess?.()
      onClose()
    } catch (e) {
      setError(mensajeError(e, 'No se pudo registrar el alta.'))
    } finally {
      setSubmitting(false)
    }
  }, [
    motivo,
    observacion,
    esIndividual,
    animal,
    destino,
    rodeoAnimal,
    tipoSeguimiento,
    tipoMovimiento,
    onSuccess,
    onClose,
  ])

  return {
    loadingForm,
    formError,
    sinOpciones,
    esIndividual,
    submitting,
    error,

    // opciones
    motivos,
    rodeos,
    razas,
    categorias,
    estadosSanitarios,

    // comunes
    motivo,
    setMotivo,
    observacion,
    setObservacion,

    // rodeo / rodeo único
    destino,
    setDestino,
    rodeoAnimal,
    setCampoRodeo,

    // individual
    animal,
    setCampoAnimal,

    submit,
  }
}
