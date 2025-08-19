import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { config } from '../config';
import { logger, logAuth } from '../utils/logger';
import { errors, ValidationError } from '../utils/errors';
import { asyncHandler } from '../middleware/errorHandler';
import { userRateLimit } from '../middleware/auth';

const router = Router();
const supabase = createClient(config.supabase.url, config.supabase.serviceRoleKey);

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
});

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(config.password.minLength, `Password must be at least ${config.password.minLength} characters`)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['board_chairman', 'ceo', 'cfo', 'cto', 'executive', 'board_member']).optional(),
  department: z.string().optional(),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string()
    .min(config.password.minLength, `Password must be at least ${config.password.minLength} characters`),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(config.password.minLength, `Password must be at least ${config.password.minLength} characters`),
});

// Rate limiting for auth endpoints
const authRateLimit = userRateLimit(5, 15 * 60 * 1000); // 5 attempts per 15 minutes

/**
 * User registration
 * POST /auth/register
 */
router.post('/register', authRateLimit, asyncHandler(async (req: Request, res: Response) => {
  const validatedData = registerSchema.parse(req.body);
  const { email, password, name, role = 'executive', department } = validatedData;

  // Check if user already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (existingUser) {
    throw errors.resourceAlreadyExists('User', 'email');
  }

  // Register with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Auto-confirm for executive portal
    user_metadata: {
      name,
      role,
      department,
    },
  });

  if (authError) {
    logger.error('Supabase auth registration error:', authError);
    throw new Error('Registration failed');
  }

  if (!authData.user) {
    throw new Error('User creation failed');
  }

  // Create user profile
  const { error: profileError } = await supabase
    .from('users')
    .insert({
      id: authData.user.id,
      email,
      name,
      role,
      department,
      theme_preferences: {
        mode: 'light',
        fontSize: 'medium',
        motionPreference: 'full',
        highContrast: false,
        reducedTransparency: false,
        focusRingVisible: true,
        colorBlindnessSupport: false,
      },
    });

  if (profileError) {
    logger.error('User profile creation error:', profileError);
    // Cleanup auth user if profile creation fails
    await supabase.auth.admin.deleteUser(authData.user.id);
    throw new Error('Profile creation failed');
  }

  // Log successful registration
  logAuth({
    event: 'register',
    userId: authData.user.id,
    email,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    success: true,
  });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: authData.user.id,
        email,
        name,
        role,
        department,
      },
    },
    timestamp: new Date().toISOString(),
  });
}));

/**
 * User login
 * POST /auth/login
 */
router.post('/login', authRateLimit, asyncHandler(async (req: Request, res: Response) => {
  const validatedData = loginSchema.parse(req.body);
  const { email, password, rememberMe } = validatedData;

  // Check failed login attempts
  const { data: userData } = await supabase
    .from('users')
    .select('id, email, name, role, failed_login_attempts, locked_until')
    .eq('email', email)
    .single();

  if (userData?.locked_until && new Date(userData.locked_until) > new Date()) {
    logAuth({
      event: 'login_failed',
      email,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      success: false,
      reason: 'Account locked',
    });
    throw errors.accountLocked(new Date(userData.locked_until));
  }

  // Authenticate with Supabase
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData.user) {
    // Increment failed login attempts
    if (userData) {
      const failedAttempts = (userData.failed_login_attempts || 0) + 1;
      const shouldLock = failedAttempts >= config.auth.maxLoginAttempts;
      
      await supabase
        .from('users')
        .update({
          failed_login_attempts: failedAttempts,
          locked_until: shouldLock 
            ? new Date(Date.now() + config.auth.lockoutTime).toISOString()
            : null,
        })
        .eq('id', userData.id);
    }

    logAuth({
      event: 'login_failed',
      userId: userData?.id,
      email,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      success: false,
      reason: authError?.message || 'Invalid credentials',
    });

    throw errors.invalidCredentials();
  }

  // Reset failed login attempts on successful login
  await supabase
    .from('users')
    .update({
      failed_login_attempts: 0,
      locked_until: null,
      last_login_at: new Date().toISOString(),
      login_count: (userData?.login_count || 0) + 1,
    })
    .eq('id', authData.user.id);

  // Get user profile
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  // Create session record
  const sessionToken = jwt.sign(
    { userId: authData.user.id, sessionId: Date.now().toString() },
    config.auth.sessionSecret
  );

  const { data: session } = await supabase
    .from('user_sessions')
    .insert({
      user_id: authData.user.id,
      session_token: sessionToken,
      refresh_token: authData.session?.refresh_token,
      ip_address: req.ip,
      user_agent: req.get('User-Agent'),
      expires_at: new Date(Date.now() + (rememberMe ? 30 * 24 * 60 * 60 * 1000 : config.auth.sessionTimeout)).toISOString(),
    })
    .select()
    .single();

  // Log successful login
  logAuth({
    event: 'login',
    userId: authData.user.id,
    email,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    success: true,
  });

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: profile?.id,
        email: profile?.email,
        name: profile?.name,
        role: profile?.role,
        department: profile?.department,
        theme_preferences: profile?.theme_preferences,
        permissions: profile?.permissions || [],
      },
      tokens: {
        access_token: authData.session?.access_token,
        refresh_token: authData.session?.refresh_token,
        session_token: sessionToken,
        expires_in: authData.session?.expires_in,
      },
    },
    timestamp: new Date().toISOString(),
  });
}));

/**
 * Refresh access token
 * POST /auth/refresh
 */
router.post('/refresh', asyncHandler(async (req: Request, res: Response) => {
  const validatedData = refreshTokenSchema.parse(req.body);
  const { refreshToken } = validatedData;

  // Refresh token with Supabase
  const { data: authData, error: authError } = await supabase.auth.refreshSession({
    refresh_token: refreshToken,
  });

  if (authError || !authData.session) {
    throw errors.tokenInvalid();
  }

  // Update session record
  await supabase
    .from('user_sessions')
    .update({
      refresh_token: authData.session.refresh_token,
      last_accessed_at: new Date().toISOString(),
    })
    .eq('refresh_token', refreshToken);

  res.status(200).json({
    success: true,
    message: 'Token refreshed successfully',
    data: {
      tokens: {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
        expires_in: authData.session.expires_in,
      },
    },
    timestamp: new Date().toISOString(),
  });
}));

/**
 * User logout
 * POST /auth/logout
 */
router.post('/logout', asyncHandler(async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const sessionToken = req.headers['x-session-token'] as string;

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, config.supabase.jwtSecret) as any;
      const userId = decoded.sub;

      // Revoke session
      if (sessionToken) {
        await supabase
          .from('user_sessions')
          .update({
            is_active: false,
            revoked_at: new Date().toISOString(),
            revoke_reason: 'User logout',
          })
          .eq('session_token', sessionToken)
          .eq('user_id', userId);
      }

      // Log logout
      logAuth({
        event: 'logout',
        userId,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        success: true,
      });
    } catch (error) {
      // Token invalid, but still return success for logout
      logger.warn('Invalid token during logout:', error);
    }
  }

  res.status(200).json({
    success: true,
    message: 'Logout successful',
    timestamp: new Date().toISOString(),
  });
}));

/**
 * Forgot password
 * POST /auth/forgot-password
 */
router.post('/forgot-password', authRateLimit, asyncHandler(async (req: Request, res: Response) => {
  const validatedData = forgotPasswordSchema.parse(req.body);
  const { email } = validatedData;

  // Send reset password email via Supabase
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.FRONTEND_URL}/reset-password`,
  });

  if (error) {
    logger.error('Password reset email error:', error);
    // Don't reveal if email exists or not
  }

  // Always return success to prevent email enumeration
  res.status(200).json({
    success: true,
    message: 'If the email exists, a password reset link has been sent',
    timestamp: new Date().toISOString(),
  });
}));

/**
 * Reset password
 * POST /auth/reset-password
 */
router.post('/reset-password', asyncHandler(async (req: Request, res: Response) => {
  const validatedData = resetPasswordSchema.parse(req.body);
  const { token, password } = validatedData;

  // Verify and update password via Supabase
  const { data, error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    logger.error('Password reset error:', error);
    throw new Error('Password reset failed');
  }

  // Log password change
  if (data.user) {
    logAuth({
      event: 'password_change',
      userId: data.user.id,
      email: data.user.email,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      success: true,
    });
  }

  res.status(200).json({
    success: true,
    message: 'Password reset successful',
    timestamp: new Date().toISOString(),
  });
}));

/**
 * Get current user profile
 * GET /auth/me
 */
router.get('/me', asyncHandler(async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    throw errors.tokenInvalid();
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, config.supabase.jwtSecret) as any;
  const userId = decoded.sub;

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
      language,
      timezone,
      last_active_at,
      created_at
    `)
    .eq('id', userId)
    .single();

  if (error || !profile) {
    throw errors.resourceNotFound('User');
  }

  res.status(200).json({
    success: true,
    data: {
      user: profile,
    },
    timestamp: new Date().toISOString(),
  });
}));

/**
 * Validate token
 * POST /auth/validate
 */
router.post('/validate', asyncHandler(async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    throw errors.tokenInvalid();
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, config.supabase.jwtSecret) as any;
    
    res.status(200).json({
      success: true,
      data: {
        valid: true,
        userId: decoded.sub,
        email: decoded.email,
        expires: new Date(decoded.exp * 1000).toISOString(),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid token',
      code: 'INVALID_TOKEN',
      timestamp: new Date().toISOString(),
    });
  }
}));

export default router;
