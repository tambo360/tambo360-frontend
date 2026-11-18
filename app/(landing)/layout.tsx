import { redirect } from 'next/navigation'

export default function LandingLayout() {
  // Landing routes are temporarily disabled; start from the login page.
  redirect('/iniciar-sesion')
}
