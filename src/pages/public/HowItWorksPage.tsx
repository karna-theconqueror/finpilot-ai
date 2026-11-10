import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

const steps = [
  { title: 'Create a demo account', desc: 'Register and access the customer portal in a safe demo environment (Phase 2 will enable Supabase Auth).' },
  { title: 'Explore loan education', desc: 'Browse the Loan Explorer to understand common loan types, characteristics, and considerations.' },
  { title: 'Follow a guided journey', desc: 'Move through step-by-step educational stages and save your progress as you learn.' },
  { title: 'Ask the AI Assistant', desc: 'Use the AI Lending Assistant for grounded educational answers from a verified knowledge base (RAG in Phase 4).' },
  { title: 'Use learning tools', desc: 'Estimate EMI for education, review document categories, and track a simulated demo application.' },
]

export default function HowItWorksPage() {
  return (
    <div className="container-page py-12">
      <Badge variant="blue">Guide</Badge>
      <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">How FinPilot AI Works</h1>
      <p className="mt-4 max-w-3xl text-text-secondary">A transparent, educational flow to help you understand lending concepts and navigate typical processes responsibly.</p>
      <div className="mt-10 space-y-4">
        {steps.map((s, i) => (
          <Card key={s.title} className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-blue/15 font-semibold text-brand-blue">{i + 1}</div>
            <div>
              <h3 className="font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-text-secondary">{s.desc}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
