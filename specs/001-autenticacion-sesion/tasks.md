# Tareas: Autenticación y Sesión

- Feature: `specs/001-autenticacion-sesion` (spec: `spec.md`, plan: `plan.md`)
- Fecha: 2026-09-10
- Alcance: Solo frontend. Solo login, register, verificación de correo y recuperar-contraseña. Sin cambios de backend; sin decisiones nuevas de diseño.

## Base: validación y red

### [x] T-01-01 · Esquemas de validación de formularios

- **Acción**: Revisar y alinear los esquemas de `types/login.ts`, `types/register.ts` y `types/auth.ts` con formato de correo, fortaleza mínima y coincidencia de confirmación.
- **Resultado**: Los tres esquemas cubren login, register y recuperar-contraseña sin reglas contradictorias.
- **Depende de**: ninguna
- **Verificación**: Hecha por inspección y `tsc` sin errores nuevos.

### [x] T-01-02 · Instancia central de red

- **Acción**: Revisar `services/api.ts` (credenciales y redirección ante 401).
- **Resultado**: El manejo centralizado de sesión expirada queda verificado para el login.
- **Depende de**: ninguna
- **Verificación**: Hecha por inspección y `tsc` sin errores nuevos.

### [x] T-01-03 · Puerta de salida de autenticación

- **Acción**: Revisar `utils/api/auth.api.ts` como único punto de consumo de los endpoints usados.
- **Resultado**: Los 6 endpoints del plan quedan centralizados.
- **Depende de**: T-01-02
- **Verificación**: Hecha por inspección y `tsc` sin errores nuevos.

## Hooks

### [x] T-02-01 · Mutación de registro

- **Acción**: Revisar `hooks/auth/useRegister.ts` (envío único, carga y error).
- **Resultado**: El registro expone pendiente y error para la pantalla.
- **Depende de**: T-01-03
- **Verificación**: Hecha por inspección y `tsc` sin errores nuevos.

### [x] T-02-02 · Mutación de inicio de sesión

- **Acción**: Revisar `hooks/auth/useLogin.ts` (envío único, carga y error).
- **Resultado**: El inicio de sesión expone pendiente y error para la pantalla.
- **Depende de**: T-01-03
- **Verificación**: Hecha por inspección y `tsc` sin errores nuevos.

### [x] T-02-03 · Mutaciones de verificación de correo

- **Acción**: Revisar `hooks/auth/useVerifyEmail.ts` y `hooks/auth/useResendEmail.ts` (estados de carga, éxito y fallo).
- **Resultado**: La verificación y el reenvío exponen los estados exigidos.
- **Depende de**: T-01-03
- **Verificación**: Hecha por inspección y `tsc` sin errores nuevos.

### [x] T-02-04 · Mutaciones de recuperación de contraseña

- **Acción**: Revisar `hooks/auth/useForgotPassword.ts` y `hooks/auth/useResetPassword.ts` (envío único, carga y error por paso).
- **Resultado**: Solicitud y nueva contraseña exponen los estados exigidos.
- **Depende de**: T-01-03
- **Verificación**: Hecha por inspección y `tsc` sin errores nuevos.

## Pantallas

### [x] T-03-01 · Pantalla de inicio de sesión

- **Acción**: Revisar `app/(auth)/iniciar-sesion/page.tsx` (validación, carga, bloqueo y enlaces).
- **Resultado**: La pantalla cumple lo indicado en la spec.
- **Depende de**: T-02-02
- **Verificación**: Hecha por inspección, `tsc` y `lint` sin errores nuevos.

### [x] T-03-02 · Pantalla de registro

- **Acción**: Revisar `app/(auth)/registrarse/page.tsx` y `components/shared/register/RegisterForm.tsx`.
- **Resultado**: La pantalla cumple lo indicado en la spec.
- **Depende de**: T-02-01
- **Verificación**: Hecha por inspección y `tsc` sin errores nuevos.

### [x] T-03-03 · Pantalla de recuperación de contraseña

- **Acción**: Revisar `app/(auth)/recuperar-contrasena/page.tsx` (solicitud, nueva contraseña, enlace inválido y confirmación).
- **Resultado**: La pantalla cumple lo indicado en la spec desde el lado frontend.
- **Depende de**: T-02-04
- **Verificación**: Hecha por inspección y `tsc` sin errores nuevos.

### [x] T-03-04 · Pantalla de verificación de correo

- **Acción**: Revisar `app/(auth)/verificar/page.tsx` (estados de carga, éxito y fallo con retorno al inicio de sesión) y el aviso con reenvío en `components/shared/register/RegisterForm.tsx`.
- **Resultado**: La pantalla cumple lo indicado en la spec desde el lado frontend.
- **Depende de**: T-02-03
- **Verificación**: Hecha por inspección y `tsc` sin errores nuevos.
