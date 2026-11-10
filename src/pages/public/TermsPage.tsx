import { Card } from '@/components/ui/Card'

export default function TermsPage() {
  return (
    <div className="container-page py-12">
      <h1 className="text-3xl font-semibold">Terms and Conditions</h1>
      <p className="mt-2 text-text-secondary">Last updated: Demo MVP (Phase 1)</p>
      <div className="mt-8 space-y-4">
        <Card><h2 className="font-semibold">1. Educational service only</h2><p className="mt-2 text-sm text-text-secondary">FinPilot AI provides educational guidance about lending concepts and processes. It is not a bank, lender, financial advisor, or loan approval service.</p></Card>
        <Card><h2 className="font-semibold">2. No financial decisions</h2><p className="mt-2 text-sm text-text-secondary">The platform does not approve or reject loans, make creditworthiness decisions, guarantee eligibility, or provide lender-specific offers, rates, or policies.</p></Card>
        <Card><h2 className="font-semibold">3. Estimates and simulations</h2><p className="mt-2 text-sm text-text-secondary">EMI calculations are educational estimates. Application tracker statuses are simulated demo records and do not represent real submissions to financial institutions.</p></Card>
        <Card><h2 className="font-semibold">4. Acceptable use</h2><p className="mt-2 text-sm text-text-secondary">Users must not submit sensitive personal/financial secrets to the MVP. Do not rely on demo content as professional financial or legal advice.</p></Card>
        <Card><h2 className="font-semibold">5. Changes</h2><p className="mt-2 text-sm text-text-secondary">These terms may evolve as the product matures across future phases.</p></Card>
      </div>
    </div>
  )
}
