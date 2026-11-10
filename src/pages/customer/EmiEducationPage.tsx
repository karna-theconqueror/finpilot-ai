import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { calculateEmi } from '@/utils/emi'

export default function EmiEducationPage() {
  const [principal, setPrincipal] = useState('500000')
  const [rate, setRate] = useState('10.5')
  const [months, setMonths] = useState('60')
  const [touched, setTouched] = useState(false)

  const p = Number(principal)
  const r = Number(rate)
  const n = Number(months)

  const errors = {
    p: !(p > 0 && p <= 1000000000) ? 'Enter a principal between 1 and 1,000,000,000' : '',
    r: !(r >= 0 && r <= 100) ? 'Enter an annual rate between 0 and 100' : '',
    n: !(Number.isInteger(n) && n > 0 && n <= 600) ? 'Enter duration in months (1–600)' : '',
  }
  const valid = !errors.p && !errors.r && !errors.n
  const result = useMemo(() => (valid ? calculateEmi(p, r, n) : null), [valid, p, r, n])

  const fmt = (v: number) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(v)

  return (
    <div className="space-y-6">
      <div>
        <Badge variant="blue">Educational calculator</Badge>
        <h1 className="mt-2 text-2xl font-semibold">EMI Education</h1>
        <p className="mt-1 text-sm text-text-secondary">Estimate monthly payments using the standard reducing-balance formula. Results are educational estimates, not lender quotations or loan offers.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold">Inputs</h2>
          <div className="mt-4 space-y-4" onBlur={() => setTouched(true)}>
            <Input label="Principal amount" type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} error={touched ? errors.p : ''} min={1} />
            <Input label="Annual interest rate (%)" type="number" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} error={touched ? errors.r : ''} min={0} />
            <Input label="Loan duration (months)" type="number" value={months} onChange={(e) => setMonths(e.target.value)} error={touched ? errors.n : ''} min={1} />
          </div>
          <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs text-text-secondary">
            Formula (reducing balance): EMI = P × r × (1+r)^n / ((1+r)^n − 1), where r is monthly rate. If rate is 0%, EMI = P / n.
          </div>
        </Card>

        <Card className="border-brand-blue/20">
          <h2 className="font-semibold">Estimated results</h2>
          {!valid ? (
            <p className="mt-4 text-sm text-text-secondary">Enter valid inputs to see estimates.</p>
          ) : result ? (
            <div className="mt-4 space-y-4">
              <div className="rounded-xl bg-brand-blue/10 p-4 border border-brand-blue/20">
                <p className="text-sm text-text-secondary">Estimated monthly EMI</p>
                <p className="mt-1 text-3xl font-semibold text-text-primary">₹ {fmt(result.emi)}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/5 p-4"><p className="text-sm text-text-secondary">Total repayment</p><p className="mt-1 text-xl font-semibold">₹ {fmt(result.total)}</p></div>
                <div className="rounded-xl border border-white/5 p-4"><p className="text-sm text-text-secondary">Total interest</p><p className="mt-1 text-xl font-semibold">₹ {fmt(result.interest)}</p></div>
              </div>
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-200">
                Educational estimate only — not a lender quotation, offer, or guarantee. Actual terms, rates, and fees vary by lender and individual circumstances.
              </div>
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  )
}
