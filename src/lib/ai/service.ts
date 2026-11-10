import { supabase } from '@/lib/supabase'
import { mockProvider } from './mockProvider'
import { buildContext, retrieveKnowledge } from './rag'
import type { AIResponse } from './types'

export async function generateAssistantResponse(question: string): Promise<AIResponse> {
  // Prefer secure server-side Edge Function when Supabase is configured
  if (supabase) {
    try {
      const { data, error } = await supabase.functions.invoke('ai-assistant', { body: { question } })
      if (!error && data?.answer) {
        return {
          answer: String(data.answer),
          sources: Array.isArray(data.sources) ? data.sources : [],
          mode: data.mode === 'provider' ? 'provider' : 'mock',
        }
      }
    } catch {
      // fall through to client-side mock+RAG
    }
    // Client-side RAG fallback using published knowledge (authenticated read policy)
    try {
      const docs = await retrieveKnowledge(question)
      const context = buildContext(docs)
      const base = await mockProvider.generate({ question, context })
      return {
        ...base,
        sources: docs.map((d) => ({ id: d.id, title: d.title, source: d.source })),
      }
    } catch {
      // ignore
    }
  }
  return mockProvider.generate({ question })
}
