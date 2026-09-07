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
