import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

const categories = [
  { title: 'Identity verification information', items: ['Government-issued photo ID (examples vary by country/lender)', 'Basic personal details as requested', 'Note: Do not upload real IDs in this MVP demo'], note: 'Requirements vary by institution.' },
  { title: 'Address verification information', items: ['Proof of residence documents (examples vary)', 'Current address details', 'May depend on lender policy'], note: 'General category guidance only.' },
  { title: 'Income information', items: ['Income statements or salary-related documents (as applicable)', 'Self-employed income evidence may differ', 'Lenders define acceptable formats'], note: 'Not lender-specific.' },
  { title: 'Employment information', items: ['Employment status/details', 'Employer information where relevant', 'Tenure/type may be considered by lenders'], note: 'Varies by product and lender.' },
  { title: 'Other lender-specific documentation', items: ['Product-specific forms or collateral documents (e.g. secured loans)', 'Additional verification as requested', 'Always check official lender requirements'], note: 'FinPilot provides education, not official checklists.' },
]

export default function DocumentGuidePage() {
  return (
    <div className="space-y-6">
      <div>
        <Badge variant="blue">Educational guide · Sample guidance only</Badge>
        <h1 className="mt-2 text-2xl font-semibold">Document Guide</h1>
        <p className="mt-1 text-sm text-text-secondary">Learn about common document categories that financial institutions may request. This MVP does not collect real Aadhaar, PAN, bank credentials, or actual identity documents.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {categories.map((c) => (
          <Card key={c.title}>
            <h2 className="font-semibold">{c.title}</h2>
            <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-text-secondary">
              {c.items.map((i) => <li key={i}>{i}</li>)}
            </ul>
            <p className="mt-3 text-xs text-brand-blue">{c.note}</p>
          </Card>
        ))}
      </div>
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-200">
        <strong>Important:</strong> Use sample data only. Never share sensitive personal identifiers, banking passwords, or real identity documents in this demo application.
      </div>
    </div>
  )
}
