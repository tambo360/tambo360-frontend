# Tareas: Onboarding Diagnóstico Inicial

- Feature: `specs/002-onboarding-diagnostico-inicial` (spec: `spec.md`, plan: `plan.md`)
- Fecha: 2026-09-16
- Alcance: Solo con componentes ya montados, sin crear archivos ni componentes nuevos. Verificar que lo montado cubre el spec y el contrato `contracts/onboarding.md`; la refactorización queda **Pendiente**. Sin decisiones nuevas de diseño.

## Base: tipos, red y catálogos

### [x] T-01-01 · Catálogos de enums

- **Acción**: Verificar en `types/enums.ts` que existen `TipoOrdenie`, `VentaLeche`, `TipoRodeo`, `TipoSeguimiento`, `RazasVacas`, `CategoriaAnimal` y `EstadoAnimal` con los valores del contrato.
- **Resultado**: Los catálogos del diagnóstico y del inventario quedan confirmados sin listas paralelas.
- **Depende de**: ninguna
- **Verificación**: hecha por inspección y `tsc` sin errores nuevos.

### [x] T-01-02 · Esquemas del cuestionario

- **Acción**: Verificar en `types/establishment/configuration.ts` el `configurationSchema` (línea base, rodeos con costo de ración y razas, animales(lectura)) y el tipo `ConfigurationRequest` con `TipoSeguimiento`.
- **Resultado**: Los esquemas quedan verificados; se registran diferencias contra el contrato (razas opcional, raza/categoría/estado como texto libre) en `implement.md`.
- **Depende de**: T-01-01
- **Verificación**: hecha por inspección y `tsc` sin errores nuevos.

### [x] T-01-03 · Instancia central de red

- **Acción**: Verificar `services/api.ts` (credenciales y contexto para el envío autenticado).
- **Resultado**: La base de red para el cuestionario queda confirmada.
- **Depende de**: ninguna
- **Verificación**: hecha por inspección y `tsc` sin errores nuevos.

### [x] T-01-04 · Puerta de salida del cuestionario

- **Acción**: Verificar `utils/api/establishment/configuration.api.ts` como único punto de consumo de `POST /establecimiento/cuestionario`.
- **Resultado**: El endpoint del plan queda centralizado en una sola puerta de salida.
- **Depende de**: T-01-03
- **Verificación**: hecha por inspección y `tsc` sin errores nuevos.

### [x] T-01-05 · Cascada de ubicación

- **Acción**: Verificar `hooks/ubication/useProvince`, `hooks/ubication/useLocality`, `utils/api/ubication.api.ts` y `utils/assets/ubications/` (Localidad deshabilitada sin Provincia y limpiada al cambiarla).
- **Resultado**: La cascada Provincia y Localidad queda confirmada con mensajes junto al campo.
- **Depende de**: ninguna
- **Verificación**: hecha por inspección y `tsc` sin errores nuevos.

## Envío

### [x] T-02-01 · Mutación de registro

- **Acción**: Verificar `hooks/establishment/useUpdateConfiguration.ts` (envío único, carga y error con mensaje del backend).
- **Resultado**: El envío expone pendiente y error para el asistente.
- **Depende de**: T-01-04
- **Verificación**: hecha por inspección y `tsc` sin errores nuevos.

### [x] T-02-02 · Mapeo de casos a TipoSeguimiento

- **Acción**: Verificar en `Configuration.tsx` (`onSubmit`) el armado del envío: `INDIVIDUAL` con animales para tambo pequeño, `RODEO` con rodeos completos para mediano/grande, y totales derivados de la suma de razas.
- **Resultado**: El mapeo montado queda verificado: colapsa los Casos 1 y 2 a `INDIVIDUAL` (ignora `registrarRodeo`); la brecha del Caso 2 queda registrada en el plan.
- **Depende de**: T-02-01
- **Verificación**: hecha por inspección y `tsc` sin errores nuevos.

## Asistente montado

### [x] T-03-01 · Línea base y perfilado

- **Acción**: Verificar en `Configuration.tsx` el paso 1: ubicación, ordeñes por día (1-3), tipo de ordeñe (6 opciones), litros, destino (4 opciones), DEL, precio, pregunta de registro en tambo pequeño y perfilado por litros.
- **Resultado**: Los ocho campos del spec quedan verificados con validación junto al campo.
- **Depende de**: T-01-02
- **Verificación**: hecha por inspección y `tsc` sin errores nuevos.

### [x] T-03-02 · Bloques por escala

- **Acción**: Verificar `RodeoCategoriaCard.tsx` y su uso en `Configuration.tsx`: dos bloques (`UNICO_ORDENIE` + `UNICO_SECA`) o tres (`ALTA_PRODUCCION` + `BAJA_PRODUCCION` + `VACAS_SECAS`), con costo de ración, razas y total por bloque.
- **Resultado**: Los bloques fijos y la suma frente al total quedan confirmados.
- **Depende de**: T-03-01
- **Verificación**: hecha por inspección y `tsc` sin errores nuevos.

### [x] T-03-03 · Carga individual del Caso 1

- **Acción**: Verificar en `Configuration.tsx` el paso 2: tabla de animales (código, nombre, raza, categoría, estado), añadir, quitar y contador de registros.
- **Resultado**: La carga individual con su progreso queda confirmada.
- **Depende de**: T-03-01
- **Verificación**: hecha por inspección y `tsc` sin errores nuevos.

### [x] T-03-04 · Navegación y estados del asistente

- **Acción**: Verificar el pie del asistente en `Configuration.tsx`: Cancelar/Atrás, Siguiente/Finalizar, bloqueo con `isPending`, exigencia de al menos un animal en el paso 2, mensaje de error del backend y redirección a invitar al guardar.
- **Resultado**: Los estados quedan verificados; la exigencia de al menos un animal es solo de UI (el envío admite el resguardo `00-fallback`, brecha registrada).
- **Depende de**: T-02-01
- **Verificación**: hecha por inspección y `tsc` sin errores nuevos.

## Rutas y valores visibles

### [x] T-04-01 · Ruta del cuestionario

- **Acción**: Verificar que `app/(onboard)/organizaciones/[orgId]/[id]/cuestionario/page.tsx` monta `Configuration` como diagnóstico previo al resto del flujo.
- **Resultado**: El marco bloqueante del diagnóstico queda confirmado.
- **Depende de**: T-03-04
- **Verificación**: hecha por inspección y `tsc` sin errores nuevos.

### [x] T-04-02 · Valores visibles en Configuración

- **Acción**: Verificar que lo guardado se refleja en la Configuración montada (`ConfigurationDashboard.tsx` con pestañas General y Catálogo).
- **Resultado**: Lo visible del spec queda confirmado sin duplicar pantallas.
- **Depende de**: T-04-01
- **Verificación**: hecha por inspección y `tsc` sin errores nuevos.

## Conformidad con el contrato

### [x] T-05-01 · Conformidad del envío con el contrato

- **Acción**: Verificar el envío armado contra `contracts/onboarding.md`: rodeos con costo de ración y al menos una raza positiva, animales con categoría y estado válidos, totales por suma de razas, tope individual (70 animales, 2000 litros) y `ORDENE` solo `SANO`.
- **Resultado**: La conformidad y las brechas del plan quedan confirmadas punto por punto.
- **Depende de**: T-02-02
- **Verificación**: hecha por inspección y `tsc` sin errores nuevos; brechas y fugas registradas en `implement.md`.

## Refactor pendiente

### [x] T-06-01 · Brechas registradas para el refactor

- **Acción**: Dejar registradas las tres brechas del plan (Caso 2 como `RODEO_UNICO`, rodeos junto al seguimiento individual y animal de resguardo) como alcance del refactor futuro, sin tocar código.
- **Resultado**: El refactor pendiente queda delimitado y trazable al plan.
- **Depende de**: T-05-01
- **Verificación**: hecha por inspección y `tsc` sin errores nuevos.
