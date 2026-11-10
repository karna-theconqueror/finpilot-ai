import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase, supabaseConfigured } from '@/lib/supabase'

export type Profile = {
  id: string
  full_name: string | null
  role: 'customer' | 'admin'
  created_at?: string
}

type AuthContextValue = {
  session: Session | null
  user: User | null
  profile: Profile | null
  loading: boolean
  configured: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (fullName: string, email: string, password: string) => Promise<{ error?: string; needsConfirmation?: boolean }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error?: string }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = async (uid: string) => {
    if (!supabase) return null
    const { data, error } = await supabase.from('profiles').select('id, full_name, role, created_at').eq('id', uid).maybeSingle()
    if (error) return null
    return (data as Profile) ?? null
  }

  const refreshProfile = async () => {
    if (!user) { setProfile(null); return }
    const p = await loadProfile(user.id)
    setProfile(p)
  }

  useEffect(() => {
    let mounted = true
    if (!supabase) {
      setLoading(false)
      return
    }
    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return
      setSession(data.session)
      setUser(data.session?.user ?? null)
      if (data.session?.user) {
        const p = await loadProfile(data.session.user.id)
        if (mounted) setProfile(p)
      }
      if (mounted) setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)
      if (newSession?.user) {
        const p = await loadProfile(newSession.user.id)
        if (mounted) setProfile(p)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
    return () => { mounted = false; sub.subscription.unsubscribe() }
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    session,
    user,
    profile,
    loading,
    configured: supabaseConfigured,
    signIn: async (email, password) => {
      if (!supabase) return { error: 'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.' }
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      return { error: error?.message }
    },
    signUp: async (fullName, email, password) => {
      if (!supabase) return { error: 'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.' }
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      })
      if (error) return { error: error.message }
      // profile row should be created by DB trigger; fallback best-effort if session exists and policy allows
      if (data.user && data.session) {
        await supabase.from('profiles').upsert({ id: data.user.id, full_name: fullName, role: 'customer' }, { onConflict: 'id' })
      }
      return { needsConfirmation: !data.session }
    },
    signOut: async () => {
      if (!supabase) return
      await supabase.auth.signOut()
    },
    resetPassword: async (email) => {
      if (!supabase) return { error: 'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.' }
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/login` })
      return { error: error?.message }
    },
    refreshProfile,
  }), [session, user, profile, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
