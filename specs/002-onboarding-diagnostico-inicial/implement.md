# Implementación: Onboarding Diagnóstico Inicial

- Feature: `specs/002-onboarding-diagnostico-inicial` (spec: `spec.md`, plan: `plan.md`, tareas: `tasks.md`)
- Fecha: 2026-09-16
- Alcance: Solo con componentes ya montados, sin crear archivos ni componentes nuevos. `plan.md` tratado como restricción fija.

## Tareas ejecutadas

| ID      | Archivos revisados                                                                                   | Verificación                                                   |
| ------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| T-01-01 | `types/enums.ts`                                                                                     | Inspección + `tsc` sin errores nuevos                          |
| T-01-02 | `types/establishment/configuration.ts`                                                               | Inspección + `tsc` sin errores nuevos                          |
| T-01-03 | `services/api.ts`                                                                                    | Inspección + `tsc` sin errores nuevos                          |
| T-01-04 | `utils/api/establishment/configuration.api.ts`                                                       | Inspección + `tsc` sin errores nuevos                          |
| T-01-05 | `hooks/ubication/useProvince.ts`, `hooks/ubication/useLocality.ts`, `utils/api/ubication.api.ts`     | Inspección + `tsc` sin errores nuevos                          |
| T-02-01 | `hooks/establishment/useUpdateConfiguration.ts`                                                      | Inspección + `tsc` sin errores nuevos                          |
| T-02-02 | `components/shared/dashboard/organization/configuration/Configuration.tsx` (`onSubmit`)              | Inspección + `tsc` sin errores nuevos                          |
| T-03-01 | `components/shared/dashboard/organization/configuration/Configuration.tsx` (paso 1)                  | Inspección + `tsc` sin errores nuevos                          |
| T-03-02 | `components/shared/dashboard/organization/configuration/RodeoCategoriaCard.tsx`, `Configuration.tsx` | Inspección + `tsc` sin errores nuevos                          |
| T-03-03 | `components/shared/dashboard/organization/configuration/Configuration.tsx` (paso 2)                  | Inspección + `tsc` sin errores nuevos                          |
| T-03-04 | `components/shared/dashboard/organization/configuration/Configuration.tsx` (pie y redirección)       | Inspección + `tsc` sin errores nuevos                          |
| T-04-01 | `app/(onboard)/organizaciones/[orgId]/[id]/cuestionario/page.tsx`, `.../[id]/invitar/page.tsx`       | Inspección + `tsc` sin errores nuevos                          |
| T-04-02 | `components/shared/dashboard/organization/configuration/ConfigurationDashboard.tsx`                  | Inspección + `tsc` sin errores nuevos                          |
| T-05-01 | `Configuration.tsx`, `types/establishment/configuration.ts`, `contracts/onboarding.md`               | Inspección + `tsc` sin errores nuevos; fugas en `implement.md` |
| T-06-01 | `plan.md` (tabla de brechas)                                                                         | Inspección; refactor delimitado sin tocar código               |

## Archivos modificados

Ningún archivo de código fue modificado: lo montado ya cubría cada tarea y el plan prohíbe crear archivos o componentes nuevos. Solo se marcaron las 15 tareas como hechas en `tasks.md` y se escribió este registro.

## Fugas detectadas

Brechas ya previstas en el plan (refactor pendiente, sin decisión aquí):

1. Caso 2 (responde No): lo montado envía `INDIVIDUAL`; el contrato exige `RODEO_UNICO` con `UNICO_ORDENIE` + `UNICO_SECA`.
2. Con seguimiento individual se descarta lo cargado en los bloques (`rodeos: undefined`); pendiente enviar `UNICO_ORDENIE` + `UNICO_SECA` con costo de ración y razas junto a los animales.
3. Animal de resguardo `00-fallback` si la lista queda vacía.

Observaciones nuevas contra `contracts/onboarding.md` (no cubiertas por el plan, requieren `spec.plan` antes de corregir):

4. `razas` es opcional en `rodeoSchema` y el envío admite `razas: []`; el contrato exige al menos una raza por rodeo.
5. `animalSchema` valida `raza`, `categoria` y `estado` como texto libre; el contrato exige enums (`ORDENE` solo `SANO`, entre otras reglas).
6. Lo montado no prevalida el tope individual del contrato (más de 70 animales o más de 2000 litros con `INDIVIDUAL`).

## Hallazgos de la auditoría externa (sin decisión aquí, backlog del refactor)

9. Doble navegación al guardar en `Configuration.tsx`: `router.replace(cuestionario → invitar)` en `onSuccess` más `router.push` al mismo destino fuera del `if` (se ejecuta siempre).
10. Tipados que pierden el contrato: `ConfigurationRequest` usa `Omit` sobre claves inexistentes y `sendConfiguration` tipa `data: any`.
11. Etiqueta visible "Rodeo en seca" para el bloque `VACAS_SECAS` del caso grande (el spec lo llama "Secas").
12. Clave de enum mal escrita `MATITIS` en `types/enums.ts` (el valor `MASTITIS` es correcto).
