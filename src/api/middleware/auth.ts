import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';
import { config } from '../config';
import { ApiError } from '../utils/errors';
import { logger } from '../utils/logger';

// Extend Request interface to include user data
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        permissions: string[];
        sessionId?: string;
      };
    }
  }
}

// Initialize Supabase client for auth operations
const supabase = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/**
 * Extract JWT token from Authorization header
 */
const extractToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return null;
  }
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
};

/**
 * Verify JWT token and extract user information
 */
const verifyToken = async (token: string) => {
  try {
    // Verify with Supabase JWT secret
    const payload = jwt.verify(token, config.supabase.jwtSecret) as any;
    
    // Extract user information from JWT payload
    const userId = payload.sub;
    const email = payload.email;
    const role = payload.app_metadata?.role || payload.user_metadata?.role;
    
    if (!userId || !email) {
      throw new ApiError('Invalid token payload', 401);
    }
    
    return {
      id: userId,
      email,
      role,
      aud: payload.aud,
      exp: payload.exp,
    };
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError('Invalid token', 401);
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError('Token expired', 401);
    }
    throw error;
  }
};

/**
 * Get user details from database
 */
const getUserDetails = async (userId: string) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select(`
        id,
        email,
        name,
        role,
        permissions,
        access_level,
        last_active_at,
        locked_until
      `)
      .eq('id', userId)
      .single();
    
    if (error || !user) {
      throw new ApiError('User not found', 404);
    }
    
    // Check if user is locked
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      throw new ApiError('Account is temporarily locked', 423);
    }
    
    return user;
  } catch (error) {
    logger.error('Error fetching user details:', error);
    throw error;
  }
};

/**
 * Update user's last active timestamp
 */
const updateLastActive = async (userId: string) => {
  try {
    await supabase
      .from('users')
      .update({ last_active_at: new Date().toISOString() })
      .eq('id', userId);
  } catch (error) {
    // Log but don't fail the request for this
    logger.warn('Failed to update last_active_at:', error);
  }
};

/**
 * Log authentication attempt
 */
const logAuthAttempt = async (
  userId: string | null,
  success: boolean,
  ip: string,
  userAgent: string,
  reason?: string
) => {
  try {
    await supabase
      .from('audit_logs')
      .insert({
        user_id: userId,
        action: success ? 'login' : 'login_failed',
        entity_type: 'authentication',
        entity_id: userId,
        ip_address: ip,
        user_agent: userAgent,
        old_values: reason ? { reason } : null,
        risk_score: success ? 2 : 6,
      });
  } catch (error) {
    logger.warn('Failed to log auth attempt:', error);
  }
};

/**
 * Main authentication middleware
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractToken(req);
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.get('User-Agent') || 'unknown';
    
    if (!token) {
      await logAuthAttempt(null, false, clientIp, userAgent, 'No token provided');
      throw new ApiError('Authentication token required', 401);
    }
    
    // Verify JWT token
    const tokenPayload = await verifyToken(token);
    
    // Get user details from database
    const user = await getUserDetails(tokenPayload.id);
    
    // Update last active timestamp
    await updateLastActive(user.id);
    
    // Log successful authentication
    await logAuthAttempt(user.id, true, clientIp, userAgent);
    
    // Attach user information to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions || [],
    };
    
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        error: error.message,
        code: 'AUTHENTICATION_FAILED',
        timestamp: new Date().toISOString(),
      });
    }
    
    logger.error('Authentication middleware error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Role-based authorization middleware
 */
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        code: 'AUTHENTICATION_REQUIRED',
      });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: allowedRoles,
        current: req.user.role,
      });
    }
    
    next();
  };
};

/**
 * Permission-based authorization middleware
 */
export const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        code: 'AUTHENTICATION_REQUIRED',
      });
    }
    
    if (!req.user.permissions.includes(permission)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: permission,
        current: req.user.permissions,
      });
    }
    
    next();
  };
};

/**
 * Executive-level access middleware
 */
export const requireExecutive = requireRole([
  'board_chairman',
  'ceo',
  'cfo',
  'cto',
  'executive',
  'board_member',
]);

/**
 * Board-level access middleware
 */
export const requireBoard = requireRole([
  'board_chairman',
  'board_member',
]);

/**
 * Admin access middleware
 */
export const requireAdmin = requireRole([
  'admin',
  'board_chairman',
  'ceo',
]);

/**
 * Optional authentication middleware (doesn't fail if no token)
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractToken(req);
    
    if (token) {
      const tokenPayload = await verifyToken(token);
      const user = await getUserDetails(tokenPayload.id);
      
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        permissions: user.permissions || [],
      };
    }
    
    next();
  } catch (error) {
    // For optional auth, we continue even if authentication fails
    next();
  }
};

/**
 * Rate limiting per user
 */
export const userRateLimit = (maxRequests: number, windowMs: number) => {
  const attempts = new Map<string, { count: number; resetTime: number }>();
  
  return (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id || req.ip || 'anonymous';
    const now = Date.now();
    const userAttempts = attempts.get(userId);
    
    if (!userAttempts || now > userAttempts.resetTime) {
      attempts.set(userId, {
        count: 1,
        resetTime: now + windowMs,
      });
      return next();
    }
    
    if (userAttempts.count >= maxRequests) {
      return res.status(429).json({
        error: 'Too many requests',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: Math.ceil((userAttempts.resetTime - now) / 1000),
      });
    }
    
    userAttempts.count++;
    next();
  };
};

/**
 * Session validation middleware
 */
export const validateSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next();
  }
  
  try {
    const sessionToken = req.headers['x-session-token'] as string;
    
    if (sessionToken) {
      const { data: session, error } = await supabase
        .from('user_sessions')
        .select('id, is_active, expires_at')
        .eq('session_token', sessionToken)
        .eq('user_id', req.user.id)
        .single();
      
      if (error || !session || !session.is_active) {
        return res.status(401).json({
          error: 'Invalid session',
          code: 'INVALID_SESSION',
        });
      }
      
      if (new Date(session.expires_at) < new Date()) {
        return res.status(401).json({
          error: 'Session expired',
          code: 'SESSION_EXPIRED',
        });
      }
      
      req.user.sessionId = session.id;
    }
    
    next();
  } catch (error) {
    logger.error('Session validation error:', error);
    next();
  }
};

export default authMiddleware;
