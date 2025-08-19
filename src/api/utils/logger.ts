import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { config } from '../config';

// Custom log levels
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
  },
};

// Add colors to winston
winston.addColors(customLevels.colors);

// Custom format for console output
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ level, message, timestamp, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    
    // Add metadata if present
    if (Object.keys(meta).length > 0) {
      log += `\n${JSON.stringify(meta, null, 2)}`;
    }
    
    return log;
  })
);

// Custom format for file output
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint()
);

// Create transports array
const transports: winston.transport[] = [];

// Console transport (always enabled in development)
if (config.env === 'development') {
  transports.push(
    new winston.transports.Console({
      level: config.logging.level,
      format: consoleFormat,
    })
  );
} else {
  // In production, only log errors to console
  transports.push(
    new winston.transports.Console({
      level: 'error',
      format: consoleFormat,
    })
  );
}

// File transport (if enabled)
if (config.logging.fileEnabled) {
  // General log file with rotation
  transports.push(
    new DailyRotateFile({
      filename: config.logging.filePath.replace('.log', '-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      level: config.logging.level,
      format: fileFormat,
    })
  );

  // Separate error log file
  transports.push(
    new DailyRotateFile({
      filename: config.logging.filePath.replace('.log', '-error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
      level: 'error',
      format: fileFormat,
    })
  );

  // Separate audit log file for security events
  transports.push(
    new DailyRotateFile({
      filename: config.logging.filePath.replace('.log', '-audit-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '50m',
      maxFiles: '90d',
      level: 'info',
      format: fileFormat,
    })
  );
}

// Create logger instance
export const logger = winston.createLogger({
  level: config.logging.level,
  levels: customLevels.levels,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true })
  ),
  transports,
  exitOnError: false, // Don't exit on handled exceptions
});

// Handle uncaught exceptions and rejections
if (config.env === 'production') {
  logger.exceptions.handle(
    new DailyRotateFile({
      filename: config.logging.filePath.replace('.log', '-exceptions-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
      format: fileFormat,
    })
  );

  logger.rejections.handle(
    new DailyRotateFile({
      filename: config.logging.filePath.replace('.log', '-rejections-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
      format: fileFormat,
    })
  );
}

// Create specialized loggers for different purposes
export const auditLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new DailyRotateFile({
      filename: config.logging.filePath.replace('.log', '-audit-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '50m',
      maxFiles: '2555d', // Keep audit logs for 7 years
      format: fileFormat,
    }),
  ],
});

export const securityLogger = winston.createLogger({
  level: 'warn',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new DailyRotateFile({
      filename: config.logging.filePath.replace('.log', '-security-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '100m',
      maxFiles: '365d', // Keep security logs for 1 year
      format: fileFormat,
    }),
  ],
});

export const performanceLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new DailyRotateFile({
      filename: config.logging.filePath.replace('.log', '-performance-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '100m',
      maxFiles: '30d',
      format: fileFormat,
    }),
  ],
});

// Utility functions for structured logging
export const loggers = {
  /**
   * Log API requests
   */
  request: (data: {
    requestId: string;
    method: string;
    url: string;
    userAgent?: string;
    ip?: string;
    userId?: string;
    responseTime?: number;
    statusCode?: number;
  }) => {
    logger.info('API Request', data);
  },

  /**
   * Log authentication events
   */
  auth: (data: {
    event: 'login' | 'logout' | 'login_failed' | 'token_refresh' | 'password_change';
    userId?: string;
    email?: string;
    ip?: string;
    userAgent?: string;
    success: boolean;
    reason?: string;
  }) => {
    const logLevel = data.success ? 'info' : 'warn';
    auditLogger[logLevel]('Authentication Event', data);
    
    // Also log to security logger for failed attempts
    if (!data.success) {
      securityLogger.warn('Authentication Failed', data);
    }
  },

  /**
   * Log business operations
   */
  business: (data: {
    operation: string;
    entity: string;
    entityId?: string;
    userId?: string;
    success: boolean;
    details?: any;
  }) => {
    auditLogger.info('Business Operation', data);
  },

  /**
   * Log security events
   */
  security: (data: {
    event: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    ip?: string;
    userAgent?: string;
    userId?: string;
    details?: any;
  }) => {
    const logLevel = data.severity === 'critical' ? 'error' : 'warn';
    securityLogger[logLevel]('Security Event', data);
    
    // Also log to main logger for critical events
    if (data.severity === 'critical') {
      logger.error('Critical Security Event', data);
    }
  },

  /**
   * Log performance metrics
   */
  performance: (data: {
    operation: string;
    duration: number;
    success: boolean;
    details?: any;
  }) => {
    performanceLogger.info('Performance Metric', data);
    
    // Log slow operations to main logger
    if (data.duration > 5000) {
      logger.warn('Slow Operation', data);
    }
  },

  /**
   * Log AI operations
   */
  ai: (data: {
    operation: string;
    userId?: string;
    query?: string;
    model?: string;
    tokensUsed?: number;
    responseTime?: number;
    success: boolean;
    error?: string;
  }) => {
    logger.info('AI Operation', {
      ...data,
      query: data.query ? data.query.substring(0, 200) + '...' : undefined, // Truncate for privacy
    });
  },

  /**
   * Log database operations
   */
  database: (data: {
    operation: string;
    table?: string;
    duration: number;
    rowsAffected?: number;
    success: boolean;
    error?: string;
  }) => {
    const logLevel = data.success ? 'debug' : 'error';
    logger[logLevel]('Database Operation', data);
    
    // Log slow queries
    if (data.duration > 1000) {
      performanceLogger.warn('Slow Database Query', data);
    }
  },

  /**
   * Log file operations
   */
  file: (data: {
    operation: 'upload' | 'download' | 'delete';
    filename: string;
    fileSize?: number;
    userId?: string;
    success: boolean;
    error?: string;
  }) => {
    logger.info('File Operation', data);
    
    // Log file operations to audit log
    auditLogger.info('File Operation', data);
  },

  /**
   * Log system events
   */
  system: (data: {
    event: string;
    level: 'info' | 'warn' | 'error';
    details?: any;
  }) => {
    logger[data.level]('System Event', data);
  },
};

// Export structured logging functions
export const logRequest = loggers.request;
export const logAuth = loggers.auth;
export const logBusiness = loggers.business;
export const logSecurity = loggers.security;
export const logPerformance = loggers.performance;
export const logAI = loggers.ai;
export const logDatabase = loggers.database;
export const logFile = loggers.file;
export const logSystem = loggers.system;

// Health check for logging system
export const checkLoggingHealth = () => {
  try {
    logger.info('Logging health check');
    return { status: 'healthy', timestamp: new Date().toISOString() };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };
  }
};

// Initialize logging system
logger.info('Logging system initialized', {
  level: config.logging.level,
  format: config.logging.format,
  fileEnabled: config.logging.fileEnabled,
  filePath: config.logging.filePath,
  environment: config.env,
});

export default logger;
