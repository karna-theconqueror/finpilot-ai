import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

export function PublicFooter() {
  return (
    <footer className="border-t border-white/5 bg-bg-secondary/40">
      <div className="container-page grid gap-8 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-semibold">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-blue/20 text-brand-blue"><Sparkles size={18} /></span>
            FinPilot AI
          </div>
          <p className="mt-3 max-w-md text-sm text-text-secondary">
            AI-powered financial journey platform for lending education and assistance. Not a bank, lender, or loan approval service.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Product</h4>
          <ul className="mt-3 space-y-2 text-sm text-text-secondary">
            <li><Link to="/how-it-works" className="hover:text-text-primary">How it Works</Link></li>
            <li><Link to="/about" className="hover:text-text-primary">About FinPilot</Link></li>
            <li><Link to="/app/dashboard" className="hover:text-text-primary">Customer Portal</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Legal</h4>
          <ul className="mt-3 space-y-2 text-sm text-text-secondary">
            <li><Link to="/privacy" className="hover:text-text-primary">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-text-primary">Terms & Conditions</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 py-4 text-center text-xs text-text-secondary">
        © {new Date().getFullYear()} FinPilot AI. Educational demo platform.
      </div>
    </footer>
  )
}
