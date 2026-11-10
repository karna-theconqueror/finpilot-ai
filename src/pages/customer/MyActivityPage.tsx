import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

const items = [
  { action: 'Completed step: "Understand loan types"', module: 'Loan Journey', time: 'Today, 10:12 AM', type: 'Journey' },
  { action: 'Asked: "What documents might a lender request?"', module: 'AI Assistant', time: 'Today, 09:40 AM', type: 'Assistant' },
  { action: 'Calculated EMI estimate (₹500,000 / 10.5% / 60 mo)', module: 'EMI Education', time: 'Yesterday', type: 'Tool' },
  { action: 'Viewed "Education Loan" details', module: 'Loan Explorer', time: 'Yesterday', type: 'Learning' },
]

export default function MyActivityPage() {
  return (
    <div className="space-y-6">
      <div>
        <Badge variant="blue">Demo activity</Badge>
        <h1 className="mt-2 text-2xl font-semibold">My Activity</h1>
        <p className="mt-1 text-sm text-text-secondary">A summary of your recent learning and demo interactions. Real persistence will be added with Supabase in Phase 2.</p>
      </div>
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-white/5 text-left text-text-secondary">
              <tr><th className="px-4 py-3 font-medium">Activity</th><th className="px-4 py-3 font-medium">Module</th><th className="px-4 py-3 font-medium">Type</th><th className="px-4 py-3 font-medium">Time</th></tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.action} className="border-t border-white/5">
                  <td className="px-4 py-3">{i.action}</td>
                  <td className="px-4 py-3 text-text-secondary">{i.module}</td>
                  <td className="px-4 py-3"><Badge variant="muted">{i.type}</Badge></td>
                  <td className="px-4 py-3 text-text-secondary">{i.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
