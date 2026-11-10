import { supabase } from '@/lib/supabase'
import type { ApplicationRecord, Journey, JourneyStep, KnowledgeDocument, LoanProduct, Profile } from '@/types'

export async function listProfiles() {
  if (!supabase) return { data: [] as Profile[], error: 'Supabase not configured' }
  const { data, error } = await supabase.from('profiles').select('id,full_name,role,created_at').order('created_at', { ascending: false })
  return { data: (data as Profile[]) || [], error: error?.message }
}

export async function listKnowledgeDocuments(all = false) {
  if (!supabase) return { data: [] as KnowledgeDocument[], error: 'Supabase not configured' }
  let q = supabase.from('knowledge_documents').select('*').order('updated_at', { ascending: false })
  if (!all) q = q.eq('status', 'published')
  const { data, error } = await q
  return { data: (data as KnowledgeDocument[]) || [], error: error?.message }
}

export async function upsertKnowledgeDocument(doc: Partial<KnowledgeDocument> & { title: string; content: string }) {
  if (!supabase) return { error: 'Supabase not configured' }
  const payload = {
    title: doc.title,
    content: doc.content,
    source: doc.source ?? 'FinPilot Verified Knowledge Base',
    status: doc.status ?? 'draft',
  }
  if (doc.id) {
    const { error } = await supabase.from('knowledge_documents').update(payload).eq('id', doc.id)
    return { error: error?.message }
  }
  const { error } = await supabase.from('knowledge_documents').insert(payload)
  return { error: error?.message }
}

export async function setKnowledgeStatus(id: string, status: 'draft' | 'published' | 'archived') {
  if (!supabase) return { error: 'Supabase not configured' }
  const { error } = await supabase.from('knowledge_documents').update({ status }).eq('id', id)
  return { error: error?.message }
}

export async function deleteKnowledgeDocument(id: string) {
  if (!supabase) return { error: 'Supabase not configured' }
  const { error } = await supabase.from('knowledge_documents').delete().eq('id', id)
  return { error: error?.message }
}

export async function listAuditLogs() {
  if (!supabase) return { data: [] as any[], error: 'Supabase not configured' }
  const { data, error } = await supabase.from('audit_logs').select('id,actor_id,action,entity_type,entity_id,created_at').order('created_at', { ascending: false }).limit(100)
  return { data: data || [], error: error?.message }
}

export async function logAudit(action: string, entity_type?: string, entity_id?: string) {
  if (!supabase) return
  const { data: { user } } = await supabase.auth.getUser()
  await supabase.from('audit_logs').insert({ actor_id: user?.id ?? null, action, entity_type, entity_id })
}

export async function listMyApplicationRecords(userId: string) {
  if (!supabase) return { data: [] as ApplicationRecord[], error: 'Supabase not configured' }
  const { data, error } = await supabase.from('application_records').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  return { data: (data as ApplicationRecord[]) || [], error: error?.message }
}

export async function createDemoApplication(userId: string, journeyId?: string | null) {
  if (!supabase) return { error: 'Supabase not configured' }
  const { error } = await supabase.from('application_records').insert({ user_id: userId, journey_id: journeyId ?? null, demo_status: 'Draft' })
  return { error: error?.message }
}

export async function updateDemoApplication(id: string, demo_status: ApplicationRecord['demo_status']) {
  if (!supabase) return { error: 'Supabase not configured' }
  const { error } = await supabase.from('application_records').update({ demo_status }).eq('id', id)
  return { error: error?.message }
}

export async function listLoanProducts() {
  if (!supabase) return { data: [] as LoanProduct[], error: 'Supabase not configured' }
  const { data, error } = await supabase.from('loan_products').select('*').order('name')
  return { data: (data as LoanProduct[]) || [], error: error?.message }
}

export async function upsertJourneyForUser(userId: string, loanProductId: string | null, titleSteps: { step_key: string; title: string; position: number }[]) {
  if (!supabase) return { error: 'Supabase not configured' }
  const { data: journey, error: jErr } = await supabase.from('journeys').insert({ user_id: userId, loan_product_id: loanProductId, status: 'active' }).select('*').single()
  if (jErr || !journey) return { error: jErr?.message || 'Failed to create journey' }
  const steps = titleSteps.map((s) => ({ journey_id: (journey as Journey).id, step_key: s.step_key, title: s.title, position: s.position, status: 'pending' }))
  const { error: sErr } = await supabase.from('journey_steps').insert(steps)
  return { error: sErr?.message, journeyId: (journey as Journey).id }
}

export async function listJourneysWithSteps(userId: string) {
  if (!supabase) return { data: [] as (Journey & { journey_steps: JourneyStep[] })[], error: 'Supabase not configured' }
  const { data, error } = await supabase.from('journeys').select('*, journey_steps(*)').eq('user_id', userId).order('created_at', { ascending: false })
  return { data: (data as any[]) || [], error: error?.message }
}

export async function setJourneyStepStatus(stepId: string, status: 'pending' | 'completed') {
  if (!supabase) return { error: 'Supabase not configured' }
  const { error } = await supabase.from('journey_steps').update({ status, completed_at: status === 'completed' ? new Date().toISOString() : null }).eq('id', stepId)
  return { error: error?.message }
}

export async function adminCounts() {
  if (!supabase) return { error: 'Supabase not configured' as string, data: null as any }
  const [profiles, journeys, completedJourneys, knowledge, conversations, audit] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('journeys').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('journeys').select('id', { count: 'exact', head: true }).eq('status', 'completed'),
    supabase.from('knowledge_documents').select('id', { count: 'exact', head: true }),
    supabase.from('conversations').select('id', { count: 'exact', head: true }),
    supabase.from('audit_logs').select('id', { count: 'exact', head: true }),
  ])
  return {
    error: profiles.error?.message || journeys.error?.message || completedJourneys.error?.message || knowledge.error?.message || conversations.error?.message || audit.error?.message,
    data: {
      users: profiles.count ?? 0,
      activeJourneys: journeys.count ?? 0,
      completedJourneys: completedJourneys.count ?? 0,
      knowledge: knowledge.count ?? 0,
      conversations: conversations.count ?? 0,
      audit: audit.count ?? 0,
    },
  }
}

export async function listAllConversations() {
  if (!supabase) return { data: [] as any[], error: 'Supabase not configured' }
  const { data, error } = await supabase.from('conversations').select('id,user_id,title,created_at,updated_at,messages(count)').order('updated_at', { ascending: false }).limit(50)
  return { data: data || [], error: error?.message }
}

export async function listAllJourneys() {
  if (!supabase) return { data: [] as any[], error: 'Supabase not configured' }
  const { data, error } = await supabase.from('journeys').select('id,user_id,status,loan_product_id,created_at,updated_at,journey_steps(count)').order('updated_at', { ascending: false }).limit(50)
  return { data: data || [], error: error?.message }
}

export async function listKnowledgeStats() {
  if (!supabase) return { data: null as any, error: 'Supabase not configured' }
  const { data, error } = await supabase.from('knowledge_documents').select('status')
  if (error) return { data: null, error: error.message }
  const counts = { published: 0, draft: 0, archived: 0 }
  ;(data || []).forEach((d: any) => { if (counts[d.status as keyof typeof counts] !== undefined) counts[d.status as keyof typeof counts]++ })
  return { data: counts, error: undefined }
}
