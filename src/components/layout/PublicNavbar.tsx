import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/how-it-works', label: 'How it Works' },
  { to: '/privacy', label: 'Privacy' },
  { to: '/terms', label: 'Terms' },
]

export function PublicNavbar() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-bg-primary/80 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-blue/20 text-brand-blue">
            <Sparkles size={18} />
          </span>
          <span>FinPilot AI</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-2 text-sm text-text-secondary transition hover:text-text-primary',
                  isActive && 'bg-white/5 text-text-primary',
                )
              }
              end={l.to === '/'}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Link to="/login"><Button variant="ghost">Log in</Button></Link>
          <Link to="/register"><Button>Get Started</Button></Link>
        </div>
        <button className="inline-flex rounded-lg p-2 text-text-secondary hover:bg-white/5 md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <div className="border-t border-white/5 bg-bg-secondary/95 md:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-white/5 hover:text-text-primary">
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              <Link to="/login" className="flex-1" onClick={() => setOpen(false)}><Button variant="secondary" className="w-full">Log in</Button></Link>
              <Link to="/register" className="flex-1" onClick={() => setOpen(false)}><Button className="w-full">Get Started</Button></Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
