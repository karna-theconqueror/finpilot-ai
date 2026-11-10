// Supabase Edge Function: ai-assistant (Phase 4 scaffold)
// Secure server-side entry point for AI responses. Do NOT expose provider keys to frontend.
// This scaffold returns a deterministic, grounded educational response using mock logic.
// Replace/extend with provider adapter + RAG retrieval against published knowledge_documents.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function mockAnswer(question: string) {
  const q = question.toLowerCase()
  if (q.includes('emi')) return 'EMI (Equated Monthly Installment) is a fixed monthly payment that typically includes principal and interest. A common reducing-balance formula is EMI = P × r × (1+r)^n / ((1+r)^n − 1). This is educational information only, not a lender quotation or offer.'
  if (q.includes('secured') || q.includes('unsecured')) return 'Secured loans are usually backed by collateral; unsecured loans generally are not. Eligibility, rates, and terms vary by lender. Educational guidance only.'
  if (q.includes('document')) return 'Lenders may request categories like identity, address, income, and employment information. Requirements vary by institution. This MVP does not collect real identity documents.'
  if (q.includes('interest')) return 'An interest rate is the cost of borrowing, often expressed annually. Actual rates and fees vary by lender and circumstances; I cannot invent lender-specific rates.'
  if (q.includes('submit')) return 'After submission to a lender, applications typically go through review/verification stages with timelines that vary. FinPilot provides simulated demo tracking only, not real submissions or approvals.'
  return 'I can provide general lending education (loan types, EMI concepts, common document categories, and typical stages). I do not approve loans, guarantee eligibility, or invent lender-specific rates/policies.'
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const authHeader = req.headers.get('Authorization') ?? ''
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnon = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseAnon, { global: { headers: { Authorization: authHeader } } })

    const { data: { user }, error: userErr } = await supabase.auth.getUser()
    if (userErr || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const body = await req.json().catch(() => ({}))
    const question = String(body?.question || '').slice(0, 2000)
    if (!question) return new Response(JSON.stringify({ error: 'Question is required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    // TODO Phase 4: retrieve relevant published knowledge_documents (RAG), generate grounded response via provider adapter, include sources.
    const answer = mockAnswer(question)
    return new Response(JSON.stringify({ answer, sources: [], mode: 'mock' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
