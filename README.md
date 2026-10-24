# JUST EIGHT

Premium fashion e-commerce frontend for the JUST EIGHT clothing brand.

## Stack

- React + Vite + TypeScript
- Tailwind CSS v4
- React Router
- Lucide icons
- Supabase (Auth, Postgres, Storage) when configured

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Supabase

See **[docs/SUPABASE.md](docs/SUPABASE.md)** for creating `just-eight-store`, applying migrations, promoting an admin, and connecting `.env`.

See **[docs/DEPLOY.md](docs/DEPLOY.md)** for GitHub → hosting → GoDaddy.

```bash
cp .env.example .env
# add VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY only (never service_role)
npx supabase link --project-ref <PROJECT_REF>
npx supabase db push
npm run dev
```

Admin: `http://localhost:5173/admin` (requires `profiles.is_admin = true`).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` | Typecheck and production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run oxlint |

## Project structure

```
src/
  components/   # Layout, home, product, auth, admin, UI
  context/      # Auth, catalog, cart
  data/         # Local demo fallback catalog
  pages/        # Storefront + admin screens
  services/     # Supabase catalog + admin APIs
  types/
supabase/
  migrations/   # Schema, storage policies, seed
docs/
  SUPABASE.md
  DEPLOY.md
```

## Security notes

- Frontend uses the anon key only
- RLS is enabled on all store tables
- Admin writes require `public.is_admin()`
- Storage writes on `product-images` are admin-only
