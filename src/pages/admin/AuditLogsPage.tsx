import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { listAuditLogs } from '@/services/supabaseData'

export default function AuditLogsPage() {
  const { configured } = useAuth()
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true); setError(null)
    const res = await listAuditLogs()
    setLoading(false)
    if (res.error) setError(res.error); else setLogs(res.data)
  }

  useEffect(() => { load() }, [configured])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge variant={configured ? 'green' : 'violet'}>{configured ? 'Connected to Supabase' : 'Demo mode'}</Badge>
          <h1 className="mt-2 text-2xl font-semibold">Audit Logs</h1>
          <p className="mt-1 text-sm text-text-secondary">Records administrative actions. Access is restricted (admin-only via RLS) and unnecessary customer information is not exposed.</p>
        </div>
        <Button variant="secondary" onClick={load} disabled={loading}>{loading ? 'Refreshing…' : 'Refresh'}</Button>
      </div>
      {error && <p className="text-sm text-red-300">{error}</p>}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-white/5 text-left text-text-secondary"><tr><th className="px-4 py-3">Actor ID</th><th className="px-4 py-3">Action</th><th className="px-4 py-3">Entity</th><th className="px-4 py-3">Entity ID</th><th className="px-4 py-3">Time</th></tr></thead>
            <tbody>
              {logs.length === 0 ? (
                <tr><td className="px-4 py-6 text-text-secondary" colSpan={5}>{configured ? 'No audit logs found (or access denied).' : 'Supabase not configured. Audit logs will appear here when connected as admin.'}</td></tr>
              ) : logs.map((l) => (
                <tr key={l.id} className="border-t border-white/5">
                  <td className="px-4 py-3 font-mono text-xs text-text-secondary">{l.actor_id || '—'}</td>
                  <td className="px-4 py-3"><Badge variant="blue">{l.action}</Badge></td>
                  <td className="px-4 py-3 text-text-secondary">{l.entity_type || '—'}</td>
                  <td className="px-4 py-3 font-mono text-xs text-text-secondary">{l.entity_id || '—'}</td>
                  <td className="px-4 py-3 text-text-secondary">{new Date(l.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
