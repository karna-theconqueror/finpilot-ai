import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/contexts/AuthContext'
import { deleteKnowledgeDocument, listKnowledgeDocuments, logAudit, setKnowledgeStatus, upsertKnowledgeDocument } from '@/services/supabaseData'
import type { KnowledgeDocument } from '@/types'

export default function KnowledgeManagementPage() {
  const { configured } = useAuth()
  const [docs, setDocs] = useState<KnowledgeDocument[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<{ id?: string; title: string; content: string; source: string; status: 'draft'|'published'|'archived' }>({ title: '', content: '', source: 'FinPilot Verified Knowledge Base', status: 'draft' })
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true); setError(null)
    const res = await listKnowledgeDocuments(true)
    setLoading(false)
    if (res.error) setError(res.error); else setDocs(res.data)
  }

  useEffect(() => { load() }, [configured])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.content.trim()) { setError('Title and content are required.'); return }
    setSaving(true); setError(null)
    const res = await upsertKnowledgeDocument(form)
    setSaving(false)
    if (res.error) { setError(res.error); return }
    await logAudit(form.id ? 'UPDATED_KNOWLEDGE_DOCUMENT' : 'CREATED_KNOWLEDGE_DOCUMENT', 'knowledge_document', form.id)
    setForm({ title: '', content: '', source: 'FinPilot Verified Knowledge Base', status: 'draft' })
    await load()
  }

  const changeStatus = async (id: string, status: 'draft'|'published'|'archived') => {
    const res = await setKnowledgeStatus(id, status)
    if (res.error) setError(res.error); else { await logAudit(`KNOWLEDGE_${status.toUpperCase()}`, 'knowledge_document', id); await load() }
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this document?')) return
    const res = await deleteKnowledgeDocument(id)
    if (res.error) setError(res.error); else { await logAudit('DELETED_KNOWLEDGE_DOCUMENT', 'knowledge_document', id); await load() }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge variant={configured ? 'green' : 'violet'}>{configured ? 'Connected to Supabase' : 'Supabase not configured'}</Badge>
          <h1 className="mt-2 text-2xl font-semibold">Knowledge Management</h1>
          <p className="mt-1 text-sm text-text-secondary">Create, edit, publish, and archive verified educational documents used for grounded AI responses (RAG). Admin access must be enforced server-side via RLS.</p>
        </div>
        <Button variant="secondary" onClick={load} disabled={loading}>{loading ? 'Refreshing…' : 'Refresh'}</Button>
      </div>

      <Card>
        <h2 className="font-semibold">{form.id ? 'Edit document' : 'Create document'}</h2>
        <form className="mt-4 grid gap-4" onSubmit={save}>
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">Content</label>
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} className="w-full rounded-xl border border-white/10 bg-bg-secondary px-3 py-2 text-sm outline-none focus:border-brand-blue/50 focus:ring-2 focus:ring-brand-blue/20" required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Source" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })} className="h-10 w-full rounded-xl border border-white/10 bg-bg-secondary px-3 text-sm">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          {error && <p className="text-sm text-red-300">{error}</p>}
          <div className="flex gap-2">
            <Button type="submit" disabled={saving || !configured}>{saving ? 'Saving…' : form.id ? 'Update document' : 'Create document'}</Button>
            {form.id && <Button type="button" variant="ghost" onClick={() => setForm({ title: '', content: '', source: 'FinPilot Verified Knowledge Base', status: 'draft' })}>Cancel edit</Button>}
          </div>
          {!configured && <p className="text-sm text-amber-200">Configure Supabase to persist documents and enable RAG from published knowledge.</p>}
        </form>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-white/5 text-left text-text-secondary"><tr><th className="px-4 py-3">Title</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Source</th><th className="px-4 py-3">Updated</th><th className="px-4 py-3">Actions</th></tr></thead>
            <tbody>
              {docs.length === 0 ? (
                <tr><td className="px-4 py-6 text-text-secondary" colSpan={5}>{configured ? 'No documents found (or access denied). Add a document above.' : 'No live data (Supabase not configured). Seed documents are available in supabase/seed.sql.'}</td></tr>
              ) : docs.map((d) => (
                <tr key={d.id} className="border-t border-white/5 align-top">
                  <td className="px-4 py-3"><div className="font-medium">{d.title}</div><div className="mt-1 line-clamp-2 max-w-xl text-xs text-text-secondary">{d.content}</div></td>
                  <td className="px-4 py-3"><Badge variant={d.status === 'published' ? 'green' : d.status === 'archived' ? 'warning' : 'muted'}>{d.status}</Badge></td>
                  <td className="px-4 py-3 text-text-secondary">{d.source || '—'}</td>
                  <td className="px-4 py-3 text-text-secondary">{new Date((d as any).updated_at || d.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="secondary" onClick={() => setForm({ id: d.id, title: d.title, content: d.content, source: d.source || '', status: d.status })}>Edit</Button>
                      {d.status !== 'published' && <Button size="sm" variant="outline" onClick={() => changeStatus(d.id, 'published')}>Publish</Button>}
                      {d.status !== 'archived' && <Button size="sm" variant="ghost" onClick={() => changeStatus(d.id, 'archived')}>Archive</Button>}
                      <Button size="sm" variant="danger" onClick={() => remove(d.id)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
