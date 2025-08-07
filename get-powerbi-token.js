// Power BI Access Token Generator
// Run this script to generate an access token for Power BI embedding

const CLIENT_ID = 'ab13106b-99f4-416d-aa53-a0ca9d3175ca';
const CLIENT_SECRET = 'your-client-secret-here';
const TENANT_ID = 'ba2cab20-721a-44f0-bec4-f2e784ba3c23';

async function getPowerBIToken() {
  const tokenUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;
  
  console.log('🔍 Attempting to get Power BI token...');
  console.log('📋 Configuration:');
  console.log('  Client ID:', CLIENT_ID);
  console.log('  Tenant ID:', TENANT_ID);
  console.log('  Token URL:', tokenUrl);
  console.log('');

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

    console.log('📡 Response status:', response.status, response.statusText);

    const responseText = await response.text();
    
    if (!response.ok) {
      console.log('❌ Error response body:', responseText);
      
      try {
        const errorData = JSON.parse(responseText);
        console.log('');
        console.log('🔍 Detailed Error Information:');
        console.log('  Error:', errorData.error);
        console.log('  Description:', errorData.error_description);
        console.log('  Error URI:', errorData.error_uri || 'Not provided');
        
        // Specific troubleshooting based on error
        if (errorData.error === 'invalid_client') {
          console.log('');
          console.log('🛠️  INVALID_CLIENT Error - Common Solutions:');
          console.log('  1. The Client ID or Client Secret is incorrect');
          console.log('  2. The Client Secret has expired');
          console.log('  3. The app registration doesn\'t exist in this tenant');
          console.log('  4. The app registration is disabled');
        } else if (errorData.error === 'unauthorized_client') {
          console.log('');
          console.log('🛠️  UNAUTHORIZED_CLIENT Error - Common Solutions:');
          console.log('  1. The app doesn\'t have permission to use client credentials flow');
          console.log('  2. Admin consent is required for the requested scopes');
          console.log('  3. The app registration needs "Application permissions" not "Delegated permissions"');
        } else if (errorData.error === 'invalid_scope') {
          console.log('');
          console.log('🛠️  INVALID_SCOPE Error - Common Solutions:');
          console.log('  1. The Power BI Service API permissions are not configured');
          console.log('  2. Admin consent has not been granted');
          console.log('  3. Try using scope: "https://analysis.windows.net/powerbi/api/.default"');
        }
        
      } catch (parseError) {
        console.log('Could not parse error response as JSON');
      }
      
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = JSON.parse(responseText);
    
    console.log('✅ Power BI Access Token Generated Successfully!');
    console.log('📋 Copy this token to your .env file as VITE_POWERBI_ACCESS_TOKEN:');
    console.log('');
    console.log('🔑 Access Token:');
    console.log(data.access_token);
    console.log('');
    console.log('⏰ Token expires in:', data.expires_in, 'seconds');
    console.log('🕒 Expires at:', new Date(Date.now() + data.expires_in * 1000).toLocaleString());
    
    return data.access_token;
  } catch (error) {
    console.error('❌ Error getting Power BI token:', error.message);
    console.log('');
    console.log('🔍 General Troubleshooting Steps:');
    console.log('1. Check Azure AD App Registration:');
    console.log('   - Go to https://portal.azure.com');
    console.log('   - Navigate to Azure Active Directory > App registrations');
    console.log('   - Find your app with Client ID:', CLIENT_ID);
    console.log('');
    console.log('2. Verify API Permissions:');
    console.log('   - In your app registration, go to "API permissions"');
    console.log('   - Add permission > Power BI Service');
    console.log('   - Select "Application permissions" (not Delegated)');
    console.log('   - Add required permissions like "Dataset.Read.All", "Report.Read.All"');
    console.log('   - Click "Grant admin consent"');
    console.log('');
    console.log('3. Check Client Secret:');
    console.log('   - In your app registration, go to "Certificates & secrets"');
    console.log('   - Verify the client secret is not expired');
    console.log('   - Create a new secret if needed');
    console.log('');
    console.log('4. Verify Authentication:');
    console.log('   - In "Authentication" section, ensure "Allow public client flows" is set appropriately');
    console.log('   - For service principal: should be "No"');
  }
}

// Run the function
getPowerBIToken();

// Note: You can also run this in Node.js:
// node get-powerbi-token.js