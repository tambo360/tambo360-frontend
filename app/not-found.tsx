'use client'
import { Button } from '@/components/ui/button'

const NotFound = () => {
  return (
    <div className="flex flex-col gap-6 items-center justify-center h-screen w-full">
      <div className="flex flex-col items-center justify-center">
        <img
          src="/logos/isotipo_tambo_1.png"
          alt="Not Found"
          className="w-64"
        />
        <img src="/logotipo 1.png" alt="Not Found" className="h-12" />
      </div>

      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-lg text-body-text">Página no encontrada</p>
      <Button onClick={() => window.history.back()}>Volver</Button>
    </div>
  )
}
export default NotFound
