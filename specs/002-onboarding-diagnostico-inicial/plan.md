# Plan: Onboarding Diagnóstico Inicial

- Fecha: 2026-09-16
- Estado: Pendiente.
- Alcance: Solo con componentes ya montados, sin crear archivos ni componentes nuevos. Cubre el diagnóstico inicial obligatorio montado en el cuestionario, el perfilado por escala (Casos 1, 2 y 3) y el inventario inicial por bloques con costo de ración y razas, con envío al backend según el contrato de cuestionario. La refactorización queda pendiente. No incluye inteligencia artificial.

## 1. Resumen

Se reutiliza tal cual el flujo ya montado: la ruta del cuestionario monta `Configuration`, que captura la línea base (ubicación, ordeñes por día, tipo de ordeñe, litros, destino, DEL y precio), perfila por litros (pequeño por debajo de 2000, mediano/grande desde 2000), pregunta si se registra el rodeo en tambos pequeños y reparte el inventario en bloques fijos (`UNICO_ORDENIE` + `UNICO_SECA` o `ALTA_PRODUCCION` + `BAJA_PRODUCCION` + `VACAS_SECAS`) mediante `RodeoCategoriaCard`. El Caso 1 usa el paso 2 de carga individual de animales; los Casos 2 y 3 confirman con totales por bloque. El envío sale por la mutación ya montada hacia `POST /establecimiento/cuestionario` con su `TipoSeguimiento`, y al guardar navega a invitar.

**Pendiente**, Queda pendiente que con seguimiento individual también se envíen los rodeos `UNICO_ORDENIE` y `UNICO_SECA` con todos sus datos (hoy lo montado los descarta con `rodeos: undefined`). Las brechas frente al spec y al contrato quedan registradas abajo como refactorización pendiente, sin código nuevo en esta entrega.

## 2. Arquitectura

### Módulos y servicios

| Módulo / servicio                                                                   | Rol                                                                                                                               |
| ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `app/(onboard)/organizaciones/[orgId]/[id]/cuestionario/page.tsx`                   | Marco del flujo; monta `Configuration` como diagnóstico bloqueante                                                                |
| `components/shared/dashboard/organization/configuration/Configuration.tsx`          | Asistente montado: línea base, preguntas de registro, bloques y carga individual                                                  |
| `components/shared/dashboard/organization/configuration/RodeoCategoriaCard.tsx`     | Tarjeta montada por bloque: total, costo de ración y razas con cantidades                                                         |
| `hooks/establishment/useUpdateConfiguration.ts`                                     | Mutación montada de envío con estados de carga y error del backend                                                                |
| `utils/api/establishment/configuration.api.ts`                                      | Puerta de salida montada hacia el endpoint del contrato                                                                           |
| `services/api.ts`                                                                   | Instancia de red central con credenciales y contexto                                                                              |
| `types/establishment/configuration.ts`                                              | Esquemas montados (`configurationSchema`, `TIPOS_UNICO`) y tipo del envío                                                         |
| `types/enums.ts`                                                                    | Catálogos montados (`TipoOrdenie`, `VentaLeche`, `TipoRodeo`, `TipoSeguimiento`, `RazasVacas`, `CategoriaAnimal`, `EstadoAnimal`) |
| `hooks/ubication/useProvince` + `hooks/ubication/useLocality`                       | Cascada montada de Provincia y Localidad                                                                                          |
| `utils/api/ubication.api.ts` + `utils/assets/ubications/`                           | Catálogos locales de provincias y localidades                                                                                     |
| `components/ui/combobox`, `components/ui/input`, `components/ui/label`              | Controles montados del formulario                                                                                                 |
| `app/(onboard)/organizaciones/[orgId]/[id]/invitar/page.tsx`                        | Destino montado tras guardar desde el cuestionario                                                                                |
| `components/shared/dashboard/organization/configuration/ConfigurationDashboard.tsx` | Configuración montada (pestañas General y Catálogo) donde se ven los valores                                                      |

### Entidades principales

| Entidad              | Descripción                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------ |
| Diagnóstico          | Línea base montada con ubicación, ordeñe, litros, destino, DEL y precio por litro          |
| Perfil de escala     | Resultado por litros: pequeño por debajo de 2000, mediano/grande desde 2000                |
| Bloque de inventario | Agrupación montada con tipo de rodeo fijo, costo de ración y razas con sus cantidades      |
| Animal individual    | Registro montado del Caso 1 con código, nombre, raza, categoría y estado                   |
| Contexto reservado   | Destino, DEL, precio e inventario enviados sin mostrarse como editables en el cuestionario |

### Decisiones clave

| Decisión                                                                                                                    | Justificación breve                                                                 |
| --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| No crear archivos ni componentes nuevos                                                                                     | Lo montado ya cubre el flujo; la refactorización queda **Pendiente**                |
| Reutilizar `Configuration` como único asistente                                                                             | Ya implementa los pasos, el perfilado, los bloques y la carga individual            |
| Reutilizar `RodeoCategoriaCard` para todos los bloques                                                                      | Ya resuelve costo de ración y razas con totales por bloque                          |
| Enviar por la mutación y la puerta de salida montadas                                                                       | Ya apuntan al contrato con sus estados de carga y error                             |
| Mapear cada caso al `TipoSeguimiento` del contrato                                                                          | El backend solo acepta `INDIVIDUAL`, `RODEO_UNICO` o `RODEO` con sus reglas propias |
| Etiquetas de producto mapeadas a enums (`UNICO_ORDENIE`, `UNICO_SECA`, `ALTA_PRODUCCION`, `BAJA_PRODUCCION`, `VACAS_SECAS`) | La interfaz muestra nombres amables y el envío usa los valores exactos del contrato |
| Validar la suma de bloques antes de confirmar                                                                               | El backend calcula el total sumando las razas y rechaza sumas que no coinciden      |
| Prevalidar el límite individual (70 animales, 2000 litros)                                                                  | El backend rechaza el seguimiento individual fuera de ese rango                     |
| Reutilizar la cascada Provincia y Localidad montada                                                                         | Mantiene el limpiado de Localidad y los mensajes junto al campo ya probados         |
| Mostrar los valores en la Configuración montada                                                                             | Cumple lo visible sin duplicar pantallas                                            |

### Brechas conocidas (refactorización pendiente, sin código nuevo aquí)

| Brecha                | Estado montado                                                                        | Esperado según spec y contrato                                                                  |
| --------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Caso 2 (responde No)  | Se envía como `INDIVIDUAL`                                                            | Debe enviarse como `RODEO_UNICO` con `UNICO_ORDENIE` + `UNICO_SECA`                             |
| Animal de resguardo   | Envío con animal `00-fallback` si la lista queda vacía                                | Sin resguardos: exigir al menos un animal o enviar totales                                      |
| Rodeos con individual | Con `INDIVIDUAL` se envía `rodeos: undefined` y se descarta lo cargado en los bloques | Pendiente: enviar `UNICO_ORDENIE` + `UNICO_SECA` con costo de ración y razas junto a `animales` |

> **Refactorización futura (pendiente, fuera de esta entrega):** las 3 brechas de la tabla más 3 observaciones de `implement.md` (razas obligatorias por rodeo, enums en animales, tope individual y regla `ORDENE` solo `SANO`). Ver el detalle en `spec.md` ("Pendiente y refactorización futura") y en `implement.md` ("Fugas detectadas").

## 3. Contratos de API usados o modificados

| Método | Endpoint                        | Auth | Propósito                                                                            |
| ------ | ------------------------------- | ---- | ------------------------------------------------------------------------------------ |
| POST   | `/establecimiento/cuestionario` | Sí   | Registrar el cuestionario con seguimiento, línea base, rodeos o animales y ubicación |

Nota: no se crea ni se modifica ningún endpoint. El detalle de cuerpos, parámetros y respuestas vive en `contracts/onboarding.md`; esta tabla solo indica qué contrato se usa. El envío requiere contexto de organización y establecimiento con roles de `OWNER` o `ADMIN` del establecimiento y `ORG_OWNER` de la organización.

## 4. Archivos nuevos o modificados

No se crea ningún archivo nuevo en esta entrega. Solo se usa lo ya montado:

| Archivo                                                                             | Propósito en esta feature                                           |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `app/(onboard)/organizaciones/[orgId]/[id]/cuestionario/page.tsx`                   | Monta `Configuration` como diagnóstico bloqueante                   |
| `components/shared/dashboard/organization/configuration/Configuration.tsx`          | Línea base, pregunta de registro, bloques, carga individual y envío |
| `components/shared/dashboard/organization/configuration/RodeoCategoriaCard.tsx`     | Carga de costo de ración y razas por bloque con su total            |
| `hooks/establishment/useUpdateConfiguration.ts`                                     | Mutación de registro con carga y lectura de errores del backend     |
| `utils/api/establishment/configuration.api.ts`                                      | Puerta de salida única hacia el endpoint del contrato               |
| `services/api.ts`                                                                   | Instancia de red central con credenciales y contexto                |
| `types/establishment/configuration.ts`                                              | Esquemas y tipos del diagnóstico, los bloques y el envío            |
| `types/enums.ts`                                                                    | Catálogos del diagnóstico y del inventario                          |
| `hooks/ubication/useProvince` + `hooks/ubication/useLocality`                       | Cascada de Provincia y Localidad                                    |
| `utils/api/ubication.api.ts` + `utils/assets/ubications/`                           | Catálogos locales de ubicación                                      |
| `app/(onboard)/organizaciones/[orgId]/[id]/invitar/page.tsx`                        | Destino tras guardar desde el cuestionario                          |
| `components/shared/dashboard/organization/configuration/ConfigurationDashboard.tsx` | Configuración donde se ven los valores guardados                    |

## 5. Módulos y archivos fuera del alcance

Todo lo no listado arriba, incluyendo cualquier archivo o componente nuevo, la refactorización de lo montado (incluidas las brechas de la tabla), los productos asociados al establecimiento (opcionales según el contrato), la sincronización entre dispositivos, la inteligencia artificial, los costos, los reportes, las alertas, la gestión de organizaciones e invitaciones, y la edición del inventario inicial una vez confirmado más allá de lo visible en Configuración.
