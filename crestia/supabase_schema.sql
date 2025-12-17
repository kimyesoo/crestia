-- ==========================================
-- 1. Enum Types
-- ==========================================
create type public.gender_type as enum ('Male', 'Female', 'Unknown');

-- ==========================================
-- 2. Profiles Table (Extends auth.users)
-- ==========================================
create table public.profiles (
  id uuid not null references auth.users(id) on delete cascade,
  shop_name text,
  is_verified boolean default false,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint profiles_pkey primary key (id)
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Profiles Policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using ( true );

create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- ==========================================
-- 3. Geckos Table
-- ==========================================
create table public.geckos (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  morph text not null,
  gender gender_type not null default 'Unknown',
  birth_date date,
  image_url text,
  sire_id uuid references public.geckos(id) on delete set null, -- Father (Self-referencing)
  dam_id uuid references public.geckos(id) on delete set null,  -- Mother (Self-referencing)
  description text,
  is_for_sale boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.geckos enable row level security;

-- Geckos Policies
create policy "Geckos are viewable by everyone"
  on public.geckos for select
  using ( true );

create policy "Users can insert their own geckos"
  on public.geckos for insert
  with check ( auth.uid() = owner_id );

create policy "Users can update their own geckos"
  on public.geckos for update
  using ( auth.uid() = owner_id );

create policy "Users can delete their own geckos"
  on public.geckos for delete
  using ( auth.uid() = owner_id );

-- ==========================================
-- 4. Triggers for Automation
-- ==========================================
-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, shop_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

-- Trigger to call the function
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Automatic updated_at timestamp trigger for geckos
create or replace function update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger update_geckos_updated_at
  before update on public.geckos
  for each row execute procedure update_updated_at_column();

-- ==========================================
-- 5. Indexes for Performance
-- ==========================================
create index idx_geckos_owner_id on public.geckos(owner_id);
create index idx_geckos_sire_id on public.geckos(sire_id);
create index idx_geckos_dam_id on public.geckos(dam_id);
