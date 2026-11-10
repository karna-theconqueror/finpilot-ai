import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { adminCounts, listAllConversations, listKnowledgeStats } from '@/services/supabaseData'

export default function AIAnalyticsPage() {
  const { configured } = useAuth()
  const [counts, setCounts] = useState<any>(null)
  const [convs, setConvs] = useState<any[]>([])
  const [kstats, setKstats] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setError(null)
    const [c, cv, ks] = await Promise.all([adminCounts(), listAllConversations(), listKnowledgeStats()])
    if (c.data) setCounts(c.data)
    if (cv.data) setConvs(cv.data)
    if (ks.data) setKstats(ks.data)
    if (c.error || cv.error || ks.error) setError(c.error || cv.error || ks.error || null)
  }

  useEffect(() => { load() }, [configured])

  const topicBuckets = [
    { name: 'EMI & calculations', count: 0 },
    { name: 'Loan types', count: 0 },
    { name: 'Documents', count: 0 },
    { name: 'Interest rates', count: 0 },
    { name: 'Application stages', count: 0 },
  ]
  convs.forEach((c) => {
    const t = (c.title || '').toLowerCase()
    if (t.includes('emi')) topicBuckets[0].count++
    else if (t.includes('loan')) topicBuckets[1].count++
    else if (t.includes('document')) topicBuckets[2].count++
    else if (t.includes('interest')) topicBuckets[3].count++
    else if (t.includes('submit') || t.includes('application') || t.includes('review')) topicBuckets[4].count++
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge variant={configured ? 'green' : 'violet'}>{configured ? 'Connected to Supabase' : 'Demo mode'}</Badge>
          <h1 className="mt-2 text-2xl font-semibold">AI Analytics</h1>
          <p className="mt-1 text-sm text-text-secondary">Assistant usage and knowledge metrics derived from available database records. Response latency/error telemetry can be extended with server-side instrumentation.</p>
        </div>
        <Button variant="secondary" onClick={load}>Refresh</Button>
      </div>
      {error && <p className="text-sm text-red-300">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card><p className="text-sm text-text-secondary">Conversation count</p><p className="mt-2 text-3xl font-semibold">{counts?.conversations ?? 0}</p></Card>
        <Card><p className="text-sm text-text-secondary">Knowledge documents</p><p className="mt-2 text-3xl font-semibold">{counts?.knowledge ?? 0}</p><p className="text-xs text-text-secondary">Published: {kstats?.published ?? 0} · Draft: {kstats?.draft ?? 0}</p></Card>
        <Card><p className="text-sm text-text-secondary">Error count</p><p className="mt-2 text-3xl font-semibold">—</p><p className="text-xs text-text-secondary">Requires server telemetry</p></Card>
        <Card><p className="text-sm text-text-secondary">Avg. response latency</p><p className="mt-2 text-3xl font-semibold">—</p><p className="text-xs text-text-secondary">Measurable via instrumentation</p></Card>
      </div>
      <Card>
        <h2 className="font-semibold">Common topics (from conversation titles)</h2>
        <div className="mt-4 space-y-3">
          {topicBuckets.map((t) => (
            <div key={t.name}>
              <div className="flex justify-between text-sm"><span>{t.name}</span><span className="text-text-secondary">{t.count}</span></div>
              <div className="mt-1 h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-brand-blue" style={{ width: `${Math.max(4, Math.min(100, t.count * 20))}%` }} /></div>
            </div>
          ))}
        </div>
        {!configured && <p className="mt-3 text-xs text-text-secondary">Connect Supabase and collect conversations to populate live analytics.</p>}
      </Card>
    </div>
  )
}
