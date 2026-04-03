# Admin Login UI — Dermatologika

## Overview

Minimal, production-ready admin login interface connected to the server-side session authentication layer.

**Location:** `/admin/login`

---

## Features

### 1. Form Component (`AdminLoginForm`)

Located at: `src/features/admin-auth/components/admin-login-form.tsx`

**State Management:**
- `idle` — Form ready for input
- `loading` — Login request in progress (spinner visible)
- `success` — Login successful, preparing redirect
- `error` — Validation or authentication failed

**Accessibility:**
- Semantic labels with `htmlFor` binding
- ARIA attributes: `aria-invalid`, `aria-describedby`, `aria-busy`
- Screen reader announcements for loading state
- Keyboard navigation fully supported
- Clear focus states with brand-green ring

**Validation:**
- Email format check (Zod schema)
- Password required (non-empty)
- Real-time error feedback
- Inline error messages with color coding

### 2. Login Page

Located at: `src/app/admin/login/page.tsx`

**Layout:**
- Centered container, responsive across all breakpoints
- Clean card design with subtle border and shadows
- Header with branding and section label
- Footer with access restriction notice

**Design System Alignment:**
- Colors: surface-canvas, text-primary, brand-primary, status-error
- Typography: headline-lg, body-md, label-md, caption
- Spacing: rhythm-based with space-y-6, px-4, py-3
- Radius: rounded-md (inputs), rounded-lg (buttons)
- Shadows: shadow-sm for subtle depth

---

## API Integration

### Login Endpoint

**Route:** `POST /api/admin/login`

**Request:**
```json
{
  "email": "admin@dermatologika.local",
  "password": "change-this-admin-password"
}
```

**Success Response (200 OK):**
- Sets httpOnly, secure, lax cookie named `dermatologika-session`
- Cookie expires after 8 hours (configurable via `AUTH_SESSION_MAX_AGE_SECONDS`)
- No body returned; redirect handled on client

**Error Responses:**
- `401 Unauthorized` — Invalid email or password
- `403 Forbidden` — Email exists but not admin role
- `500 Server Error` — Unexpected error (generic message to user)

### Session Cookie

**Name:** `dermatologika-session` (see `AUTH_SESSION_COOKIE_NAME` in `src/server/auth/auth-config.ts`)

**Attributes:**
- `httpOnly` — Prevents JavaScript access
- `secure` — HTTPS only in production
- `sameSite: 'lax'` — CSRF protection
- `path: '/'` — Available application-wide
- `maxAge: 28800s` — 8 hours (configurable)

**Content:** HMAC-SHA256 signed JWT-like payload containing:
- `email` — Authenticated user email
- `role` — `'admin'` or `'staff'`
- `iat` — Issued at timestamp
- `exp` — Expiration timestamp

---

## Testing

### Manual Testing in Browser

1. **Start development server:**
   ```bash
   npx next dev --port 3000
   ```

2. **Navigate to login:**
   ```
   http://localhost:3000/admin/login
   ```

3. **Test valid admin login:**
   - Email: `admin@dermatologika.local`
   - Password: `change-this-admin-password`
   - Expected: Redirect to `/admin/leads` (or 404 if page not yet created)

4. **Test invalid credentials:**
   - Any wrong email/password combination
   - Expected: Error message "Email o contraseña inválidos"

5. **Test required fields:**
   - Try submitting with empty email or password
   - Expected: Button disabled, validation feedback

6. **Test loading state:**
   - Submit form and observe spinner during request
   - Loading state prevents duplicate submissions

7. **Test error clearing:**
   - Trigger error, then start typing
   - Error message clears automatically

### Programmatic Testing

**Login and get session:**
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@dermatologika.local","password":"change-this-admin-password"}' \
  -c cookies.txt
# Returns 200 with Set-Cookie header
```

**Use session to access protected route:**
```bash
curl http://localhost:3000/api/contact-leads \
  -b cookies.txt
# Returns 200 with contact leads data
```

**Test logout:**
```bash
curl -X POST http://localhost:3000/api/admin/logout \
  -b cookies.txt
# Returns 200, clears session cookie
```

---

## Error Handling

### User-Facing Messages

| Scenario | Message | Display |
|----------|---------|---------|
| Email format invalid | "Email inválido" | Validation feedback |
| Empty password | "La contraseña es requerida" | Validation feedback |
| Wrong credentials | "Email o contraseña inválidos" | Error alert (red box) |
| Access denied (staff) | "Acceso denegado" | Error alert (red box) |
| Network error | "Error de conexión" | Error alert (red box) |
| Server error | "Error en el servidor" | Error alert (red box) |

### Console Logging

Caught errors are logged to browser console for debugging. No sensitive information is exposed to the user.

---

## Customization

### Change Default Redirect

Edit `src/app/admin/login/page.tsx`:
```tsx
<AdminLoginForm onSuccessRedirect="/your/custom/path" />
```

### Adjust Session Duration

Edit `.env`:
```
AUTH_SESSION_MAX_AGE_SECONDS=43200  // 12 hours instead of 8
```

### Update Admin Credentials

Edit `.env`:
```
ADMIN_AUTH_EMAIL=newemail@company.local
ADMIN_AUTH_PASSWORD=new-secure-password
```

⚠️ **Important:** Never commit credentials to git. Use environment variables in deployment.

### Modify Form Styling

Form classes use Tailwind design tokens:
- `text-label-md` — Field labels
- `border-border-default` — Input borders
- `focus:ring-brand-primary` — Focus ring color
- `bg-status-error/10` — Error alert background

Change token mappings in `tailwind.config.ts`.

---

## Architecture

### Component Hierarchy

```
src/app/admin/login/page.tsx (Public Server Component)
└── src/features/admin-auth/components/admin-login-form.tsx (Client Component)
    ├── State: email, password, formState, error
    ├── Services: loginAdmin() from src/services/admin-auth/client.ts
    └── Lib: adminLoginInputSchema from src/features/auth/schemas/admin-auth.schema.ts
```

### Data Flow

```
User fills form
    ↓
Submit (validated by Zod schema)
    ↓
loginAdmin() service calls POST /api/admin/login
    ↓
Backend validates credentials and sets httpOnly cookie
    ↓
Client receives 200 response
    ↓
useRouter().push() redirects to /admin/leads
```

### Server-Side Auth

Related files handling session verification:

| File | Purpose |
|------|---------|
| `src/server/auth/get-authenticated-user.ts` | Reads & verifies signed cookie |
| `src/server/auth/require-admin-auth.ts` | Enforces admin role, returns 403 for non-admin |
| `src/server/auth/session.ts` | HMAC-SHA256 signing, encoding, verification |
| `src/server/auth/authenticate-user-credentials.ts` | Timing-safe credential matching |
| `src/app/api/admin/login/route.ts` | POST handler, creates session |
| `src/app/api/admin/logout/route.ts` | POST handler, clears session |

---

## Accessibility Checklist

- ✓ Semantic form structure with `<form>`, `<label>`, `<input>`
- ✓ Labels bound to inputs via `htmlFor`
- ✓ Error messages linked via `aria-describedby`
- ✓ Invalid state marked with `aria-invalid="true"`
- ✓ Loading state announced via `aria-busy="true"` and `aria-live="polite"`
- ✓ Keyboard navigation: Tab through fields, Enter to submit
- ✓ Focus styles visible (brand-green ring)
- ✓ Color not only way to convey state (text + color)
- ✓ No flickering or distracting motion
- ✓ Contrast ratios meet WCAG AA

---

## Security Considerations

### ✓ Implemented

- Credentials are **never** logged or exposed
- httpOnly cookies prevent JavaScript access
- HMAC-SHA256 signing prevents tampering
- Timing-safe comparison prevents timing attacks
- Role-based access control (admin vs staff)
- Session max age enforced server-side

### ⚠️ Future Considerations

- Rate limiting on login attempts (prevent brute force)
- Login attempt logging/audit trail
- Account lockout after N failed attempts
- Password reset flow
- Two-factor authentication
- Session invalidation on password change

---

## Troubleshooting

### Login always fails (401)

**Possible cause:** Credentials in `.env` don't match what you're entering.

**Solution:**
```bash
# Check .env file
cat .env | grep AUTH_

# Should see:
# ADMIN_AUTH_EMAIL=admin@dermatologika.local
# ADMIN_AUTH_PASSWORD=change-this-admin-password
```

### Session cookie not being set

**Possible cause:** Browser security settings or HTTPS in production without `secure` flag.

**Debug:**
1. Open DevTools → Application → Cookies
2. Look for `dermatologika-session` cookie
3. In development, `secure` flag is not required
4. In production, ensure HTTPS is enabled

### Form submit not working

**Possible cause:** JavaScript not loading (rare in Next.js), or `credentials: 'include'` missing.

**Solution:**
- Check browser console for errors
- Verify `src/services/admin-auth/client.ts` has `credentials: 'include'`

### Redirect to `/admin/leads` fails with 404

**Expected behavior.** The leads page is not yet created.

**Solution:**
- Create `src/app/admin/leads/page.tsx` as a placeholder or full implementation
- Or change `onSuccessRedirect` to an existing page

---

## Version

**Admin Login UI v1.0**  
Fully accessible, production-ready, design-system-aligned login interface for Dermatologika internal admin operations.
