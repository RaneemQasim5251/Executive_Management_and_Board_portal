# Power BI Integration Setup Guide

## Overview
This guide will help you set up proper Power BI authentication and configuration for the Executive Management Portal.

## 🚀 Features Implemented

### ✅ Advanced Power BI Integration
- **Official Power BI React Client**: Using `powerbi-client-react` for native integration
- **Proper Authentication Handling**: Token-based authentication system
- **Error Management**: Comprehensive error handling and user feedback
- **Event Handling**: Full Power BI event system integration
- **Export Functions**: PDF export and print capabilities
- **Refresh Controls**: Real-time report refresh functionality
- **Responsive Design**: Optimized for all device sizes

### ✅ Enterprise Features
- **Multi-Report Dashboard**: All 7 business unit reports integrated
- **Category Filtering**: Operations, Financial, HR & Workforce tabs
- **Bilingual Support**: Full Arabic/English interface
- **Professional UI**: Executive-grade design and user experience

## 🔧 Setup Instructions

### Step 1: Power BI Service Configuration

1. **Register Your Application in Azure AD**
   ```bash
   # Go to Azure Portal > Azure Active Directory > App registrations
   # Create a new registration with these settings:
   Name: "Executive Management Portal"
   Supported account types: "Accounts in this organizational directory only"
   Redirect URI: "https://your-domain.com/auth/callback" (for production)
   ```

2. **Configure API Permissions**
   ```bash
   # Add these Power BI permissions:
   - Dataset.Read.All
   - Report.Read.All
   - Workspace.Read.All
   - Dashboard.Read.All
   ```

3. **Generate Client Secret**
   ```bash
   # Go to Certificates & secrets > New client secret
   # Copy the secret value (you'll need this for backend authentication)
   ```

### Step 2: Environment Configuration

Create a `.env` file in your project root:

```env
# Power BI Configuration
REACT_APP_POWERBI_CLIENT_ID=your-azure-app-client-id
REACT_APP_POWERBI_TENANT_ID=ba2cab20-721a-44f0-bec4-f2e784ba3c23
REACT_APP_POWERBI_CLIENT_SECRET=your-client-secret

# Report IDs (replace with your actual report IDs)
REACT_APP_JTC_REPORT_ID=de40b238-ed32-4ca6-abe5-7383e5785ddf
REACT_APP_ALJERI_REPORT_ID=your-aljeri-report-id
REACT_APP_JOIL_REPORT_ID=your-joil-report-id
REACT_APP_TIME_ATTENDANCE_REPORT_ID=your-time-attendance-report-id
REACT_APP_45DEGREES_REPORT_ID=your-45degrees-report-id
REACT_APP_SHAHEEN_REPORT_ID=your-shaheen-report-id
REACT_APP_REVENUE_REPORT_ID=your-revenue-report-id
```

### Step 3: Backend Authentication Service (Required)

**⚠️ IMPORTANT**: For security reasons, access tokens should NEVER be stored in frontend code. You need to implement a backend service to generate tokens.

Create a backend endpoint (Node.js/Python/C#):

```javascript
// Example Node.js backend endpoint
app.post('/api/powerbi/token', async (req, res) => {
  try {
    const tokenResponse = await axios.post(
      `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.POWERBI_CLIENT_ID,
        client_secret: process.env.POWERBI_CLIENT_SECRET,
        scope: 'https://analysis.windows.net/powerbi/api/.default'
      })
    );
    
    const accessToken = tokenResponse.data.access_token;
    
    // Get embed token for specific report
    const embedTokenResponse = await axios.post(
      `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}/GenerateToken`,
      {
        accessLevel: 'View',
        allowSaveAs: false
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    res.json({
      accessToken: embedTokenResponse.data.token,
      tokenId: embedTokenResponse.data.tokenId,
      expiration: embedTokenResponse.data.expiration
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate Power BI token' });
  }
});
```

### Step 4: Update Frontend Service

Update `src/services/powerBIService.ts`:

```typescript
public async getAccessToken(): Promise<string> {
  try {
    const response = await fetch('/api/powerbi/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userAuthToken}` // Your app's auth token
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch access token');
    }
    
    const data = await response.json();
    return data.accessToken;
  } catch (error) {
    console.error('Failed to fetch Power BI access token:', error);
    throw new Error('Unable to authenticate with Power BI service');
  }
}
```

## 🔒 Security Best Practices

### Authentication Flow
1. **User Authentication**: User logs into your portal
2. **Token Request**: Frontend requests Power BI token from your backend
3. **Backend Validation**: Backend validates user permissions
4. **Token Generation**: Backend generates embed token using service principal
5. **Secure Delivery**: Token sent securely to frontend
6. **Report Embedding**: Frontend uses token to embed reports

### Security Considerations
- ✅ Never store client secrets in frontend code
- ✅ Use short-lived embed tokens (1 hour max)
- ✅ Implement token refresh mechanism
- ✅ Validate user permissions before token generation
- ✅ Use HTTPS for all communications
- ✅ Implement proper CORS policies

## 🎯 Testing & Validation

### Test the Integration
1. **Development Mode**: `npm run dev`
2. **Navigate to**: `/systems/kpi-erp`
3. **Check Features**:
   - Reports load without authentication prompts
   - Refresh buttons work
   - Category filtering functions
   - Export/print features work
   - Responsive design on mobile

### Common Issues & Solutions

**Issue**: "Authentication failed" or sign-in prompts
**Solution**: Ensure proper embed tokens are being generated by your backend

**Issue**: Reports not loading
**Solution**: Check report IDs and embed URLs are correct

**Issue**: CORS errors
**Solution**: Configure proper CORS policies on your backend

**Issue**: Token expiration
**Solution**: Implement automatic token refresh mechanism

## 📱 Production Deployment

### Frontend Build
```bash
npm run build
# Deploy dist/ folder to your hosting platform
```

### Backend Deployment
```bash
# Deploy your backend service with environment variables:
POWERBI_CLIENT_ID=your-client-id
POWERBI_CLIENT_SECRET=your-client-secret
POWERBI_TENANT_ID=your-tenant-id
```

### Environment Variables
```bash
# Production environment
NODE_ENV=production
REACT_APP_API_BASE_URL=https://your-api-domain.com
REACT_APP_POWERBI_CLIENT_ID=your-client-id
REACT_APP_POWERBI_TENANT_ID=your-tenant-id
```

## 🚀 Advanced Features Available

- **Dynamic Filtering**: Apply filters to reports programmatically
- **Data Selection**: Handle user interactions with report data
- **Theme Integration**: Match Power BI theme with portal design
- **Export Options**: PDF, Excel, PowerPoint export capabilities
- **Responsive Embedding**: Automatic sizing and mobile optimization
- **Event Tracking**: Monitor user interactions with reports
- **Error Recovery**: Automatic retry and error handling

## 📞 Support & Documentation

- **Microsoft Power BI Embedded**: https://docs.microsoft.com/en-us/power-bi/developer/embedded/
- **Power BI REST API**: https://docs.microsoft.com/en-us/rest/api/power-bi/
- **Azure AD App Registration**: https://docs.microsoft.com/en-us/azure/active-directory/develop/

---

**🎉 Your Power BI integration is now ready for production use!**

The system uses official Microsoft libraries and follows enterprise security best practices. All reports will load seamlessly without authentication prompts once properly configured.