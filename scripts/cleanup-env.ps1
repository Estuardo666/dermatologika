#!/usr/bin/env pwsh
# cleanup-env.ps1 - Remove system-level DATABASE_URL environment variable
# 
# This script removes the system-level DATABASE_URL variable that may be
# overriding the Neon connection string in .env
#
# Usage: powershell -ExecutionPolicy Bypass -File cleanup-env.ps1
#
# Note: Requires Administrator privileges. The script will ask for confirmation.

$ErrorActionPreference = "Continue"

# Check if running as Administrator
$isAdmin = [bool]([System.Security.Principal.WindowsIdentity]::GetCurrent().Groups -match "S-1-5-32-544")

if (-not $isAdmin) {
    Write-Host "⚠️  This script requires Administrator privileges." -ForegroundColor Yellow
    Write-Host "Please run:"
    Write-Host "  powershell -ExecutionPolicy Bypass -File cleanup-env.ps1"
    Write-Host ""
    Write-Host "And run PowerShell as Administrator."
    exit 1
}

Write-Host "🔍 Checking for system-level DATABASE_URL variable..." -ForegroundColor Cyan

# Check Machine (system) level
$machineVar = [Environment]::GetEnvironmentVariable("DATABASE_URL", "Machine")
$userVar = [Environment]::GetEnvironmentVariable("DATABASE_URL", "User")

if ($machineVar -or $userVar) {
    Write-Host ""
    if ($machineVar) {
        Write-Host "Found Machine-level DATABASE_URL:" -ForegroundColor Yellow
        Write-Host "  Value: $($machineVar.Substring(0, [Math]::Min(60, $machineVar.Length)))..."
    }
    if ($userVar) {
        Write-Host "Found User-level DATABASE_URL:" -ForegroundColor Yellow
        Write-Host "  Value: $($userVar.Substring(0, [Math]::Min(60, $userVar.Length)))..."
    }
    
    Write-Host ""
    $confirm = Read-Host "Remove these global variables? (y/n)"
    
    if ($confirm -eq "y" -or $confirm -eq "Y") {
        Write-Host ""
        Write-Host "🧹 Cleaning up..." -ForegroundColor Cyan
        
        if ($machineVar) {
            [Environment]::SetEnvironmentVariable("DATABASE_URL", $null, "Machine")
            Write-Host "✓ Removed Machine-level DATABASE_URL" -ForegroundColor Green
        }
        
        if ($userVar) {
            [Environment]::SetEnvironmentVariable("DATABASE_URL", $null, "User")
            Write-Host "✓ Removed User-level DATABASE_URL" -ForegroundColor Green
        }
        
        Write-Host ""
        Write-Host "✅ Cleanup complete!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📌 IMPORTANT: You must now:" -ForegroundColor Yellow
        Write-Host "   1. Close ALL PowerShell windows completely"
        Write-Host "   2. Close VS Code if it's open"
        Write-Host "   3. Wait 5 seconds"
        Write-Host "   4. Reopen PowerShell/Terminal fresh"
        Write-Host "   5. Run: npm run prisma:migrate:status"
        Write-Host ""
        Write-Host "This ensures the new Neon connection loads correctly."
    } else {
        Write-Host "Cancelled." -ForegroundColor Yellow
    }
} else {
    Write-Host "✓ No system-level DATABASE_URL variables found" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your environment is clean. The .env file will be used for DATABASE_URL."
}
