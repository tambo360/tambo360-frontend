// utils/api/animal.api.ts
import { api } from '@/services/api'

export interface Animal {
  idAnimal: string
  codigo: string
  nombre: string
  estado: 'NORMAL' | 'MASTITIS' | 'TRATAMIENTO'
  categoria?: string
  produccionDia?: number
}

export const getAnimals = async (): Promise<Animal[]> => {
  const res = await api.get('/conf/animal/listar')
  return res.data.data // el body real viene envuelto en { success, message, data: [...] }
}
