const GEOREF_BASE = 'https://apis.datos.gob.ar/georef/api/v2.0'

const removeAccents = (str: string) =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

type Option = { id: string; nombre: string }
type LocalityOption = Option & {
  centroide: { lon: number; lat: number }
}

type Provincia = {
  id: string
  nombre: string
  nombre_completo: string
  fuente: string
  categoria: string
  centroide: { lon: number; lat: number }
  iso_id?: string
  iso_nombre?: string
}

type LocalidadCensal = {
  id: string
  nombre: string
  fuente: string
  provincia: { id: string; nombre: string }
  departamento: { id: string; nombre: string }
  gobierno_local: { id: string; nombre: string }
  localidad_censal: { id: string; nombre: string }
  categoria: string
  centroide: { lon: number; lat: number }
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Georef ${url} → ${res.status}`)
  return (await res.json()) as T
}

let provincesCache: Provincia[] | null = null
const localitiesCache = new Map<string, LocalidadCensal[]>()

export const getProvinces = async (name: string = '') => {
  if (!provincesCache) {
    const { provincias } = await getJson<{ provincias: Provincia[] }>(
      `${GEOREF_BASE}/provincias?max=100`
    )
    provincesCache = provincias
  }

  const query = removeAccents(name.toLowerCase().trim())
  if (query === '') return { data: { provincias: provincesCache } }

  const filtered: Option[] = provincesCache
    .filter((prov) => removeAccents(prov.nombre.toLowerCase()).includes(query))
    .map(({ id, nombre }) => ({ id, nombre }))

  return { data: { provincias: filtered } }
}

export const getLocalities = async (id: string, search: string = '') => {
  let localidades = localitiesCache.get(id)
  if (!localidades) {
    const { localidades_censales } = await getJson<{
      localidades_censales: LocalidadCensal[]
    }>(`${GEOREF_BASE}/localidades-censales?provincia=${id}&max=5000`)
    localidades = localidades_censales
    localitiesCache.set(id, localidades)
  }

  const query = removeAccents(search.toLowerCase().trim())
  const seen = new Set<string>()

  const filtered: LocalityOption[] = localidades
    .filter((loc) => removeAccents(loc.nombre.toLowerCase()).includes(query))
    .filter((loc) => {
      if (seen.has(loc.nombre)) return false
      seen.add(loc.nombre)
      return true
    })
    .map(({ id, nombre, centroide }) => ({ id, nombre, centroide }))

  return { data: { municipios: filtered.slice(0, 50) } }
}

export const getLocationCoordinates = async (
  provinceName: string,
  localityName: string
) => {
  const { data: provinceData } = await getProvinces()
  const province = provinceData.provincias.find(
    ({ nombre }) =>
      removeAccents(nombre.toLowerCase().trim()) ===
      removeAccents(provinceName.toLowerCase().trim())
  )

  if (!province) {
    throw new Error(`No se encontró la provincia "${provinceName}"`)
  }

  const { data: localityData } = await getLocalities(province.id, localityName)
  const locality = localityData.municipios.find(
    ({ nombre }) =>
      removeAccents(nombre.toLowerCase().trim()) ===
      removeAccents(localityName.toLowerCase().trim())
  )

  if (!locality) {
    throw new Error(
      `No se encontraron coordenadas para "${localityName}, ${provinceName}"`
    )
  }

  return {
    lat: locality.centroide.lat,
    lon: locality.centroide.lon,
  }
}
