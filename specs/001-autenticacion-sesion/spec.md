# Especificación: Autenticación y Sesión

- Fecha: 2026-09-10
- Status: Completado
- Alcance: Solo frontend. Esta especificación solo indica que se cumple el inicio de sesión, el registro, la verificación de correo y, desde el lado frontend, todo lo correspondiente a recuperar-contraseña. No especifica nada más.

## Cumplimiento

| Flujo                                   | Estado    |
| --------------------------------------- | --------- |
| Inicio de sesión (login)                | Se cumple |
| Registro de un nuevo usuario (register) | Se cumple |
| Verificación de correo (lado frontend)  | Se cumple |
| Recuperar contraseña (lado frontend)    | Se cumple |

## Historias de usuario

### US-01 · Registrarme · P1

- Estado: Se cumple

Como usuario, quiero crear mi cuenta con mis datos para poder usar la plataforma.
Al terminar, se me confirma que revise mi correo para activar la cuenta, y si no me llega puedo pedir que me lo reenvíen.

Criterios de aceptación:

- Se piden nombre, correo, contraseña y confirmación, y cada dato inválido se señala junto a su campo.
- La confirmación debe coincidir con la contraseña; si no, se muestra un aviso.
- Mientras se crea la cuenta, el botón muestra que está trabajando y no permite enviar dos veces.
- Al terminar, se confirma y se indica revisar el correo, con opción de reenviar el mensaje.

### US-02 · Verificar mi correo · P1 (lado frontend)

- Estado: Se cumple

Como usuario, quiero activar mi cuenta desde el enlace que recibí para empezar a usar la plataforma.
Si el enlace sirve, se me da la bienvenida; si no sirve o venció, se me explica y se me guía de vuelta al inicio de sesión.

Criterios de aceptación:

- Al abrir el enlace se muestra que la cuenta se está verificando.
- Si la verificación sale bien, se muestra la bienvenida con la opción de continuar.
- Si el enlace no sirve o venció, se muestra un aviso con la opción de volver al inicio de sesión.

### US-03 · Iniciar sesión · P1

- Estado: Se cumple

Como usuario, quiero entrar con mi correo y contraseña para acceder de forma segura.
Si los datos son correctos accedo; si no, recibo un aviso claro. Desde aquí puedo ir a registrarme o a recuperar mi contraseña.

Criterios de aceptación:

- Se piden correo y contraseña, con la opción de mostrar u ocultar la clave.
- Los campos vacíos o con formato inválido se señalan junto a cada campo.
- Mientras se verifica el acceso, el botón muestra que está trabajando y los campos se bloquean.
- Si los datos son incorrectos, se muestra un aviso sin decir cuál de los dos falló.

### US-04 · Recuperar mi contraseña · P2 (lado frontend)

- Estado: Se cumple

Como usuario que olvidó su clave, quiero crear una nueva para recuperar el acceso. Dejo mi correo, recibo un enlace, defino y confirmo mi nueva clave.
Si el enlace no sirve o venció, puedo pedir uno nuevo; al terminar, inicio sesión con mi nueva clave.

Criterios de aceptación:

- Primero se pide solo el correo, se valida su formato y se confirma que se envió la solicitud.
- Después se piden la nueva contraseña y su confirmación, con las mismas reglas que en el registro.
- Si el enlace no sirve o venció, se muestra un aviso con la opción de pedir uno nuevo.
- Al terminar, se confirma el cambio y se ofrece volver al inicio de sesión.

## Casos borde

- Si la persona intenta registrarse con un correo ya usado, ve un aviso claro y conserva los datos que ya ingresó.
- Si la persona abre un enlace de verificación o de recuperación vencido o ya usado, ve un aviso y puede pedir uno nuevo.
- Si la persona intenta entrar a una pantalla privada sin haber iniciado sesión, es llevada al inicio de sesión.
- Si la persona pierde la conexión en medio de un envío, ve un aviso de error y puede intentarlo de nuevo sin perder lo escrito.

## Fuera de alcance

- El envío real de los correos (verificación y recuperación), que es responsabilidad del backend.
- El cambio de contraseña con la sesión iniciada (desde perfil o configuración).
- El registro con cuentas externas (Google, redes sociales) y la verificación en dos pasos.
- La gestión del establecimiento, las organizaciones y cualquier pantalla posterior al acceso.
