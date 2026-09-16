import { useQuery } from '@tanstack/react-query'

interface WeatherData {
  temperature: number
  description: string
  location: string
}

// Coordenadas de ejemplo (Curuzú Cuatiá, Corrientes)
// En producción, esto debería venir del perfil del establecimiento
const DEFAULT_COORDS = {
  lat: -29.3333,
  lon: -58.0833,
  location: 'Curuzú Cuatiá, Corrientes',
}

export function useWeather() {
  return useQuery({
    queryKey: ['weather', DEFAULT_COORDS.lat, DEFAULT_COORDS.lon],
    queryFn: async (): Promise<WeatherData> => {
      // Usamos Open-Meteo (gratis, sin API key)
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${DEFAULT_COORDS.lat}&longitude=${DEFAULT_COORDS.lon}&current_weather=true`
      )

      if (!response.ok) throw new Error('Error al obtener el clima')

      const data = await response.json()

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
        location: DEFAULT_COORDS.location,
      }
    },
    staleTime: 10 * 60 * 1000, // Actualizar cada 10 minutos
    refetchOnWindowFocus: false,
  })
}
