# API Testing Guide - ContactLead

Quick reference for testing the ContactLead endpoint locally.

## Development Server

Start the dev server:
```bash
npm run dev
```

Server runs on `http://localhost:3000`

## Test Cases

### Success Case: Valid Contact Lead

```bash
curl -X POST http://localhost:3000/api/contact-leads \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Alice Johnson",
    "email": "alice@dermatologika.com",
    "phone": "+1 234 567 8900",
    "message": "I would like to schedule a consultation for my skin condition.",
    "source": "landing-page"
  }'
```

Expected: 201 Created

### Edge Case: Minimal Valid Input

```bash
curl -X POST http://localhost:3000/api/contact-leads \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Bo",
    "email": "bo@example.com",
    "message": "Longer than 10 chars!!"
  }'
```

Expected: 201 Created (source defaults to "web-form")

### Validation Failures

#### Missing required field
```bash
curl -X POST http://localhost:3000/api/contact-leads \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com"
  }'
```

Expected: 422 Validation Error (missing message)

#### Invalid email
```bash
curl -X POST http://localhost:3000/api/contact-leads \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "invalid-email",
    "message": "This is a valid message with more than 10 chars"
  }'
```

Expected: 422 Validation Error

#### Message too short
```bash
curl -X POST http://localhost:3000/api/contact-leads \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "message": "Short"
  }'
```

Expected: 422 Validation Error

#### Invalid phone format
```bash
curl -X POST http://localhost:3000/api/contact-leads \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "message": "This is a valid message with more than 10 chars",
    "phone": "abc"
  }'
```

Expected: 422 Validation Error

### Malformed Request

#### Invalid JSON
```bash
curl -X POST http://localhost:3000/api/contact-leads \
  -H "Content-Type: application/json" \
  -d '{invalid json}'
```

Expected: 400 Bad Request

## Prisma Studio (View Data)

After applying migrations, view all contact leads:

```bash
npm run prisma:studio
```

Opens browser interface at `http://localhost:5555`

## Response Structure

All responses follow this envelope:

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "ISO string"
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  },
  "timestamp": "ISO string"
}
```

## HTTP Status Codes

- **201**: Successfully created
- **400**: Malformed request (invalid JSON)
- **422**: Validation failed
- **500**: Server error
