# FinanceFlow Edge Functions Deployment Script
# Run this script to deploy all loans-related Edge Functions

Write-Host "🚀 FinanceFlow - Edge Functions Deployment" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Supabase CLI is installed
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow
$supabaseInstalled = Get-Command supabase -ErrorAction SilentlyContinue
if (-not $supabaseInstalled) {
    Write-Host "❌ Supabase CLI not found!" -ForegroundColor Red
    Write-Host "   Install it with: npm install -g supabase" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Supabase CLI found" -ForegroundColor Green

# Navigate to project root
$projectRoot = "d:\Project\FinanceFlow\FinanceFlow"
Set-Location $projectRoot
Write-Host "📁 Working directory: $projectRoot" -ForegroundColor Gray
Write-Host ""

# List of loans-related functions to deploy
$functions = @(
    "calculate-amortization-schedule",
    "generate-debt-payoff-strategy",
    "analyze-refinancing-opportunities",
    "detect-payment-issues",
    "send-payment-reminders"
)

Write-Host "📦 Functions to deploy:" -ForegroundColor Yellow
foreach ($func in $functions) {
    Write-Host "   • $func" -ForegroundColor Gray
}
Write-Host ""

# Ask for confirmation
$confirm = Read-Host "Deploy all functions? (y/n)"
if ($confirm -ne 'y' -and $confirm -ne 'Y') {
    Write-Host "❌ Deployment cancelled" -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "🚀 Starting deployment..." -ForegroundColor Cyan
Write-Host ""

$successCount = 0
$failCount = 0

foreach ($func in $functions) {
    Write-Host "Deploying $func..." -ForegroundColor Yellow
    
    try {
        supabase functions deploy $func
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ $func deployed successfully" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host "❌ $func deployment failed" -ForegroundColor Red
            $failCount++
        }
    } catch {
        Write-Host "❌ Error deploying $func : $_" -ForegroundColor Red
        $failCount++
    }
    
    Write-Host ""
}

# Summary
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "📊 Deployment Summary" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "✅ Successful: $successCount" -ForegroundColor Green
Write-Host "❌ Failed: $failCount" -ForegroundColor Red
Write-Host ""

if ($failCount -eq 0) {
    Write-Host "🎉 All functions deployed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  Next Steps:" -ForegroundColor Yellow
    Write-Host "   1. Set environment variables in Supabase Dashboard:" -ForegroundColor Gray
    Write-Host "      • GROK_API_KEY (for AI features)" -ForegroundColor Gray
    Write-Host "      • CRON_SECRET (for scheduled jobs)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "   2. Set up cron job for payment reminders:" -ForegroundColor Gray
    Write-Host "      • Function: send-payment-reminders" -ForegroundColor Gray
    Write-Host "      • Schedule: 0 9 * * * (9 AM daily)" -ForegroundColor Gray
    Write-Host "      • Header: Authorization: Bearer YOUR_CRON_SECRET" -ForegroundColor Gray
    Write-Host ""
    Write-Host "   3. Test functions in Supabase Dashboard" -ForegroundColor Gray
    Write-Host ""
    Write-Host "📚 See EDGE_FUNCTIONS_DEPLOYMENT.md for detailed instructions" -ForegroundColor Cyan
} else {
    Write-Host "⚠️  Some functions failed to deploy" -ForegroundColor Yellow
    Write-Host "   Check the error messages above and try again" -ForegroundColor Gray
    Write-Host "   Or deploy individually: supabase functions deploy FUNCTION_NAME" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
