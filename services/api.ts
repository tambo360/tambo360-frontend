import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
})

// ✅ 1. INTERCEPTOR DE PETICIONES (Aquí inyectamos los headers que faltan)
api.interceptors.request.use(
  (config) => {
    // Solo ejecutamos esto en el navegador (no en el servidor de Next.js)
    if (typeof window !== 'undefined') {
      const pathParts = window.location.pathname.split('/')

      // La URL se ve así: /organizaciones/[ORG_ID]/[EST_ID]/produccion
      // pathParts[0] = "" (vacío)
      // pathParts[1] = "organizaciones"
      // pathParts[2] = ORG_ID
      // pathParts[3] = EST_ID

      if (pathParts[1] === 'organizaciones') {
        const orgId = pathParts[2]
        const estId = pathParts[3]

        // Inyectamos el header de la organización si existe
        if (orgId) {
          config.headers['x-organizacion-id'] = orgId
        }

        // Inyectamos el header del establecimiento si existe
        // Ojo: a veces pathParts[3] puede ser una palabra como "configuracion" o "invitar",
        // por eso verificamos que no sea una ruta conocida.
        if (
          estId &&
          !['configuracion', 'invitar', 'cuestionario'].includes(estId)
        ) {
          config.headers['x-establecimiento-id'] = estId
        }
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// ✅ 2. INTERCEPTOR DE RESPUESTAS (Tu código original, está perfecto)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthMe = error.config?.url?.includes('/auth/me')
    const isLogout = error.config?.url?.includes('/auth/logout')

    if (error.response?.status === 401) {
      if (!isAuthMe && !isLogout && typeof window !== 'undefined') {
        window.location.href = '/iniciar-sesion'
      }
    }
    return Promise.reject(error)
  }
)
