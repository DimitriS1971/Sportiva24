create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  image text not null default '/hero/hero-sportiva24.svg',
  category text not null default 'Fútbol',
  published_at timestamptz,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.articles enable row level security;

create policy "Public can read published articles"
  on public.articles for select
  using (published_at is not null and published_at <= now());

create policy "Authenticated admins can manage articles"
  on public.articles for all
  to authenticated
  using (true)
  with check (true);

create table if not exists public.site_stats (
  id boolean primary key default true check (id),
  visits bigint not null default 0,
  updated_at timestamptz not null default now()
);

insert into public.site_stats (id, visits)
values (true, 0)
on conflict (id) do nothing;

alter table public.site_stats enable row level security;

create or replace function public.increment_site_visits()
returns bigint
language sql
security definer
set search_path = public
as $$
  insert into public.site_stats (id, visits, updated_at)
  values (true, 1, now())
  on conflict (id) do update
    set visits = public.site_stats.visits + 1,
        updated_at = now();
  select visits from public.site_stats where id = true;
$$;

revoke all on function public.increment_site_visits() from public;
grant execute on function public.increment_site_visits() to anon, authenticated;
