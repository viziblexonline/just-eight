# Continue with Google — setup

Google sign-in needs **Supabase** + a **Google Cloud OAuth client**. The app code is already wired.

Admin inbox for signup/login alerts: **justeightuk@gmail.com**

## 1. Connect Supabase to the frontend

1. Open [Project API settings](https://supabase.com/dashboard/project/srtzbpagjuwvbywnwuqg/settings/api-keys)
2. Copy **Project URL** and the **legacy anon / public** key
3. Local `.env` and Vercel Environment Variables:

```env
VITE_SUPABASE_URL=https://srtzbpagjuwvbywnwuqg.supabase.co
VITE_SUPABASE_ANON_KEY=paste-your-anon-key-here
```

4. Restart / redeploy after changing env vars

## 2. Create Google OAuth credentials

1. Open [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
2. Configure the **OAuth consent screen** (External) if prompted
3. **Create credentials → OAuth client ID → Web application**
4. Authorized JavaScript origins:
   - `http://localhost:5173`
   - `http://127.0.0.1:5173`
   - `https://justeight.co.uk`
   - `https://www.justeight.co.uk`
5. Authorized redirect URIs (Supabase callback only):
   - `https://srtzbpagjuwvbywnwuqg.supabase.co/auth/v1/callback`
6. Save and copy **Client ID** + **Client Secret**

## 3. Enable Google in Supabase

1. Open [Auth → Providers → Google](https://supabase.com/dashboard/project/srtzbpagjuwvbywnwuqg/auth/providers)
2. Enable Google
3. Paste Client ID + Client Secret
4. Save

## 4. Allow app redirect URLs (required for live site)

1. Open [Auth → URL Configuration](https://supabase.com/dashboard/project/srtzbpagjuwvbywnwuqg/auth/url-configuration)
2. **Site URL:** `https://justeight.co.uk`
3. **Redirect URLs** (add all):
   - `https://justeight.co.uk/auth/callback`
   - `https://www.justeight.co.uk/auth/callback`
   - `http://localhost:5173/auth/callback`
   - `http://127.0.0.1:5173/auth/callback`

## 5. Admin signup/login email alerts

The storefront notifies **justeightuk@gmail.com** when a customer:

- Signs up with email
- Logs in with email
- Signs in / signs up with Google

First alert uses [FormSubmit](https://formsubmit.co). Check that Gmail inbox once and **confirm the activation email**, then alerts will arrive for every signup/login.

## 6. Test

1. Open `https://justeight.co.uk/login` (or local)
2. Click **Continue with Google**
3. You should land on `/account`
4. Check `justeightuk@gmail.com` for the alert

> Client ID / Secret stay in the Supabase dashboard only — never put them in Vite `.env`.
