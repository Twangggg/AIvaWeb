create table if not exists public.preorders (
  id bigint generated always as identity primary key,
  full_name text not null,
  email text not null,
  phone text not null,
  note text,
  created_at timestamptz not null default now()
);

alter table public.preorders enable row level security;

drop policy if exists "Allow anonymous insert preorders" on public.preorders;
create policy "Allow anonymous insert preorders"
on public.preorders
for insert
to anon
with check (true);
