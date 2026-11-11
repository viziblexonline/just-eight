# Continue with Google — setup

Google sign-in needs **Supabase** + a **Google Cloud OAuth client**. The app code is already wired.

## 1. Connect Supabase to the frontend

1. Open [Project API settings](https://supabase.com/dashboard/project/lgbisvqwpaoxrgyfxcot/settings/api)
2. Copy **Project URL** and the **anon / public** key
3. In the project root, create `.env`:

```env
VITE_SUPABASE_URL=https://lgbisvqwpaoxrgyfxcot.supabase.co
VITE_SUPABASE_ANON_KEY=paste-your-anon-key-here
```

4. Restart the dev server (`npm run dev`)

## 2. Create Google OAuth credentials

1. Open [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
2. Configure the **OAuth consent screen** (External) if prompted
3. **Create credentials → OAuth client ID → Web application**
4. Authorized JavaScript origins:
   - `http://localhost:5173`
   - `http://127.0.0.1:5173`
5. Authorized redirect URIs (use your Supabase callback):
   - `https://lgbisvqwpaoxrgyfxcot.supabase.co/auth/v1/callback`
6. Save and copy **Client ID** + **Client Secret**

## 3. Enable Google in Supabase

1. Open [Auth → Providers → Google](https://supabase.com/dashboard/project/lgbisvqwpaoxrgyfxcot/auth/providers)
2. Enable Google
3. Paste Client ID + Client Secret
4. Save

## 4. Allow app redirect URLs

1. Open [Auth → URL Configuration](https://supabase.com/dashboard/project/lgbisvqwpaoxrgyfxcot/auth/url-configuration)
2. Site URL: `http://localhost:5173`
3. Redirect URLs (add):
   - `http://localhost:5173/auth/callback`
   - `http://127.0.0.1:5173/auth/callback`

## 5. Test

1. Open `http://localhost:5173/login`
2. Click **Continue with Google**
3. You should land on `/account` after approving Google

> Client ID / Secret stay in the Supabase dashboard only — never put them in Vite `.env`.
