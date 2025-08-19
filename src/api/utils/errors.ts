/**
 * Custom API Error class for structured error handling
 */
export class ApiError extends Error {
  public statusCode: number;
  public code?: string;
  public details?: any;
  public isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code?: string,
    details?: any,
    isOperational: boolean = true
  ) {
    super(message);
    
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation Error class
 */
export class ValidationError extends ApiError {
  public errors: any[];

  constructor(message: string, errors: any[] = []) {
    super(message, 400, 'VALIDATION_ERROR');
    this.errors = errors;
  }
}

/**
 * Authentication Error class
 */
export class AuthenticationError extends ApiError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

/**
 * Authorization Error class
 */
export class AuthorizationError extends ApiError {
  public requiredRole?: string;
  public requiredPermission?: string;

  constructor(
    message: string = 'Insufficient permissions',
    requiredRole?: string,
    requiredPermission?: string
  ) {
    super(message, 403, 'AUTHORIZATION_ERROR');
    this.requiredRole = requiredRole;
    this.requiredPermission = requiredPermission;
  }
}

/**
 * Not Found Error class
 */
export class NotFoundError extends ApiError {
  public resource?: string;

  constructor(message: string = 'Resource not found', resource?: string) {
    super(message, 404, 'NOT_FOUND');
    this.resource = resource;
  }
}

/**
 * Conflict Error class
 */
export class ConflictError extends ApiError {
  constructor(message: string = 'Resource already exists') {
    super(message, 409, 'CONFLICT');
  }
}

/**
 * Rate Limit Error class
 */
export class RateLimitError extends ApiError {
  public retryAfter?: number;

  constructor(message: string = 'Rate limit exceeded', retryAfter?: number) {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
    this.retryAfter = retryAfter;
  }
}

/**
 * Service Unavailable Error class
 */
export class ServiceUnavailableError extends ApiError {
  public service?: string;

  constructor(message: string = 'Service temporarily unavailable', service?: string) {
    super(message, 503, 'SERVICE_UNAVAILABLE');
    this.service = service;
  }
}

/**
 * Database Error class
 */
export class DatabaseError extends ApiError {
  public query?: string;
  public constraint?: string;

  constructor(
    message: string = 'Database operation failed',
    query?: string,
    constraint?: string
  ) {
    super(message, 500, 'DATABASE_ERROR');
    this.query = query;
    this.constraint = constraint;
  }
}

/**
 * External Service Error class
 */
export class ExternalServiceError extends ApiError {
  public service: string;
  public originalError?: any;

  constructor(
    service: string,
    message: string = 'External service error',
    originalError?: any
  ) {
    super(message, 503, 'EXTERNAL_SERVICE_ERROR');
    this.service = service;
    this.originalError = originalError;
  }
}

/**
 * Business Logic Error class
 */
export class BusinessLogicError extends ApiError {
  constructor(message: string) {
    super(message, 422, 'BUSINESS_LOGIC_ERROR');
  }
}

/**
 * File Upload Error class
 */
export class FileUploadError extends ApiError {
  public filename?: string;
  public fileSize?: number;
  public maxSize?: number;

  constructor(
    message: string,
    filename?: string,
    fileSize?: number,
    maxSize?: number
  ) {
    super(message, 400, 'FILE_UPLOAD_ERROR');
    this.filename = filename;
    this.fileSize = fileSize;
    this.maxSize = maxSize;
  }
}

/**
 * Predefined error factory functions
 */
export const errors = {
  // Authentication & Authorization
  invalidCredentials: () => 
    new AuthenticationError('Invalid email or password'),
  
  tokenExpired: () => 
    new AuthenticationError('Authentication token has expired'),
  
  tokenInvalid: () => 
    new AuthenticationError('Invalid authentication token'),
  
  accountLocked: (unlockTime?: Date) => 
    new AuthenticationError(
      `Account is temporarily locked${unlockTime ? ` until ${unlockTime.toISOString()}` : ''}`
    ),
  
  insufficientPermissions: (required?: string) => 
    new AuthorizationError(
      `Insufficient permissions${required ? `. Required: ${required}` : ''}`,
      undefined,
      required
    ),
  
  roleRequired: (role: string) => 
    new AuthorizationError(`${role} role required`, role),

  // Resource Management
  resourceNotFound: (resource: string, id?: string) => 
    new NotFoundError(
      `${resource}${id ? ` with ID ${id}` : ''} not found`,
      resource
    ),
  
  resourceAlreadyExists: (resource: string, field?: string) => 
    new ConflictError(
      `${resource}${field ? ` with this ${field}` : ''} already exists`
    ),
  
  resourceInUse: (resource: string) => 
    new ConflictError(`${resource} is currently in use and cannot be deleted`),

  // Validation
  validationFailed: (errors: any[]) => 
    new ValidationError('Validation failed', errors),
  
  requiredField: (field: string) => 
    new ValidationError(`${field} is required`),
  
  invalidFormat: (field: string, format: string) => 
    new ValidationError(`${field} must be a valid ${format}`),
  
  invalidLength: (field: string, min?: number, max?: number) => {
    let message = `${field} length is invalid`;
    if (min && max) message += ` (must be between ${min} and ${max} characters)`;
    else if (min) message += ` (must be at least ${min} characters)`;
    else if (max) message += ` (must be at most ${max} characters)`;
    return new ValidationError(message);
  },

  // Rate Limiting
  rateLimitExceeded: (retryAfter?: number) => 
    new RateLimitError('Too many requests, please try again later', retryAfter),
  
  aiRateLimitExceeded: () => 
    new RateLimitError('AI service rate limit exceeded, please try again later'),

  // File Operations
  fileTooLarge: (filename: string, size: number, maxSize: number) => 
    new FileUploadError(
      `File ${filename} is too large (${size} bytes). Maximum allowed: ${maxSize} bytes`,
      filename,
      size,
      maxSize
    ),
  
  invalidFileType: (filename: string, type: string, allowed: string[]) => 
    new FileUploadError(
      `File type ${type} not allowed for ${filename}. Allowed types: ${allowed.join(', ')}`,
      filename
    ),
  
  fileNotFound: (filename: string) => 
    new NotFoundError(`File ${filename} not found`),

  // External Services
  aiServiceUnavailable: (details?: string) => 
    new ExternalServiceError(
      'AI Service',
      `AI service is temporarily unavailable${details ? `: ${details}` : ''}`,
      details
    ),
  
  emailServiceUnavailable: () => 
    new ExternalServiceError('Email Service', 'Email service is temporarily unavailable'),
  
  storageServiceUnavailable: () => 
    new ExternalServiceError('Storage Service', 'File storage service is temporarily unavailable'),

  // Business Logic
  insufficientFunds: () => 
    new BusinessLogicError('Insufficient funds for this operation'),
  
  operationNotAllowed: (reason: string) => 
    new BusinessLogicError(`Operation not allowed: ${reason}`),
  
  deadlineExceeded: (deadline: Date) => 
    new BusinessLogicError(`Operation deadline exceeded (was: ${deadline.toISOString()})`),
  
  dependencyExists: (dependency: string) => 
    new BusinessLogicError(`Cannot perform operation due to existing dependency: ${dependency}`),

  // Database
  databaseConnectionFailed: () => 
    new DatabaseError('Failed to connect to database'),
  
  queryTimeout: () => 
    new DatabaseError('Database query timed out'),
  
  constraintViolation: (constraint: string) => 
    new DatabaseError(`Database constraint violation: ${constraint}`, undefined, constraint),

  // System
  maintenanceMode: () => 
    new ServiceUnavailableError('System is currently under maintenance'),
  
  serviceOverloaded: () => 
    new ServiceUnavailableError('Service is temporarily overloaded'),
  
  configurationError: (setting: string) => 
    new ApiError(`Configuration error: ${setting}`, 500, 'CONFIGURATION_ERROR'),
};

/**
 * Error type guards
 */
export const isApiError = (error: any): error is ApiError => {
  return error instanceof ApiError;
};

export const isValidationError = (error: any): error is ValidationError => {
  return error instanceof ValidationError;
};

export const isAuthenticationError = (error: any): error is AuthenticationError => {
  return error instanceof AuthenticationError;
};

export const isAuthorizationError = (error: any): error is AuthorizationError => {
  return error instanceof AuthorizationError;
};

export const isNotFoundError = (error: any): error is NotFoundError => {
  return error instanceof NotFoundError;
};

export const isRateLimitError = (error: any): error is RateLimitError => {
  return error instanceof RateLimitError;
};

export const isExternalServiceError = (error: any): error is ExternalServiceError => {
  return error instanceof ExternalServiceError;
};

/**
 * Error serializer for logging and responses
 */
export const serializeError = (error: any) => {
  if (isApiError(error)) {
    return {
      name: error.name,
      message: error.message,
      statusCode: error.statusCode,
      code: error.code,
      details: error.details,
      isOperational: error.isOperational,
      stack: error.stack,
    };
  }
  
  return {
    name: error.name || 'Error',
    message: error.message || 'Unknown error',
    statusCode: 500,
    code: 'UNKNOWN_ERROR',
    isOperational: false,
    stack: error.stack,
  };
};

export default ApiError;
