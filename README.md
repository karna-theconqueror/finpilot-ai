# FinPilot AI

AI-powered financial journey platform focused on lending education and assistance.

> **Important:** This is an educational and financial assistance platform. It is **not** a bank, lender, or loan approval service. Demo/simulated features are clearly labeled and must never be treated as real financial applications, offers, or approvals.

## Stack
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router, Lucide React
- **Backend:** Supabase (PostgreSQL, Auth, Edge Functions, RLS)
- **AI:** Provider-independent service with deterministic mock provider, RAG retrieval from published knowledge, and secure Edge Function scaffold
- **Testing:** Vitest, React Testing Library, Playwright

## Project location
Implemented in `finpilot-ai/` (isolated subdirectory) to preserve unrelated existing work in the workspace root.

## Getting started
```bash
cd finpilot-ai
npm install
cp .env.example .env   # configure Supabase to enable auth/data features
npm run dev
```

## Scripts
- `npm run dev` - start dev server
- `npm run build` - production build (`tsc -b && vite build`)
- `npm run preview` - preview production build
- `npm run typecheck` - TypeScript checks
- `npm run test` - Vitest unit tests
- `npm run test:e2e` - Playwright tests (requires Playwright setup/environment)

## Supabase (Phase 2+)
1. Run `supabase/migrations/001_init.sql` in your Supabase project.
2. Run `supabase/seed.sql`.
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`.
4. Deploy Edge Function `supabase/functions/ai-assistant` when ready (optional; app includes safe fallbacks).
5. **Admin provisioning:** create admins via trusted administrative process only (never public registration). See `DEPLOYMENT.md`.

## Implemented capabilities (MVP)
- Public website: landing, about, how it works, login/register, privacy, terms
- Customer portal: dashboard, AI assistant, loan explorer, loan journey, EMI education, document guide, simulated application tracker, activity, profile, help
- Admin portal: dashboard, user/journey/knowledge/conversation/analytics/audit/settings modules (UI + data-aware/demo-safe foundations)
- Supabase Auth integration, protected routes, role-aware admin access checks (UI) + RLS policies (DB)
- AI architecture: mock provider, knowledge retrieval/RAG helpers, service with Edge Function invocation + fallback
- EMI calculator (reducing-balance, zero-interest and validation handling)
- Database schema for profiles, loan_products, journeys, journey_steps, knowledge_documents, conversations, messages, application_records, audit_logs

## Documentation
- `DEPLOYMENT.md` - setup, migrations/seed, auth/admin provisioning, Edge Function, Vercel, security notes
- `supabase/migrations/001_init.sql` - schema, constraints, indexes, triggers, RLS
- `supabase/seed.sql` - demo/educational seed data
- `.env.example` - environment template

## Quality checks run (latest)
- `npm run typecheck` - passed
- `npm run build` - passed
- `npm test` - passed (Vitest)

## Notes
- Run without paid services: core demo/educational UI and calculations work; Supabase-backed auth/persistence/real queries activate when configured.
- The assistant provides educational guidance only and must not approve loans, guarantee eligibility, or invent lender-specific rates/policies.
