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
-- Mapping to 03-measures.md:
--   explore_complete_rate = explore_completed / NULLIF(explore_assigned,0)   (B2)
--   explore_start_rate    = explore_started   / NULLIF(explore_assigned,0)   (B1)
--   oracle_ratio (child)  = mean(oracle_like) across valid sessions           (A2)
--   time_to_final_answer_sec = first child_utterance -> first ANSWER_FULL policy decision (B4)
-- NOTE: must DROP then CREATE (column signature changed from an earlier version);
--       `create or replace view` cannot change column names/order.
drop view if exists public.export_session_features;
create view public.export_session_features as
select
  s.participant_code,
  en.condition,
  s.session_index,
  s.topic_id,
  de.cdepth as chain_depth,
  s.valid_for_primary,
  s.dropout_flag,
  s.parent_intervened_flag,
  round(extract(epoch from (coalesce(s.ended_at, s.started_at) - s.started_at)) / 60.0, 2) as duration_min,
  slc.oracle_like,
  slc.explore_assigned,
  slc.explore_started,
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
    count(*) filter (where ev.event_type = 'explore_assigned') as explore_assigned,
    count(*) filter (where ev.event_type = 'explore_started') as explore_started,
    count(*) filter (where ev.event_type = 'explore_completed') as explore_completed,
    count(*) filter (where ev.event_type = 'verify_submitted') as verify_count,
    -- Oracle-like session: at most 1 child turn and no explore completed
    count(*) filter (where ev.event_type = 'child_utterance') <= 1
      and count(*) filter (where ev.event_type = 'explore_completed') = 0 as oracle_like,
    -- B4: first child question -> first full answer unlock (ANSWER_FULL policy decision)
    (select case when a.ts is not null then extract(epoch from (a.ts - q.ts)) end
       from (
         select min(seq.ts) as ts
         from study_events seq
         where seq.session_id = s.session_id and seq.event_type = 'child_utterance'
       ) q
       cross join lateral (
select min(seq2.ts) as ts
          from study_events seq2
          where seq2.session_id = s.session_id
            and seq2.event_type = 'policy_decision'
            and seq2.policy_action = 'ANSWER_FULL'
       ) a
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