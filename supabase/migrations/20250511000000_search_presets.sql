-- Career OS: initial schema for search presets (requires Supabase Auth later)
-- Run in Supabase SQL editor or via CLI: supabase db push

create table if not exists public.search_presets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null default 'My search',
  roles text[] not null default '{}',
  locations text[] not null default '{}',
  extra_query text,
  board_ids text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists search_presets_user_id_idx
  on public.search_presets (user_id);

alter table public.search_presets enable row level security;

create policy "Users read own presets"
  on public.search_presets for select
  using (auth.uid() = user_id);

create policy "Users insert own presets"
  on public.search_presets for insert
  with check (auth.uid() = user_id);

create policy "Users update own presets"
  on public.search_presets for update
  using (auth.uid() = user_id);

create policy "Users delete own presets"
  on public.search_presets for delete
  using (auth.uid() = user_id);

comment on table public.search_presets is 'Saved ATS Google search presets; synced from app after auth.';
