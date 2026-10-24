-- JUST EIGHT store schema
-- Project name target: just-eight-store
-- RLS enabled on all public tables. Service role never used in the frontend.

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select p.is_admin from public.profiles p where p.id = auth.uid()),
    false
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated, anon;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create policy "Profiles are viewable by owner or admin"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "Users can update their own non-admin profile fields"
  on public.profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and is_admin = (select p.is_admin from public.profiles p where p.id = auth.uid())
  );

create policy "Admins can update profiles"
  on public.profiles for update
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Categories
-- ---------------------------------------------------------------------------

create table if not exists public.categories (
  id text primary key,
  name text not null,
  description text not null default '',
  image_url text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.categories enable row level security;

create policy "Categories are publicly readable"
  on public.categories for select
  using (true);

create policy "Admins manage categories"
  on public.categories for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Products
-- ---------------------------------------------------------------------------

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  details jsonb not null default '[]'::jsonb,
  care jsonb not null default '[]'::jsonb,
  price numeric(10, 2) not null check (price >= 0),
  sale_price numeric(10, 2) check (sale_price is null or sale_price >= 0),
  category_id text not null references public.categories (id) on delete restrict,
  stock integer not null default 0 check (stock >= 0),
  featured boolean not null default false,
  new_arrival boolean not null default false,
  best_seller boolean not null default false,
  popularity integer not null default 0,
  is_active boolean not null default true,
  is_demo boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists products_category_id_idx on public.products (category_id);
create index if not exists products_is_active_idx on public.products (is_active);
create index if not exists products_created_at_idx on public.products (created_at desc);

alter table public.products enable row level security;

create policy "Active products are publicly readable"
  on public.products for select
  using (is_active = true or public.is_admin());

create policy "Admins insert products"
  on public.products for insert
  with check (public.is_admin());

create policy "Admins update products"
  on public.products for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins delete products"
  on public.products for delete
  using (public.is_admin());

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Product images
-- ---------------------------------------------------------------------------

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  url text not null,
  storage_path text,
  alt text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists product_images_product_id_idx on public.product_images (product_id);

alter table public.product_images enable row level security;

create policy "Product images are publicly readable"
  on public.product_images for select
  using (
    exists (
      select 1 from public.products p
      where p.id = product_id and (p.is_active = true or public.is_admin())
    )
  );

create policy "Admins manage product images"
  on public.product_images for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Variants (size / color / stock)
-- ---------------------------------------------------------------------------

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  size text not null,
  color_name text not null,
  color_hex text not null default '#000000',
  sku text,
  stock integer not null default 0 check (stock >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  unique (product_id, size, color_name)
);

create index if not exists product_variants_product_id_idx on public.product_variants (product_id);

alter table public.product_variants enable row level security;

create policy "Variants are publicly readable for active products"
  on public.product_variants for select
  using (
    exists (
      select 1 from public.products p
      where p.id = product_id and (p.is_active = true or public.is_admin())
    )
  );

create policy "Admins manage variants"
  on public.product_variants for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Orders
-- ---------------------------------------------------------------------------

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid references auth.users (id) on delete set null,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  customer_name text not null,
  email text not null,
  phone text not null default '',
  address text not null,
  city text not null,
  postal_code text not null,
  payment_method text not null default 'card',
  subtotal numeric(10, 2) not null default 0,
  shipping_cost numeric(10, 2) not null default 0,
  total numeric(10, 2) not null default 0,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_status_idx on public.orders (status);

alter table public.orders enable row level security;

create policy "Users can read their own orders"
  on public.orders for select
  using (auth.uid() = user_id or public.is_admin());

create policy "Anyone can create guest or own orders"
  on public.orders for insert
  with check (user_id is null or auth.uid() = user_id);

create policy "Admins update orders"
  on public.orders for update
  using (public.is_admin())
  with check (public.is_admin());

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  product_name text not null,
  size text not null,
  color text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.order_items enable row level security;

create policy "Users can read their order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "Anyone can insert items for allowed orders"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (o.user_id is null or o.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "Admins manage order items"
  on public.order_items for all
  using (public.is_admin())
  with check (public.is_admin());
