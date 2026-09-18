# Plan: Autenticación y Sesión

- Fecha: 2026-09-10
- Estado: Completado
- Alcance: Solo frontend. Solo cubre que se cumplen login, register, verificación de correo y el lado frontend de recuperar-contraseña. No se especifica nada más.

## 1. Resumen

Se consolida el frontend de inicio de sesión, registro, verificación de correo y recuperación de contraseña (solicitud y nueva contraseña con sus estados visuales), reutilizando las rutas públicas, los hooks de autenticación y la instancia central de red. No se crea ni se modifica ningún endpoint de backend.

## 2. Arquitectura

### Módulos y servicios

| Módulo / servicio                                                                                           | Rol                                                              |
| ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `app/(auth)` (iniciar-sesion, registrarse, recuperar-contrasena, verificar)                                 | Pantallas del flujo cubierto                                     |
| `components/shared/register/RegisterForm.tsx`                                                               | Formulario de registro (incluye aviso y reenvío de verificación) |
| `components/shared/login/LoginForm.tsx`                                                                     | Formulario de login                                              |
| `hooks/auth/*` (useLogin, useRegister, useVerifyEmail, useResendEmail, useForgotPassword, useResetPassword) | Mutaciones con estado de carga y error                           |
| `utils/api/auth.api.ts`                                                                                     | Puerta de salida única hacia los endpoints usados                |
| `services/api.ts`                                                                                           | Instancia de red central con credenciales y manejo de 401        |
| `types/` (login, register, auth)                                                                            | Esquemas de validación de los formularios                        |

### Entidades principales

| Entidad                   | Descripción                                                                                |
| ------------------------- | ------------------------------------------------------------------------------------------ |
| Usuario                   | Persona con nombre y correo que se registra e inicia sesión                                |
| Solicitud de recuperación | Pedido de restablecimiento asociado a un correo, con estados visibles de envío y resultado |

### Decisiones clave

| Decisión                                                     | Justificación breve                                                       |
| ------------------------------------------------------------ | ------------------------------------------------------------------------- |
| Reutilizar la instancia central de red                       | Un solo criterio de sesión expirada en todo el frontend                   |
| Mantener un módulo de salida único (`utils/api/auth.api.ts`) | Aísla la integración y facilita verificar la coincidencia con el contrato |
| Validar formularios en la interfaz antes del envío           | Mensajes junto al campo sin esperar a la red                              |

## 3. Contratos de API usados

| Método | Endpoint                       | Auth | Propósito                                       |
| ------ | ------------------------------ | ---- | ----------------------------------------------- |
| POST   | `/auth/crear-cuenta`           | No   | Registrar un nuevo usuario                      |
| POST   | `/auth/iniciar-sesion`         | No   | Iniciar sesión con correo y contraseña          |
| POST   | `/auth/verificar-email`        | No   | Verificar la cuenta con el token del correo     |
| POST   | `/auth/reenviar-verificacion`  | No   | Reenviar el correo de verificación              |
| POST   | `/auth/contrasena-olvidada`    | No   | Solicitar el enlace de restablecimiento         |
| POST   | `/auth/restablecer-contrasena` | No   | Definir la nueva contraseña con un token válido |

## 4. Archivos nuevos o modificados

| Archivo                                       | Propósito en esta feature                  |
| --------------------------------------------- | ------------------------------------------ |
| `app/(auth)/iniciar-sesion/page.tsx`          | Marco de la pantalla de inicio de sesión   |
| `components/shared/login/LoginForm.tsx`       | Formulario de inicio de sesión             |
| `app/(auth)/registrarse/page.tsx`             | Marco de la pantalla de registro           |
| `components/shared/register/RegisterForm.tsx` | Formulario de registro                     |
| `app/(auth)/recuperar-contrasena/page.tsx`    | Solicitud y definición de nueva contraseña |
| `app/(auth)/verificar/page.tsx`               | Estados de verificación de correo          |
| `hooks/auth/useLogin.ts`                      | Mutación de inicio de sesión               |
| `hooks/auth/useRegister.ts`                   | Mutación de registro                       |
| `hooks/auth/useVerifyEmail.ts`                | Mutación de verificación de correo         |
| `hooks/auth/useResendEmail.ts`                | Mutación de reenvío de verificación        |
| `hooks/auth/useForgotPassword.ts`             | Mutación de solicitud de restablecimiento  |
| `hooks/auth/useResetPassword.ts`              | Mutación de definición de nueva contraseña |
| `utils/api/auth.api.ts`                       | Puerta de salida única                     |
| `services/api.ts`                             | Instancia de red central                   |
| `types/login.ts`                              | Validación del inicio de sesión            |
| `types/register.ts`                           | Validación del registro                    |
| `types/auth.ts`                               | Validación del restablecimiento            |

## 5. Módulos y archivos fuera del alcance

Todo lo no listado arriba, incluyendo sesión visible, cierre de sesión, guardias de rutas, organizaciones, establecimiento y cualquier lógica de backend.
