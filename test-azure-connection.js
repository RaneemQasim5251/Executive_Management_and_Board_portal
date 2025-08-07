// Azure AD Connection Test
// This script tests basic connectivity to Azure AD without requiring Power BI permissions

const CLIENT_ID = 'ab13106b-99f4-416d-aa53-a0ca9d3175ca';
const CLIENT_SECRET = 'your-client-secret-here';
const TENANT_ID = 'ba2cab20-721a-44f0-bec4-f2e784ba3c23';

async function testBasicAuth() {
  console.log('🔍 Testing basic Azure AD authentication...');
  console.log('📋 Using minimal Microsoft Graph scope for testing');
  console.log('');

  const tokenUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;
  
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', CLIENT_ID);
  params.append('client_secret', CLIENT_SECRET);
  // Use Microsoft Graph API scope instead of Power BI for basic testing
  params.append('scope', 'https://graph.microsoft.com/.default');

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params
    });

    console.log('📡 Response status:', response.status, response.statusText);
    const responseText = await response.text();

    if (!response.ok) {
      console.log('❌ Error response:', responseText);
      
      try {
        const errorData = JSON.parse(responseText);
        console.log('');
        console.log('🔍 Error Details:');
        console.log('  Error Code:', errorData.error);
        console.log('  Description:', errorData.error_description);
        
        if (errorData.error === 'invalid_client') {
          console.log('');
          console.log('❌ INVALID_CLIENT: Your app registration has issues');
          console.log('   This means either:');
          console.log('   - Client ID is wrong');
          console.log('   - Client Secret is wrong or expired');
          console.log('   - App doesn\'t exist in this tenant');
        }
        
      } catch (parseError) {
        console.log('Could not parse error response');
      }
      
      return false;
    }

    const data = JSON.parse(responseText);
    console.log('✅ Basic Azure AD authentication successful!');
    console.log('🔑 Token type:', data.token_type);
    console.log('⏰ Expires in:', data.expires_in, 'seconds');
    console.log('');
    console.log('✅ Your Client ID and Secret are valid');
    console.log('✅ Your Tenant ID is correct');
    console.log('');
    console.log('🎯 Next step: Configure Power BI API permissions');
    
    return true;
    
  } catch (error) {
    console.error('❌ Network error:', error.message);
    return false;
  }
}

async function testPowerBIAuth() {
  console.log('🔍 Testing Power BI specific authentication...');
  
  const tokenUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;
  
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', CLIENT_ID);
  params.append('client_secret', CLIENT_SECRET);
  params.append('scope', 'https://analysis.windows.net/powerbi/api/.default');

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params
    });

    const responseText = await response.text();

    if (!response.ok) {
      try {
        const errorData = JSON.parse(responseText);
        if (errorData.error === 'invalid_scope' || errorData.error === 'unauthorized_client') {
          console.log('❌ Power BI permissions not configured properly');
          console.log('');
          console.log('🛠️  Required Azure AD App Setup:');
          console.log('1. Go to: https://portal.azure.com');
          console.log('2. Navigate: Azure Active Directory > App registrations');
          console.log('3. Find your app:', CLIENT_ID);
          console.log('4. Go to: API permissions');
          console.log('5. Add permission > Power BI Service');
          console.log('6. Select APPLICATION PERMISSIONS (not delegated):');
          console.log('   ✓ Dataset.Read.All');
          console.log('   ✓ Report.Read.All');
          console.log('   ✓ Workspace.Read.All');
          console.log('7. Click "Grant admin consent for [Your Organization]"');
          console.log('8. Wait 5-10 minutes for permissions to propagate');
          
          return false;
        }
      } catch (e) {
        // Continue with generic error handling
      }
      
      console.log('❌ Power BI authentication failed');
      console.log('Response:', responseText);
      return false;
    }

    const data = JSON.parse(responseText);
    console.log('✅ Power BI authentication successful!');
    console.log('🎉 You can now use this token in your application');
    
    return data.access_token;
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Azure AD & Power BI Connection Test');
  console.log('=====================================');
  console.log('');
  
  // Test 1: Basic Azure AD auth
  const basicAuthSuccess = await testBasicAuth();
  
  console.log('');
  console.log('=====================================');
  console.log('');
  
  if (basicAuthSuccess) {
    // Test 2: Power BI specific auth
    const powerBIToken = await testPowerBIAuth();
    
    if (powerBIToken) {
      console.log('');
      console.log('🎯 SUCCESS: Copy this token to your .env file:');
      console.log('VITE_POWERBI_ACCESS_TOKEN=' + powerBIToken);
    }
  } else {
    console.log('❌ Basic authentication failed. Fix the app registration first.');
  }
}

// Run the tests
runTests();