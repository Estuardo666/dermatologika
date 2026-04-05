# Public Auth With Clerk — Dermatologika

## Overview

Public account access now uses Clerk for email/password authentication.

This integration covers the public-facing account entry points only:

- `/login`
- `/register`

It does **not** replace the current internal admin authentication flow.

Admin continues to use the existing session-cookie system and `/admin/login`.

---

## What Was Added

- Clerk provider at the root layout when environment keys are available
- Custom public login UI aligned with Dermatologika visual patterns
- Custom public register UI with email verification code step
- Public header account entry that switches between sign-in and sign-out states

---

## Required Environment Variables

Add these values to `.env`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxxxx"
CLERK_SECRET_KEY="sk_test_xxxxx"
```

If these keys are missing:

- the rest of the application still renders
- Clerk provider is not mounted
- `/login` and `/register` show a configuration notice instead of a broken auth flow

---

## UX Notes

- No social providers are rendered
- No Google sign-in is shown
- Register uses email verification code flow before activating the session
- Motion follows the calm public frontend language used in checkout and cart surfaces

---

## Files Involved

- `src/app/layout.tsx`
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/register/page.tsx`
- `src/components/layout/public-header.tsx`
- `src/components/layout/public-account-entry.tsx`
- `src/features/auth/components/*`
- `src/server/auth/clerk-config.ts`

---

## Current Boundary

Public auth and admin auth are intentionally separate for now.

This avoids breaking existing admin route protection, which still depends on the repository's internal session helpers and protected API guards.
