import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Badge variant="violet">Admin configuration (demo)</Badge>
        <h1 className="mt-2 text-2xl font-semibold">Settings</h1>
        <p className="mt-1 text-sm text-text-secondary">Platform configuration placeholders. Sensitive settings must be managed securely and audited.</p>
      </div>
      <Card>
        <h2 className="font-semibold">AI assistant</h2>
        <p className="mt-2 text-sm text-text-secondary">Provider-independent architecture. Current mode: deterministic mock with verified knowledge base. External LLM adapter via secure backend in Phase 4.</p>
        <div className="mt-3 flex items-center justify-between rounded-xl border border-white/5 p-3 text-sm"><span>Demo mode</span><Badge variant="green">Enabled</Badge></div>
      </Card>
      <Card>
        <h2 className="font-semibold">Security</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-text-secondary">
          <li>Server-side admin verification (Phase 2+)</li>
          <li>Row Level Security on all tables (Phase 2)</li>
          <li>No service role key in frontend</li>
          <li>Audit logging for administrative actions</li>
        </ul>
      </Card>
      <Card>
        <h2 className="font-semibold">Environment</h2>
        <p className="mt-2 text-sm text-text-secondary">Supabase URL/keys configured via environment variables. This demo build runs without paid services.</p>
        <Button className="mt-4" variant="secondary">Save settings (Phase 5)</Button>
      </Card>
    </div>
  )
}
