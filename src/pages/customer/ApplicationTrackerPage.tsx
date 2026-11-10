import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { createDemoApplication, listMyApplicationRecords, updateDemoApplication } from '@/services/supabaseData'
import type { ApplicationRecord } from '@/types'

const statuses: ApplicationRecord['demo_status'][] = ['Draft', 'Submitted', 'Under Review', 'Completed', 'Cancelled']

export default function ApplicationTrackerPage() {
  const { user, configured } = useAuth()
  const [records, setRecords] = useState<ApplicationRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    if (!user) return
    setLoading(true); setError(null)
    const res = await listMyApplicationRecords(user.id)
    setLoading(false)
    if (res.error) setError(res.error); else setRecords(res.data)
  }

  useEffect(() => { load() }, [user?.id, configured])

  const create = async () => {
    if (!user) return
    const res = await createDemoApplication(user.id)
    if (res.error) setError(res.error); else load()
  }

  const advance = async (r: ApplicationRecord) => {
    const idx = statuses.indexOf(r.demo_status)
    const next = statuses[Math.min(statuses.length - 1, idx + 1)]
    const res = await updateDemoApplication(r.id, next)
    if (res.error) setError(res.error); else load()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge variant="warning">DEMO ONLY — not a real financial application</Badge>
          <h1 className="mt-2 text-2xl font-semibold">Application Tracker</h1>
          <p className="mt-1 text-sm text-text-secondary">Track simulated application/journey statuses for learning purposes. No actual application is submitted to any bank or lender.</p>
        </div>
        <Button onClick={create} disabled={!configured || !user}>Create demo record</Button>
      </div>

      {error && <p className="text-sm text-red-300">{error}</p>}
      {loading && <p className="text-sm text-text-secondary">Loading records…</p>}

      <div className="grid gap-4 lg:grid-cols-2">
        {records.length === 0 ? (
          <Card className="lg:col-span-2 text-sm text-text-secondary">
            {configured ? 'No demo application records yet. Create one to simulate tracking (stored in your account).' : 'Supabase not configured. Connect Supabase to persist demo application records in the database.'}
          </Card>
        ) : records.map((a) => (
          <Card key={a.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-text-secondary">Reference</p>
                <h2 className="font-semibold font-mono text-sm">DEMO-{a.id.slice(0, 8).toUpperCase()}</h2>
                <p className="mt-1 text-sm text-text-secondary">Simulated application record</p>
              </div>
              <Badge variant={a.demo_status === 'Under Review' ? 'blue' : a.demo_status === 'Completed' ? 'green' : a.demo_status === 'Cancelled' ? 'warning' : 'muted'}>{a.demo_status}</Badge>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-text-secondary">Created</p><p>{new Date(a.created_at).toLocaleString()}</p></div>
              <div><p className="text-text-secondary">Journey link</p><p className="font-mono text-xs">{a.journey_id ? a.journey_id.slice(0,8) : '—'}</p></div>
            </div>
            <p className="mt-3 text-xs text-text-secondary">Status explanation: Simulated educational status only. No real lender submission or decision.</p>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => advance(a)} disabled={a.demo_status === 'Cancelled' || a.demo_status === 'Completed'}>Advance status (demo)</Button>
              {a.demo_status !== 'Cancelled' && a.demo_status !== 'Completed' && <Button size="sm" variant="ghost" onClick={() => updateDemoApplication(a.id, 'Cancelled').then(load)}>Cancel</Button>}
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="font-semibold">Status timeline (educational)</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-5">
          {statuses.map((t) => (
            <div key={t} className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
              <p className="text-sm font-medium">{t}</p>
              <p className="mt-1 text-xs text-text-secondary">Simulated stage for learning only.</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
