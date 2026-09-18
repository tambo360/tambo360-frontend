export enum Unidad {
  KG = 'kg',
  LITROS = 'litros',
}
export type Moneda = 'USD' | 'EUR' | 'ARS'

export type Categoria = 'quesos' | 'leches'

export type TipoToken = 'verificacion' | 'recuperacion'

export enum TipoSeguimiento {
  RODEO = 'RODEO',
  INDIVIDUAL = 'INDIVIDUAL',
  RODEO_UNICO = 'RODEO_UNICO',
}

export enum CategoriaAnimal {
  ORDENE = 'ORDENE',
  SECAS = 'SECAS',
}

export enum EstadoAnimal {
  MATITIS = 'MASTITIS',
  TRATAMIENTO = 'TRATAMIENTO',
  PREPARTO = 'PREPARTO',
  SANO = 'SANO',
}

export enum TipoMerma {
  MASTITIS = 'MASTITIS',
  ESTRES_CALORICO = 'ESTRES_CALORICO',
  DERRAME_EN_ORDENE = 'DERRAME_EN_ORDENE',
  FALLA_EQUIPO = 'FALLA_EQUIPO',
  RECHAZO_ANTIBIOTICOS = 'RECHAZO_ANTIBIOTICOS',
  ACIDOSIS_RUMINAL = 'ACIDOSIS_RUMINAL',
  PERDIDA_EN_TRANSPORTE = 'PERDIDA_EN_TRANSPORTE',
  VENCIMIENTO_PRODUCTO = 'VENCIMIENTO_PRODUCTO',
  DANO_POR_MANIPULACION = 'DANO_POR_MANIPULACION',
  DISCREPANCIA_INVENTARIO = 'DISCREPANCIA_INVENTARIO',
  MERMA_DESCONOCIDA = 'MERMA_DESCONOCIDA',
  OTRO = 'OTRO',
}

export enum TipoDestino {
  TANQUE_FRIO = 'TANQUE_FRIO',
  VENTA = 'VENTA',
  FABRICA_QUESOS = 'FABRICA_QUESOS',
}

export enum TipoRodeo {
  ALTA_PRODUCCION = 'ALTA_PRODUCCION',
  BAJA_PRODUCCION = 'BAJA_PRODUCCION',
  VACAS_SECAS = 'VACAS_SECAS',
  UNICO_ORDENIE = 'UNICO_ORDENIE',
  UNICO_SECA = 'UNICO_SECA',
}

export type ConceptoCosto =
  | 'insumos_basicos'
  | 'leche_cruda'
  | 'cuajo_y_fermentos'
  | 'refrigeracion'

export enum TipoCosto {
  ALIMENTACION = 'ALIMENTACION',
  SANIDAD = 'SANIDAD',
  MANO_OBRA = 'MANO_OBRA',
  ENERGIA = 'ENERGIA',
  MANTENIMIENTO = 'MANTENIMIENTO',
  LOGISTICA = 'LOGISTICA',
  OTRO = 'OTRO',
}

export enum GeneralCostType {
  LOGISTICA = TipoCosto.LOGISTICA,
  MANTENIMIENTO = TipoCosto.MANTENIMIENTO,
  OTRO = TipoCosto.OTRO,
  PERSONAL = 'PERSONAL',
  SERVICIOS = 'SERVICIOS',
  VETERINARIO = 'VETERINARIO',
  INMUEBLE = 'INMUEBLE',
}
export type RolOrganizacion = 'ORG_OWNER' | 'ORG_ADMIN' | 'MEMBER'

export type RolEstablecimiento = 'OWNER' | 'ADMIN' | 'EMPLOYEE'

export enum InvitationRole {
  EMPLOYEE = 'EMPLOYEE',
  ADMIN = 'ADMIN',
}

export type EstadoInvitacion = 'pendiente' | 'aceptada' | 'rechazada'

export enum TipoOrdenie {
  BALDE = 'balde',
  LINEA = 'linea',
  ESPINA_DE_PESCADO = 'espina_de_pescado',
  ROTATIVO = 'rotativo',
  MANUAL = 'manual',
  OTRO = 'otro',
}

export enum VentaLeche {
  USINA = 'USINA',
  COOPERATIVA = 'COOPERTIVA',
  ELABORACION_PROPIA = 'ELABORACION_PROPIA',
  VENTA_DIRECTA_MERCADO_LOCAL = 'VENTA_DIRECTA_MERCADO_LOCAL',
}

export enum RazasVacas {
  HOLANDO_ARGENTINO = 'HOLANDO_ARGENTINO',
  JERSEY = 'JERSEY',
  PARDO_SUIZO = 'PARDO_SUIZO',
  GIR_LECHERO = 'GIR_LECHERO',
  HOLANDO_JERSEY_CRUZA = 'HOLANDO_JERSEY_CRUZA',
  AYRSHIRE = 'AYRSHIRE',
  NORMANDO = 'NORMANDO',
  BROWN_SWISS = 'BROWN_SWISS',
  MONTBELIARDE = 'MONTBELIARDE',
  SIMMENTAL_LECHERO = 'SIMMENTAL_LECHERO',
  OTRAS = 'OTRAS',
}

export type NivelAlerta = 'bajo' | 'medio' | 'alto'
