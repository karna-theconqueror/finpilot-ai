import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export default function AboutPage() {
  return (
    <div className="container-page py-12">
      <Badge variant="blue">About</Badge>
      <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">About FinPilot AI</h1>
      <p className="mt-4 max-w-3xl text-text-secondary">
        FinPilot AI is an AI-powered financial journey platform designed to simplify how people learn about and navigate lending processes. It provides educational guidance, structured journeys, and responsible AI assistance — without acting as a bank, lender, or loan approval service.
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <Card>
          <h3 className="font-semibold">Our mission</h3>
          <p className="mt-2 text-sm text-text-secondary">Make financial concepts and lending journeys easier to understand through clear education and intelligent assistance.</p>
        </Card>
        <Card>
          <h3 className="font-semibold">What we do</h3>
          <p className="mt-2 text-sm text-text-secondary">Offer loan education, guided learning journeys, EMI education tools, document guidance, and a demo application tracker.</p>
        </Card>
        <Card>
          <h3 className="font-semibold">What we don’t do</h3>
          <p className="mt-2 text-sm text-text-secondary">We do not approve/reject loans, make credit decisions, guarantee eligibility, or collect real identity/banking credentials in the MVP.</p>
        </Card>
      </div>
      <Card className="mt-6">
        <h3 className="font-semibold">Modular future roadmap</h3>
        <p className="mt-2 text-sm text-text-secondary">The platform is built with a modular architecture. The first release focuses on the Lending module, with Insurance and Fintech assistants planned for future releases without rebuilding the core application.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="green">Lending (current)</Badge>
          <Badge variant="muted">Insurance (planned)</Badge>
          <Badge variant="muted">Fintech (planned)</Badge>
        </div>
      </Card>
    </div>
  )
}
