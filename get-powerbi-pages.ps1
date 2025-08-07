# PowerShell script to get Power BI pages
# Install Power BI PowerShell module if not already installed
# Install-Module -Name MicrosoftPowerBIMgmt -Scope CurrentUser

# Import the Power BI module
Import-Module MicrosoftPowerBIMgmt

Write-Host "Power BI module imported. Now connecting to Power BI..." -ForegroundColor Yellow
Write-Host "A browser window will open for authentication." -ForegroundColor Cyan

# Connect to Power BI
Connect-PowerBIServiceAccount

# Get the report pages
$reportId = "de40b238-ed32-4ca6-abe5-7383e5785ddf"
$pages = Get-PowerBIReport -Id $reportId | Get-PowerBIPage

# Display the pages
$pages | Select-Object Name, DisplayName, Order | Format-Table

# Or get as JSON for easy copying
$pages | Select-Object Name, DisplayName, Order | ConvertTo-Json -Depth 2

Write-Host "Copy the 'Name' values above and update your pageNames object in KPIsERP.tsx"