alter table text_messages add column if not exists room_code text not null default 'public';
alter table shared_files add column if not exists room_code text not null default 'public';
create index if not exists idx_text_messages_room_code on text_messages (room_code);
create index if not exists idx_shared_files_room_code on shared_files (room_code);
