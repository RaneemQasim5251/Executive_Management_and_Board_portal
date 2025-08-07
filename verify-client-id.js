// Quick verification script to test if the Client ID exists in your tenant

const CORRECT_CLIENT_ID = 'ab13106b-99f4-416d-aa53-a0ca9d3175ca';
const WRONG_CLIENT_ID = 'c4360f88-13f6-48b7-8428-874517362e64';
const CLIENT_SECRET = 'your-client-secret-here';
const TENANT_ID = 'ba2cab20-721a-44f0-bec4-f2e784ba3c23';

async function testClientId(clientId, description) {
  console.log(`\n🔍 Testing ${description}...`);
  console.log(`   Client ID: ${clientId}`);
  
  const tokenUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;
  
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', clientId);
  params.append('client_secret', CLIENT_SECRET);
  params.append('scope', 'https://graph.microsoft.com/.default');

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params
    });

    if (response.ok) {
      console.log(`✅ ${description} - CLIENT ID EXISTS and is valid!`);
      return true;
    } else {
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error === 'unauthorized_client' && errorData.error_description.includes('was not found')) {
          console.log(`❌ ${description} - Client ID NOT FOUND in tenant`);
        } else if (errorData.error === 'invalid_client') {
          console.log(`❌ ${description} - Invalid client credentials`);
        } else {
          console.log(`⚠️  ${description} - Other error: ${errorData.error}`);
        }
      } catch (e) {
        console.log(`❌ ${description} - HTTP ${response.status}: ${response.statusText}`);
      }
      return false;
    }
  } catch (error) {
    console.log(`❌ ${description} - Network error: ${error.message}`);
    return false;
  }
}

async function runVerification() {
  console.log('🚀 Client ID Verification Test');
  console.log('===============================');
  console.log(`Tenant: Al Jeri Transportation Co (${TENANT_ID})`);
  
  // Test the wrong Client ID first to confirm it doesn't exist
  const wrongResult = await testClientId(WRONG_CLIENT_ID, 'Wrong Client ID (should fail)');
  
  // Test the correct Client ID
  const correctResult = await testClientId(CORRECT_CLIENT_ID, 'Correct Client ID (should work)');
  
  console.log('\n📋 Summary:');
  console.log('===========');
  
  if (!wrongResult && correctResult) {
    console.log('✅ PERFECT! Using the correct Client ID now.');
    console.log('🎯 Next step: Run "node get-powerbi-token.js" to get your Power BI token');
  } else if (wrongResult) {
    console.log('⚠️  Unexpected: The wrong Client ID actually works?');
  } else if (!correctResult) {
    console.log('❌ Issue: The correct Client ID also has problems');
    console.log('   Check if the client secret is correct for this app');
  } else {
    console.log('❌ Both Client IDs have issues - check your tenant and credentials');
  }
}

runVerification();