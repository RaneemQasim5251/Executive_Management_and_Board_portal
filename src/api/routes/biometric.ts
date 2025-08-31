import { Router, Request, Response } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';
import { config } from '../config';
import { logger, logAuth } from '../utils/logger';
import { errors } from '../utils/errors';
import { asyncHandler } from '../middleware/errorHandler';
import { authMiddleware, userRateLimit } from '../middleware/auth';
import { webAuthnService, RegistrationCredential, AuthenticationCredential } from '../services/webAuthnService';

const router = Router();
const supabase = createClient(config.supabase.url, config.supabase.serviceRoleKey);

// Validation schemas
const registrationOptionsSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  userName: z.string().min(1, 'User name is required'),
  userDisplayName: z.string().min(1, 'User display name is required'),
});

const registrationVerificationSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  credential: z.object({
    id: z.string(),
    rawId: z.string(),
    response: z.object({
      clientDataJSON: z.string(),
      attestationObject: z.string(),
      transports: z.array(z.string()).optional(),
    }),
    type: z.literal('public-key'),
    clientExtensionResults: z.any().optional(),
    authenticatorAttachment: z.enum(['platform', 'cross-platform']).optional(),
  }),
});

const authenticationOptionsSchema = z.object({
  userId: z.string().uuid().optional(), // Optional for usernameless flow
});

const authenticationVerificationSchema = z.object({
  credential: z.object({
    id: z.string(),
    rawId: z.string(),
    response: z.object({
      clientDataJSON: z.string(),
      authenticatorData: z.string(),
      signature: z.string(),
      userHandle: z.string().optional(),
    }),
    type: z.literal('public-key'),
    clientExtensionResults: z.any().optional(),
    authenticatorAttachment: z.enum(['platform', 'cross-platform']).optional(),
  }),
});

// Rate limiting for biometric endpoints
const biometricRateLimit = userRateLimit(10, 15 * 60 * 1000); // 10 attempts per 15 minutes

/**
 * Generate registration options for biometric setup
 * POST /biometric/register/begin
 */
router.post('/register/begin', authMiddleware, biometricRateLimit, asyncHandler(async (req: Request, res: Response) => {
  const validatedData = registrationOptionsSchema.parse({
    userId: req.user!.id,
    userName: req.user!.email,
    userDisplayName: req.body.userDisplayName || req.user!.email,
  });

  const options = await webAuthnService.generateRegistrationOptions(
    validatedData.userId,
    validatedData.userName,
    validatedData.userDisplayName
  );

  res.status(200).json({
    success: true,
    data: { options },
    message: 'Registration options generated successfully',
    timestamp: new Date().toISOString(),
  });
}));

/**
 * Complete biometric registration
 * POST /biometric/register/complete
 */
router.post('/register/complete', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const validatedData = registrationVerificationSchema.parse({
    userId: req.user!.id,
    credential: req.body.credential,
  });

  const result = await webAuthnService.verifyRegistration(
    validatedData.userId,
    validatedData.credential as RegistrationCredential
  );

  if (!result.verified) {
    throw errors.validationFailed([{ field: 'credential', message: 'Credential verification failed' }]);
  }

  // Log successful biometric registration
  logAuth({
    event: 'biometric_register',
    userId: validatedData.userId,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    success: true,
  });

  res.status(201).json({
    success: true,
    data: {
      credentialId: result.credentialId,
      registered: true,
    },
    message: 'Biometric authentication registered successfully',
    timestamp: new Date().toISOString(),
  });
}));

/**
 * Generate authentication options for biometric login
 * POST /biometric/authenticate/begin
 */
router.post('/authenticate/begin', biometricRateLimit, asyncHandler(async (req: Request, res: Response) => {
  const validatedData = authenticationOptionsSchema.parse(req.body);

  const options = await webAuthnService.generateAuthenticationOptions(validatedData.userId);

  res.status(200).json({
    success: true,
    data: { options },
    message: 'Authentication options generated successfully',
    timestamp: new Date().toISOString(),
  });
}));

/**
 * Complete biometric authentication
 * POST /biometric/authenticate/complete
 */
router.post('/authenticate/complete', asyncHandler(async (req: Request, res: Response) => {
  const validatedData = authenticationVerificationSchema.parse(req.body);

  const result = await webAuthnService.verifyAuthentication(
    validatedData.credential as AuthenticationCredential
  );

  if (!result.verified || !result.userId) {
    // Log failed biometric authentication
    logAuth({
      event: 'biometric_login_failed',
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      success: false,
      reason: 'Credential verification failed',
    });

    throw errors.invalidCredentials();
  }

  // Get user profile
  const { data: profile, error } = await supabase
    .from('users')
    .select(`
      id,
      email,
      name,
      role,
      department,
      avatar_url,
      theme_preferences,
      permissions,
      access_level,
      locked_until
    `)
    .eq('id', result.userId)
    .single();

  if (error || !profile) {
    throw errors.resourceNotFound('User');
  }

  // Check if user is locked
  if (profile.locked_until && new Date(profile.locked_until) > new Date()) {
    throw errors.accountLocked(new Date(profile.locked_until));
  }

  // Generate JWT tokens
  const accessToken = jwt.sign(
    {
      sub: profile.id,
      email: profile.email,
      role: profile.role,
      permissions: profile.permissions || [],
      auth_method: 'biometric',
    },
    config.auth.jwtSecret,
    { expiresIn: config.auth.jwtExpiresIn }
  );

  const refreshToken = jwt.sign(
    { sub: profile.id, type: 'refresh' },
    config.auth.jwtSecret,
    { expiresIn: config.auth.jwtRefreshExpiresIn }
  );

  // Create session record
  const sessionToken = jwt.sign(
    { userId: profile.id, sessionId: Date.now().toString(), authMethod: 'biometric' },
    config.auth.sessionSecret
  );

  await supabase
    .from('user_sessions')
    .insert({
      user_id: profile.id,
      session_token: sessionToken,
      refresh_token: refreshToken,
      ip_address: req.ip,
      user_agent: req.get('User-Agent'),
      device_info: {
        authMethod: 'biometric',
        credentialId: validatedData.credential.id,
      },
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    });

  // Update user login stats
  await supabase
    .from('users')
    .update({
      last_login_at: new Date().toISOString(),
      login_count: (profile.login_count || 0) + 1,
      failed_login_attempts: 0,
      locked_until: null,
    })
    .eq('id', profile.id);

  // Log successful biometric login
  logAuth({
    event: 'biometric_login',
    userId: profile.id,
    email: profile.email,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    success: true,
  });

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        department: profile.department,
        theme_preferences: profile.theme_preferences,
        permissions: profile.permissions || [],
      },
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken,
        session_token: sessionToken,
        expires_in: 86400, // 24 hours
        token_type: 'Bearer',
        auth_method: 'biometric',
        expires_in: 86400, 
        session_token: sessionToken 
      },
    },
    message: 'Biometric authentication successful',
    timestamp: new Date().toISOString(),
  });
}));

/**
 * Get user's biometric credentials
 * GET /biometric/credentials
 */
router.get('/credentials', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const credentials = await webAuthnService.getUserCredentials(req.user!.id);

  res.status(200).json({
    success: true,
    data: { credentials },
    message: 'Biometric credentials retrieved successfully',
    timestamp: new Date().toISOString(),
  });
}));

/**
 * Delete a biometric credential
 * DELETE /biometric/credentials/:credentialId
 */
router.delete('/credentials/:credentialId', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const credentialId = req.params.credentialId;

  if (!credentialId) {
    throw errors.validationFailed([{ field: 'credentialId', message: 'Credential ID is required' }]);
  }

  await webAuthnService.deleteCredential(req.user!.id, credentialId);

  // Log credential deletion
  logAuth({
    event: 'biometric_delete',
    userId: req.user!.id,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    success: true,
  });

  res.status(200).json({
    success: true,
    message: 'Biometric credential deleted successfully',
    timestamp: new Date().toISOString(),
  });
}));

/**
 * Check WebAuthn support and browser capabilities
 * GET /biometric/support
 */
router.get('/support', asyncHandler(async (req: Request, res: Response) => {
  // This endpoint provides information about WebAuthn support
  // The actual support check happens client-side
  
  res.status(200).json({
    success: true,
    data: {
      webAuthnSupported: true, // Client will verify actual support
      supportedAuthenticators: ['platform', 'cross-platform'],
      supportedTransports: ['internal', 'usb', 'nfc', 'ble', 'hybrid'],
      userVerificationMethods: ['biometric', 'pin', 'pattern'],
      securityFeatures: {
        attestation: true,
        residentKeys: true,
        userVerification: true,
        enterpriseAttestation: false,
      },
      recommendations: {
        preferredAuthenticator: 'platform',
        preferredUserVerification: 'required',
        recommendedTimeout: 60000,
      },
    },
    message: 'WebAuthn support information',
    timestamp: new Date().toISOString(),
  });
}));

/**
 * Get biometric authentication statistics (admin only)
 * GET /biometric/stats
 */
router.get('/stats', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  // Check if user has permission to view stats
  if (!['board_chairman', 'ceo', 'admin'].includes(req.user!.role)) {
    throw errors.insufficientPermissions('admin');
  }

  const { data: stats } = await supabase
    .rpc('get_biometric_stats');

  // If the RPC doesn't exist, calculate manually
  const { data: credentialStats } = await supabase
    .from('biometric_credentials')
    .select(`
      device_type,
      authenticator_attachment,
      is_active,
      created_at,
      last_used_at,
      use_count
    `);

  const totalCredentials = credentialStats?.length || 0;
  const activeCredentials = credentialStats?.filter(c => c.is_active).length || 0;
  const platformCredentials = credentialStats?.filter(c => c.authenticator_attachment === 'platform').length || 0;
  const totalUsage = credentialStats?.reduce((sum, c) => sum + (c.use_count || 0), 0) || 0;

  const statistics = {
    totalCredentials,
    activeCredentials,
    inactiveCredentials: totalCredentials - activeCredentials,
    platformCredentials,
    crossPlatformCredentials: totalCredentials - platformCredentials,
    totalUsage,
    averageUsage: totalCredentials > 0 ? Math.round(totalUsage / totalCredentials) : 0,
    registrationTrend: {
      thisMonth: credentialStats?.filter(c => 
        new Date(c.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length || 0,
      lastMonth: credentialStats?.filter(c => {
        const date = new Date(c.created_at);
        const now = new Date();
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return date >= lastMonth && date < thisMonth;
      }).length || 0,
    },
  };

  res.status(200).json({
    success: true,
    data: { statistics },
    message: 'Biometric authentication statistics',
    timestamp: new Date().toISOString(),
  });
}));

export default router;
