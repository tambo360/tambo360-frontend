import axios from 'axios'

// ==========================================
// Funciones Mock
// ==========================================
export const getSecurityTip = async (): Promise<string> => {
  const tips = [
    'Use a unique password for each account to prevent credential stuffing attacks.',
    'Enable two-factor authentication whenever possible for an extra layer of security.',
    'Be cautious of phishing attempts - always verify the sender before clicking links.',
    'Use a password manager to generate and store strong, unique passwords.',
    'Regularly review your account activity and log out from unused sessions.',
  ]

  return tips[Math.floor(Math.random() * tips.length)]
}

export const getAIGreeting = async (name: string): Promise<string> => {
  const greetings = [
    `Welcome back, ${name}! Your digital fortress awaits.`,
    `Hello ${name}! Ready to secure your digital identity?`,
    `Greetings ${name}! Your portal is at your command.`,
    `${name}, it's great to see you again! Let's make today secure.`,
    `Welcome ${name}! Your identity ecosystem is ready for action.`,
  ]

  return greetings[Math.floor(Math.random() * greetings.length)]
}

// ==========================================
// Configuración de Axios
// ==========================================
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
})

// ✅ INTERCEPTOR DE PETICIÓN (REQUEST)
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      // Agregar Token
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      // Agregar ID de Organización
      const organizacionId = localStorage.getItem('organizacionId')
      if (organizacionId) {
        config.headers['x-organizacion-id'] = organizacionId
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// ✅ INTERCEPTOR DE RESPUESTA (RESPONSE)
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
