# Deployment Guide (FinPilot AI MVP)

## Prerequisites
- Node.js 18+
- A Supabase project (free tier is sufficient)
- Vercel account (optional for frontend hosting)

## 1. Supabase setup
1. Create a Supabase project.
2. In SQL Editor, run migrations in order:
   - `supabase/migrations/001_init.sql`
3. Run seed data:
   - `supabase/seed.sql`
4. Verify RLS is enabled on all public tables and policies exist.
5. Copy project values:
   - Project URL -> `VITE_SUPABASE_URL`
   - Anon/public key -> `VITE_SUPABASE_ANON_KEY`

## 2. Environment variables
Create `finpilot-ai/.env`:
```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_APP_NAME=FinPilot AI
VITE_DEMO_MODE=false
```
Never expose the Supabase service role key in frontend code.

## 3. Authentication & admin provisioning (trusted process)
- Customers can register via the app (`/register`) using Supabase Auth.
- **Admin accounts must NOT be created/promoted via public registration.**
- Trusted admin provisioning:
  1. Create/invite the admin user in Supabase Auth (Dashboard/Auth admin tools).
  2. Ensure a `profiles` row exists for that user.
  3. Promote via privileged SQL (SQL Editor/service role context):
     ```sql
     update public.profiles set role = 'admin' where id = '<admin-user-uuid>';
     insert into public.audit_logs (actor_id, action, entity_type, entity_id)
     values ('<admin-user-uuid>', 'ADMIN_PROVISIONED', 'profile', '<admin-user-uuid>');
     ```
- Admin routes/UI require authenticated user with `profiles.role = 'admin'`; enforce authorization server-side/RLS for all data operations.

## 4. Edge Function (AI assistant)
- Function scaffold: `supabase/functions/ai-assistant/index.ts`
- Deploy (Supabase CLI, when configured):
  ```bash
  supabase functions deploy ai-assistant
  ```
- The frontend attempts to invoke `ai-assistant` when Supabase is configured and falls back to client-side grounded mock/RAG from published `knowledge_documents`.
- Keep any external LLM provider keys in server-side secrets (Edge Function env), never in frontend.

## 5. Local development
```bash
cd finpilot-ai
npm install
npm run dev
```
If Supabase env vars are missing, protected portals will show a configuration-required state (public pages remain viewable).

## 6. Quality checks
```bash
npm run typecheck
npm run build
npm test
# npm run test:e2e (configure Playwright and a running app first)
```

## 7. Vercel deployment (frontend)
1. Import the `finpilot-ai` directory/project into Vercel.
2. Framework preset: Vite.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Set environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, etc.).
6. Ensure SPA rewrites to `index.html` for client-side routing if needed.

## 8. Security & responsible AI checklist
- RLS enabled on all tables; verify policies in your Supabase project.
- No service role key in client bundle.
- Admin-only operations protected server-side/RLS.
- AI responses are educational only: no approvals, no credit decisions, no invented lender rates/policies.
- Do not collect real identity documents or banking credentials in MVP.

## 9. Known MVP limitations
- Some admin/customer modules include demo shells/fallbacks and may require additional CRUD wiring against Supabase for full production behavior.
- AI provider adapter for external LLMs is scaffolded; default mode is deterministic mock + knowledge retrieval.
- E2E tests require Playwright browser setup and environment configuration.