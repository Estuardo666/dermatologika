# Database Connection Test Guide

## Quick Start

Test if Prisma can connect to your database:

### Linux / macOS
```bash
bash verify-db.sh
```

### Windows
```cmd
verify-db.bat
```

### Or use Node directly
```bash
node scripts/test-db-connection.js
```

## What Gets Tested

1. **Environment Configuration**
   - Checks `.env` file exists
   - Validates `DATABASE_URL` format
   - Confirms `NODE_ENV` is set

2. **Prisma Client**
   - Regenerates Client types
   - Checks for any generation errors

3. **PostgreSQL Connection**
   - Attempts actual database connection
   - Verifies server is running and accessible
   - Shows server time (confirms working connection)

4. **ContactLead Table**
   - Checks if table exists
   - Counts records
   - Shows if migrations need to be applied

5. **Database Schema**
   - Lists all tables in public schema
   - Verifies expected tables exist

## Expected Output (Success)

```
========================================
Database Connection Test
========================================

1. Testing environment validation...
   ✓ DATABASE_URL validated
   ✓ Environment: development

2. Testing Prisma connection...
   ✓ Connected to PostgreSQL
   ✓ Server time: 2026-03-30T14:32:15.123Z

3. Testing ContactLead table...
   ✓ ContactLead table accessible
   ✓ Records in table: 0
   → Table is empty (ready for data)

4. Checking database schema...
   ✓ Found 5 tables:
     - ContactLead
     - _prisma_migrations
     - ...

========================================
✓ Database connection test passed!
========================================
```

## Common Issues & Fixes

### PostgreSQL not running
```
✗ Connection failed: ECONNREFUSED
```
**Fix:**
- macOS: `brew services start postgresql`
- Linux: `sudo systemctl start postgresql`
- Windows: Start PostgreSQL from Services

### Database/User doesn't exist
```
✗ Connection failed: database "dermatologika_dev" does not exist
```
**Fix:**
```bash
psql -U postgres
CREATE DATABASE dermatologika_dev;
CREATE USER dermatologika_user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE dermatologika_dev TO dermatologika_user;
```

### Wrong credentials
```
✗ Connection failed: password authentication failed
```
**Fix:**
- Verify username/password in `.env`
- Check DATABASE_URL format
- Example: `postgresql://user:password@localhost:5432/dbname?schema=public`

### Migrations not applied
```
✗ ContactLead table not found or error
```
**Fix:**
```bash
npm run prisma:migrate:dev
```

## After Tests Pass

1. **View data:**
   ```bash
   npm run prisma:studio
   ```

2. **Start dev server:**
   ```bash
   npm run dev
   ```

3. **Test endpoint:**
   ```bash
   curl -X POST http://localhost:3000/api/contact-leads \
     -H "Content-Type: application/json" \
     -d '{
       "fullName": "John Doe",
       "email": "john@example.com",
       "message": "This is a test message for the database."
     }'
   ```

## Production Database Testing

For production setup (e.g., Neon, AWS RDS):

1. Create `.env` with production `DATABASE_URL`
2. Run test:
   ```bash
   NODE_ENV=production node scripts/test-db-connection.js
   ```
3. Apply migrations:
   ```bash
   npm run prisma:migrate:deploy
   ```
4. Verify with test script again

## Troubleshooting

If tests still fail after trying fixes above:

1. Check PostgreSQL is listening:
   ```bash
   psql -U postgres -c "SELECT version();"
   ```

2. Test raw connection:
   ```bash
   psql "postgresql://user:password@localhost:5432/dbname"
   ```

3. Check Prisma schema is valid:
   ```bash
   npm run prisma:generate
   ```

4. See detailed error:
   ```bash
   NODE_DEBUG=* node scripts/test-db-connection.js
   ```

## Documentation

- Full setup guide: [DATABASE_SETUP.md](DATABASE_SETUP.md)
- API testing: [API_TESTING.md](API_TESTING.md)
- ContactLead vertical: [CONTACT_LEAD_VERTICAL.md](CONTACT_LEAD_VERTICAL.md)
