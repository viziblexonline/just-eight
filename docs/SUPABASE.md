# JUST EIGHT × Supabase setup

Target project name: **just-eight-store**

The frontend only uses the **anon / publishable** key. Never put the **service_role** key in Vite env vars or commit it.

## Phase 1 — Create / connect the project

### Option A — Supabase Dashboard (recommended)

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. **New project** → name it `just-eight-store`
3. Choose a region and set a strong database password (store it in a password manager)
4. Wait until the project is healthy
5. Open **Project Settings → API**
6. Copy:
   - Project URL → `VITE_SUPABASE_URL`
   - `anon` `public` key → `VITE_SUPABASE_ANON_KEY`

### Option B — Supabase CLI

```bash
npx supabase login
npx supabase projects create just-eight-store --org-id <YOUR_ORG_ID> --db-password <STRONG_PASSWORD> --region us-east-1
npx supabase link --project-ref <PROJECT_REF>
```

## Phase 2–3 — Apply schema + storage

From this repo:

```bash
npx supabase link --project-ref <PROJECT_REF>
npx supabase db push
```

Or paste the SQL files in order into the Supabase **SQL Editor**:

1. `supabase/migrations/20260319120000_just_eight_schema.sql`
2. `supabase/migrations/20260319120100_storage_product_images.sql`
3. `supabase/migrations/20260319120200_seed_catalog.sql`

This creates:

- `profiles` (+ `is_admin`)
- `categories`, `products`, `product_images`, `product_variants`
- `orders`, `order_items`
- RLS policies
- Storage bucket `product-images` (public read, admin write)

## Phase 4 — Connect the frontend

1. Copy `.env.example` → `.env`
2. Fill URL + anon key
3. Restart the dev server:

```bash
npm run dev
```

The storefront loads products from Supabase when configured, and falls back to local demo data if the API is unreachable.

## Phase 5 — Promote an admin

1. Sign up / sign in on the site (`/signup` or `/login`)
2. In Supabase SQL Editor:

```sql
update public.profiles
set is_admin = true
where id = (
  select id from auth.users where email = 'your-admin@email.com'
);
```

3. Refresh `/account` or `/admin`

Only users with `profiles.is_admin = true` can mutate catalog data (enforced by RLS).

## Phase 6 — Admin dashboard

Open **http://localhost:5173/admin**

- Overview stats
- Products: create / edit / delete
- Image upload to `product-images`
- Categories
- Orders + status updates

## Google auth (optional)

1. Authentication → Providers → Google → enable
2. Add redirect URL: `http://localhost:5173/auth/callback`
3. For production, also add `https://yourdomain.com/auth/callback`
