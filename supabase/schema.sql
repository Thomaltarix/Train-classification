create extension if not exists "pgcrypto";

create table if not exists public.models (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text,
  reference text not null,
  category text not null check (
    category in (
      'locomotive',
      'voiture',
      'wagon',
      'automotrice',
      'autorail',
      'engin_chantier'
    )
  ),
  type text not null check (type in ('electrique', 'diesel')),
  color text not null,
  length numeric,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.images (
  id uuid primary key default gen_random_uuid(),
  model_id uuid not null references public.models(id) on delete cascade,
  path text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists models_category_idx on public.models (category);
create index if not exists models_type_idx on public.models (type);
create index if not exists models_user_id_idx on public.models (user_id);
create index if not exists images_model_id_idx on public.images (model_id);

alter table public.models enable row level security;
alter table public.images enable row level security;

drop policy if exists "Allow authenticated read on models" on public.models;
drop policy if exists "Allow authenticated read on images" on public.images;

create policy "Users can read own models"
on public.models
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own models"
on public.models
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can delete own models"
on public.models
for delete
to authenticated
using (auth.uid() = user_id);

create policy "Users can read images linked to own models"
on public.images
for select
to authenticated
using (
  exists (
    select 1
    from public.models
    where public.models.id = public.images.model_id
      and public.models.user_id = auth.uid()
  )
);

create policy "Users can insert images linked to own models"
on public.images
for insert
to authenticated
with check (
  exists (
    select 1
    from public.models
    where public.models.id = public.images.model_id
      and public.models.user_id = auth.uid()
  )
);
