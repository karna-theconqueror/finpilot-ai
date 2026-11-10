import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { listAllConversations } from '@/services/supabaseData'

export default function ConversationMonitoringPage() {
  const { configured } = useAuth()
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true); setError(null)
    const res = await listAllConversations()
    setLoading(false)
    if (res.error) setError(res.error); else setRows(res.data)
  }

  useEffect(() => { load() }, [configured])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge variant={configured ? 'green' : 'violet'}>{configured ? 'Connected to Supabase' : 'Demo mode'}</Badge>
          <h1 className="mt-2 text-2xl font-semibold">Conversation Monitoring</h1>
          <p className="mt-1 text-sm text-text-secondary">Operational overview of assistant conversations. Access is admin-only and data-minimized; avoid exposing unnecessary customer content.</p>
        </div>
        <Button variant="secondary" onClick={load} disabled={loading}>Refresh</Button>
      </div>
      {error && <p className="text-sm text-red-300">{error}</p>}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-white/5 text-left text-text-secondary"><tr><th className="px-4 py-3">Conversation</th><th className="px-4 py-3">User ID</th><th className="px-4 py-3">Title</th><th className="px-4 py-3">Messages</th><th className="px-4 py-3">Updated</th></tr></thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td className="px-4 py-6 text-text-secondary" colSpan={5}>{configured ? 'No conversations found (or access denied).' : 'Supabase not configured. Connect to monitor conversations.'}</td></tr>
              ) : rows.map((c) => (
                <tr key={c.id} className="border-t border-white/5">
                  <td className="px-4 py-3 font-mono text-xs">{c.id}</td>
                  <td className="px-4 py-3 font-mono text-xs text-text-secondary">{c.user_id}</td>
                  <td className="px-4 py-3">{c.title || '—'}</td>
                  <td className="px-4 py-3"><Badge variant="blue">{Array.isArray(c.messages) ? (c.messages[0]?.count ?? 0) : 0}</Badge></td>
                  <td className="px-4 py-3 text-text-secondary">{new Date(c.updated_at || c.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
