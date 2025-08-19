import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { ApiError } from '../utils/errors';
import { config } from '../config';

/**
 * Custom error class for API errors
 */
export class ValidationError extends Error {
  public statusCode: number;
  public errors: any[];

  constructor(message: string, errors: any[] = []) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.errors = errors;
  }
}

/**
 * Global error handler middleware
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log the error
  logger.error('API Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    userId: req.user?.id,
  });

  // Handle specific error types
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      error: error.message,
      code: error.code || 'API_ERROR',
      timestamp: new Date().toISOString(),
      requestId: req.headers['x-request-id'] || 'unknown',
      ...(config.env === 'development' && { stack: error.stack }),
    });
  }

  if (error instanceof ValidationError) {
    return res.status(400).json({
      error: error.message,
      code: 'VALIDATION_ERROR',
      errors: error.errors,
      timestamp: new Date().toISOString(),
      requestId: req.headers['x-request-id'] || 'unknown',
    });
  }

  // Handle Supabase errors
  if (error.message?.includes('duplicate key value violates unique constraint')) {
    return res.status(409).json({
      error: 'Resource already exists',
      code: 'DUPLICATE_RESOURCE',
      timestamp: new Date().toISOString(),
    });
  }

  if (error.message?.includes('foreign key constraint')) {
    return res.status(400).json({
      error: 'Invalid reference to related resource',
      code: 'INVALID_REFERENCE',
      timestamp: new Date().toISOString(),
    });
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid authentication token',
      code: 'INVALID_TOKEN',
      timestamp: new Date().toISOString(),
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Authentication token expired',
      code: 'TOKEN_EXPIRED',
      timestamp: new Date().toISOString(),
    });
  }

  // Handle Zod validation errors
  if (error.name === 'ZodError') {
    const zodError = error as any;
    return res.status(400).json({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      errors: zodError.errors?.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code,
      })),
      timestamp: new Date().toISOString(),
    });
  }

  // Handle database connection errors
  if (error.message?.includes('connect ECONNREFUSED') || 
      error.message?.includes('connection terminated')) {
    return res.status(503).json({
      error: 'Database connection error',
      code: 'DATABASE_CONNECTION_ERROR',
      timestamp: new Date().toISOString(),
    });
  }

  // Handle Redis connection errors
  if (error.message?.includes('Redis connection')) {
    return res.status(503).json({
      error: 'Cache service unavailable',
      code: 'CACHE_SERVICE_ERROR',
      timestamp: new Date().toISOString(),
    });
  }

  // Handle file upload errors
  if (error.message?.includes('File too large')) {
    return res.status(413).json({
      error: 'File size exceeds maximum allowed limit',
      code: 'FILE_TOO_LARGE',
      maxSize: config.storage.maxFileSize,
      timestamp: new Date().toISOString(),
    });
  }

  if (error.message?.includes('Invalid file type')) {
    return res.status(400).json({
      error: 'File type not allowed',
      code: 'INVALID_FILE_TYPE',
      allowedTypes: config.storage.allowedFileTypes.split(','),
      timestamp: new Date().toISOString(),
    });
  }

  // Handle AI service errors
  if (error.message?.includes('OpenAI') || error.message?.includes('AI service')) {
    return res.status(503).json({
      error: 'AI service temporarily unavailable',
      code: 'AI_SERVICE_ERROR',
      timestamp: new Date().toISOString(),
    });
  }

  // Handle email service errors
  if (error.message?.includes('SMTP') || error.message?.includes('Email')) {
    return res.status(503).json({
      error: 'Email service temporarily unavailable',
      code: 'EMAIL_SERVICE_ERROR',
      timestamp: new Date().toISOString(),
    });
  }

  // Default internal server error
  return res.status(500).json({
    error: config.env === 'production' 
      ? 'Internal server error' 
      : error.message,
    code: 'INTERNAL_SERVER_ERROR',
    timestamp: new Date().toISOString(),
    requestId: req.headers['x-request-id'] || 'unknown',
    ...(config.env === 'development' && { 
      stack: error.stack,
      details: error.toString(),
    }),
  });
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req: Request, res: Response) => {
  logger.warn('Route not found:', {
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    userId: req.user?.id,
  });

  res.status(404).json({
    error: 'Route not found',
    code: 'ROUTE_NOT_FOUND',
    method: req.method,
    path: req.path,
    timestamp: new Date().toISOString(),
    suggestion: 'Check the API documentation for available endpoints',
  });
};

/**
 * Async error handler wrapper
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Request timeout handler
 */
export const timeoutHandler = (timeoutMs: number = 30000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const timeout = setTimeout(() => {
      if (!res.headersSent) {
        logger.warn('Request timeout:', {
          method: req.method,
          url: req.url,
          timeout: timeoutMs,
          userId: req.user?.id,
        });

        res.status(408).json({
          error: 'Request timeout',
          code: 'REQUEST_TIMEOUT',
          timeout: timeoutMs,
          timestamp: new Date().toISOString(),
        });
      }
    }, timeoutMs);

    res.on('finish', () => {
      clearTimeout(timeout);
    });

    res.on('close', () => {
      clearTimeout(timeout);
    });

    next();
  };
};

/**
 * Graceful shutdown handler
 */
export const gracefulShutdown = (server: any) => {
  const shutdown = (signal: string) => {
    logger.info(`Received ${signal}, shutting down gracefully...`);
    
    server.close(() => {
      logger.info('Server closed successfully');
      process.exit(0);
    });

    // Force close after 10 seconds
    setTimeout(() => {
      logger.error('Forced shutdown due to timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGUSR2', () => shutdown('SIGUSR2')); // Nodemon restart

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    shutdown('uncaughtException');
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    shutdown('unhandledRejection');
  });
};

/**
 * Health check error handler
 */
export const healthCheckError = (component: string, error: any) => {
  logger.error(`Health check failed for ${component}:`, error);
  
  return {
    component,
    status: 'unhealthy',
    error: error.message || 'Unknown error',
    timestamp: new Date().toISOString(),
  };
};

/**
 * API response wrapper for consistent error handling
 */
export const apiResponse = {
  success: (data: any, message?: string, meta?: any) => ({
    success: true,
    data,
    message,
    meta,
    timestamp: new Date().toISOString(),
  }),

  error: (message: string, code?: string, details?: any) => ({
    success: false,
    error: message,
    code,
    details,
    timestamp: new Date().toISOString(),
  }),

  paginated: (data: any[], total: number, page: number, limit: number) => ({
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
    timestamp: new Date().toISOString(),
  }),
};

export default errorHandler;
