# Neon Backend Setup - Exact Steps to Execute

**Current Status**: ✅ All backend connections configured and verified

---

## What's Done ✅

| Item | Status | Details |
|------|--------|---------|
| Neon PostgreSQL Connection | ✅ Verified | Connected to `neondb` at Neon |
| Prisma Configuration | ✅ Configured | `provider = "postgresql"` via `env("DATABASE_URL")` |
| Environment Validation | ✅ Working | `src/config/env.ts` enforces Postgres URL format |
| Prisma Client Factory | ✅ Working | Singleton pattern in `src/server/db/prisma.ts` |
| Initial Migration | ✅ Applied | `ContactLead` table created in Neon |
| Database Schema | ✅ Synchronized | Schema matches Prisma schema.prisma |

---

## Your Exact Next Steps

### Step 1: Fix System Environment Variable

**Why?** A global `DATABASE_URL=localhost:5432` variable is overriding your `.env` file.

**How:**
```powershell
# Run this as Administrator in PowerShell
powershell -ExecutionPolicy Bypass -File scripts/cleanup-env.ps1
```

**Confirmation:**
- You'll see what variables exist
- You'll be asked to confirm removal
- Script shows green checkmarks when done

**Important After Step 1:**
- Close ALL PowerShell windows completely (including VS Code terminal)
- Wait 5 seconds
- Reopen PowerShell fresh (this reloads the environment)

---

### Step 2: Verify Clean Environment

**After reopening fresh PowerShell:**

```bash
cd "c:\Users\Stuart\Documents\Derma\Dermatologika\Web Dermatologika"
npx prisma migrate status
```

**Expected output:**
```
Datasource "db": PostgreSQL database "neondb", schema "public" at "ep-wild-pond-an3lung7-pooler.c-6.us-east-1.aws.neon.tech"

1 migration found in prisma/migrations

Database schema is up to date!
```

✅ If you see this, the connection is working correctly.

❌ If you still see `localhost`, the system variable wasn't fully removed. Go back to Step 1 and verify all terminals/VS Code are fully closed.

---

### Step 3: View Your Data

**Open Prisma Studio (visual database browser):**

```bash
npm run prisma:studio
```

This opens http://localhost:5555 where you can:
- See the `ContactLead` table structure
- Browse any records that exist
- Add test data if you want
- Verify Neon connection works end-to-end

**Exit:** Press Ctrl+C in the terminal

---

### Step 4: Build and Test

**Build the application:**
```bash
npm run build
```

**Expected:** "✓ Compiled successfully" message

**Start development server:**
```bash
npm run dev
```

**Expected:** Server running on http://localhost:3000

---

### Step 5: Test the ContactLead API

**In a new terminal**, test the endpoint:

```bash
curl -X POST http://localhost:3000/api/contact-leads \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "message": "I would like more information."
  }'
```

**Expected response (201):**
```json
{
  "success": true,
  "data": {
    "id": "clx1234567890",
    "fullName": "John Doe",
    "email": "john@example.com",
    "status": "new",
    "createdAt": "2026-01-15T10:30:00.000Z"
  },
  "timestamp": "2026-01-15T10:30:00.000Z"
}
```

**Or using Node.js:**
```javascript
fetch("http://localhost:3000/api/contact-leads", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    fullName: "Jane Smith",
    email: "jane@example.com",
    message: "Testing the API from Node.js"
  })
})
  .then(r => r.json())
  .then(data => console.log("Created:", data.data));
```

---

## After setup, what's the next step?

### Backend Work (Phase 4)

**Recommended next vertical slices:**

1. **GET /api/contact-leads** (most immediate)
   - Query all leads (with pagination)
   - Filter by status, source
   - Establishes repository pattern for future endpoints
   - Time estimate: 1-2 hours

2. **PATCH /api/contact-leads/:id** (follow-up)
   - Update lead status (new → contacted → converted, etc)
   - Authorization: only specific roles can update
   - Demonstrates auth boundaries

3. **GET /api/contact-leads/:id**
   - Single lead details
   - Ownership verification

### Frontend Work (Later)

These come after backend is stable:
- Public contact form (connects to POST /api/contact-leads)
- Admin dashboard to view leads
- Lead filter and search
- Lead status workflow

### Infrastructure (Future)

When ready for production:
- Email notifications (when lead created)
- Rate limiting on contact form
- Cloudflare R2 for any files
- Production deployment to Vercel

---

## Important: Architecture Summary

Everything follows the Backend Agent rules from AGENTS.md:

✅ **Server-only environment** (`src/config/env.ts`)
- DATABASE_URL never exposed to client
- Validated at server startup
- Marked `import "server-only"`

✅ **Centralized database access** (`src/server/db/prisma.ts`)
- Single Prisma Client instance (singleton pattern)
- No scattered database calls
- Reusable across services

✅ **Repository layer** (`src/server/contact/contact-lead.repository.ts`)
- All database queries in one place
- Easy to test, easy to modify
- Consistent error handling

✅ **Service layer** (`src/services/contact/`)
- Business logic separate from routes
- Reusable across endpoints
- Clean separation of concerns

✅ **Type safety** (TypeScript strict mode)
- No `any` types
- Zod validation for input/output
- Compile-time and runtime checks

✅ **API contracts** (`src/types/contact-lead.ts`)
- Explicit request/response shapes
- Shared between frontend and backend
- Predictable, documented APIs

---

## Troubleshooting

### Still using localhost after cleanup?

**Check what's in environment:**
```powershell
# Current session
$env:DATABASE_URL

# System level (should be empty now)
[Environment]::GetEnvironmentVariable("DATABASE_URL", "Machine")
[Environment]::GetEnvironmentVariable("DATABASE_URL", "User")
```

**If variables still exist:**
- Open PowerShell as Administrator
- Run: `[Environment]::SetEnvironmentVariable("DATABASE_URL", $null, "Machine")`
- Run: `[Environment]::SetEnvironmentVariable("DATABASE_URL", $null, "User")`
- Close all terminals and VS Code completely
- Reopen fresh

### Prisma Studio won't open?

```bash
# Make sure Neon is reachable
npm run prisma:migrate:status

# If that works, try studio again
npm run prisma:studio

# If still fails, check logs
npm run prisma:studio -- --verbose
```

### API endpoint returns 500?

1. Check server console for error details
2. Verify `.env` has correct Neon URL
3. Run migration status: `npx prisma migrate status`
4. Check Neon console if database is online

### Can't submit a lead (validation error)?

Check the error message shows which field is invalid:
- `fullName` must be 2-255 characters
- `email` must be valid email format
- `message` must be 10-5000 characters  
- `phone` is optional, must be valid format if provided

---

## Document References

- **Full Neon Setup Guide**: [docs/NEON_SETUP.md](docs/NEON_SETUP.md)
- **ContactLead API Details**: [docs/CONTACT_LEAD_VERTICAL.md](docs/CONTACT_LEAD_VERTICAL.md)
- **API Testing Guide**: [docs/API_TESTING.md](docs/API_TESTING.md)
- **Database Setup (Local/Self-hosted)**: [docs/DATABASE_SETUP.md](docs/DATABASE_SETUP.md)

---

**Ready to execute? Start with Step 1: Fix System Environment Variable**
