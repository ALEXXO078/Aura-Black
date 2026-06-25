create extension if not exists pgcrypto;

create type public.app_role as enum ('admin','user');

create table public.profiles(
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create table public.user_roles(
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique(user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.user_roles where user_id=_user_id and role=_role)
$$;

create table public.categories(
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  created_at timestamptz not null default now()
);
alter table public.categories enable row level security;

create table public.products(
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  brand text not null default '',
  description text not null default '',
  notes text[] not null default '{}',
  price numeric not null default 0,
  old_price numeric,
  ml integer not null default 100,
  stock integer not null default 0,
  category_id uuid references public.categories(id) on delete set null,
  tags text[] not null default '{}',
  image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.products enable row level security;

create policy "public read products" on public.products for select using (true);
create policy "admin insert products" on public.products for insert to authenticated with check (public.has_role(auth.uid(),'admin'));
create policy "admin update products" on public.products for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "admin delete products" on public.products for delete to authenticated using (public.has_role(auth.uid(),'admin'));

create policy "public read categories" on public.categories for select using (true);
create policy "admin insert categories" on public.categories for insert to authenticated with check (public.has_role(auth.uid(),'admin'));
create policy "admin update categories" on public.categories for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "admin delete categories" on public.categories for delete to authenticated using (public.has_role(auth.uid(),'admin'));

create policy "users read own profile" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "users read own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles(id,email) values (new.id, new.email) on conflict do nothing;
  insert into public.user_roles(user_id, role) values (new.id, 'user') on conflict do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create trigger products_touch before update on public.products for each row execute function public.touch_updated_at();