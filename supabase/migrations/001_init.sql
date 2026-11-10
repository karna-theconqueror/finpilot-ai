-- FinPilot AI MVP schema (Phase 2)
-- Requires pgcrypto for gen_random_uuid() in Supabase projects (usually enabled)

create extension if not exists pgcrypto;

-- Profiles (linked to auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'customer' check (role in ('customer','admin')),
  created_at timestamptz not null default now()
);

-- Loan products (educational catalogue)
create table if not exists public.loan_products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Journeys (per user, optionally linked to product)
create table if not exists public.journeys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  loan_product_id uuid references public.loan_products(id) on delete set null,
  status text not null default 'active' check (status in ('active','completed','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Journey steps
create table if not exists public.journey_steps (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid not null references public.journeys(id) on delete cascade,
  step_key text not null,
  title text not null,
  status text not null default 'pending' check (status in ('pending','completed')),
  position int not null default 0,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (journey_id, step_key)
);

-- Knowledge documents (verified KB for RAG)
create table if not exists public.knowledge_documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  source text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Conversations
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Messages
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  role text not null check (role in ('user','assistant','system')),
  content text not null,
  created_at timestamptz not null default now()
);

-- Application records (DEMO/simulated only)
create table if not exists public.application_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  journey_id uuid references public.journeys(id) on delete set null,
  demo_status text not null default 'Draft' check (demo_status in ('Draft','Submitted','Under Review','Completed','Cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Audit logs (administrative actions)
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id text,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_loan_products_active on public.loan_products(is_active);
create index if not exists idx_journeys_user on public.journeys(user_id);
create index if not exists idx_journey_steps_journey on public.journey_steps(journey_id);
create index if not exists idx_journey_steps_position on public.journey_steps(journey_id, position);
create index if not exists idx_knowledge_status on public.knowledge_documents(status);
create index if not exists idx_conversations_user on public.conversations(user_id);
create index if not exists idx_messages_conversation on public.messages(conversation_id, created_at);
create index if not exists idx_application_records_user on public.application_records(user_id);
create index if not exists idx_audit_logs_actor on public.audit_logs(actor_id, created_at desc);

-- updated_at trigger helper
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_loan_products_updated on public.loan_products;
create trigger trg_loan_products_updated before update on public.loan_products for each row execute function public.set_updated_at();
drop trigger if exists trg_journeys_updated on public.journeys;
create trigger trg_journeys_updated before update on public.journeys for each row execute function public.set_updated_at();
drop trigger if exists trg_journey_steps_updated on public.journey_steps;
create trigger trg_journey_steps_updated before update on public.journey_steps for each row execute function public.set_updated_at();
drop trigger if exists trg_knowledge_updated on public.knowledge_documents;
create trigger trg_knowledge_updated before update on public.knowledge_documents for each row execute function public.set_updated_at();
drop trigger if exists trg_conversations_updated on public.conversations;
create trigger trg_conversations_updated before update on public.conversations for each row execute function public.set_updated_at();
drop trigger if exists trg_application_records_updated on public.application_records;
create trigger trg_application_records_updated before update on public.application_records for each row execute function public.set_updated_at();

-- Create profile on signup (trusted default role = customer; admins provisioned separately)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), 'customer')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper: is_admin (uses profiles; evaluated under RLS-aware queries via policies)
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles p where p.id = uid and p.role = 'admin');
$$;

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.loan_products enable row level security;
alter table public.journeys enable row level security;
alter table public.journey_steps enable row level security;
alter table public.knowledge_documents enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.application_records enable row level security;
alter table public.audit_logs enable row level security;

-- PROFILES: users can read/update own (but cannot escalate role); admins can read all and manage
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin" on public.profiles
for select using (auth.uid() = id or public.is_admin(auth.uid()));

drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self" on public.profiles
for insert with check (auth.uid() = id and role = 'customer');

drop policy if exists "profiles_update_own_no_role_change" on public.profiles;
create policy "profiles_update_own_no_role_change" on public.profiles
for update using (auth.uid() = id)
with check (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()));

drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all" on public.profiles
for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- LOAN PRODUCTS: active readable by authenticated customers; admins manage all
drop policy if exists "loan_products_read" on public.loan_products;
create policy "loan_products_read" on public.loan_products
for select using (is_active = true or public.is_admin(auth.uid()));

drop policy if exists "loan_products_admin_write" on public.loan_products;
create policy "loan_products_admin_write" on public.loan_products
for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- JOURNEYS: owner or admin
drop policy if exists "journeys_owner_select" on public.journeys;
create policy "journeys_owner_select" on public.journeys
for select using (user_id = auth.uid() or public.is_admin(auth.uid()));
drop policy if exists "journeys_owner_insert" on public.journeys;
create policy "journeys_owner_insert" on public.journeys
for insert with check (user_id = auth.uid() or public.is_admin(auth.uid()));
drop policy if exists "journeys_owner_update" on public.journeys;
create policy "journeys_owner_update" on public.journeys
for update using (user_id = auth.uid() or public.is_admin(auth.uid())) with check (user_id = auth.uid() or public.is_admin(auth.uid()));
drop policy if exists "journeys_owner_delete" on public.journeys;
create policy "journeys_owner_delete" on public.journeys
for delete using (user_id = auth.uid() or public.is_admin(auth.uid()));

-- JOURNEY STEPS: via journey ownership or admin
drop policy if exists "journey_steps_select" on public.journey_steps;
create policy "journey_steps_select" on public.journey_steps
for select using (exists (select 1 from public.journeys j where j.id = journey_id and (j.user_id = auth.uid() or public.is_admin(auth.uid()))));
drop policy if exists "journey_steps_write" on public.journey_steps;
create policy "journey_steps_write" on public.journey_steps
for all using (exists (select 1 from public.journeys j where j.id = journey_id and (j.user_id = auth.uid() or public.is_admin(auth.uid()))))
with check (exists (select 1 from public.journeys j where j.id = journey_id and (j.user_id = auth.uid() or public.is_admin(auth.uid()))));

-- KNOWLEDGE DOCUMENTS: published readable by authenticated users; admins manage all
drop policy if exists "knowledge_read_published" on public.knowledge_documents;
create policy "knowledge_read_published" on public.knowledge_documents
for select using (status = 'published' or public.is_admin(auth.uid()));
drop policy if exists "knowledge_admin_write" on public.knowledge_documents;
create policy "knowledge_admin_write" on public.knowledge_documents
for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- CONVERSATIONS: owner or admin
drop policy if exists "conversations_owner" on public.conversations;
create policy "conversations_owner" on public.conversations
for all using (user_id = auth.uid() or public.is_admin(auth.uid()))
with check (user_id = auth.uid() or public.is_admin(auth.uid()));

-- MESSAGES: via conversation ownership or admin
drop policy if exists "messages_owner" on public.messages;
create policy "messages_owner" on public.messages
for all using (exists (select 1 from public.conversations c where c.id = conversation_id and (c.user_id = auth.uid() or public.is_admin(auth.uid()))))
with check (exists (select 1 from public.conversations c where c.id = conversation_id and (c.user_id = auth.uid() or public.is_admin(auth.uid()))));

-- APPLICATION RECORDS (demo): owner or admin
drop policy if exists "application_records_owner" on public.application_records;
create policy "application_records_owner" on public.application_records
for all using (user_id = auth.uid() or public.is_admin(auth.uid()))
with check (user_id = auth.uid() or public.is_admin(auth.uid()));

-- AUDIT LOGS: admins can read; inserts allowed for admins (and server-side processes). No broad user access.
drop policy if exists "audit_logs_admin_select" on public.audit_logs;
create policy "audit_logs_admin_select" on public.audit_logs
for select using (public.is_admin(auth.uid()));
drop policy if exists "audit_logs_admin_insert" on public.audit_logs;
create policy "audit_logs_admin_insert" on public.audit_logs
for insert with check (public.is_admin(auth.uid()));
