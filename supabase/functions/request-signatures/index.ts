import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.5'

interface Signatory {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  nationalIdLast3: string;
  sign_token?: string;
  otp?: string;
  otp_expires_at?: string;
}

interface Resolution {
  id: string;
  signatories: Signatory[];
}

// Real SMS sending function for ConnectSaudi (Saudi Arabia)
async function sendSMS(phoneNumber: string, message: string): Promise<void> {
  console.log(`Sending SMS to ${phoneNumber}: ${message}`);
  
  const SMS_USER = Deno.env.get('SMS_USER');
  const SMS_PASS = Deno.env.get('SMS_PASS');
  const SMS_API_URL = Deno.env.get('SMS_API_URL') || 'https://sms.connectsaudi.com/sendurl.aspx';
  
  if (!SMS_USER || !SMS_PASS) {
    console.warn('SMS credentials not set. Using demo mode.');
    console.log(`📱 [DEMO SMS] To: ${phoneNumber} | Message: ${message}`);
    return;
  }

  try {
    // Format phone number for Saudi Arabia (remove + and spaces)
    const formattedNumber = phoneNumber.replace(/[\s\+\-\(\)]/g, '');
    
    // ConnectSaudi SMS gateway format - GET request with URL parameters
    const smsParams = new URLSearchParams({
      user: SMS_USER,
      pwd: SMS_PASS,
      senderid: 'BOARDMARK',
      CountryCode: '966', // Saudi Arabia country code
      mobileno: formattedNumber.startsWith('966') ? formattedNumber.substring(3) : formattedNumber,
      msgtext: message.trim(),
    });
    
    const fullUrl = `${SMS_API_URL}?${smsParams.toString()}`;
    console.log('ConnectSaudi SMS URL:', fullUrl.replace(SMS_PASS, '***')); // Hide password in logs
    
    const response = await fetch(fullUrl, {
      method: 'GET',
    });

    const responseText = await response.text();
    
    console.log(`SMS API Response: ${responseText}`);
    
    if (response.ok && (responseText.includes('success') || responseText.includes('sent') || responseText.trim().length < 50)) {
      console.log(`✅ SMS sent successfully to ${phoneNumber}`);
    } else {
      console.error(`❌ SMS failed: ${responseText}`);
      // Fallback to demo mode
      console.log(`📱 [FALLBACK DEMO] To: ${phoneNumber} | Message: ${message}`);
    }
  } catch (error) {
    console.error('SMS sending error:', error);
    // Fallback to demo mode
    console.log(`📱 [ERROR FALLBACK DEMO] To: ${phoneNumber} | Message: ${message}`);
  }
}

serve(async (req) => {
  // Handle preflight OPTIONS requests for CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-my-example-header, x-my-custom-header',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    } });
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { 'x-my-example-header': 'board-mark-request-signatures' } } }
  );

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  const { resolutionId } = await req.json();

  if (!resolutionId) {
    return new Response(JSON.stringify({ error: 'resolutionId is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  try {
    // First get the resolution
    const { data: resolutionData, error: resolutionError } = await supabaseClient
      .from('board_resolutions')
      .select('*')
      .eq('id', resolutionId)
      .single();

    if (resolutionError || !resolutionData) {
      console.error('Error fetching resolution:', resolutionError?.message);
      return new Response(JSON.stringify({ error: 'Resolution not found or error fetching' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    // Then get the signatories separately including phone numbers
    const { data: signatoriesData, error: signatoriesError } = await supabaseClient
      .from('board_signatories')
      .select('*, phone_number')
      .eq('resolution_id', resolutionId);

    if (signatoriesError) {
      console.error('Error fetching signatories:', signatoriesError?.message);
      return new Response(JSON.stringify({ error: 'Error fetching signatories' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const signatories = signatoriesData || [];
    const updatedSignatories: Signatory[] = [];

    for (const signatory of signatories) {
      const sign_token = crypto.randomUUID();
      const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
      const otp_expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes from now

      const { error: updateError } = await supabaseClient
        .from('board_signatories')
        .update({
          sign_token,
          otp,
          otp_expires_at,
          signed_at: null, // Reset if previously signed
          signature_hash: null,
          decision: null,
          decision_reason: null,
        })
        .eq('id', signatory.id);

      if (updateError) {
        console.error(`Error updating signatory ${signatory.id}:`, updateError.message);
        continue;
      } else {
        console.log(`Successfully updated signatory ${signatory.id} with token ${sign_token} and OTP ${otp}`);
      }

      // Construct deep link for signing (use localhost for demo)
      const deepLink = `http://localhost:5173/board-mark/${resolutionId}/sign?sid=${signatory.id}&token=${sign_token}`;
      
      // Create simple SMS message without special characters
      const message = `Board Resolution OTP: ${otp} for ${signatory.name}`;
      
      console.log(`SMS message length: ${message.length} characters`);
      console.log(`SMS message content: ${message}`);

      // Debug: Log signatory data to see what we're getting
      console.log(`Signatory ${signatory.id} data:`, JSON.stringify(signatory, null, 2));
      
      // Use real phone numbers from database, with proper fallback logic
      let phoneNumber;
      if ((signatory as any).phone_number && (signatory as any).phone_number.trim() !== '') {
        phoneNumber = (signatory as any).phone_number;
        console.log(`✅ Using database phone number: ${phoneNumber}`);
      } else if (signatory.email && !signatory.email.includes('@')) {
        phoneNumber = signatory.email; // Email field contains phone number
        console.log(`📧 Using email field as phone number: ${phoneNumber}`);
      } else {
        phoneNumber = '+966501234567'; // Final fallback
        console.log(`⚠️ Using fallback phone number: ${phoneNumber}`);
      }
      
      console.log(`Final phone number for ${signatory.name}: ${phoneNumber}`);
      
      await sendSMS(phoneNumber, message);
      updatedSignatories.push({ ...signatory, sign_token, otp, otp_expires_at });
    }

    return new Response(JSON.stringify({ message: 'Signature requests initiated', updatedSignatories }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });

  } catch (error) {
    console.error('Error in request-signatures:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
})
