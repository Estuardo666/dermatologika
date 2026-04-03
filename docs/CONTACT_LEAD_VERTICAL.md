# ContactLead Vertical Implementation

## Overview

First production-ready vertical slice of Dermatologika: minimal but fully functional contact lead capture system.

## Architecture

### Layer Organization

```
src/types/contact-lead.ts
  └─ Shared types and contracts

src/features/contact/schemas/contact-lead.schema.ts
  └─ Zod validation schemas for input/output

src/server/contact/contact-lead.repository.ts
  └─ Data access layer (server-only)

src/services/contact/create-contact-lead.ts
  └─ Application service (business logic orchestration)

src/app/api/contact-leads/route.ts
  └─ HTTP endpoint handler
```

### Data Flow

```
HTTP POST /api/contact-leads
  ↓
[route.ts] Receives JSON, validates with Zod
  ↓
[createContactLeadService] Orchestrates business logic
  ↓
[contactLeadRepository.create] Persists to database via Prisma
  ↓
Response with success/error envelope
```

## Database

### ContactLead Model

```prisma
model ContactLead {
  id        String    @id @default(cuid())
  fullName  String
  email     String
  phone     String?
  message   String
  source    String    @default("web-form")
  status    String    @default("new")
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@index([email])
  @@index([status])
  @@index([createdAt])
}
```

### Migration

Initial migration is in `prisma/migrations/0_initial_contact_lead/`.

To apply:
```bash
npm run prisma:migrate:dev -- --name init
```

## API Endpoint

### POST /api/contact-leads

Create a new contact lead.

**Request**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1 234-567-8900",
  "message": "I'd like to know more about your services.",
  "source": "web-form"
}
```

**Valid sources**: `"web-form"` (default), `"landing-page"`, `"email"`, `"referral"`

**Response (201 Created)**
```json
{
  "success": true,
  "data": {
    "id": "cluxyz123abc",
    "fullName": "John Doe",
    "email": "john@example.com",
    "status": "new",
    "createdAt": "2026-03-30T12:30:45.000Z"
  },
  "timestamp": "2026-03-30T12:30:45.123Z"
}
```

**Response (Validation Error - 422)**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed: message: Message must be at least 10 characters"
  },
  "timestamp": "2026-03-30T12:30:45.123Z"
}
```

**Response (Server Error - 500)**
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Failed to create contact lead. Please try again."
  },
  "timestamp": "2026-03-30T12:30:45.123Z"
}
```

## Validation Rules

- **fullName**: 2-255 characters required
- **email**: Valid email format required, converted to lowercase
- **phone**: Optional, must match phone pattern if provided
- **message**: 10-5000 characters required
- **source**: Optional (defaults to "web-form")

## Key Design Decisions

### Type Safety

- Input types validated against schemas with runtime Zod checks
- Output types limited to non-sensitive fields only
- Prisma types kept generic (`string` instead of strict unions) to handle direct DB modifications

### Error Handling

- Validation errors return 422 with specific field errors
- Database errors logged internally but return generic 500 to clients
- No stack traces or internal details exposed

### Repository Pattern

- All DB access centralized in `contact-lead.repository.ts`
- Future data access changes isolated to one module
- Easy to add caching, auditing, or soft deletes later

### Service Layer

- Application logic in services, not in route handlers
- Enables reuse by other endpoints or background jobs
- Clear separation between HTTP concerns and business logic

## Testing the Endpoint

### Public create with cURL

```bash
curl -X POST http://localhost:3000/api/contact-leads \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Jane Smith",
    "email": "jane@example.com",
    "message": "This is a longer message that contains more than 10 characters."
  }'
```

### Protected admin flows

Admin-only read routes now use a signed httpOnly session cookie.

```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"admin@dermatologika.local","password":"change-this-admin-password"}'

curl http://localhost:3000/api/contact-leads \
  -b cookies.txt

curl -X POST http://localhost:3000/api/admin/logout \
  -b cookies.txt \
  -c cookies.txt
```

### Using Node fetch

```javascript
const response = await fetch("http://localhost:3000/api/contact-leads", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    fullName: "Jane Smith",
    email: "jane@example.com",
    message: "This is a longer message that contains more than 10 characters.",
    source: "landing-page",
  }),
});

const data = await response.json();
console.log(data);
```

## Extending ContactLead

### Adding a New Field

1. Add to Prisma schema
2. Create migration: `npm run prisma:migrate:dev -- --name feature/add_field`
3. Update `src/types/contact-lead.ts`
4. Update validation schema in `src/features/contact/schemas/`
5. Add to repository methods if needed
6. Update endpoint if exposing via API

### Adding a New Repository Method

```typescript
// src/server/contact/contact-lead.repository.ts
async updateStatus(id: string, status: string): Promise<ContactLead> {
  return await prisma.contactLead.update({
    where: { id },
    data: { status },
  });
}
```

### Adding a Service for Status Updates

```typescript
// src/services/contact/update-contact-lead-status.ts
export async function updateContactLeadStatusService(id: string, newStatus: string) {
  // Validate status
  // Update via repository
  // Return DTO
}
```

## Production Checklist

- [x] TypeScript strict mode
- [x] No `any` types
- [x] Zod validation
- [x] Error handling
- [x] Server-only module boundaries
- [ ] Database connection string set
- [ ] Migration applied to production schema
- [ ] Rate limiting configured (future)
- [ ] Request logging configured (future)
- [ ] Email notifications on new leads (future)
