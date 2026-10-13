create extension if not exists "uuid-ossp";

create table if not exists text_messages (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  char_count integer not null default 0,
  word_count integer not null default 0,
  is_pinned boolean not null default false,
  room_code text not null default 'public',
  created_at timestamptz not null default now()
);

alter table text_messages enable row level security;

create policy "Allow public read on text_messages"
  on text_messages for select
  using (true);

create policy "Allow public insert on text_messages"
  on text_messages for insert
  with check (true);

create policy "Allow public update on text_messages"
  on text_messages for update
  using (true);

create policy "Allow public delete on text_messages"
  on text_messages for delete
  using (true);

create table if not exists shared_files (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  size bigint not null,
  formatted_size text not null,
  type text not null,
  category text not null default 'other',
  storage_path text not null,
  public_url text not null,
  room_code text not null default 'public',
  created_at timestamptz not null default now()
);

alter table shared_files enable row level security;

create policy "Allow public read on shared_files"
  on shared_files for select
  using (true);

create policy "Allow public insert on shared_files"
  on shared_files for insert
  with check (true);

create policy "Allow public delete on shared_files"
  on shared_files for delete
  using (true);

insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do update set public = true;

create policy "Allow public read on uploads storage"
  on storage.objects for select
  using (bucket_id = 'uploads');

create policy "Allow public insert on uploads storage"
  on storage.objects for insert
  with check (bucket_id = 'uploads');

create policy "Allow public delete on uploads storage"
  on storage.objects for delete
  using (bucket_id = 'uploads');

alter publication supabase_realtime add table text_messages;
alter publication supabase_realtime add table shared_files;
