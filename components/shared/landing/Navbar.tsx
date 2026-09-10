'use client'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

const Navbar = () => {
  const pathname = usePathname()
  const links = [
    { label: 'Nosotros', href: '/nosotros' },
    { label: 'Equipo', href: '/equipo' },
    { label: 'Testimonios', href: '/testimonios' },
    { label: 'Precios', href: '/precios' },
    { label: 'Contacto', href: '/contacto' },
  ]

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-background transition-shadow duration-300 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center text-xl font-bold tracking-tight"
        >
          <img
            src="/logos/isotipo_tambo 1.png"
            alt="Logo"
            className="size-12"
          />
          Tambo<span className="text-[#669213]">360</span> QA
        </Link>

        <div className="hidden md:flex items-center gap-4">
          <NavigationMenu>
            <NavigationMenuList className="gap-2">
              {links.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                      'text-[#669213]',
                      'hover:bg-[#D7ECAF] hover:text-[#4d6e0e]',
                      'focus:outline-none focus:ring-2 focus:ring-[#669213]/30',
                      pathname === link.href
                        ? 'bg-[#D7ECAF] text-[#4d6e0e]'
                        : 'bg-transparent'
                    )}
                  >
                    {link.label}
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <Button
            size="sm"
            className="h-11 px-6 font-semibold rounded-xl bg-[#669213] text-white hover:bg-[#4d6e0e] transition-all"
            asChild
          >
            <Link href="/iniciar-sesion">Ver Demo</Link>
          </Button>
        </div>

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-[#D7ECAF]"
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5 text-[#669213]" />
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="px-6 pb-6">
            <nav className="flex flex-col mt-4 gap-2">
              <Link
                href="/"
                className="flex items-center gap-2 text-xl font-bold tracking-tight mb-4"
              >
                <img
                  src="/logos/isotipo_tambo 1.png"
                  alt="Logo"
                  className="size-10"
                />
                <span>
                  Tambo<span className="text-[#669213]">360</span>
                </span>
              </Link>

              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-[#669213] hover:bg-[#D7ECAF] transition-all"
                >
                  {link.label}
                </Link>
              ))}

              <Button
                asChild
                className="mt-4 font-semibold w-full rounded-xl bg-[#669213] text-white hover:bg-[#4d6e0e]"
              >
                <Link href="#contacto">Solicitar Demo</Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}

export default Navbar
