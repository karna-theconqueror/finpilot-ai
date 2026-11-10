import { NavLink, Outlet, Link } from 'react-router-dom'
import { LayoutDashboard, Users, Route, BookOpen, MessageSquare, BarChart3, ScrollText, Settings, Sparkles, Menu, Shield, LogOut } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/utils/cn'
import { Badge } from '@/components/ui/Badge'
import { useAuth } from '@/contexts/AuthContext'

const items = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/users', label: 'User Management', icon: Users },
  { to: '/admin/journeys', label: 'Journey Management', icon: Route },
  { to: '/admin/knowledge', label: 'Knowledge Management', icon: BookOpen },
  { to: '/admin/conversations', label: 'Conversation Monitoring', icon: MessageSquare },
  { to: '/admin/analytics', label: 'AI Analytics', icon: BarChart3 },
  { to: '/admin/audit-logs', label: 'Audit Logs', icon: ScrollText },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export function AdminLayout() {
  const [open, setOpen] = useState(false)
  const { profile, user, signOut } = useAuth()
  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="flex">
        <aside className={cn('fixed inset-y-0 left-0 z-30 w-64 border-r border-white/5 bg-bg-secondary/70 backdrop-blur-xl transition-transform lg:static lg:translate-x-0', open ? 'translate-x-0' : '-translate-x-full')}>
          <div className="flex h-16 items-center justify-between border-b border-white/5 px-4">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-violet/20 text-brand-violet"><Sparkles size={18} /></span>
              FinPilot AI
            </Link>
            <Badge variant="violet">Admin</Badge>
          </div>
          <nav className="space-y-1 p-3">
            {items.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => cn('flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-text-secondary transition hover:bg-white/5 hover:text-text-primary', isActive && 'bg-brand-violet/10 text-text-primary border border-brand-violet/20')}>
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="border-t border-white/5 p-3">
            <button onClick={() => signOut()} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-text-secondary hover:bg-white/5 hover:text-text-primary">
              <LogOut size={18} /> Log out
            </button>
          </div>
        </aside>
        {open && <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}
        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-white/5 bg-bg-primary/80 px-4 backdrop-blur-xl sm:px-6">
            <button className="rounded-lg p-2 text-text-secondary hover:bg-white/5 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={20} /></button>
            <div className="flex items-center gap-2 text-sm text-text-secondary"><Shield size={16} className="text-brand-violet" /> Admin Portal <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs text-amber-300">Admin access</span></div>
            <div className="flex items-center gap-2 text-sm"><span className="hidden text-text-secondary sm:inline max-w-[180px] truncate">{profile?.full_name || user?.email || 'Admin'}</span><div className="h-8 w-8 rounded-full bg-brand-blue/30 ring-1 ring-white/10" /></div>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8"><Outlet /></main>
        </div>
      </div>
    </div>
  )
}
