import {
  Cloud,
  CloudRain,
  CloudSnow,
  CloudFog,
  Sun,
  Thermometer,
  Umbrella,
  Loader2,
} from 'lucide-react'
import { useWeather } from '@/hooks/weather/useWeather'

export function WeatherIndicator() {
  const { data: weather, isLoading, error } = useWeather()

  // Estado de carga
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
        <span className="text-xs text-gray-500">Cargando clima...</span>
      </div>
    )
  }

  // Estado de error o sin datos
  if (error || !weather) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
        <span className="text-xs text-gray-500">Sin datos de clima</span>
      </div>
    )
  }

  // ✅ Mejora: Función para obtener el icono con manejo de mayúsculas/minúsculas y accesibilidad
  const getWeatherIcon = (description: string) => {
    const desc = description.toLowerCase()

    if (desc.includes('despejado') || desc.includes('soleado')) {
      return (
        <Sun className="w-4 h-4 text-yellow-500" aria-label="Clima despejado" />
      )
    }
    if (desc.includes('nublado') || desc.includes('parcialmente')) {
      return (
        <Cloud className="w-4 h-4 text-gray-500" aria-label="Clima nublado" />
      )
    }
    if (desc.includes('lluvia') || desc.includes('llovizna')) {
      return <CloudRain className="w-4 h-4 text-blue-500" aria-label="Lluvia" />
    }
    if (desc.includes('nieve')) {
      return <CloudSnow className="w-4 h-4 text-blue-300" aria-label="Nieve" />
    }
    if (desc.includes('niebla') || desc.includes('bruma')) {
      return <CloudFog className="w-4 h-4 text-gray-400" aria-label="Niebla" />
    }
    if (desc.includes('tormenta') || desc.includes('trueno')) {
      return (
        <Umbrella className="w-4 h-4 text-purple-500" aria-label="Tormenta" />
      )
    }

    // Fallback por defecto
    return (
      <Thermometer className="w-4 h-4 text-gray-500" aria-label="Temperatura" />
    )
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
      {getWeatherIcon(weather.description)}
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-gray-700">
          {weather.temperature}°C
        </span>
        <span className="text-[10px] text-gray-500 leading-none capitalize">
          {weather.description}
        </span>
      </div>
    </div>
  )
}
