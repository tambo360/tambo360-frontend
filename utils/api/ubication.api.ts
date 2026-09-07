import provincesData from '@/utils/assets/ubications/provinces.json'
import localitiesData from '@/utils/assets/ubications/localities.json'

const removeAccents = (str: string) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export const getProvinces = (name: string = '') => {
  const query = removeAccents(name.toLowerCase().trim())

  if (query === '')
    return Promise.resolve({ data: { provincias: provincesData } })

  const filtered = provincesData
    .filter((prov) => removeAccents(prov.nombre.toLowerCase()).includes(query))
    .map((prov) => ({
      id: prov.id,
      nombre: prov.nombre,
    }))

  return Promise.resolve({ data: { provincias: filtered } })
}

export const getLocalities = (id: string, search: string = '') => {
  const query = removeAccents(search.toLowerCase().trim())

  const seen = new Set<string>()
  const filtered = localitiesData
    .filter((loc) => loc.provincia.id === id)
    .filter((loc) => removeAccents(loc.nombre.toLowerCase()).includes(query))
    // El JSON trae localidades homónimas (ej. "Paso Córdova" x2) y los
    // SelectItem usan el nombre como value: duplicados rompen las keys de Radix
    .filter((loc) => {
      if (seen.has(loc.nombre)) return false
      seen.add(loc.nombre)
      return true
    })
    .map((loc) => ({
      id: loc.id,
      nombre: loc.nombre,
    }))

  const limit = 50
  return Promise.resolve({ data: { municipios: filtered.slice(0, limit) } })
}
