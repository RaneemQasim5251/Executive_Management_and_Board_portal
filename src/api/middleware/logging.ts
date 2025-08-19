import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';
import { config } from '../config';

/**
 * Request logging middleware
 */
export const loggingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();
  const requestId = uuidv4();
  
  // Add request ID to headers for tracing
  req.headers['x-request-id'] = requestId;
  res.setHeader('x-request-id', requestId);
  
  // Skip logging for health checks in production
  const shouldSkipLogging = config.env === 'production' && 
    (req.path === '/health' || req.path === '/health/deep');
  
  if (!shouldSkipLogging) {
    logger.info('Request started', {
      requestId,
      method: req.method,
      url: req.url,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      userId: req.user?.id,
      contentLength: req.get('Content-Length'),
      contentType: req.get('Content-Type'),
    });
  }
  
  // Log request body for non-GET requests (excluding sensitive data)
  if (req.method !== 'GET' && req.body && !shouldSkipLogging) {
    const sanitizedBody = sanitizeLogData(req.body);
    logger.debug('Request body', {
      requestId,
      body: sanitizedBody,
    });
  }
  
  // Override res.json to log response
  const originalJson = res.json;
  res.json = function(body: any) {
    const responseTime = Date.now() - startTime;
    
    if (!shouldSkipLogging) {
      logger.info('Request completed', {
        requestId,
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        responseTime,
        userId: req.user?.id,
        contentLength: JSON.stringify(body).length,
      });
      
      // Log response body for errors or debug mode
      if (res.statusCode >= 400 || config.logging.level === 'debug') {
        const sanitizedResponse = sanitizeLogData(body);
        logger.debug('Response body', {
          requestId,
          statusCode: res.statusCode,
          body: sanitizedResponse,
        });
      }
    }
    
    // Call original json method
    return originalJson.call(this, body);
  };
  
  // Log when response finishes
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    
    if (!shouldSkipLogging) {
      const logLevel = res.statusCode >= 500 ? 'error' : 
                      res.statusCode >= 400 ? 'warn' : 'info';
      
      logger[logLevel]('Response finished', {
        requestId,
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        responseTime,
        userId: req.user?.id,
      });
    }
    
    // Log slow requests
    if (responseTime > 5000) {
      logger.warn('Slow request detected', {
        requestId,
        method: req.method,
        url: req.url,
        responseTime,
        userId: req.user?.id,
      });
    }
  });
  
  // Log connection errors
  req.on('error', (error) => {
    logger.error('Request error', {
      requestId,
      error: error.message,
      stack: error.stack,
    });
  });
  
  res.on('error', (error) => {
    logger.error('Response error', {
      requestId,
      error: error.message,
      stack: error.stack,
    });
  });
  
  next();
};

/**
 * Sanitize sensitive data from logs
 */
const sanitizeLogData = (data: any): any => {
  if (!data || typeof data !== 'object') {
    return data;
  }
  
  const sensitiveFields = [
    'password',
    'token',
    'secret',
    'key',
    'authorization',
    'cookie',
    'session',
    'credentials',
    'auth',
    'apiKey',
    'api_key',
  ];
  
  const sanitized = { ...data };
  
  const sanitizeObject = (obj: any, path: string = ''): any => {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }
    
    if (Array.isArray(obj)) {
      return obj.map((item, index) => 
        sanitizeObject(item, `${path}[${index}]`)
      );
    }
    
    const result: any = {};
    
    for (const [key, value] of Object.entries(obj)) {
      const fullPath = path ? `${path}.${key}` : key;
      const lowerKey = key.toLowerCase();
      
      if (sensitiveFields.some(field => lowerKey.includes(field))) {
        result[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        result[key] = sanitizeObject(value, fullPath);
      } else {
        result[key] = value;
      }
    }
    
    return result;
  };
  
  return sanitizeObject(sanitized);
};

/**
 * Audit logging middleware for sensitive operations
 */
export const auditLogMiddleware = (operation: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json;
    
    res.json = function(body: any) {
      // Log audit trail for successful operations
      if (res.statusCode < 400) {
        logger.info('Audit log', {
          operation,
          userId: req.user?.id,
          userEmail: req.user?.email,
          method: req.method,
          url: req.url,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          requestId: req.headers['x-request-id'],
          timestamp: new Date().toISOString(),
          success: true,
        });
      }
      
      return originalJson.call(this, body);
    };
    
    next();
  };
};

/**
 * Performance monitoring middleware
 */
export const performanceMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = process.hrtime.bigint();
  const startMemory = process.memoryUsage();
  
  res.on('finish', () => {
    const endTime = process.hrtime.bigint();
    const endMemory = process.memoryUsage();
    
    const responseTime = Number(endTime - startTime) / 1000000; // Convert to milliseconds
    const memoryDelta = {
      rss: endMemory.rss - startMemory.rss,
      heapUsed: endMemory.heapUsed - startMemory.heapUsed,
      heapTotal: endMemory.heapTotal - startMemory.heapTotal,
      external: endMemory.external - startMemory.external,
    };
    
    // Log performance metrics for slow requests or high memory usage
    if (responseTime > 1000 || Math.abs(memoryDelta.heapUsed) > 10 * 1024 * 1024) {
      logger.warn('Performance metrics', {
        requestId: req.headers['x-request-id'],
        method: req.method,
        url: req.url,
        responseTime: Math.round(responseTime * 100) / 100,
        statusCode: res.statusCode,
        memoryDelta,
        userId: req.user?.id,
      });
    }
  });
  
  next();
};

/**
 * Security logging middleware
 */
export const securityLogMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log potential security issues
  const securityChecks = {
    suspiciousUserAgent: /bot|crawler|spider|scraper|hack/i.test(req.get('User-Agent') || ''),
    sqlInjectionAttempt: /(\b(union|select|insert|update|delete|drop|create|alter)\b)/i.test(req.url),
    xssAttempt: /<script|javascript:|on\w+\s*=/i.test(req.url),
    pathTraversalAttempt: /\.\.\/|\.\.\\/.test(req.url),
    unusualHeaders: Object.keys(req.headers).some(header => 
      /^x-(?!request-id|forwarded|real-ip)/i.test(header) && 
      !['x-requested-with', 'x-csrf-token'].includes(header.toLowerCase())
    ),
  };
  
  const suspiciousActivity = Object.entries(securityChecks)
    .filter(([, detected]) => detected)
    .map(([check]) => check);
  
  if (suspiciousActivity.length > 0) {
    logger.warn('Security alert', {
      requestId: req.headers['x-request-id'],
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id,
      suspiciousActivity,
      headers: sanitizeLogData(req.headers),
    });
  }
  
  next();
};

/**
 * Rate limiting log middleware
 */
export const rateLimitLogMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log rate limit hits
  if (res.statusCode === 429) {
    logger.warn('Rate limit exceeded', {
      requestId: req.headers['x-request-id'],
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id,
    });
  }
  
  next();
};

/**
 * Database query logging middleware
 */
export const queryLogMiddleware = (query: string, params?: any[]) => {
  if (config.performance.enableQueryLogging) {
    const startTime = Date.now();
    
    return {
      log: () => {
        const duration = Date.now() - startTime;
        logger.debug('Database query', {
          query: query.substring(0, 500), // Limit query length
          params: params ? sanitizeLogData(params) : undefined,
          duration,
        });
      }
    };
  }
  
  return { log: () => {} };
};

export default loggingMiddleware;
