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

// Placeholder for your SMS sending logic
async function sendSMS(to: string, message: string): Promise<void> {
  console.log(`Sending SMS to ${to}: ${message}`);
  const SMS_USER = Deno.env.get('SMS_USER');
  const SMS_PASS = Deno.env.get('SMS_PASS');
  const SMS_API_URL = Deno.env.get('SMS_API_URL');

  if (!SMS_USER || !SMS_PASS || !SMS_API_URL) {
    console.warn('SMS credentials or API URL not set in environment variables. Skipping SMS.');
    return;
  }

  // Example: Replace with your actual SMS gateway API call
  // This is a dummy implementation
  const response = await fetch(SMS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${btoa(`${SMS_USER}:${SMS_PASS}`)}`
    },
    body: JSON.stringify({
      to,
      message,
      // Add other parameters required by your SMS API
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Failed to send SMS: ${response.status} - ${errorBody}`);
  } else {
    console.log(`SMS sent successfully to ${to}`);
  }
}

serve(async (req) => {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { 'x-my-example-header': 'board-mark-request-signatures' } } }
  )

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { resolutionId } = await req.json();

  if (!resolutionId) {
    return new Response(JSON.stringify({ error: 'resolutionId is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { data: resolutionData, error: resolutionError } = await supabaseClient
      .from('board_resolutions')
      .select('*, board_signatories(*)') // Select resolution and its signatories
      .eq('id', resolutionId)
      .single();

    if (resolutionError || !resolutionData) {
      console.error('Error fetching resolution:', resolutionError?.message);
      return new Response(JSON.stringify({ error: 'Resolution not found or error fetching' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const resolution: Resolution = resolutionData as unknown as Resolution;
    const updatedSignatories: Signatory[] = [];

    for (const signatory of resolution.signatories) {
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
      }

      // Construct deep link for signing
      const deepLink = `https://yourapp.com/board-mark/${resolutionId}/sign?sid=${signatory.id}&token=${sign_token}`;
      const message = `Dear ${signatory.name}, please sign the board resolution. Your OTP is ${otp}. Link: ${deepLink}`;

      // In a real application, you'd send SMS to signatory.email or a phone number
      // For demo, we'll log it
      await sendSMS(signatory.nationalIdLast3 || 'N/A', message); // Assuming nationalIdLast3 is used as a dummy 'to' for SMS
      updatedSignatories.push({ ...signatory, sign_token, otp, otp_expires_at });
    }

    return new Response(JSON.stringify({ message: 'Signature requests initiated', updatedSignatories }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in request-signatures:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
})
