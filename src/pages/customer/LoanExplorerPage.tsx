import { useEffect, useMemo, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { LoanProduct } from '@/types'

type LoanCard = {
  id?: string
  name: string
  category: string
  desc: string
  characteristics: string[]
  docs: string[]
  education: string
}

const demoLoans: LoanCard[] = [
  { name: 'Personal Loan', category: 'Personal Loan', desc: 'Commonly used for personal expenses with flexible purposes.', characteristics: ['Often unsecured', 'Fixed installments common', 'Terms vary by lender'], docs: ['Identity', 'Income', 'Address'], education: 'General education only; not a lender offer.' },
  { name: 'Home Loan', category: 'Home Loan', desc: 'Typically used to purchase or construct property, often secured by the property.', characteristics: ['Usually long tenure', 'Property as collateral', 'Documentation can be extensive'], docs: ['Identity', 'Income', 'Property papers'], education: 'Rates/eligibility vary widely by institution.' },
  { name: 'Education Loan', category: 'Education Loan', desc: 'Supports education-related expenses such as tuition and fees.', characteristics: ['May include moratorium periods', 'Course/institution factors', 'Co-applicant sometimes required'], docs: ['Identity', 'Admission proof', 'Income/guarantor info'], education: 'Check institution-specific policies.' },
  { name: 'Vehicle Loan', category: 'Vehicle Loan', desc: 'Used to purchase a vehicle, often secured by the vehicle itself.', characteristics: ['Asset-backed', 'Tenure varies', 'Down payment common'], docs: ['Identity', 'Income', 'Vehicle details'], education: 'Costs and terms vary by lender.' },
  { name: 'Secured Loan', category: 'Secured Loan', desc: 'Loans backed by collateral, which may reduce lender risk.', characteristics: ['Requires collateral', 'Collateral valuation may apply', 'Terms vary'], docs: ['Identity', 'Collateral documents', 'Income'], education: 'Collateral requirements differ by lender.' },
  { name: 'Unsecured Loan', category: 'Unsecured Loan', desc: 'Loans without collateral; assessment often emphasizes credit/income factors.', characteristics: ['No collateral', 'Eligibility varies', 'Rates/fees vary'], docs: ['Identity', 'Income', 'Address'], education: 'Not a guarantee of eligibility.' },
]

function toCard(p: LoanProduct): LoanCard {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    desc: p.description || 'Educational information about this loan type.',
    characteristics: ['General characteristics vary by lender', 'Review eligibility and costs carefully', 'Educational information only'],
    docs: ['Identity', 'Income', 'Address'],
    education: 'General education only; not lender-specific policy or a loan offer.',
  }
}

export default function LoanExplorerPage() {
  const { configured } = useAuth()
  const [loans, setLoans] = useState<LoanCard[]>(demoLoans)
  const [source, setSource] = useState<'demo' | 'database'>('demo')
  const [selected, setSelected] = useState<LoanCard | null>(null)
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    async function load() {
      if (!configured || !supabase) { setLoans(demoLoans); setSource('demo'); return }
      setLoading(true)
      const { data, error } = await supabase.from('loan_products').select('id,name,description,category,is_active').eq('is_active', true).order('name')
      setLoading(false)
      if (!mounted) return
      if (!error && data && data.length) { setLoans((data as LoanProduct[]).map(toCard)); setSource('database') }
      else { setLoans(demoLoans); setSource('demo') }
    }
    load()
    return () => { mounted = false }
  }, [configured])

  const filtered = useMemo(() => loans.filter((l) => (l.name + l.category + l.desc).toLowerCase().includes(q.toLowerCase())), [loans, q])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge variant={source === 'database' ? 'green' : 'blue'}>{source === 'database' ? 'Loaded from database' : 'Demo educational catalogue'}</Badge>
          <h1 className="mt-2 text-2xl font-semibold">Loan Explorer</h1>
          <p className="mt-1 text-sm text-text-secondary">Learn about common loan categories and considerations. Information is general and not lender-specific policy.</p>
        </div>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search loans..." className="h-10 w-full max-w-xs rounded-xl border border-white/10 bg-bg-secondary px-3 text-sm outline-none focus:border-brand-blue/50" />
      </div>

      {loading && <p className="text-sm text-text-secondary">Loading loan products…</p>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((loan) => (
          <Card key={loan.id || loan.name} className="flex h-full flex-col">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-lg font-semibold">{loan.name}</h3>
              <Badge variant="violet">{loan.category}</Badge>
            </div>
            <p className="mt-2 text-sm text-text-secondary">{loan.desc}</p>
            <div className="mt-3">
              <p className="text-xs font-medium text-text-secondary">Key characteristics</p>
              <ul className="mt-1 list-inside list-disc text-sm text-text-secondary">
                {loan.characteristics.map((c) => <li key={c}>{c}</li>)}
              </ul>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {loan.docs.map((d) => <Badge key={d} variant="muted">{d}</Badge>)}
            </div>
            <p className="mt-3 text-xs text-text-secondary">{loan.education}</p>
            <div className="mt-4 pt-2">
              <Button variant="outline" size="sm" onClick={() => setSelected(loan)}>Learn More</Button>
            </div>
          </Card>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setSelected(null)}>
          <Card className="max-h-[85vh] w-full max-w-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div><h2 className="text-xl font-semibold">{selected.name}</h2><p className="mt-1 text-sm text-text-secondary">{selected.desc}</p></div>
              <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>Close</Button>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 text-sm">
              <div><h3 className="font-medium">How it generally works</h3><p className="mt-1 text-text-secondary">Borrowers apply, provide information/documents as requested, and lenders review based on their own criteria. Processes and timelines vary.</p></div>
              <div><h3 className="font-medium">Common eligibility factors</h3><p className="mt-1 text-text-secondary">May include identity, income stability, credit profile, existing obligations, and product-specific criteria (varies by lender).</p></div>
              <div><h3 className="font-medium">Possible costs</h3><p className="mt-1 text-text-secondary">Interest, fees, and charges may apply depending on lender and product. FinPilot does not quote specific rates or fees.</p></div>
              <div><h3 className="font-medium">Typical application stages</h3><p className="mt-1 text-text-secondary">Learn → prepare information → submit (to lender, outside this demo) → review/verification → outcome. This app tracks a simulated demo journey only.</p></div>
            </div>
            <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-200">
              Important: This is general educational information, not the policy of any particular financial institution and not a loan offer or approval.
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
