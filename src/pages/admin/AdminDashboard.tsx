import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { adminCounts, listAuditLogs } from '@/services/supabaseData'

export default function AdminDashboard() {
  const { configured } = useAuth()
  const [counts, setCounts] = useState({ users: 0, activeJourneys: 0, completedJourneys: 0, knowledge: 0, conversations: 0, audit: 0 })
  const [activities, setActivities] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setError(null)
    const [c, a] = await Promise.all([adminCounts(), listAuditLogs()])
    if (c.data) setCounts(c.data)
    if (a.data) setActivities(a.data.slice(0, 5))
    if (c.error || a.error) setError(c.error || a.error || null)
  }

  useEffect(() => { load() }, [configured])

  const stats = [
    { label: 'Registered users', value: String(counts.users) },
    { label: 'Active journeys', value: String(counts.activeJourneys) },
    { label: 'Completed journeys', value: String(counts.completedJourneys) },
    { label: 'Assistant conversations', value: String(counts.conversations) },
    { label: 'Knowledge documents', value: String(counts.knowledge) },
    { label: 'Audit log entries', value: String(counts.audit) },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge variant={configured ? 'green' : 'violet'}>{configured ? 'Connected to Supabase' : 'Demo mode'}</Badge>
          <h1 className="mt-2 text-2xl font-semibold">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-text-secondary">Aggregate overview of platform activity from the database (subject to RLS/admin permissions).</p>
        </div>
        <Button variant="secondary" onClick={load}>Refresh</Button>
      </div>
      {error && <p className="text-sm text-red-300">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}><p className="text-sm text-text-secondary">{s.label}</p><p className="mt-2 text-3xl font-semibold">{s.value}</p><p className="text-xs text-text-secondary">{configured ? 'Live count' : 'Connect Supabase'}</p></Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><div><CardTitle>Usage overview</CardTitle><CardDescription>Aggregate counts snapshot</CardDescription></div></CardHeader>
          <div className="flex h-48 items-end gap-3">
            {[counts.users, counts.activeJourneys, counts.completedJourneys, counts.conversations, counts.knowledge, counts.audit, Math.max(1, counts.users + counts.conversations)].map((v, i) => (
              <div key={i} className="flex-1 rounded-t-lg bg-gradient-to-t from-brand-violet/60 to-brand-blue/60" style={{ height: `${Math.max(8, Math.min(100, v * 10 || 8))}%` }} />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-text-secondary"><span>Users</span><span>Audit</span></div>
        </Card>
        <Card>
          <CardHeader><div><CardTitle>Recent administrative activities</CardTitle><CardDescription>Latest audit log entries</CardDescription></div></CardHeader>
          <ul className="space-y-3 text-sm">
            {activities.length === 0 ? <li className="text-text-secondary">No audit activity yet.</li> : activities.map((a) => (
              <li key={a.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <p><span className="text-brand-blue">{a.action}</span> {a.entity_type ? `· ${a.entity_type}` : ''}</p>
                <p className="mt-1 text-xs text-text-secondary">{new Date(a.created_at).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
