import { Link } from 'react-router-dom'
import { ArrowRight, Bot, ShieldCheck, Route, BookOpen, BarChart3, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

const features = [
  { icon: Bot, title: 'AI Lending Assistant', desc: 'Conversational guidance grounded in verified educational knowledge to help you understand lending concepts.' },
  { icon: BookOpen, title: 'Loan Explorer', desc: 'Clear, structured explanations of common loan types, characteristics, and considerations.' },
  { icon: Route, title: 'Guided Loan Journey', desc: 'Step-by-step educational journeys that help you learn processes and track progress.' },
  { icon: BarChart3, title: 'EMI Education', desc: 'Interactive calculator with transparent formulas and estimates labeled for learning only.' },
  { icon: ShieldCheck, title: 'Privacy & Security', desc: 'Designed with data minimization, secure patterns, and clear boundaries for financial assistance.' },
  { icon: MessageSquare, title: 'Help & Clarity', desc: 'Plain-language explanations, FAQs, and responsible AI responses that avoid invented facts.' },
]

const steps = [
  { title: 'Learn', desc: 'Explore loan types, terminology, and common processes through curated educational content.' },
  { title: 'Navigate', desc: 'Follow a guided journey to understand typical stages and documentation categories.' },
  { title: 'Ask AI', desc: 'Get grounded answers from the AI Lending Assistant with clear limitations and sources.' },
  { title: 'Track', desc: 'Monitor a simulated demo journey and application status for learning purposes.' },
]

const faqs = [
  { q: 'Is FinPilot AI a bank or lender?', a: 'No. FinPilot AI is an educational and financial assistance platform. It does not provide loans, approvals, or financial products.' },
  { q: 'Can the AI approve my loan?', a: 'No. The assistant provides educational guidance only and never makes creditworthiness or approval decisions.' },
  { q: 'Are EMI results a loan offer?', a: 'No. EMI calculations are educational estimates based on the values you enter and standard formulas.' },
  { q: 'Do I need to upload real identity documents?', a: 'No. The MVP uses sample/demo data and does not collect real Aadhaar, PAN, or banking credentials.' },
]

export default function LandingPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(22,119,255,0.18),transparent_55%),radial-gradient(ellipse_at_right,rgba(121,91,255,0.12),transparent_45%)]" />
        <div className="container-page grid gap-10 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
          <div className="animate-fade-in">
            <Badge variant="blue" className="mb-4">AI-Powered Lending Education</Badge>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Your Financial Journey, Made Simpler with AI.
            </h1>
            <p className="mt-5 max-w-xl text-base text-text-secondary sm:text-lg">
              Understand lending, navigate financial processes and get intelligent assistance throughout your journey.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register"><Button size="lg">Get Started <ArrowRight size={18} /></Button></Link>
              <Link to="/app/assistant"><Button size="lg" variant="secondary">Explore FinPilot AI</Button></Link>
            </div>
            <p className="mt-4 text-xs text-text-secondary">Educational platform • Not a lender • Demo features labeled</p>
          </div>
          <Card className="relative overflow-hidden border-brand-blue/20 bg-gradient-to-b from-bg-card to-bg-secondary p-0">
            <div className="border-b border-white/5 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2"><Bot className="text-brand-blue" size={18} /><span className="font-medium">AI Lending Assistant</span></div>
              <Badge variant="green">Demo</Badge>
            </div>
            <div className="space-y-3 p-5">
              <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-white/5 p-3 text-sm text-text-secondary">What is EMI and how is it calculated?</div>
              <div className="ml-auto max-w-[90%] rounded-2xl rounded-tr-md bg-brand-blue/15 p-3 text-sm text-text-primary border border-brand-blue/20">
                EMI (Equated Monthly Installment) is a fixed monthly payment used to repay a loan over time. It typically includes principal and interest components. The standard reducing-balance formula is: <span className="text-brand-blue">EMI = P × r × (1+r)^n / ((1+r)^n − 1)</span>.
                <div className="mt-2 text-xs text-text-secondary">Educational explanation • Not a lender quote</div>
              </div>
              <div className="max-w-[80%] rounded-2xl rounded-tl-md bg-white/5 p-3 text-sm text-text-secondary">What documents might a lender request?</div>
              <div className="ml-auto max-w-[90%] rounded-2xl rounded-tr-md bg-brand-blue/10 p-3 text-sm text-text-secondary border border-white/5">Common categories include identity, address, income, and employment information. Requirements vary by institution — FinPilot provides general guidance only.</div>
            </div>
          </Card>
        </div>
      </section>

      <section className="container-page py-16">
        <h2 className="section-title">Built for clarity and confidence</h2>
        <p className="section-subtitle">A premium experience for understanding lending concepts, journeys, and documentation — responsibly and transparently.</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="h-full transition hover:border-brand-blue/20">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue"><f.icon size={20} /></div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-text-secondary">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-white/5 bg-bg-secondary/30">
        <div className="container-page py-16">
          <h2 className="section-title">How it works</h2>
          <p className="section-subtitle">A simple, guided flow designed for learning and navigation.</p>
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {steps.map((s, i) => (
              <Card key={s.title} className="relative">
                <div className="mb-3 text-xs font-semibold text-brand-blue">Step {i + 1}</div>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-text-secondary">{s.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="section-title">Benefits for learners and customers</h2>
            <ul className="mt-6 space-y-3">
              {[
                'Understand loan types and terminology in plain language',
                'Learn typical documentation categories without sharing sensitive data',
                'Use an EMI calculator with transparent educational estimates',
                'Follow guided journeys and track demo progress',
                'Get responsible AI assistance grounded in verified knowledge',
              ].map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-text-secondary">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-brand-green" size={18} /> <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <Card className="border-brand-violet/20">
            <div className="flex items-center gap-2 text-brand-violet"><ShieldCheck size={18} /><span className="font-medium">Security & Responsible AI</span></div>
            <p className="mt-3 text-sm text-text-secondary">
              FinPilot AI is designed to minimize data collection, protect accounts with secure authentication patterns, and provide educational guidance only. The assistant does not approve loans, invent rates or policies, or collect real identity documents in the MVP.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="green">Educational only</Badge>
              <Badge variant="blue">RAG-ready</Badge>
              <Badge variant="violet">Privacy-first</Badge>
            </div>
          </Card>
        </div>
      </section>

      <section className="border-t border-white/5 bg-bg-secondary/30">
        <div className="container-page py-16">
          <h2 className="section-title">Frequently asked questions</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {faqs.map((f) => (
              <Card key={f.q}>
                <h3 className="font-medium">{f.q}</h3>
                <p className="mt-2 text-sm text-text-secondary">{f.a}</p>
              </Card>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-brand-blue/20 bg-brand-blue/5 p-6">
            <div>
              <h3 className="text-lg font-semibold">Ready to explore the lending journey?</h3>
              <p className="text-sm text-text-secondary">Start with demo data and learn safely in a guided environment.</p>
            </div>
            <Link to="/register"><Button size="lg">Create demo account <Sparkles size={16} /></Button></Link>
          </div>
        </div>
      </section>
    </div>
  )
}
