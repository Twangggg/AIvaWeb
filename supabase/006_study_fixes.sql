-- 006_study_fixes.sql — post-005 hardening for the study pipeline.
--  1) Remove duplicate study_sessions (same participant + same session_index)
--     that can be created by a race in the sandbox chat route (dry-run P900
--     showed two rows with session_index=1).
--  2) Add a UNIQUE constraint so the database itself refuses duplicates.
--  3) Re-create the export view identically (kept here so 6xx migrations are
--     self-contained if 005 was applied via a different path).
-- Read-only is NOT the case here: this deletes duplicate test rows. Scope is
-- pre-pilot dry-run data only; nothing else is touched.

-- (1) Clean duplicates: keep the newest session per (participant, session_index).
with dup as (
  select participant_code, session_index
  from study_sessions
  group by participant_code, session_index
  having count(*) > 1
),
kill as (
  select s.session_id
  from study_sessions s
  join dup d
    on d.participant_code = s.participant_code
   and d.session_index = s.session_index
  where s.session_id <> (
    select s2.session_id
    from study_sessions s2
    where s2.participant_code = s.participant_code
      and s2.session_index = s.session_index
    order by s2.started_at desc, s2.session_id desc
    limit 1
  )
)
delete from study_events where session_id in (select session_id from kill);

with dup as (
  select participant_code, session_index
  from study_sessions
  group by participant_code, session_index
  having count(*) > 1
),
kill as (
  select s.session_id
  from study_sessions s
  join dup d
    on d.participant_code = s.participant_code
   and d.session_index = s.session_index
  where s.session_id <> (
    select s2.session_id
    from study_sessions s2
    where s2.participant_code = s.participant_code
      and s2.session_index = s.session_index
    order by s2.started_at desc, s2.session_id desc
    limit 1
  )
)
delete from study_learning_items where session_id in (select session_id from kill);

with dup as (
  select participant_code, session_index
  from study_sessions
  group by participant_code, session_index
  having count(*) > 1
),
kill as (
  select s.session_id
  from study_sessions s
  join dup d
    on d.participant_code = s.participant_code
   and d.session_index = s.session_index
  where s.session_id <> (
    select s2.session_id
    from study_sessions s2
    where s2.participant_code = s.participant_code
      and s2.session_index = s.session_index
    order by s2.started_at desc, s2.session_id desc
    limit 1
  )
)
delete from study_sessions where session_id in (select session_id from kill);

-- (2) Unique (participant_code, session_index).
alter table public.study_sessions
  drop constraint if exists study_sessions_participant_code_session_key;
alter table public.study_sessions
  add constraint study_sessions_participant_code_session_key
  unique (participant_code, session_index);