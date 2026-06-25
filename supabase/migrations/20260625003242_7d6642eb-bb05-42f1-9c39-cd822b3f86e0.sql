
create table public.web_vitals (
  id uuid primary key default gen_random_uuid(),
  session_key text,
  metric text not null,
  value double precision not null,
  rating text,
  device text,
  path text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  created_at timestamptz not null default now()
);

create index web_vitals_metric_created_idx on public.web_vitals (metric, created_at desc);
create index web_vitals_created_idx on public.web_vitals (created_at desc);

grant all on public.web_vitals to service_role;

alter table public.web_vitals enable row level security;

create policy "deny all anon select" on public.web_vitals for select to anon using (false);
create policy "deny all anon insert" on public.web_vitals for insert to anon with check (false);
create policy "deny all authenticated select" on public.web_vitals for select to authenticated using (false);
create policy "deny all authenticated insert" on public.web_vitals for insert to authenticated with check (false);
