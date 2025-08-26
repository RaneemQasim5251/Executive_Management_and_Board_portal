-- Tenancy & catalog
create table if not exists tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  region text,
  created_at timestamptz default now()
);

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade,
  name text not null,
  bookcase_code text unique,
  created_at timestamptz default now()
);

create table if not exists entities (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  name text not null,
  type text check (type in ('fund','trust','company','spv')) default 'company',
  created_at timestamptz default now()
);

create table if not exists committees (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid references entities(id) on delete cascade,
  name text not null,         -- Board, Exec, Audit
  created_at timestamptz default now()
);

create table if not exists meetings (
  id uuid primary key default gen_random_uuid(),
  committee_id uuid references committees(id) on delete cascade,
  starts_at timestamptz not null,
  location text,
  mode text check (mode in ('in_person','remote','hybrid')) default 'hybrid',
  status text check (status in ('planned','completed','archived')) default 'planned',
  created_at timestamptz default now()
);

create table if not exists packs (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid references meetings(id) on delete cascade,
  version int not null default 1,
  status text check (status in ('draft','in_review','approved','published','archived')) default 'draft',
  lang text check (lang in ('en','ar')) default 'en',
  is_published boolean default false,
  published_at timestamptz,
  created_by uuid,
  created_at timestamptz default now()
);

create table if not exists pack_documents (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid references packs(id) on delete cascade,
  title text not null,
  file_path text not null,
  mime text,
  page_map jsonb,             -- mapping for note preservation across versions
  idx int not null default 0,
  created_at timestamptz default now()
);

create table if not exists agenda_items (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid references meetings(id) on delete cascade,
  idx int not null,
  title text not null,
  owner_id uuid,
  minutes int not null default 5,
  tag text,                   -- Steering, Supervising, Strategy, Performance, Governance
  stakeholders text[] default '{}',  -- ['Employee','Customer',...]
  created_at timestamptz default now()
);

create table if not exists annotations (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid references packs(id) on delete cascade,
  user_id uuid not null,
  page int not null,
  rect jsonb,
  note text,
  created_at timestamptz default now()
);

create table if not exists approvals (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid references packs(id) on delete cascade,
  approver_id uuid not null,
  status text check (status in ('requested','approved','rejected')) default 'requested',
  comment text,
  decided_at timestamptz
);

create table if not exists sign_requests (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid references packs(id) on delete cascade,
  doc_id uuid references pack_documents(id) on delete cascade,
  signer_id uuid not null,
  status text check (status in ('requested','viewed','signed','declined','expired')) default 'requested',
  envelope_id text,           -- external provider id (optional)
  created_at timestamptz default now(),
  completed_at timestamptz
);

create table if not exists roles (
  id uuid primary key default gen_random_uuid(),
  name text unique not null   -- Admin, PackCompiler, Approver, Distributor, Director
);

create table if not exists memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role_id uuid references roles(id),
  client_id uuid references clients(id),
  entity_id uuid references entities(id),
  committee_id uuid references committees(id),
  created_at timestamptz default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  at timestamptz default now(),
  actor_id uuid,
  action text not null,
  subject_type text not null,
  subject_id uuid not null,
  meta jsonb,
  prev_hash text,
  this_hash text
);

-- RBAC convenience: seed roles (idempotent)
insert into roles(id, name)
values (gen_random_uuid(),'Admin'),
       (gen_random_uuid(),'PackCompiler'),
       (gen_random_uuid(),'Approver'),
       (gen_random_uuid(),'Distributor'),
       (gen_random_uuid(),'Director')
on conflict (name) do nothing;

-- Enable RLS
alter table clients enable row level security;
alter table entities enable row level security;
alter table committees enable row level security;
alter table meetings enable row level security;
alter table packs enable row level security;
alter table pack_documents enable row level security;
alter table agenda_items enable row level security;
alter table annotations enable row level security;
alter table approvals enable row level security;
alter table sign_requests enable row level security;
alter table memberships enable row level security;

-- Basic tenant/role-aware SELECT policy example (read if user has membership in scope)
create policy "read_by_membership_clients" on clients
for select using (exists (select 1 from memberships m
  where m.user_id = auth.uid() and m.client_id = clients.id));

create policy "read_by_membership_entities" on entities
for select using (exists (select 1 from memberships m
  join clients c on c.id = entities.client_id
  where m.user_id = auth.uid()
    and (m.client_id = c.id or m.entity_id = entities.id)));

create policy "read_by_membership_committees" on committees
for select using (exists (select 1 from memberships m
  join entities e on e.id = committees.entity_id
  where m.user_id = auth.uid()
    and (m.entity_id = e.id or m.committee_id = committees.id)));

create policy "read_by_membership_meetings" on meetings
for select using (exists (select 1 from memberships m
  where m.user_id = auth.uid()
    and (m.committee_id = meetings.committee_id)));

create policy "read_by_membership_packs" on packs
for select using (exists (select 1 from meetings mt
  join memberships m on m.committee_id = mt.committee_id
  where mt.id = packs.meeting_id and m.user_id = auth.uid()));

create policy "crud_by_compiler_packs" on packs
for all using (exists (select 1 from memberships m
  join roles r on r.id = m.role_id
  join meetings mt on mt.id = packs.meeting_id
  where m.user_id = auth.uid() and m.committee_id = mt.committee_id and r.name='PackCompiler'));

create policy "read_docs_by_membership" on pack_documents
for select using (exists (select 1 from packs p
  join meetings mt on mt.id = p.meeting_id
  join memberships m on m.committee_id = mt.committee_id
  where p.id = pack_documents.pack_id and m.user_id = auth.uid()));

create policy "update_docs_by_compiler" on pack_documents
for all using (exists (select 1 from packs p
  join meetings mt on mt.id = p.meeting_id
  join memberships m on m.committee_id = mt.committee_id
  join roles r on r.id = m.role_id
  where p.id = pack_documents.pack_id and m.user_id = auth.uid() and r.name='PackCompiler'));

create policy "notes_by_owner" on annotations
for all using (auth.uid() = user_id);

-- Approvals and signatures visible in-scope
create policy "approvals_scope" on approvals
for all using (exists (select 1 from packs p
  join meetings mt on mt.id = p.meeting_id
  join memberships m on m.committee_id = mt.committee_id
  where approvals.pack_id = p.id and m.user_id = auth.uid()));

create policy "sign_requests_scope" on sign_requests
for all using (exists (select 1 from packs p
  join meetings mt on mt.id = p.meeting_id
  join memberships m on m.committee_id = mt.committee_id
  where sign_requests.pack_id = p.id and m.user_id = auth.uid()));

-- Helpful indexes
create index if not exists idx_memberships_by_user on memberships(user_id);
create index if not exists idx_meetings_by_committee on meetings(committee_id, starts_at);
create index if not exists idx_packs_by_meeting on packs(meeting_id, status, is_published);
create index if not exists idx_pack_docs_by_pack on pack_documents(pack_id, idx);
create index if not exists idx_audit_subject on audit_logs(subject_type, subject_id, at desc);
create index if not exists idx_sign_requests_pack on sign_requests(pack_id, created_at desc);

-- Hash chain for audit logs (tamper-evident)
create extension if not exists pgcrypto;
create or replace function audit_hash_chain()
returns trigger language plpgsql as $$
declare
  prev text;
begin
  select this_hash into prev from audit_logs 
  where subject_type = new.subject_type and subject_id = new.subject_id
  order by at desc limit 1;
  new.prev_hash := prev;
  new.this_hash := encode(digest(coalesce(prev,'') || new.at || new.actor_id || new.action || new.subject_type || new.subject_id || coalesce(new.meta::text,''), 'sha256'),'hex');
  return new;
end $$;

drop trigger if exists trg_audit_hash on audit_logs;
create trigger trg_audit_hash before insert on audit_logs
for each row execute function audit_hash_chain();

-- View: pack latest published
create or replace view v_latest_published_packs as
  select distinct on (meeting_id) *
  from packs
  where is_published = true
  order by meeting_id, published_at desc;

-- Minimal insert policies for authors/compilers (example)
create policy "insert_agenda_by_compiler" on agenda_items
for insert with check (exists (
  select 1 from meetings mt
  join memberships m on m.committee_id = mt.committee_id
  join roles r on r.id = m.role_id
  where mt.id = meeting_id and m.user_id = auth.uid() and r.name='PackCompiler'
));

create policy "update_agenda_by_compiler" on agenda_items
for update using (exists (
  select 1 from meetings mt
  join memberships m on m.committee_id = mt.committee_id
  join roles r on r.id = m.role_id
  where mt.id = agenda_items.meeting_id and m.user_id = auth.uid() and r.name='PackCompiler'
));
