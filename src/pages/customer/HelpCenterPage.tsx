import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

const faqs = [
  { q: 'What can FinPilot AI help with?', a: 'Educational guidance on lending concepts, common loan types, EMI learning, document categories, and guided journey stages.' },
  { q: 'What can it not do?', a: 'It cannot approve/reject loans, make credit decisions, guarantee eligibility, or provide lender-specific rates/policies as facts.' },
  { q: 'Is my application real?', a: 'No. The Application Tracker is a simulated demo for learning and does not submit anything to a bank or lender.' },
  { q: 'How is my data handled?', a: 'The MVP is designed for data minimization. Do not enter real identity documents or banking credentials.' },
]

export default function HelpCenterPage() {
  return (
    <div className="space-y-6">
      <div>
        <Badge variant="blue">Support & guidance</Badge>
        <h1 className="mt-2 text-2xl font-semibold">Help Center</h1>
        <p className="mt-1 text-sm text-text-secondary">Find answers to common questions and learn how to use FinPilot AI responsibly.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {faqs.map((f) => (
          <Card key={f.q}><h2 className="font-medium">{f.q}</h2><p className="mt-2 text-sm text-text-secondary">{f.a}</p></Card>
        ))}
      </div>
      <Card>
        <h2 className="font-semibold">Need more help?</h2>
        <p className="mt-2 text-sm text-text-secondary">Use the AI Assistant for lending education questions, or contact the demo administrator for platform support. For real financial decisions, consult qualified professionals and official lender information.</p>
      </Card>
    </div>
  )
}
