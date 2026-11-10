import { useEffect, useMemo, useState } from 'react'
import { Send, Plus, Trash2, Bot, User, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { generateAssistantResponse } from '@/lib/ai/service'
import type { Conversation, Message } from '@/types'

const suggestions = [
  'What is a personal loan?',
  'Explain secured and unsecured loans.',
  'What is EMI?',
  'What documents might a lender request?',
  'Explain interest rates.',
  'What happens after submitting a loan application?',
]

type Msg = { id: string; role: 'user' | 'assistant'; content: string; time: string; sources?: { title: string; source?: string | null }[] }

const welcome: Msg = {
  id: 'welcome',
  role: 'assistant',
  content: 'Hi! I’m the FinPilot AI Lending Assistant. Ask about loan types, EMI, common documentation categories, or application journey stages. I provide educational guidance only and never make loan approvals or invent lender-specific rates/policies.',
  time: new Date().toLocaleTimeString(),
}

export default function AIAssistantPage() {
  const { user, configured } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Msg[]>([welcome])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadingHistory, setLoadingHistory] = useState(false)

  const canPersist = Boolean(configured && supabase && user)

  const loadConversations = async () => {
    if (!canPersist || !supabase || !user) return
    const { data } = await supabase.from('conversations').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20)
    if (data) setConversations(data as Conversation[])
  }

  const loadMessages = async (convId: string) => {
    if (!canPersist || !supabase) return
    setLoadingHistory(true)
    const { data, error } = await supabase.from('messages').select('*').eq('conversation_id', convId).order('created_at', { ascending: true })
    setLoadingHistory(false)
    if (error) { setError(error.message); return }
    const mapped: Msg[] = (data as Message[]).map((m) => ({ id: m.id, role: m.role as 'user'|'assistant', content: m.content, time: new Date(m.created_at).toLocaleTimeString() }))
    setMessages(mapped.length ? mapped : [welcome])
  }

  useEffect(() => { loadConversations() }, [user?.id, configured])

  useEffect(() => { if (currentId) loadMessages(currentId); else setMessages([welcome]) }, [currentId])

  const ensureConversation = async (firstQuestion: string): Promise<string | null> => {
    if (!canPersist || !supabase || !user) return null
    if (currentId) return currentId
    const title = firstQuestion.slice(0, 60)
    const { data, error } = await supabase.from('conversations').insert({ user_id: user.id, title }).select('*').single()
    if (error || !data) { setError(error?.message || 'Could not create conversation'); return null }
    const conv = data as Conversation
    setCurrentId(conv.id)
    setConversations((c) => [conv, ...c])
    return conv.id
  }

  const persistMessage = async (convId: string, role: 'user'|'assistant', content: string) => {
    if (!canPersist || !supabase) return
    await supabase.from('messages').insert({ conversation_id: convId, role, content })
  }

  const send = async (text: string) => {
    const q = text.trim()
    if (!q || loading) return
    setError(null)
    const now = new Date().toLocaleTimeString()
    const userMsg: Msg = { id: crypto.randomUUID(), role: 'user', content: q, time: now }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setLoading(true)

    let convId: string | null = currentId
    try {
      convId = await ensureConversation(q)
      if (convId) await persistMessage(convId, 'user', q)
    } catch { /* non-blocking */ }

    try {
      const res = await generateAssistantResponse(q)
      const assistantMsg: Msg = { id: crypto.randomUUID(), role: 'assistant', content: res.answer, time: new Date().toLocaleTimeString(), sources: res.sources }
      setMessages((m) => [...m, assistantMsg])
      if (convId) await persistMessage(convId, 'assistant', res.answer)
    } catch (e: any) {
      setError('The assistant is temporarily unavailable. Please try again.')
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: 'assistant', content: 'I could not generate a response right now. Please try again in a moment.', time: new Date().toLocaleTimeString() }])
    } finally {
      setLoading(false)
    }
  }

  const clearConversation = async () => {
    if (currentId && canPersist && supabase) {
      await supabase.from('messages').delete().eq('conversation_id', currentId)
      await supabase.from('conversations').delete().eq('id', currentId)
      setConversations((c) => c.filter((x) => x.id !== currentId))
    }
    setCurrentId(null)
    setMessages([welcome])
    setError(null)
  }

  const newConversation = () => {
    setCurrentId(null)
    setMessages([welcome])
    setError(null)
  }

  const titleList = useMemo(() => conversations, [conversations])

  return (
    <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
      <div className="space-y-4">
        <Card>
          <div className="flex items-center justify-between"><h2 className="font-semibold">Conversations</h2><Badge variant={canPersist ? 'green' : 'blue'}>{canPersist ? 'Saved' : 'Local demo'}</Badge></div>
          <p className="mt-2 text-sm text-text-secondary">{canPersist ? 'Your conversations are stored securely in your account.' : 'Connect Supabase to persist conversations for authenticated users.'}</p>
          <div className="mt-4 space-y-2 max-h-56 overflow-y-auto">
            <button onClick={newConversation} className={`w-full rounded-xl border px-3 py-2 text-left text-sm ${!currentId ? 'border-brand-blue/20 bg-brand-blue/10' : 'border-white/5 hover:bg-white/5'}`}>Current (new)</button>
            {titleList.map((c) => (
              <button key={c.id} onClick={() => setCurrentId(c.id)} className={`w-full rounded-xl border px-3 py-2 text-left text-sm ${currentId === c.id ? 'border-brand-blue/20 bg-brand-blue/10' : 'border-white/5 hover:bg-white/5'}`}>
                <div className="truncate">{c.title || 'Conversation'}</div>
                <div className="text-xs text-text-secondary">{new Date(c.created_at).toLocaleDateString()}</div>
              </button>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <Button variant="secondary" size="sm" className="flex-1" onClick={newConversation}><Plus size={14} /> New</Button>
            <Button variant="ghost" size="sm" className="flex-1" onClick={clearConversation}><Trash2 size={14} /> Clear</Button>
          </div>
        </Card>
        <Card>
          <h3 className="font-medium">Suggested questions</h3>
          <div className="mt-3 flex flex-col gap-2">
            {suggestions.map((s) => (
              <button key={s} onClick={() => send(s)} className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2 text-left text-sm text-text-secondary hover:border-brand-blue/20 hover:text-text-primary">{s}</button>
            ))}
          </div>
        </Card>
      </div>

      <Card className="flex h-[70vh] min-h-[520px] flex-col p-0">
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
          <div className="flex items-center gap-2"><Bot className="text-brand-blue" size={18} /><span className="font-semibold">AI Lending Assistant</span><Badge variant="green">Grounded · RAG-ready</Badge></div>
          <span className="text-xs text-text-secondary">Educational guidance only</span>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {loadingHistory && <div className="text-sm text-text-secondary">Loading conversation…</div>}
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : ''}`}>
              {m.role === 'assistant' && <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-blue/15 text-brand-blue"><Bot size={16} /></div>}
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${m.role === 'user' ? 'bg-brand-blue text-white rounded-tr-md' : 'bg-white/5 text-text-primary border border-white/5 rounded-tl-md'}`}>
                <p className="whitespace-pre-wrap">{m.content}</p>
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-2 border-t border-white/10 pt-2 text-xs text-text-secondary">
                    Sources: {m.sources.map((s) => s.title).join(', ')}
                  </div>
                )}
                <p className={`mt-1 text-[11px] ${m.role === 'user' ? 'text-blue-100' : 'text-text-secondary'}`}>{m.time}</p>
              </div>
              {m.role === 'user' && <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-text-secondary"><User size={16} /></div>}
            </div>
          ))}
          {loading && <div className="flex items-center gap-2 text-sm text-text-secondary"><Loader2 size={16} className="animate-spin text-brand-blue" /> Generating grounded response…</div>}
          {error && <p className="text-sm text-red-300">{error}</p>}
        </div>
        <form className="border-t border-white/5 p-4" onSubmit={(e) => { e.preventDefault(); send(input) }}>
          <div className="flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about loans, EMI, documents, or journey steps..." className="h-11 flex-1 rounded-xl border border-white/10 bg-bg-secondary px-4 text-sm outline-none focus:border-brand-blue/50 focus:ring-2 focus:ring-brand-blue/20" />
            <Button type="submit" disabled={!input.trim() || loading} aria-label="Send"><Send size={16} /></Button>
          </div>
          <p className="mt-2 text-xs text-text-secondary">Responses are educational, grounded when knowledge is available, and never loan decisions. Do not share sensitive personal or banking information.</p>
        </form>
      </Card>
    </div>
  )
}
