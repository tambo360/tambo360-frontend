import { useQuery } from '@tanstack/react-query'
import { useConfiguration } from '@/hooks/establishment/useConfiguration'
import { getLocationCoordinates } from '@/utils/api/ubication.api'

interface WeatherData {
  temperature: number
  description: string
  location: string
}

export function useWeather() {
  const {
    data: configuration,
    isLoading: isLoadingConfiguration,
    error: configurationError,
  } = useConfiguration()

  const province = configuration?.data?.provincia
  const locality = configuration?.data?.localidad

  const weatherQuery = useQuery({
    queryKey: ['weather', province, locality],
    queryFn: async (): Promise<WeatherData> => {
      if (!province || !locality) {
        throw new Error('El establecimiento no tiene una ubicación configurada')
      }

      const { lat, lon } = await getLocationCoordinates(province, locality)
      // Usamos Open-Meteo (gratis, sin API key)
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      )

      if (!response.ok) throw new Error('Error al obtener el clima')

      const data: {
        current_weather?: { temperature: number; weathercode: number }
      } = await response.json()
      if (!data.current_weather) {
        throw new Error('La respuesta del clima no contiene datos actuales')
      }

      // Mapear códigos de weather a descripciones
      const weatherCodes: Record<number, string> = {
        0: 'Despejado',
        1: 'Parcialmente nublado',
        2: 'Nublado',
        3: 'Muy nublado',
        45: 'Niebla',
        48: 'Niebla con escarcha',
        51: 'Llovizna ligera',
        53: 'Llovizna moderada',
        55: 'Llovizna densa',
        61: 'Lluvia débil',
        63: 'Lluvia moderada',
        65: 'Lluvia fuerte',
        71: 'Nieve débil',
        73: 'Nieve moderada',
        75: 'Nieve fuerte',
        95: 'Tormenta',
      }

      const temp = Math.round(data.current_weather.temperature)
      const code = data.current_weather.weathercode
      const description = weatherCodes[code] || 'Despejado'

      return {
        temperature: temp,
        description,
        location: `${locality}, ${province}`,
      }
    },
    enabled: !!province && !!locality,
    staleTime: 10 * 60 * 1000, // Actualizar cada 10 minutos
    refetchOnWindowFocus: false,
  })

  return {
    ...weatherQuery,
    isLoading: isLoadingConfiguration || weatherQuery.isLoading,
    error: configurationError ?? weatherQuery.error,
  }
}
