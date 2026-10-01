create table if not exists public.s24_prediction_snapshots (
  id uuid primary key default gen_random_uuid(),
  match_id text not null,
  generated_at timestamptz not null,
  model_version text not null,
  feature_version text not null,
  status text not null check (status in ('ready', 'limited-data', 'insufficient-data')),
  data_quality_score integer not null check (data_quality_score between 0 and 100),
  prediction jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists s24_prediction_snapshots_match_generated_idx
  on public.s24_prediction_snapshots (match_id, generated_at desc);

alter table public.s24_prediction_snapshots enable row level security;