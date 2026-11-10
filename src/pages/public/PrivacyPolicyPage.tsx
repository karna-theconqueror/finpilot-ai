import { Card } from '@/components/ui/Card'

export default function PrivacyPolicyPage() {
  return (
    <div className="container-page py-12">
      <h1 className="text-3xl font-semibold">Privacy Policy</h1>
      <p className="mt-2 text-text-secondary">Last updated: Demo MVP (Phase 1)</p>
      <div className="mt-8 space-y-4">
        <Card><h2 className="font-semibold">1. Purpose</h2><p className="mt-2 text-sm text-text-secondary">FinPilot AI is an educational and financial assistance platform. We aim to minimize data collection and use information only to provide learning features and account functionality.</p></Card>
        <Card><h2 className="font-semibold">2. Information we collect (MVP)</h2><p className="mt-2 text-sm text-text-secondary">When Supabase Auth is enabled, we may collect account information such as name and email. The MVP does not collect real identity documents (Aadhaar, PAN), banking passwords, or actual lender application data.</p></Card>
        <Card><h2 className="font-semibold">3. Demo data</h2><p className="mt-2 text-sm text-text-secondary">Dashboards and trackers may display sample/demo data clearly labeled as such. Demo application records are simulations and are not submitted to banks or lenders.</p></Card>
        <Card><h2 className="font-semibold">4. Security</h2><p className="mt-2 text-sm text-text-secondary">We design for secure authentication, role-based access, and server-side validation. No secrets or service-role keys are exposed in frontend code.</p></Card>
        <Card><h2 className="font-semibold">5. Contact</h2><p className="mt-2 text-sm text-text-secondary">For privacy questions in this demo environment, contact the project administrator.</p></Card>
      </div>
    </div>
  )
}
