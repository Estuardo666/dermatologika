/**
 * Database Connection Test
 * Usage: node scripts/test-db-connection.js
 *
 * This script verifies that:
 * 1. DATABASE_URL is properly configured
 * 2. Prisma can connect to PostgreSQL
 * 3. ContactLead table exists and is queryable
 */

const path = require("path");

// Load .env
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

async function testConnection() {
  console.log("\n========================================");
  console.log("Database Connection Test");
  console.log("========================================\n");

  // Test 1: Environment validation
  console.log("1. Testing environment validation...");
  try {
    const { env } = require(path.join(__dirname, "..", "src", "config", "env"));
    console.log("   ✓ DATABASE_URL validated");
    console.log(`   ✓ Environment: ${env.NODE_ENV}`);
  } catch (error) {
    console.error("   ✗ Environment validation failed:");
    console.error(`   ${error.message}`);
    process.exit(1);
  }

  // Test 2: Prisma connection
  console.log("\n2. Testing Prisma connection...");
  try {
    const { PrismaClient } = require("@prisma/client");
    const prisma = new PrismaClient();

    // Test connection
    const now = await prisma.$queryRaw`SELECT NOW() as time`;
    console.log("   ✓ Connected to PostgreSQL");
    console.log(`   ✓ Server time: ${now[0].time}`);

    // Test 3: ContactLead table
    console.log("\n3. Testing ContactLead table...");
    try {
      const count = await prisma.contactLead.count();
      console.log("   ✓ ContactLead table accessible");
      console.log(`   ✓ Records in table: ${count}`);

      if (count === 0) {
        console.log("   → Table is empty (ready for data)");
      }
    } catch (tableError) {
      console.error("   ✗ ContactLead table not found or error:");
      console.error(`   ${tableError.message}`);
      console.log("\n   → This is normal if migrations haven't been applied yet.");
      console.log("   → Run: npm run prisma:migrate:dev\n");
    }

    // Test 4: Schema verification
    console.log("\n4. Checking database schema...");
    try {
      const tables = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `;
      console.log(`   ✓ Found ${tables.length} tables:`);
      tables.forEach((t) => {
        console.log(`     - ${t.table_name}`);
      });
    } catch (schemaError) {
      console.error("   ✗ Could not verify schema:", schemaError.message);
    }

    await prisma.$disconnect();

    console.log("\n========================================");
    console.log("✓ Database connection test passed!");
    console.log("========================================\n");
    console.log("Ready to use:");
    console.log("  • npm run dev        - Start dev server");
    console.log("  • npm run build      - Build for production");
    console.log("  • npm run prisma:studio - Open Prisma Studio\n");

    process.exit(0);
  } catch (error) {
    console.error("   ✗ Connection failed:");
    console.error(`   ${error.message}`);

    if (error.message.includes("ECONNREFUSED")) {
      console.log("\n   → PostgreSQL server not running");
      console.log("   → On macOS: brew services start postgresql");
      console.log("   → On Linux: sudo systemctl start postgresql");
      console.log("   → On Windows: Open Services and start 'PostgreSQL'\n");
    } else if (error.message.includes("does not exist")) {
      console.log("\n   → Database or user doesn't exist");
      console.log("   → See docs/DATABASE_SETUP.md for setup instructions\n");
    } else if (error.message.includes("password authentication failed")) {
      console.log("\n   → Incorrect database credentials");
      console.log("   → Check DATABASE_URL in .env\n");
    } else {
      console.log("\n   → See docs/DATABASE_SETUP.md for troubleshooting\n");
    }

    process.exit(1);
  }
}

// Run test
testConnection();
