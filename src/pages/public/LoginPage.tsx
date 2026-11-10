import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const { signIn, resetPassword, configured } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation() as { state?: { from?: { pathname?: string } } }
  const from = location.state?.from?.pathname || '/app/dashboard'

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null); setNotice(null)
    if (!email || !password) { setError('Email and password are required.'); return }
    setLoading(true)
    const res = await signIn(email, password)
    setLoading(false)
    if (res.error) { setError(res.error); return }
    navigate(from, { replace: true })
  }

  const onReset = async () => {
    setError(null); setNotice(null)
    if (!email) { setError('Enter your email address to receive a password reset link.'); return }
    setLoading(true)
    const res = await resetPassword(email)
    setLoading(false)
    if (res.error) setError(res.error)
    else setNotice('If an account exists for this email, a password reset link has been sent.')
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <Badge variant={configured ? 'blue' : 'warning'}>{configured ? 'Supabase Auth' : 'Supabase not configured'}</Badge>
        <h1 className="mt-3 text-2xl font-semibold">Log in</h1>
        <p className="mt-2 text-sm text-text-secondary">Access your FinPilot AI account securely with Supabase Authentication.</p>
        {!configured && <p className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-200">Configure <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to enable login.</p>}
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" required />
          {error && <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}
          {notice && <p className="rounded-lg border border-brand-green/20 bg-brand-green/10 px-3 py-2 text-sm text-brand-green">{notice}</p>}
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Session persists securely via Supabase.</span>
            <button type="button" onClick={onReset} className="text-brand-blue hover:underline" disabled={loading}>Forgot password?</button>
          </div>
          <Button type="submit" className="w-full" disabled={loading || !configured}>{loading ? 'Please wait…' : 'Log in'}</Button>
        </form>
        <p className="mt-4 text-center text-sm text-text-secondary">
          Don&apos;t have an account? <Link to="/register" className="text-brand-blue hover:underline">Register</Link>
        </p>
      </Card>
    </div>
  )
}
