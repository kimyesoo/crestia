-- Create the auctions table
create table auctions (
  id uuid primary key default gen_random_uuid(),
  gecko_id uuid not null references geckos(id) on delete cascade,
  start_price int not null,
  current_bid int not null,
  bid_increment int not null default 10,
  end_at timestamptz not null,
  status text not null check (status in ('active', 'finished')) default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security
alter table auctions enable row level security;

-- Policy: Everyone can view auctions (Public Read)
create policy "Auctions are viewable by everyone"
  on auctions for select
  using (true);

-- Policy: Authenticated users can place bids (Update)
-- Note: In a real-world scenario, you might want more strict logic here (e.g., call a postgres function to bid),
-- but this allows authenticated UPDATEs as requested.
create policy "Authenticated users can update auctions (bid)"
  on auctions for update
  to authenticated
  using (true)
  with check (true);

-- Policy: Only verified shop owners can create auctions (Insert)
-- Assuming you want the gecko owner to create the auction.
create policy "Users can create auctions for their own geckos"
  on auctions for insert
  to authenticated
  with check (
    exists (
      select 1 from geckos
      where geckos.id = auctions.gecko_id
      and geckos.owner_id = auth.uid()
    )
  );
