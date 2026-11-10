import { useEffect, useMemo, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { listProfiles, logAudit } from '@/services/supabaseData'
import type { Profile } from '@/types'

export default function UserManagementPage() {
  const { configured } = useAuth()
  const [users, setUsers] = useState<Profile[]>([])
  const [q, setQ] = useState('')
  const [role, setRole] = useState('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Profile | null>(null)

  const load = async () => {
    setLoading(true); setError(null)
    const res = await listProfiles()
    setLoading(false)
    if (res.error) setError(res.error); else setUsers(res.data)
  }

  useEffect(() => { load() }, [configured])

  const filtered = useMemo(() => users.filter((u) => {
    const matchQ = `${u.full_name || ''} ${u.id} ${u.role}`.toLowerCase().includes(q.toLowerCase())
    const matchRole = role === 'all' || u.role === role
    return matchQ && matchRole
  }), [users, q, role])

  const view = async (u: Profile) => {
    setSelected(u)
    await logAudit('VIEWED_USER_PROFILE', 'profile', u.id)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge variant={configured ? 'green' : 'violet'}>{configured ? 'Connected to Supabase' : 'Demo data (Supabase not configured)'}</Badge>
          <h1 className="mt-2 text-2xl font-semibold">User Management</h1>
          <p className="mt-1 text-sm text-text-secondary">View, search, and filter accounts. Roles and access must be enforced server-side (RLS). Customers cannot change their own roles; admin accounts are provisioned via trusted administrative process only.</p>
        </div>
        <div className="flex gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search users..." className="h-10 rounded-xl border border-white/10 bg-bg-secondary px-3 text-sm outline-none" />
          <select value={role} onChange={(e) => setRole(e.target.value)} className="h-10 rounded-xl border border-white/10 bg-bg-secondary px-3 text-sm"><option value="all">All roles</option><option value="customer">Customer</option><option value="admin">Admin</option></select>
          <Button variant="secondary" onClick={load} disabled={loading}>Refresh</Button>
        </div>
      </div>

      {error && <p className="text-sm text-red-300">{error}</p>}

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-white/5 text-left text-text-secondary"><tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">User ID</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Created</th><th className="px-4 py-3">Actions</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td className="px-4 py-6 text-text-secondary" colSpan={5}>{loading ? 'Loading…' : configured ? 'No users found (or access denied by RLS).' : 'Supabase not configured. Connect and sign in as admin to view real profiles.'}</td></tr>
              ) : filtered.map((u) => (
                <tr key={u.id} className="border-t border-white/5">
                  <td className="px-4 py-3 font-medium">{u.full_name || '—'}</td>
                  <td className="px-4 py-3 text-text-secondary font-mono text-xs">{u.id}</td>
                  <td className="px-4 py-3"><Badge variant={u.role === 'admin' ? 'violet' : 'blue'}>{u.role}</Badge></td>
                  <td className="px-4 py-3 text-text-secondary">{u.created_at ? new Date(u.created_at).toLocaleString() : '—'}</td>
                  <td className="px-4 py-3"><Button variant="secondary" size="sm" onClick={() => view(u)}>View</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setSelected(null)}>
          <Card className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold">Account details</h2>
            <div className="mt-4 space-y-2 text-sm">
              <p><span className="text-text-secondary">Name:</span> {selected.full_name || '—'}</p>
              <p><span className="text-text-secondary">User ID:</span> <span className="font-mono text-xs">{selected.id}</span></p>
              <p><span className="text-text-secondary">Role:</span> {selected.role}</p>
              <p><span className="text-text-secondary">Created:</span> {selected.created_at ? new Date(selected.created_at).toLocaleString() : '—'}</p>
            </div>
            <p className="mt-4 text-xs text-text-secondary">Permitted state management and role changes must be performed through trusted server-side/admin processes and audited; public/client-side role escalation is prevented by RLS.</p>
            <div className="mt-4"><Button variant="secondary" onClick={() => setSelected(null)}>Close</Button></div>
          </Card>
        </div>
      )}
    </div>
  )
}
