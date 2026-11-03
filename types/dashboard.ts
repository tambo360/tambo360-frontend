export interface GraphParams {
  producto: 'quesos' | 'leches'
  metrica: 'cantidad' | 'mermas' | 'costos'
}

export interface FreeLiters {
  periodo: {
    fechaDesde: string
    fechaHasta: string
  }
  litrosProducidos: number
  precioLitro: number
  costosGenerales: number
  litrosLibres: number
}

export interface MarketPrice {
  precioLitro: number
  mes: number
  anio: number
  ultimaConsulta: string
}
