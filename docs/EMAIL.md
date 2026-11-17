# Just Eight — customer emails from Gmail

Store inbox / sender: **justeightsuk@gmail.com**  
Display name: **Just Eight**

## What the app already does

On **signup** (email or Google), the site:

1. Alerts **justeightsuk@gmail.com** that a customer joined  
2. Sends the customer a **welcome** auto-reply (via FormSubmit)

First time only: open **justeightsuk@gmail.com**, find the FormSubmit activation mail, and confirm. After that, alerts + welcome replies work.

## Confirmation mail “from Just Eight” (Supabase SMTP)

Supabase “Confirm your signup” emails only show **Just Eight &lt;justeightsuk@gmail.com&gt;** after you connect Gmail SMTP:

### 1. Gmail App Password

1. Sign in to [Google Account](https://myaccount.google.com/) as **justeightsuk@gmail.com**
2. Enable **2-Step Verification** if needed  
3. [App passwords](https://myaccount.google.com/apppasswords) → create one for “Mail”  
4. Copy the 16-character password

### 2. Supabase custom SMTP

1. Open [Auth → SMTP Settings](https://supabase.com/dashboard/project/srtzbpagjuwvbywnwuqg/auth/smtp)  
   (or **Project Settings → Authentication → SMTP**)
2. Enable **Custom SMTP**
3. Fill in:

| Field | Value |
| --- | --- |
| Sender email | `justeightsuk@gmail.com` |
| Sender name | `Just Eight` |
| Host | `smtp.gmail.com` |
| Port | `465` |
| Username | `justeightsuk@gmail.com` |
| Password | Gmail App Password |
| Secure | SSL / TLS on |

4. Save

### 3. Optional — email templates

**Authentication → Email Templates → Confirm signup**

- Subject: `Confirm your Just Eight account`
- Body: keep the `{{ .ConfirmationURL }}` link; brand the copy as Just Eight

After this, signup confirmation emails arrive **from Just Eight** via **justeightsuk@gmail.com**.
