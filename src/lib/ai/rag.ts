import { supabase } from '@/lib/supabase'
import type { KnowledgeDocument } from '@/types'

export async function retrieveKnowledge(query: string, limit = 3): Promise<KnowledgeDocument[]> {
  if (!supabase) return []
  const terms = query.toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length > 2).slice(0, 5)
  // Simple retrieval: fetch published docs and score client-side (free-tier friendly, no vector extension required)
  const { data, error } = await supabase
    .from('knowledge_documents')
    .select('id,title,content,source,status,created_at')
    .eq('status', 'published')
    .limit(20)
  if (error || !data) return []
  const scored = (data as KnowledgeDocument[]).map((d) => {
    const hay = `${d.title} ${d.content}`.toLowerCase()
    const score = terms.reduce((acc, t) => acc + (hay.includes(t) ? 1 : 0), 0)
    return { d, score }
  }).sort((a, b) => b.score - a.score)
  const picked = scored.filter((s) => s.score > 0).slice(0, limit).map((s) => s.d)
  return picked.length ? picked : (data as KnowledgeDocument[]).slice(0, 1)
}

export function buildContext(docs: KnowledgeDocument[]): string {
  return docs.map((d) => `Source: ${d.title}${d.source ? ` (${d.source})` : ''}\n${d.content}`).join('\n\n---\n\n')
}
