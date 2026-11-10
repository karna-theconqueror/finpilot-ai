import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { listAllJourneys } from '@/services/supabaseData'

export default function JourneyManagementPage() {
  const { configured } = useAuth()
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true); setError(null)
    const res = await listAllJourneys()
    setLoading(false)
    if (res.error) setError(res.error); else setRows(res.data)
  }

  useEffect(() => { load() }, [configured])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge variant={configured ? 'green' : 'violet'}>{configured ? 'Connected to Supabase' : 'Demo mode'}</Badge>
          <h1 className="mt-2 text-2xl font-semibold">Journey Management</h1>
          <p className="mt-1 text-sm text-text-secondary">Monitor and manage learning journeys and their step records. User journeys are stored in <code>journeys</code>/<code>journey_steps</code>; admin actions must be authorized server-side.</p>
        </div>
        <Button variant="secondary" onClick={load} disabled={loading}>Refresh</Button>
      </div>
      {error && <p className="text-sm text-red-300">{error}</p>}
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {rows.length === 0 ? (
          <Card className="lg:col-span-3 text-sm text-text-secondary">{configured ? 'No journeys found (or access denied).' : 'Supabase not configured. Connect to manage journeys from the database.'}</Card>
        ) : rows.map((j) => (
          <Card key={j.id}>
            <div className="flex items-start justify-between"><h2 className="font-semibold">Journey {j.id.slice(0,8)}</h2><Badge variant={j.status === 'completed' ? 'green' : j.status === 'cancelled' ? 'warning' : 'blue'}>{j.status}</Badge></div>
            <p className="mt-2 text-sm text-text-secondary">User: <span className="font-mono text-xs">{j.user_id}</span></p>
            <p className="mt-1 text-sm text-text-secondary">Steps: {Array.isArray(j.journey_steps) ? (j.journey_steps[0]?.count ?? 0) : 0}</p>
            <p className="mt-1 text-xs text-text-secondary">Updated {new Date(j.updated_at || j.created_at).toLocaleString()}</p>
          </Card>
        ))}
      </div>
      <Card>
        <h2 className="font-semibold">Template management note</h2>
        <p className="mt-2 text-sm text-text-secondary">This MVP uses a standard educational lending journey template in the customer experience. Templates/step definitions can be extended via knowledge documents or additional template tables in future iterations; current DB tracks user journey instances and step completion per the required schema.</p>
      </Card>
    </div>
  )
}
