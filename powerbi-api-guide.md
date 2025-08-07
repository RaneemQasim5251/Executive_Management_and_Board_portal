# Power BI REST API Access Guide

## 🔑 Getting Access Token

### Option A: Using Azure Portal (Recommended)
1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to "Azure Active Directory" → "App registrations"
3. Find your Power BI app registration
4. Go to "Certificates & secrets" → "Client secrets"
5. Copy your client secret
6. Use this to get a token:

```bash
POST https://login.microsoftonline.com/{tenant-id}/oauth2/v2.0/token
Content-Type: application/x-www-form-urlencoded

client_id=YOUR_CLIENT_ID
&client_secret=YOUR_CLIENT_SECRET
&scope=https://analysis.windows.net/powerbi/api/.default
&grant_type=client_credentials
```

### Option B: Using Power BI Developer Portal
1. Go to [Power BI Developer Portal](https://app.powerbi.com/embedsetup)
2. Sign in with your Power BI account
3. Generate an embed token
4. Use the token for API calls

## 📋 Making the API Call

### Using curl:
```bash
curl -X GET \
  "https://api.powerbi.com/v1.0/myorg/reports/de40b238-ed32-4ca6-abe5-7383e5785ddf/pages" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

### Using Postman:
1. Create new GET request
2. URL: `https://api.powerbi.com/v1.0/myorg/reports/de40b238-ed32-4ca6-abe5-7383e5785ddf/pages`
3. Headers:
   - `Authorization: Bearer YOUR_ACCESS_TOKEN`
   - `Content-Type: application/json`
4. Send request

### Expected Response:
```json
[
  {
    "displayName": "JTC Fleet Status",
    "name": "ReportSection",
    "order": "0"
  },
  {
    "displayName": "Al Jeri Investment",
    "name": "ReportSection1", 
    "order": "1"
  },
  {
    "displayName": "J:Oil Operations",
    "name": "ReportSection2",
    "order": "2"
  }
]
```

## 🔄 Update Your Code
Once you get the response, update the `pageNames` object in `src/pages/enterprise-systems/KPIsERP.tsx`:

```typescript
const pageNames = {
  'jtc': 'ReportSection',        // Use actual 'name' from API
  'aljeri': 'ReportSection1',    // Use actual 'name' from API
  'joil': 'ReportSection2',      // Use actual 'name' from API
  // ... etc
};
```