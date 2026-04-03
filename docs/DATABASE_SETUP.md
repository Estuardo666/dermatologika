# Database Setup & Migration Guide

## Prerequisites

- PostgreSQL 13+ installed and running
- `psql` CLI available (or use a database client like pgAdmin, DBeaver)
- Prisma packages installed: `npm install` already done

## Local Development Setup

### 1. Create Development Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE dermatologika_dev;

# (Optional) Create a user for development
CREATE USER dermatologika_user WITH PASSWORD 'your_secure_password';
ALTER ROLE dermatologika_user WITH CREATEDB;

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE dermatologika_dev TO dermatologika_user;
```

### 2. Configure Environment

Create `.env` in project root (copy from `.env.example`):

```bash
cp .env.example .env
```

Update `.env` with your local database URL:

```env
DATABASE_URL="postgresql://dermatologika_user:your_secure_password@localhost:5432/dermatologika_dev?schema=public"
NODE_ENV="development"
```

### 3. Verify Environment Configuration

The project validates `DATABASE_URL` on server startup:

```bash
node -e "require('./src/config/env.ts')"
```

If validation passes, no error will print. If it fails, you'll see:
```
Error: Invalid server environment variables: DATABASE_URL: ...
```

### 4. Run Prisma Migrations

Apply the initial ContactLead migration to your database:

```bash
# Create and apply migration
npm run prisma:migrate:dev -- --name init
```

This will:
1. Create the `ContactLead` table
2. Create indexes for email, status, createdAt
3. Generate Prisma Client types

Output:
```
✔ Successfully created migration '[timestamp]_init'
✔ Database migrated successfully
✔ Generated Prisma Client
```

### 5. Verify Database Connection

Test that Prisma can connect:

```bash
npm run prisma:studio
```

This opens Prisma Studio at `http://localhost:5555`:
- Shows database schema
- Allows browsing/editing records
- Confirms connection works

Close with Ctrl+C after verification.

## Verify ContactLead Table

### Using psql

```bash
# Connect to database
psql -U dermatologika_user -d dermatologika_dev

# List tables
\dt

# Describe ContactLead table
\d "ContactLead"

# Check indexes
\di

# Exit
\q
```

Output should show:
- Table `ContactLead` with columns: id, fullName, email, phone, message, source, status, createdAt, updatedAt
- Indexes on email, status, createdAt

### Using JavaScript (verify in Node)

```bash
node -e "
const { prisma } = require('./src/server/db/prisma');
(async () => {
  try {
    const leads = await prisma.contactLead.findMany();
    console.log('✓ ContactLead table accessible');
    console.log('Records:', leads.length);
    process.exit(0);
  } catch (error) {
    console.error('✗ Failed to query ContactLead:', error.message);
    process.exit(1);
  }
})();
"
```

## Production Database Setup

### Using Neon (PostgreSQL as a Service)

1. Create account at https://neon.tech
2. Create a new project and database
3. Copy connection string from Neon dashboard
4. Update `.env` (or CI/CD secret):

```env
DATABASE_URL="postgresql://[user]:[password]@[host]/[database]?schema=public&sslmode=require"
```

5. Apply migrations:

```bash
npm run prisma:migrate:deploy
```

### Using Self-Hosted PostgreSQL

1. Ensure server is running and accessible
2. Create database and user with proper permissions
3. Update `DATABASE_URL` with remote host
4. Add SSL if required: `?sslmode=require`
5. Test connection before applying migrations:

```bash
psql "$DATABASE_URL"
```

6. Apply migrations:

```bash
npm run prisma:migrate:deploy
```

## Common Issues

### Error: "connect ECONNREFUSED 127.0.0.1:5432"

**Cause**: PostgreSQL not running

**Fix**:
```bash
# macOS (Homebrew)
brew services start postgresql

# Linux (systemd)
sudo systemctl start postgresql

# Windows
# Start PostgreSQL service via Services app or:
pg_ctl start -D "C:\Program Files\PostgreSQL\15\data"
```

### Error: "FATAL: role 'user' does not exist"

**Cause**: User not created or wrong username in `.env`

**Fix**:
```bash
# Verify correct user exists
psql -U postgres -c "\du"

# Update DATABASE_URL in .env with correct user
```

### Error: "FATAL: database 'dermatologika_dev' does not exist"

**Cause**: Database not created

**Fix**:
```bash
# Create database
psql -U postgres -c "CREATE DATABASE dermatologika_dev;"

# Re-run migrations
npm run prisma:migrate:dev -- --name init
```

### Error: "Invalid server environment variables"

**Cause**: `DATABASE_URL` format incorrect or missing

**Fix**:
- Check `.env` is in project root
- Verify URL follows format: `postgresql://user:password@host:port/database?schema=public`
- No trailing whitespace in `.env`
- Passwords with special chars must be URL-encoded

## Prisma Commands Reference

```bash
# Generate Prisma Client (after schema changes)
npm run prisma:generate

# Create and apply migration (development)
npm run prisma:migrate:dev -- --name feature_name

# Apply existing migrations (production)
npm run prisma:migrate:deploy

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Reset database (development only - DESTRUCTIVE!)
npx prisma migrate reset

# Check migration status
npx prisma migrate status
```

## Troubleshooting Migrations

### Rollback a migration (development only)

```bash
# Rollback last migration
npx prisma migrate resolve --rolled-back [migration_name]
```

### Modify a migration (development only)

1. Stop any running server
2. Reset database: `npx prisma migrate reset`
3. Edit migration SQL file if needed
4. Re-run: `npm run prisma:migrate:dev`

### Repair migration history

```bash
# Check migration status
npx prisma migrate status

# If stuck, reset (DESTRUCTIVE):
npx prisma migrate reset
```

## Best Practices

1. **Always backup before production migrations**
   ```bash
   pg_dump -U user -h host -d database > backup.sql
   ```

2. **Test migrations locally first**
   - Apply to dev database
   - Verify with Prisma Studio
   - Test endpoints against dev data

3. **Keep DATABASE_URL secure**
   - Never commit `.env` to git
   - Use `.env.local` for local development
   - Use CI/CD secrets for production

4. **Monitor migration status**
   ```bash
   npx prisma migrate status
   ```

5. **Document schema changes**
   - Add comments to schema.prisma
   - Update ARCHITECTURE.md when adding models
