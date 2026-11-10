import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Circle, ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { listJourneysWithSteps, setJourneyStepStatus, upsertJourneyForUser } from '@/services/supabaseData'
import type { JourneyStep } from '@/types'

const template = [
  { step_key: 'intro', title: 'Introduction', desc: 'Overview of the lending learning journey and what to expect.' },
  { step_key: 'types', title: 'Understand loan types', desc: 'Learn differences between common loan categories and use cases.' },
  { step_key: 'eligibility', title: 'Learn common eligibility factors', desc: 'Understand factors lenders may consider (general education only).' },
  { step_key: 'docs', title: 'Understand possible documentation', desc: 'Review common document categories without sharing real sensitive data.' },
  { step_key: 'submit', title: 'Learn about application submission', desc: 'What submission typically involves when applying with a lender.' },
  { step_key: 'review', title: 'Understand review processes', desc: 'Typical verification and review stages; timelines vary by lender.' },
  { step_key: 'complete', title: 'Complete the educational journey', desc: 'Review learnings and next steps for informed conversations with lenders.' },
]

type LocalStep = { id?: string; step_key: string; title: string; desc: string; status: 'pending'|'completed'; position: number }

export default function LoanJourneyPage() {
  const { user, configured } = useAuth()
  const [steps, setSteps] = useState<LocalStep[]>(template.map((t, i) => ({ ...t, status: i < 3 ? 'completed' : 'pending', position: i })))
  const [active, setActive] = useState(3)
  const [journeyId, setJourneyId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canPersist = Boolean(configured && user)

  const load = async () => {
    if (!canPersist || !user) return
    setLoading(true); setError(null)
    const res = await listJourneysWithSteps(user.id)
    setLoading(false)
    if (res.error) { setError(res.error); return }
    const j = (res.data || [])[0]
    if (j && j.journey_steps) {
      setJourneyId(j.id)
      const mapped: LocalStep[] = (j.journey_steps as JourneyStep[])
        .sort((a,b) => a.position - b.position)
        .map((s) => ({ id: s.id, step_key: s.step_key, title: s.title, desc: template.find(t => t.step_key === s.step_key)?.desc || 'Educational step.', status: s.status, position: s.position }))
      if (mapped.length) {
        setSteps(mapped)
        const firstPending = mapped.findIndex(m => m.status !== 'completed')
        setActive(firstPending >= 0 ? firstPending : 0)
      }
    }
  }

  useEffect(() => { load() }, [user?.id, configured])

  const startJourney = async () => {
    if (!canPersist || !user) { setError('Configure Supabase and sign in to save journey progress.'); return }
    setLoading(true); setError(null)
    const res = await upsertJourneyForUser(user.id, null, template.map((t, i) => ({ step_key: t.step_key, title: t.title, position: i })))
    setLoading(false)
    if (res.error) { setError(res.error); return }
    await load()
  }

  const completed = steps.filter((s) => s.status === 'completed').length
  const progress = Math.round((completed / steps.length) * 100)

  const toggleComplete = async () => {
    const s = steps[active]
    const next = s.status === 'completed' ? 'pending' : 'completed'
    // optimistic local update
    setSteps((prev) => prev.map((x, i) => i === active ? { ...x, status: next } : x))
    if (canPersist && s.id) {
      const res = await setJourneyStepStatus(s.id, next)
      if (res.error) { setError(res.error); await load() }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge variant={journeyId ? 'green' : 'blue'}>{journeyId ? 'Saved journey' : canPersist ? 'Not started in DB' : 'Local demo'}</Badge>
          <h1 className="mt-2 text-2xl font-semibold">Loan Journey</h1>
          <p className="mt-1 text-sm text-text-secondary">A guided educational journey to understand lending processes. Progress can be saved to your account when Supabase is configured.</p>
        </div>
        <div className="min-w-[220px]">
          <div className="flex justify-between text-sm"><span>Progress</span><span className="text-text-secondary">{progress}%</span></div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-brand-green" style={{ width: `${progress}%` }} /></div>
        </div>
      </div>

      {canPersist && !journeyId && (
        <Card className="flex flex-wrap items-center justify-between gap-3 border-brand-blue/20">
          <div><h2 className="font-medium">Save your journey progress</h2><p className="text-sm text-text-secondary">Create a journey record in your account to persist steps and resume later.</p></div>
          <Button onClick={startJourney} disabled={loading}>{loading ? 'Creating…' : 'Start & save journey'}</Button>
        </Card>
      )}

      {error && <p className="text-sm text-red-300">{error}</p>}

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Card className="p-3">
          <div className="space-y-1">
            {steps.map((s, i) => (
              <button key={s.step_key} onClick={() => setActive(i)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${active === i ? 'bg-brand-blue/10 border border-brand-blue/20' : 'hover:bg-white/5 border border-transparent'}`}>
                {s.status === 'completed' ? <CheckCircle2 className="shrink-0 text-brand-green" size={18} /> : <Circle className="shrink-0 text-text-secondary" size={18} />}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{i + 1}. {s.title}</p>
                  <p className="text-xs text-text-secondary">{s.status === 'completed' ? 'Completed' : 'Pending'}</p>
                </div>
                <ChevronRight size={16} className="text-text-secondary" />
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <Badge variant={steps[active].status === 'completed' ? 'green' : 'muted'}>{steps[active].status === 'completed' ? 'Completed' : 'Pending'}</Badge>
          <h2 className="mt-3 text-xl font-semibold">{active + 1}. {steps[active].title}</h2>
          <p className="mt-2 text-text-secondary">{steps[active].desc}</p>
          <div className="mt-5 space-y-3 text-sm text-text-secondary">
            <p><span className="font-medium text-text-primary">What you’ll learn:</span> Key concepts and typical considerations related to this stage, presented as general education.</p>
            <p><span className="font-medium text-text-primary">Important:</span> This is not lender-specific advice, not a loan offer, and not an approval process.</p>
            <ul className="list-inside list-disc space-y-1">
              <li>Review explanations and examples (educational content)</li>
              <li>Ask the AI Assistant for clarification</li>
              <li>Mark the step complete when you’re ready and revisit anytime</li>
            </ul>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button onClick={toggleComplete} disabled={loading}>{steps[active].status === 'completed' ? 'Mark as pending' : 'Mark step complete'}</Button>
            <Button variant="secondary" onClick={() => setActive(Math.max(0, active - 1))} disabled={active === 0}>Previous</Button>
            <Button variant="secondary" onClick={() => setActive(Math.min(steps.length - 1, active + 1))} disabled={active === steps.length - 1}>Next</Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
