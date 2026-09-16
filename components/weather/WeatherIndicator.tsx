import {
  Cloud,
  CloudRain,
  CloudSnow,
  Droplets,
  Fog,
  Sun,
  Thermometer,
  Umbrella,
} from 'lucide-react'
import { useWeather } from '@/hooks/weather/useWeather'
import { Loader2 } from 'lucide-react'

export function WeatherIndicator() {
  const { data: weather, isLoading, error } = useWeather()

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
        <span className="text-xs text-gray-500">Cargando clima...</span>
      </div>
    )
  }

  if (error || !weather) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
        <span className="text-xs text-gray-500">Sin datos de clima</span>
      </div>
    )
  }

  // Icono según el clima
  const getWeatherIcon = (description: string) => {
    if (description.includes('Despejado'))
      return <Sun className="w-4 h-4 text-yellow-500" />
    if (description.includes('nublado'))
      return <Cloud className="w-4 h-4 text-gray-500" />
    if (description.includes('Lluvia') || description.includes('Llovizna'))
      return <CloudRain className="w-4 h-4 text-blue-500" />
    if (description.includes('Nieve'))
      return <CloudSnow className="w-4 h-4 text-blue-300" />
    if (description.includes('Niebla'))
      return <Fog className="w-4 h-4 text-gray-400" />
    if (description.includes('Tormenta'))
      return <Umbrella className="w-4 h-4 text-purple-500" />
    return <Thermometer className="w-4 h-4 text-gray-500" />
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
      {getWeatherIcon(weather.description)}
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-gray-700">
          {weather.temperature}°C
        </span>
        <span className="text-[10px] text-gray-500 leading-none">
          {weather.description}
        </span>
      </div>
    </div>
  )
}
