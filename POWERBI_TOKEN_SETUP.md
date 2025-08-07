# Power BI Token Setup Guide

## 🔑 Your Credentials
- **Client ID**: `c4360f88-13f6-48b7-8428-874517362e64`
- **Client Secret**: `your-client-secret-here`
- **Tenant ID**: `ba2cab20-721a-44f0-bec4-f2e784ba3c23`

## 🚀 Quick Setup

### Option 1: Using the Token Generator Script
```bash
node get-powerbi-token.js
```
Copy the generated token to your `.env` file.

### Option 2: Manual Token Generation
Use this PowerShell command:
```powershell
$body = @{
    grant_type = "client_credentials"
    client_id = "c4360f88-13f6-48b7-8428-874517362e64"
    client_secret = "your-client-secret-here"
    scope = "https://analysis.windows.net/powerbi/api/.default"
}

$response = Invoke-RestMethod -Uri "https://login.microsoftonline.com/ba2cab20-721a-44f0-bec4-f2e784ba3c23/oauth2/v2.0/token" -Method Post -Body $body
Write-Host "Access Token: $($response.access_token)"
```

### Option 3: Using curl
```bash
curl -X POST \
  'https://login.microsoftonline.com/ba2cab20-721a-44f0-bec4-f2e784ba3c23/oauth2/v2.0/token' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'grant_type=client_credentials&client_id=c4360f88-13f6-48b7-8428-874517362e64&client_secret=your-client-secret-here&scope=https://analysis.windows.net/powerbi/api/.default'
```

## 📝 Environment Setup

1. **Create/Update your `.env` file:**
```bash
# Power BI Configuration
VITE_POWERBI_CLIENT_ID=c4360f88-13f6-48b7-8428-874517362e64
VITE_POWERBI_CLIENT_SECRET=your-client-secret-here
VITE_POWERBI_TENANT_ID=ba2cab20-721a-44f0-bec4-f2e784ba3c23
VITE_POWERBI_ACCESS_TOKEN=your-generated-token-here

# Report IDs
VITE_APP_HOME_REPORT_ID=de40b238-ed32-4ca6-abe5-7383e5785ddf
VITE_APP_JTC_REPORT_ID=de40b238-ed32-4ca6-abe5-7383e5785ddf
VITE_APP_ALJERI_REPORT_ID=de40b238-ed32-4ca6-abe5-7383e5785ddf
VITE_APP_JOIL_REPORT_ID=de40b238-ed32-4ca6-abe5-7383e5785ddf
VITE_APP_TIME_ATTENDANCE_REPORT_ID=de40b238-ed32-4ca6-abe5-7383e5785ddf
VITE_APP_45DEGREES_REPORT_ID=de40b238-ed32-4ca6-abe5-7383e5785ddf
VITE_APP_SHAHEEN_REPORT_ID=de40b238-ed32-4ca6-abe5-7383e5785ddf
VITE_APP_MAWTEN_REPORT_ID=de40b238-ed32-4ca6-abe5-7383e5785ddf
VITE_APP_GROUP_REPORT_ID=de40b238-ed32-4ca6-abe5-7383e5785ddf
VITE_APP_DEVELOPMENT_REPORT_ID=de40b238-ed32-4ca6-abe5-7383e5785ddf
```

2. **Restart your development server:**
```bash
npm run dev
```

## ✅ Verification

After setting up the token, you should see:
- ✅ Green success message in the Power BI Integration alert
- ✅ No more console errors about invalid embed URLs
- ✅ Advanced Power BI features working (filters, events, etc.)

## 🔄 Token Refresh

Access tokens typically expire after 1 hour. For production, consider:
1. Implementing automatic token refresh
2. Using server-side token generation
3. Setting up Azure AD authentication flow

## 🛠️ Troubleshooting

If you get errors:
1. **403 Forbidden**: Check your Azure AD app permissions
2. **401 Unauthorized**: Verify client secret is correct and not expired
3. **400 Bad Request**: Check tenant ID and client ID format

## 🔒 Security Best Practices

1. **Never commit secrets to git** - Use `.env` files
2. **Regenerate secrets regularly** - Especially after sharing
3. **Use server-side token generation** - For production apps
4. **Implement proper CORS** - For web applications