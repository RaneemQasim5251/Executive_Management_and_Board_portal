# Simple method to get Power BI page names
# This will guide you through the process step by step

Write-Host "=== POWER BI PAGE NAMES RETRIEVAL ===" -ForegroundColor Green
Write-Host ""

Write-Host "METHOD 1: Use Power BI Service directly" -ForegroundColor Yellow
Write-Host "1. Go to https://app.powerbi.com" -ForegroundColor White
Write-Host "2. Find your report: de40b238-ed32-4ca6-abe5-7383e5785ddf" -ForegroundColor White
Write-Host "3. Open the report" -ForegroundColor White
Write-Host "4. Look at the tabs at the bottom of the report" -ForegroundColor White
Write-Host "5. The tab names are usually the page names!" -ForegroundColor White
Write-Host ""

Write-Host "METHOD 2: Use Browser Developer Tools" -ForegroundColor Yellow
Write-Host "1. Open the report in Power BI Service" -ForegroundColor White
Write-Host "2. Press F12 to open Developer Tools" -ForegroundColor White
Write-Host "3. Go to Network tab" -ForegroundColor White
Write-Host "4. Click on different report tabs" -ForegroundColor White
Write-Host "5. Look for API calls with 'pages' in the URL" -ForegroundColor White
Write-Host "6. Check the response for page names" -ForegroundColor White
Write-Host ""

Write-Host "METHOD 3: Try the PowerShell module" -ForegroundColor Yellow
Write-Host "Run: ./get-powerbi-pages.ps1" -ForegroundColor White
Write-Host ""

Write-Host "WHAT TO LOOK FOR:" -ForegroundColor Cyan
Write-Host "Page names usually look like:" -ForegroundColor White
Write-Host "- ReportSection (first page)" -ForegroundColor Gray
Write-Host "- ReportSection1 (second page)" -ForegroundColor Gray
Write-Host "- ReportSection2 (third page)" -ForegroundColor Gray
Write-Host "- etc..." -ForegroundColor Gray
Write-Host ""

Write-Host "UPDATE YOUR CODE:" -ForegroundColor Green
Write-Host "Once you find the page names, update the pageNames object in:" -ForegroundColor White
Write-Host "src/pages/enterprise-systems/KPIsERP.tsx" -ForegroundColor Cyan

Read-Host "Press Enter to continue..."