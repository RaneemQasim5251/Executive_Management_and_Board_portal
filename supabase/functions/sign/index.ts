import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.5';

interface SignRequest {
  resolutionId: string;
  signatoryId: string;
  token: string;
  otp: string;
  decision: 'approved' | 'rejected';
  reason?: string;
}

serve(async (req) => {
  // Handle preflight OPTIONS requests for CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-my-example-header', // ADD THIS HEADER
    } });
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { 'x-my-example-header': 'board-mark-sign' } } }
  );

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  const { resolutionId, signatoryId, token, otp, decision, reason }: SignRequest = await req.json();

  if (!resolutionId || !signatoryId || !token || !otp || !decision) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  try {
    // 1. Verify signatory, token, and OTP
    const { data: signatoryData, error: signatoryError } = await supabaseClient
      .from('board_signatories')
      .select('*')
      .eq('resolution_id', resolutionId)
      .eq('id', signatoryId)
      .single();

    if (signatoryError || !signatoryData) {
      console.error('Signatory not found or error:', signatoryError?.message);
      return new Response(JSON.stringify({ error: 'Signatory not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    if (signatoryData.sign_token !== token) {
      console.warn('Invalid sign token for signatory:', signatoryId);
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    if (signatoryData.otp !== otp || new Date(signatoryData.otp_expires_at) < new Date()) {
      console.warn('Invalid or expired OTP for signatory:', signatoryId);
      return new Response(JSON.stringify({ error: 'Invalid or expired OTP' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    // 2. Update signatory status
    const signedAt = new Date().toISOString();
    const signatureHash = crypto.randomUUID();
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('client-ip');
    const userAgent = req.headers.get('user-agent');

    const updatePayload: any = {
      signed_at: signedAt,
      decision: decision,
      decision_reason: reason || null,
      signed_ip: clientIp,
      signed_user_agent: userAgent,
      otp: null, // Clear OTP after use
      otp_expires_at: null, // Clear OTP expiry
      sign_token: null, // Clear token after use
    };

    if (decision === 'approved') {
      updatePayload.signature_hash = signatureHash;
    } else {
      updatePayload.signature_hash = null;
    }

    const { error: updateError } = await supabaseClient
      .from('board_signatories')
      .update(updatePayload)
      .eq('id', signatoryId);

    if (updateError) {
      console.error(`Error updating signatory ${signatoryId}:`, updateError.message);
      return new Response(JSON.stringify({ error: 'Failed to update signatory status' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    // 3. Check all signatories for resolution status update
    const { data: allSignatories, error: allSignatoriesError } = await supabaseClient
      .from('board_signatories')
      .select('*')
      .eq('resolution_id', resolutionId);

    if (allSignatoriesError) {
      console.error('Error fetching all signatories:', allSignatoriesError.message);
      // Continue without finalizing if there's an error, as the current signatory is still updated.
    }

    const allSigned = allSignatories?.every(s => s.signed_at !== null && s.decision === 'approved');
    const anyRejected = allSignatories?.some(s => s.decision === 'rejected');

    if (anyRejected) {
      // If any signatory rejects, mark resolution as expired
      await supabaseClient
        .from('board_resolutions')
        .update({ status: 'expired', updated_at: new Date().toISOString() })
        .eq('id', resolutionId);
    } else if (allSigned) {
      // If all approved, mark resolution as finalized
      await supabaseClient
        .from('board_resolutions')
        .update({ status: 'finalized', updated_at: new Date().toISOString() })
        .eq('id', resolutionId);
    }

    // 4. Return updated resolution (or just success status)
    const { data: updatedResolution, error: resFetchError } = await supabaseClient
      .from('board_resolutions')
      .select('*, board_signatories(*)')
      .eq('id', resolutionId)
      .single();

    if (resFetchError || !updatedResolution) {
      console.error('Error fetching updated resolution:', resFetchError?.message);
      return new Response(JSON.stringify({ message: 'Signatory updated, but failed to fetch resolution' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    return new Response(JSON.stringify(updatedResolution), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });

  } catch (error) {
    console.error('Error in sign function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
});
