import { Link } from 'react-router-dom'
import { Bot, BookOpen, Route, Calculator, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

const demoActivity = [
  { text: 'Started "Personal Loan Basics" journey', time: 'Today · Demo' },
  { text: 'Asked AI: "What is EMI?"', time: 'Today · Demo' },
  { text: 'Viewed Home Loan education page', time: 'Yesterday · Demo' },
]

export default function CustomerDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge variant="blue">Demo data</Badge>
          <h1 className="mt-2 text-2xl font-semibold">Welcome back, Demo User</h1>
          <p className="mt-1 text-sm text-text-secondary">Track your learning, explore loans, and get guided assistance in a safe educational environment.</p>
        </div>
        <Link to="/app/assistant"><Button><Bot size={16} /> Open AI Assistant</Button></Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card><CardTitle>Active journeys</CardTitle><p className="mt-2 text-3xl font-semibold">2</p><p className="text-xs text-text-secondary">Demo</p></Card>
        <Card><CardTitle>Steps completed</CardTitle><p className="mt-2 text-3xl font-semibold">5/14</p><p className="text-xs text-text-secondary">36% progress · Demo</p></Card>
        <Card><CardTitle>AI conversations</CardTitle><p className="mt-2 text-3xl font-semibold">3</p><p className="text-xs text-text-secondary">Demo</p></Card>
        <Card><CardTitle>Saved topics</CardTitle><p className="mt-2 text-3xl font-semibold">4</p><p className="text-xs text-text-secondary">Demo</p></Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><div><CardTitle>Active learning journeys</CardTitle><CardDescription>Demo progress across lending education</CardDescription></div><Link to="/app/journey" className="text-sm text-brand-blue hover:underline">View all</Link></CardHeader>
          <div className="space-y-4">
            {[{ name: 'Personal Loan Basics', progress: 57 }, { name: 'Understanding Home Loans', progress: 14 }].map((j) => (
              <div key={j.name} className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <div className="flex items-center justify-between text-sm"><span className="font-medium">{j.name}</span><span className="text-text-secondary">{j.progress}%</span></div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-brand-blue" style={{ width: `${j.progress}%` }} /></div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader><div><CardTitle>Recent activity</CardTitle><CardDescription>Demo activity feed</CardDescription></div></CardHeader>
          <ul className="space-y-3">
            {demoActivity.map((a) => (
              <li key={a.text} className="flex gap-3 text-sm">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand-green" />
                <div><p>{a.text}</p><p className="text-xs text-text-secondary">{a.time}</p></div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Quick actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { to: '/app/loans', icon: BookOpen, title: 'Loan Explorer', desc: 'Compare loan types' },
            { to: '/app/journey', icon: Route, title: 'Loan Journey', desc: 'Continue learning steps' },
            { to: '/app/emi', icon: Calculator, title: 'EMI Education', desc: 'Estimate repayments' },
            { to: '/app/documents', icon: BookOpen, title: 'Document Guide', desc: 'Common document categories' },
          ].map((q) => (
            <Link key={q.to} to={q.to}>
              <Card className="h-full transition hover:border-brand-blue/20">
                <q.icon className="text-brand-blue" size={20} />
                <h3 className="mt-3 font-medium">{q.title}</h3>
                <p className="mt-1 text-sm text-text-secondary">{q.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-brand-blue">Open <ArrowRight size={14} /></span>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader><div><CardTitle>Frequently asked questions</CardTitle><CardDescription>Quick educational answers</CardDescription></div></CardHeader>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-text-secondary">
          <p><span className="text-text-primary">Is this a lender?</span> No, FinPilot AI is educational only.</p>
          <p><span className="text-text-primary">Are EMI results offers?</span> No, they are estimates for learning.</p>
          <p><span className="text-text-primary">Can AI approve loans?</span> No, never.</p>
          <p><span className="text-text-primary">Do I upload real IDs?</span> No, MVP uses demo/sample guidance only.</p>
        </div>
      </Card>
    </div>
  )
}
