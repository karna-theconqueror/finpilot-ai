import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { useAuth } from '@/contexts/AuthContext'

export default function RegisterPage() {
  const { signUp, configured } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null); setNotice(null)
    if (!fullName || !email || !password) { setError('All fields are required.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (!agree) { setError('You must agree to the Terms and Privacy Policy.'); return }
    setLoading(true)
    const res = await signUp(fullName, email, password)
    setLoading(false)
    if (res.error) { setError(res.error); return }
    setNotice(res.needsConfirmation
      ? 'Account created. Please check your email to confirm your account before logging in (if email confirmation is enabled).'
      : 'Account created and signed in. You can now access the customer portal.')
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <Badge variant={configured ? 'blue' : 'warning'}>{configured ? 'Supabase Auth' : 'Supabase not configured'}</Badge>
        <h1 className="mt-3 text-2xl font-semibold">Create your account</h1>
        <p className="mt-2 text-sm text-text-secondary">Register as a customer for the FinPilot AI learning environment. Admin accounts are provisioned through a trusted administrative process, not public registration.</p>
        {!configured && <p className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-200">Configure <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to enable registration.</p>}
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <Input label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Doe" autoComplete="name" required />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password (min 8 chars)" autoComplete="new-password" required />
          <label className="flex items-start gap-2 text-sm text-text-secondary">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 rounded border-white/20 bg-bg-secondary" />
            <span>I agree to the <Link to="/terms" className="text-brand-blue">Terms</Link> and <Link to="/privacy" className="text-brand-blue">Privacy Policy</Link>.</span>
          </label>
          {error && <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}
          {notice && <p className="rounded-lg border border-brand-green/20 bg-brand-green/10 px-3 py-2 text-sm text-brand-green">{notice}</p>}
          <Button type="submit" className="w-full" disabled={loading || !configured}>{loading ? 'Creating account…' : 'Create account'}</Button>
        </form>
        <p className="mt-4 text-center text-sm text-text-secondary">
          Already have an account? <Link to="/login" className="text-brand-blue hover:underline">Log in</Link>
        </p>
      </Card>
    </div>
  )
}
