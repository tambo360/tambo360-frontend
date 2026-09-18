# Especificación: Onboarding Diagnóstico Inicial

- Fecha: 2026-09-16
- Status: Pendiente
- Alcance: Frontend con envío al backend según `contracts/onboarding.md` (`POST /establecimiento/cuestionario`). Sin integración con inteligencia artificial en esta entrega.

## Resumen

| Historia                                                        | Prioridad | Estado    |
| --------------------------------------------------------------- | --------- | --------- |
| US-01 · Capturar diagnóstico inicial                            | P1        | Se cumple |
| US-02 · Perfilar escala y ofrecer registro del rodeo            | P1        | Se cumple |
| US-03 · Caso 1: inventario individual en Rodeo Único            | P1        | Pendiente |
| US-04 · Caso 2: solo total de cabezas en Rodeo Único            | P1        | Se cumple |
| US-05 · Caso 3: dividir en Alto, Bajo y Secas                   | P1        | Se cumple |
| US-06 · Separar lo visible en Configuración de lo solo-contexto | P2        | Se cumple |

## Historias de usuario

### US-01 · Capturar diagnóstico inicial · Prioridad: P1 · Estado: Borrador

Como responsable del tambo, quiero completar mi configuración inicial obligatoria para que el sistema adapte la interfaz a mi escala.

Criterios de aceptación:

- El formulario pide: Provincia (desplegable), Localidad (desplegable), veces de ordeñe por día (1, 2, 3), tipo de ordeñe (Balde, Línea, Espina de pescado, Rotativo, Manual, Otro), litros promedio por día (numérico), destino del producto (Industria Grande, Cooperativa Lechera, Quesería / Elaboración propia, Venta directa / Mercado Local), DEL promedio del rodeo en días (numérico) y precio por litro cobrado (numérico).
- Localidad depende de Provincia: sin Provincia no se puede elegir Localidad, y al cambiar Provincia se limpia Localidad.
- Los campos numéricos solo aceptan valores mayores que cero; cada dato inválido se señala junto a su campo.
- No se puede avanzar sin completar todos los campos obligatorios.

### US-02 · Perfilar escala y ofrecer registro del rodeo · Prioridad: P1 · Estado: Borrador

Como responsable de un tambo pequeño, quiero que el sistema me pregunte si deseo registrar mi rodeo para elegir el nivel de detalle de mi inventario.

Criterios de aceptación:

- Con menos de 2000 litros/día, el sistema clasifica como tambo pequeño y muestra la pregunta: "¿Querés registrar tu rodeo?" (Sí / No).
- Con 2000 litros/día o más, el sistema clasifica como mediano/grande y no muestra esa pregunta.
- La clasificación se recalcula si el usuario cambia litros antes de confirmar.
- El sistema agrupa los animales en dos únicos bloques llamados "Rodeo Único" y "Rodeo en Secas" para tambos pequeños.

### US-03 · Caso 1: inventario individual en Rodeo Único · Prioridad: P1 · Estado: Borrador

Como responsable de un tambo pequeño que respondió Sí, quiero cargar mi inventario vaca por vaca para llevar el detalle de cada animal.

Criterios de aceptación:

- Al responder Sí, el sistema habilita la carga individual de animales y tambien el registro de totales de raciones y razas(tipo y cantidades) en los bloque de "Rodeo Único". y "Rodeo en Secas".
- Cada animal cargado queda asociado a los bloques de "Rodeo Único" y "Rodeo en Secas", todo dentro del tipo de seguimiento individual.
- El usuario puede ver la cantidad de animales cargados frente al total de los bloques.
- El usuario puede avanzar y volver atrás y cambiar su respuesta antes de confirmar.

### US-04 · Caso 2: solo total de cabezas en Rodeo Único · Prioridad: P1 · Estado: Borrador

Como responsable de un tambo pequeño que respondió No, quiero registrar solo el número total de cabezas para terminar rápido sin detalle por animal.

Criterios de aceptación:

- Al responder No, el sistema registra únicamente el número total de raciones y razas(tipo y cantidades) en los bloque de "Rodeo Único". y "Rodeo en Secas".
- No se pide ni se muestra detalle por animal.
- El total registrado es la suma de los bloques "Rodeo Único" y "Rodeo en Secas".
- El usuario NO puede avanzar, queda solo las opciones de cancelar o confirmar.

### US-05 · Caso 3: dividir en Alto, Bajo y Secas · Prioridad: P1 · Estado: Borrador

Como responsable de un tambo mediano/grande, quiero repartir mi inventario en los tres bloques fijos para reflejar mi escala.

Criterios de aceptación:

- En tambos medianos/grandes el sistema oculta la opción de registro individual y exige repartir el total en tres bloques fijos: Rodeo Alto, Rodeo Bajo y Secas.
- Cada bloque pide su cantidad de cabezas y solo acepta valores mayores o iguales a cero.
- La suma de los tres bloques es el total del inventario (cabezas, raciones y razas con cantidades).
- Si la suma no coincide, se muestra un aviso y no se permite confirmar.

### US-06 · Separar lo visible en Configuración de lo solo-contexto · Prioridad: P2 · Estado: Borrador

Como responsable del tambo, quiero que parte de mi diagnóstico se muestre en Configuración y el resto quede como contexto para que la experiencia sea coherente.

Criterios de aceptación:

- Se muestran en Configuración y pueden modificarse: Provincia, Localidad, veces de ordeñe por día, tipo de ordeñe y litros promedio por día.
- No se muestran en la interfaz pero quedan guardados como contexto: destino del producto, DEL promedio, precio por litro e inventario inicial (bloques y cantidades).
- Al completar el diagnóstico, los valores visibles aparecen ya cargados en Configuración.
- El diagnóstico se arma del lado cliente y se registra con `POST /establecimiento/cuestionario` según `contracts/onboarding.md`.

## Problema

Sin una configuración inicial obligatoria, el sistema no conoce la escala ni la línea base productiva del tambo. Afecta al responsable del tambo, que ve una interfaz genérica, y a la asistencia inteligente, que opera sin contexto del establecimiento.

## Requisitos funcionales

- Diagnóstico obligatorio con flujo guiado por pasos previo al uso, con los ocho campos de US-01.
- Catálogos cerrados: frecuencia (1, 2, 3), tipo de ordeñe (6 opciones), destino (4 opciones); Provincia y Localidad en cascada.
- Regla de perfilado: pequeño con menos de 2000 litros/día; mediano/grande con 2000 litros/día o más; el límite de 2000 es exclusivo.
- Casos 1, 2 y 3 excluyentes según la regla; bloques con nombres exactos ("Rodeo Único", "Rodeo en Secas", "Rodeo Alto", "Rodeo Bajo", "Secas").
- División visible / solo-contexto según US-06, con envío al backend según el contrato.

## Casos borde

- Con exactamente 2000 litros/día el tambo clasifica como mediano/grande (límite exclusivo).
- El usuario cambia litros después de elegir Sí/No o de repartir bloques: se reevalúa el caso y se conservan los datos ya ingresados cuando sigan siendo válidos.
- Tipo de ordeñe "Otro" no pide detalle adicional en esta entrega.
- Localidad con el mismo nombre en varias provincias: la lista muestra cada nombre una sola vez por provincia seleccionada.
- Recarga o abandono a mitad del diagnóstico: se conserva lo ingresado al navegar entre los pasos del asistente hasta confirmar o cancelar.

## Fuera de alcance

- Sincronización entre dispositivos y edición del inventario vaca por vaca en detalle.
- Cálculo de costos, reportes, alertas y cualquier integración con inteligencia artificial.
- Registro con cuentas externas, gestión de organizaciones e invitaciones.
- Modificación del inventario inicial una vez confirmado, más allá de lo visible en Configuración.

## Supuestos

- El diagnóstico se arma del lado cliente y se registra con `POST /establecimiento/cuestionario` según `contracts/onboarding.md`.
- El diagnóstico es bloqueante: sin completarlo no se habilita el resto de la experiencia.
- Los valores numéricos usan las mismas unidades del enunciado: litros por día, días de DEL y precio por litro en moneda local.

## Pendiente y refactorización futura

> Lo listado aquí no forma parte de esta entrega. Es el alcance del refactor futuro, para su observación o modificación pendiente.

1. Caso 2 (responde No): enviarse como `RODEO_UNICO` con `UNICO_ORDENIE` + `UNICO_SECA` (lo montado envía `INDIVIDUAL`).
2. Con seguimiento individual, enviar también los rodeos "Rodeo Único" y "Rodeo en Secas" con costo de ración y razas junto a los animales (lo montado los descarta).
3. Sin animal de resguardo: exigir al menos un animal o enviar totales (lo montado usa `00-fallback`).
4. Al menos una raza por rodeo, enums en los animales, tope individual y regla `ORDENE` solo `SANO` según el contrato.
