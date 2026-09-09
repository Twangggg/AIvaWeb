-- Study curation tables for the curiosity-adaptive companion
-- Mirrors docs/research/10-logging-schema.md (DRAFT v0.1)
-- Append-only event log; pseudonymous participant_code.

create table if not exists public.study_enrollments (
  participant_code text primary key,
  child_age_band text not null,            -- 7-8 / 9-10
  condition text not null check (condition in ('C0','C1','C2')),
  consent_audio boolean not null default false,
  consent_image boolean not null default false,
  policy_version_pin text,
  created_at timestamptz not null default now()
);

create table if not exists public.study_sessions (
  session_id uuid primary key default gen_random_uuid(),
  participant_code text not null references public.study_enrollments(participant_code),
  session_index int not null,
  topic_id text,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  valid_for_primary boolean not null default true,
  dropout_flag boolean not null default false,
  parent_intervened_flag boolean not null default false,
  notes text
);

create table if not exists public.study_events (
  event_id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.study_sessions(session_id),
  ts timestamptz not null default now(),
  actor text not null check (actor in ('child','ai','parent','system')),
  event_type text not null,
  utterance_text text,
  question_code text,          -- S/D/P/U filled during annotation
  policy_action text,
  policy_reason text,
  policy_version text,
  state_snapshot jsonb,
  explore_task_id text,
  verify_method text,
  meta jsonb
);

create table if not exists public.study_learning_items (
  id bigint generated always as identity primary key,
  session_id uuid not null references public.study_sessions(session_id),
  phase text not null check (phase in ('pre','post')),
  item_id text not null,
  response text,
  score numeric
);

-- Post-session / post-study surveys (child_post, parent_final).
create table if not exists public.study_surveys (
  id bigint generated always as identity primary key,
  session_id uuid references public.study_sessions(session_id) on delete cascade,
  participant_code text references public.study_enrollments(participant_code),
  survey_type text not null check (survey_type in ('child_post','parent_final')),
  answers jsonb not null default '{}'::jsonb,
  submitted_at timestamptz not null default now()
);

-- RLS: study data is read by service role only; block anon/authenticated by default.
alter table public.study_enrollments enable row level security;
alter table public.study_sessions enable row level security;
alter table public.study_events enable row level security;
alter table public.study_learning_items enable row level security;
alter table public.study_surveys enable row level security;

drop policy if exists "No public study writes" on public.study_enrollments;
drop policy if exists "No public study reads" on public.study_enrollments;
drop policy if exists "No public study writes" on public.study_sessions;
drop policy if exists "No public study reads" on public.study_sessions;
drop policy if exists "No public study writes" on public.study_events;
drop policy if exists "No public study reads" on public.study_events;
drop policy if exists "No public study writes" on public.study_learning_items;
drop policy if exists "No public study reads" on public.study_learning_items;
drop policy if exists "No public study writes" on public.study_surveys;
drop policy if exists "No public study reads" on public.study_surveys;

-- Export view: one row / session with computed features (see 10-logging-schema.md CSV).
create or replace view public.export_session_features as
select
  s.participant_code,
  en.condition,
  s.session_index,
  s.topic_id,
  de.cdepth as chain_depth,
  s.valid_for_primary,
  slc.oracle_like,
  slc.explore_completed,
  slc.verify_count,
  slc.time_to_final_answer_sec,
  slc.escape_used,
  pre.score as pre_score,
  post.score as post_score,
  (post.score - pre.score) as learning_gain
from study_sessions s
join study_enrollments en on en.participant_code = s.participant_code
join lateral (
  select coalesce(max((ev.state_snapshot->>'chain_depth')::int), 0) as cdepth
  from study_events ev
  where ev.session_id = s.session_id
) de on true
join lateral (
  select
    bool_or(ev.event_type = 'escape_used') as escape_used,
    count(*) filter (where ev.event_type = 'child_utterance') as child_turns,
    count(*) filter (where ev.event_type = 'explore_completed') as explore_completed,
    count(*) filter (where ev.event_type = 'verify_submitted') as verify_count,
    count(*) filter (where ev.event_type = 'child_utterance') <= 1
      and count(*) filter (where ev.event_type = 'explore_completed') = 0 as oracle_like,
    (select extract(epoch from (max(seq.ts) - min(seq.ts)))
       from study_events seq
      where seq.session_id = s.session_id
        and seq.event_type = 'child_utterance'
    ) as time_to_final_answer_sec
  from study_events ev
  where ev.session_id = s.session_id
) slc on true
join lateral (
  select coalesce(avg(li.score), 0) as score
  from study_learning_items li
  where li.session_id = s.session_id and li.phase = 'pre'
) pre on true
join lateral (
  select coalesce(avg(li.score), 0) as score
  from study_learning_items li
  where li.session_id = s.session_id and li.phase = 'post'
) post on true;