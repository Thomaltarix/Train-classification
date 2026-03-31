alter table public.models
add column if not exists user_id uuid references auth.users(id) on delete cascade;

update public.models
set user_id = (
  select id
  from auth.users
  order by created_at asc
  limit 1
)
where user_id is null;

alter table public.models
alter column user_id set not null;

create index if not exists models_user_id_idx on public.models (user_id);

alter table public.models enable row level security;
alter table public.images enable row level security;

drop policy if exists "Allow authenticated read on models" on public.models;
drop policy if exists "Allow authenticated read on images" on public.images;
drop policy if exists "Users can read own models" on public.models;
drop policy if exists "Users can insert own models" on public.models;
drop policy if exists "Users can delete own models" on public.models;
drop policy if exists "Users can read images linked to own models" on public.images;
drop policy if exists "Users can insert images linked to own models" on public.images;

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
