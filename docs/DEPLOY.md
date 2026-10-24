# Phase 7 — GitHub, hosting, GoDaddy domain

Complete local Supabase testing first (products load, admin CRUD, image upload).

## 1. Push to GitHub

```bash
cd "E:\Users\Administrator\Desktop\JUST EIGTH"
git init
git add .
git commit -m "Connect JUST EIGHT storefront to Supabase"
```

Create an empty GitHub repo (do not upload secrets), then:

```bash
git branch -M main
git remote add origin https://github.com/<YOUR_USER>/<YOUR_REPO>.git
git push -u origin main
```

Confirm `.env` is ignored (it is listed in `.gitignore`). Only `.env.example` should be committed.

## 2. Commercial hosting (recommended: Vercel or Netlify)

### Vercel

1. Import the GitHub repo at [vercel.com](https://vercel.com)
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`
5. Environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Deploy

### Netlify

1. Import the GitHub repo
2. Build: `npm run build`
3. Publish directory: `dist`
4. Add the same env vars
5. Deploy

## 3. Point GoDaddy domain to hosting

### If using Vercel

1. Vercel project → Settings → Domains → add `yourdomain.com` and `www.yourdomain.com`
2. In GoDaddy DNS:
   - `A` record for `@` → Vercel IP shown in the Vercel domain UI
   - `CNAME` for `www` → `cname.vercel-dns.com` (or the value Vercel shows)
3. Wait for DNS propagation, then verify HTTPS on Vercel

### If using Netlify

1. Netlify → Domain settings → Add custom domain
2. In GoDaddy DNS use the Netlify-provided records (often `A` / `CNAME` / nameservers)
3. Enable HTTPS (Let’s Encrypt) in Netlify

## 4. Supabase production auth URLs

In Supabase → Authentication → URL configuration:

- Site URL: `https://yourdomain.com`
- Redirect URLs include:
  - `https://yourdomain.com/auth/callback`
  - `https://www.yourdomain.com/auth/callback` (if used)

## 5. Smoke test on production

- Homepage products load from Supabase
- Shop filters work
- Cart + checkout still behave correctly
- `/admin` requires admin profile
- Product image upload works for admins only
