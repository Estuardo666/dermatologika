#!/bin/bash
# Database Connection Verification Script
# Run this to verify Prisma can connect to PostgreSQL

set -e

echo "=========================================="
echo "Dermatologika Database Verification"
echo "=========================================="
echo ""

# Check .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found"
    echo "   Run: cp .env.example .env"
    echo "   Then: update .env with your DATABASE_URL"
    exit 1
fi

echo "✓ .env file found"
echo ""

# Test environment validation
echo "→ Testing environment configuration..."
if node -e "require('dotenv').config(); const env = require('./src/config/env').env; console.log('✓ Environment validated')" 2>/dev/null; then
    echo "  ✓ DATABASE_URL is valid"
else
    echo "❌ Environment validation failed"
    echo "   Check DATABASE_URL format in .env"
    exit 1
fi

echo ""
echo "→ Testing Prisma Client generation..."
npm run prisma:generate >/dev/null 2>&1 || {
    echo "❌ Prisma Client generation failed"
    exit 1
}
echo "  ✓ Prisma Client available"

echo ""
echo "→ Checking for pending migrations..."
PENDING=$(npx prisma migrate status 2>&1 | grep -c "migrations pending" || true)
if [ "$PENDING" -gt 0 ]; then
    echo "  ⚠ Pending migrations detected"
    echo "  Run: npm run prisma:migrate:dev"
fi

echo ""
echo "→ Attempting database connection..."
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    const result = await prisma.\$queryRaw\`SELECT NOW()\`;
    console.log('  ✓ Connected to PostgreSQL');
    
    // Try to access ContactLead
    try {
      const count = await prisma.contactLead.count();
      console.log('  ✓ ContactLead table accessible');
      console.log('    Records in table: ' + count);
    } catch (e) {
      console.log('  ⚠ ContactLead table not found (migration not applied?)');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('  ❌ Connection failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.\$disconnect();
  }
})();
" || exit 1

echo ""
echo "=========================================="
echo "✓ All checks passed!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. If migrations are pending:"
echo "   npm run prisma:migrate:dev"
echo ""
echo "2. View database with:"
echo "   npm run prisma:studio"
echo ""
echo "3. Test the endpoint:"
echo "   npm run dev"
echo "   curl -X POST http://localhost:3000/api/contact-leads \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"fullName\":\"Test\",\"email\":\"test@example.com\",\"message\":\"Testing database connection\"}'"
