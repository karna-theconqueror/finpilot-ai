import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

export default function ProfilePage() {
  const { user, profile, signOut, resetPassword, refreshProfile, configured } = useAuth()
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase || !user) return
    setSaving(true); setMsg(null); setErr(null)
    const { error } = await supabase.from('profiles').update({ full_name: fullName }).eq('id', user.id)
    setSaving(false)
    if (error) setErr(error.message)
    else { setMsg('Profile updated.'); await refreshProfile() }
  }

  const onReset = async () => {
    if (!user?.email) return
    setMsg(null); setErr(null)
    const res = await resetPassword(user.email)
    if (res.error) setErr(res.error); else setMsg('Password reset email sent (if enabled).')
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Badge variant="blue">{configured ? 'Account' : 'Supabase not configured'}</Badge>
        <h1 className="mt-2 text-2xl font-semibold">Profile</h1>
        <p className="mt-1 text-sm text-text-secondary">Manage your account details. Profile data is stored securely in Supabase when configured.</p>
      </div>
      <Card>
        <h2 className="font-semibold">Account information</h2>
        <form className="mt-4 grid gap-4 sm:grid-cols-2" onSubmit={save}>
          <Input label="Full name" value={fullName || profile?.full_name || ''} onChange={(e) => setFullName(e.target.value)} />
          <Input label="Email" type="email" value={user?.email || ''} disabled />
          <Input label="Role" value={profile?.role || 'customer'} disabled />
          <Input label="User ID" value={user?.id || ''} disabled />
          {err && <p className="sm:col-span-2 text-sm text-red-300">{err}</p>}
          {msg && <p className="sm:col-span-2 text-sm text-brand-green">{msg}</p>}
          <div className="sm:col-span-2 flex flex-wrap gap-2">
            <Button type="submit" disabled={saving || !configured}>{saving ? 'Saving…' : 'Save changes'}</Button>
            <Button type="button" variant="secondary" onClick={onReset} disabled={!configured}>Send password reset email</Button>
            <Button type="button" variant="ghost" onClick={() => signOut()}>Log out</Button>
          </div>
        </form>
      </Card>
      <Card>
        <h2 className="font-semibold">Security notes</h2>
        <p className="mt-2 text-sm text-text-secondary">Your role and access are determined by your profile and enforced by server-side policies (RLS). Customers cannot change their own roles. Admin accounts are provisioned through trusted administrative processes.</p>
      </Card>
    </div>
  )
}
