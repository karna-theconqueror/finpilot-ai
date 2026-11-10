import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Card } from '@/components/ui/Card'

export function ProtectedRoute({ adminOnly = false }: { adminOnly?: boolean }) {
  const { user, profile, loading, configured } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-6">
        <Card className="text-sm text-text-secondary">Loading session…</Card>
      </div>
    )
  }

  if (!configured) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-6">
        <Card className="max-w-lg">
          <h2 className="font-semibold">Supabase configuration required</h2>
          <p className="mt-2 text-sm text-text-secondary">Authentication and secure data access require Supabase. Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in <code>.env</code> (see <code>.env.example</code>) and restart the dev server. For Phase 1 UI review, public pages remain available.</p>
        </Card>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (adminOnly && profile?.role !== 'admin') {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-6">
        <Card className="max-w-lg border-red-500/20">
          <h2 className="font-semibold">Access denied</h2>
          <p className="mt-2 text-sm text-text-secondary">This area requires administrator permissions verified by your account profile. If you believe this is an error, contact an administrator.</p>
        </Card>
      </div>
    )
  }

  return <Outlet />
}
