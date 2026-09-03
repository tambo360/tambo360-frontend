import { BatchFilters } from '@/types/batch'
import { GraphParams } from '@/types/dashboard'

export const baseKeys = {
  auth: ['auth'] as const,
  batch: ['batch'] as const,
  product: ['product'] as const,
  cost: ['cost'] as const,
  generalCost: ['generalCost'] as const,
  province: ['province'] as const,
  locality: ['locality'] as const,
  decrease: ['decrease'] as const,
  dashboard: ['dashboard'] as const,
  alert: ['alert'] as const,
  organization: ['organization'] as const,
  establishment: ['establishment'] as const,
  invitation: ['invitation'] as const,
  breed: ['breed'] as const,
  herd: ['herd'] as const,
} as const

export const authKeys = {
  all: baseKeys.auth,
  login: [...baseKeys.auth, 'login'] as const,
  currentUser: [...baseKeys.auth, 'currentUser'] as const,
  logout: [...baseKeys.auth, 'logout'] as const,
  changePassword: [...baseKeys.auth, 'changePassword'] as const,
} as const

export const batchKeys = {
  all: baseKeys.batch,
  lists: () => [...baseKeys.batch, 'list'] as const,
  filters: (filters: BatchFilters) =>
    [...baseKeys.batch, 'filters', filters] as const,
  detail: (id: string) => [...baseKeys.batch, id] as const,
  day: () => [...baseKeys.batch, 'today'] as const,
} as const

export const productKeys = {
  all: baseKeys.product,
  lists: () => [...baseKeys.product, 'list'] as const,
  detail: (id: string) => [...baseKeys.product, id] as const,
}

export const costKeys = {
  all: baseKeys.cost,
  lists: () => [...baseKeys.cost, 'list'] as const,
  detail: (id: string) => [...baseKeys.cost, id] as const,
}

export const generalCostKeys = {
  all: baseKeys.generalCost,
  lists: () => [...baseKeys.generalCost, 'list'] as const,
  detail: (id: string) => [...baseKeys.generalCost, id] as const,
}

export const provinceKeys = {
  all: baseKeys.province,
  lists: () => [...baseKeys.province, 'list'] as const,
  search: (nombre: string) => [...baseKeys.province, 'search', nombre] as const,
  detail: (id: string) => [...baseKeys.province, id] as const,
}

export const localityKeys = {
  all: baseKeys.locality,
  lists: () => [...baseKeys.locality, 'list'] as const,
  search: (id: string, search: string) =>
    [...baseKeys.locality, 'search', id, search] as const,
  detail: (id: string) => [...baseKeys.locality, id] as const,
}

export const decreaseKeys = {
  all: baseKeys.decrease,
  lists: () => [...baseKeys.decrease, 'list'] as const,
  detail: (id: string) => [...baseKeys.decrease, id] as const,
  types: () => [...baseKeys.decrease, 'types'] as const,
}

export const alertKeys = {
  all: baseKeys.alert,
  lists: () => [...baseKeys.alert, 'list'] as const,
  filters: (range: string) => [...baseKeys.alert, 'filters', range] as const,
  lasts: () => [...baseKeys.alert, 'lasts'] as const,
  noViewed: () => [...baseKeys.alert, 'noViewed'] as const,
  detail: (id: string) => [...baseKeys.alert, id] as const,
}

export const dashboardKeys = {
  graph: (params: GraphParams) =>
    [...baseKeys.dashboard, 'graph', params] as const,
  current: () => [...baseKeys.dashboard, 'current'] as const,
}

export const organizationKeys = {
  all: baseKeys.organization,
  lists: () => [...baseKeys.organization, 'list'] as const,
  detail: (id: string) => [...baseKeys.organization, id] as const,
}

export const establishmentKeys = {
  all: baseKeys.establishment,
  lists: () => [...baseKeys.establishment, 'list'] as const,
  detail: (id: string) => [...baseKeys.establishment, id] as const,
  configuration: () => [...baseKeys.establishment, 'configuration'] as const,
}

export const invitationsKeys = {
  all: baseKeys.invitation,
  lists: () => [...baseKeys.invitation, 'list'] as const,
  detail: (id: string) => [...baseKeys.invitation, id] as const,
}

export const breedKeys = {
  all: baseKeys.breed,
  lists: () => [...baseKeys.breed, 'list'] as const,
}

export const herdKeys = {
  all: baseKeys.herd,
  lists: () => [...baseKeys.herd, 'list'] as const,
}

export const queryKeys = {
  auth: authKeys,
  batch: batchKeys,
  product: productKeys,
  cost: costKeys,
  generalCost: generalCostKeys,
  province: provinceKeys,
  locality: localityKeys,
  decrease: decreaseKeys,
  alert: alertKeys,
  dashboard: dashboardKeys,
  organization: organizationKeys,
  establishment: establishmentKeys,
  invitation: invitationsKeys,
  breed: breedKeys,
  herd: herdKeys,
} as const
