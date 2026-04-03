@echo off
REM Database Connection Verification Script (Windows)
REM Run this to verify Prisma can connect to PostgreSQL

setlocal enabledelayedexpansion

echo.
echo ==========================================
echo Dermatologika Database Verification
echo ==========================================
echo.

REM Check .env exists
if not exist ".env" (
    echo [X] .env file not found
    echo     Run: copy .env.example .env
    echo     Then: update .env with your DATABASE_URL
    exit /b 1
)

echo [OK] .env file found
echo.

REM Test environment validation
echo Testing environment configuration...
node -e "require('dotenv').config(); const env = require('./src/config/env').env; console.log('[OK] DATABASE_URL is valid');" >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo [OK] Environment validated
) else (
    echo [X] Environment validation failed
    echo     Check DATABASE_URL format in .env
    exit /b 1
)

echo.
echo Testing Prisma Client generation...
call npm run prisma:generate >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo [OK] Prisma Client available
) else (
    echo [X] Prisma Client generation failed
    exit /b 1
)

echo.
echo Checking for pending migrations...
call npx prisma migrate status 2>&1 | find "migrations pending" >nul
if %ERRORLEVEL% equ 0 (
    echo [Warning] Pending migrations detected
    echo     Run: npm run prisma:migrate:dev
) else (
    echo [OK] No pending migrations
)

echo.
echo Attempting database connection...
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    await prisma.\$queryRaw\`SELECT NOW()\`;
    console.log('[OK] Connected to PostgreSQL');
    
    try {
      const count = await prisma.contactLead.count();
      console.log('[OK] ContactLead table accessible');
      console.log('     Records in table: ' + count);
    } catch (e) {
      console.log('[Warning] ContactLead table not found (migration not applied?)');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('[X] Connection failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.\$disconnect();
  }
})();
"

if %ERRORLEVEL% neq 0 (
    exit /b 1
)

echo.
echo ==========================================
echo [OK] All checks passed!
echo ==========================================
echo.
echo Next steps:
echo 1. If migrations are pending:
echo    npm run prisma:migrate:dev
echo.
echo 2. View database with:
echo    npm run prisma:studio
echo.
echo 3. Test the endpoint:
echo    npm run dev
echo    Then open: http://localhost:3000/api/contact-leads (POST)
