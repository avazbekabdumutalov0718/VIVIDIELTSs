-- ============================================================
-- VIVID IELTS — Supabase schema
-- Run this once in your Supabase project's SQL editor
-- (Dashboard → SQL Editor → New query → paste → Run)
-- ============================================================

-- 1) Profile info for each signed-up user
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  target_band numeric default 7.0,
  current_band numeric default 5.5,
  telegram_id bigint unique,
  created_at timestamptz default now()
);

-- 1b) If profiles already existed from an earlier run, add the new column safely.
alter table public.profiles add column if not exists telegram_id bigint unique;

-- 2) Vocabulary Lab progress — one row per learned word
create table if not exists public.vocab_progress (
  user_id uuid references auth.users(id) on delete cascade,
  word_id integer not null,
  learned_at timestamptz default now(),
  primary key (user_id, word_id)
);

-- 3) Grammar progress — one row per tense (12 total)
create table if not exists public.grammar_progress (
  user_id uuid references auth.users(id) on delete cascade,
  tense_id integer not null,
  unlocked boolean default false,
  best_score integer default 0,
  passed boolean default false,
  updated_at timestamptz default now(),
  primary key (user_id, tense_id)
);

-- 4) Reading test results
create table if not exists public.reading_results (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  test_id text not null,
  score integer not null,
  total integer not null,
  band numeric,
  vocab_score integer,
  completed_at timestamptz default now()
);

-- 5) Generic per-user app state (plan checkboxes, UI settings, etc.)
create table if not exists public.user_state (
  user_id uuid references auth.users(id) on delete cascade,
  key text not null,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now(),
  primary key (user_id, key)
);

-- ============================================================
-- Row Level Security — every user can only read/write their own rows
-- ============================================================
alter table public.profiles enable row level security;
alter table public.vocab_progress enable row level security;
alter table public.grammar_progress enable row level security;
alter table public.reading_results enable row level security;
alter table public.user_state enable row level security;

create policy "Users manage their own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "Users manage their own vocab progress" on public.vocab_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage their own grammar progress" on public.grammar_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage their own reading results" on public.reading_results
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage their own app state" on public.user_state
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- Auto-create a profile row whenever a new user signs up
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'IELTS Student'));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();