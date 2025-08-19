import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config();

// Environment validation schema
const configSchema = z.object({
  // Application
  env: z.enum(['development', 'production', 'test']).default('development'),
  port: z.coerce.number().default(3001),
  appTitle: z.string().default('Executive Management Portal'),
  appVersion: z.string().default('1.0.0'),

  // Supabase
  supabase: z.object({
    url: z.string().url(),
    anonKey: z.string(),
    serviceRoleKey: z.string(),
    jwtSecret: z.string(),
  }),

  // Database
  database: z.object({
    url: z.string().url(),
    poolMin: z.coerce.number().default(2),
    poolMax: z.coerce.number().default(20),
    poolIdleTimeout: z.coerce.number().default(30000),
  }),

  // Authentication & Security
  auth: z.object({
    jwtSecret: z.string().min(32),
    jwtExpiresIn: z.string().default('24h'),
    jwtRefreshExpiresIn: z.string().default('7d'),
    sessionSecret: z.string().min(32),
    sessionTimeout: z.coerce.number().default(86400000),
    maxLoginAttempts: z.coerce.number().default(5),
    lockoutTime: z.coerce.number().default(900000),
  }),

  // Password Policy
  password: z.object({
    minLength: z.coerce.number().default(8),
    requireUppercase: z.coerce.boolean().default(true),
    requireLowercase: z.coerce.boolean().default(true),
    requireNumbers: z.coerce.boolean().default(true),
    requireSymbols: z.coerce.boolean().default(true),
  }),

  // Redis
  redis: z.object({
    url: z.string().url(),
    password: z.string().optional(),
    db: z.coerce.number().default(0),
    keyPrefix: z.string().default('exec_portal:'),
    ttlDefault: z.coerce.number().default(3600),
  }),

  // File Storage
  storage: z.object({
    s3Bucket: z.string(),
    s3Region: z.string().default('us-east-1'),
    s3AccessKeyId: z.string(),
    s3SecretAccessKey: z.string(),
    s3Endpoint: z.string().url().optional(),
    s3ForcePathStyle: z.coerce.boolean().default(false),
    maxFileSize: z.coerce.number().default(10485760), // 10MB
    allowedFileTypes: z.string().default('pdf,doc,docx,xls,xlsx,ppt,pptx,jpg,jpeg,png,gif'),
  }),

  // AI Configuration
  ai: z.object({
    openaiApiKey: z.string().optional(),
    openaiModel: z.string().default('gpt-4'),
    openaiMaxTokens: z.coerce.number().default(2048),
    openaiTemperature: z.coerce.number().default(0.3),
    anthropicApiKey: z.string().optional(),
    azureOpenaiEndpoint: z.string().url().optional(),
    azureOpenaiApiKey: z.string().optional(),
  }),

  // Email
  email: z.object({
    smtpHost: z.string(),
    smtpPort: z.coerce.number().default(587),
    smtpSecure: z.coerce.boolean().default(false),
    smtpUser: z.string(),
    smtpPassword: z.string(),
    fromEmail: z.string().email(),
    fromName: z.string(),
    replyToEmail: z.string().email(),
    notificationsEnabled: z.coerce.boolean().default(true),
    digestEnabled: z.coerce.boolean().default(true),
    digestFrequency: z.enum(['daily', 'weekly', 'monthly']).default('weekly'),
  }),

  // Monitoring
  monitoring: z.object({
    sentryDsn: z.string().url().optional(),
    sentryEnvironment: z.string().default('production'),
    sentryTracesSampleRate: z.coerce.number().default(0.1),
    apmEnabled: z.coerce.boolean().default(true),
    apmServiceName: z.string().default('executive-portal'),
    apmServiceVersion: z.string().default('1.0.0'),
  }),

  // Logging
  logging: z.object({
    level: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
    format: z.enum(['simple', 'json']).default('json'),
    fileEnabled: z.coerce.boolean().default(true),
    filePath: z.string().default('/var/log/executive-portal.log'),
    rotation: z.enum(['daily', 'weekly', 'monthly']).default('daily'),
  }),

  // Rate Limiting
  rateLimit: z.object({
    windowMs: z.coerce.number().default(900000), // 15 minutes
    maxRequests: z.coerce.number().default(100),
    skipFailedRequests: z.coerce.boolean().default(true),
  }),

  // API Rate Limits
  apiRateLimit: z.object({
    window: z.coerce.number().default(3600000), // 1 hour
    max: z.coerce.number().default(1000),
    aiMax: z.coerce.number().default(50),
  }),

  // Security
  security: z.object({
    helmet: z.coerce.boolean().default(true),
    cors: z.coerce.boolean().default(true),
    ddosProtection: z.coerce.boolean().default(true),
    ddosBurst: z.coerce.number().default(20),
    ddosLimit: z.coerce.number().default(15),
  }),

  // CORS
  cors: z.object({
    origin: z.union([z.string(), z.array(z.string())]).default('*'),
  }),

  // Background Jobs
  jobs: z.object({
    redisUrl: z.string().url(),
    concurrency: z.coerce.number().default(5),
    attempts: z.coerce.number().default(3),
    backoff: z.enum(['fixed', 'exponential']).default('exponential'),
    kpiAggregationEnabled: z.coerce.boolean().default(true),
    emailDigestEnabled: z.coerce.boolean().default(true),
    dataCleanupEnabled: z.coerce.boolean().default(true),
    backupEnabled: z.coerce.boolean().default(true),
  }),

  // Feature Flags
  features: z.object({
    aiAssistant: z.coerce.boolean().default(true),
    anomalyDetection: z.coerce.boolean().default(true),
    kpiExplanations: z.coerce.boolean().default(true),
    predictiveAnalytics: z.coerce.boolean().default(true),
    realTimeCollaboration: z.coerce.boolean().default(true),
    comments: z.coerce.boolean().default(true),
    fileSharing: z.coerce.boolean().default(true),
    realTimeNotifications: z.coerce.boolean().default(true),
    advancedReporting: z.coerce.boolean().default(true),
    dashboardExport: z.coerce.boolean().default(true),
    dataVisualization: z.coerce.boolean().default(true),
    twoFactorAuth: z.coerce.boolean().default(true),
    sessionRecording: z.coerce.boolean().default(false),
    auditLogging: z.coerce.boolean().default(true),
    ipWhitelisting: z.coerce.boolean().default(false),
  }),

  // Performance
  performance: z.object({
    responseCaching: z.coerce.boolean().default(true),
    cacheTtlShort: z.coerce.number().default(300), // 5 minutes
    cacheTtlMedium: z.coerce.number().default(3600), // 1 hour
    cacheTtlLong: z.coerce.number().default(86400), // 24 hours
    dbQueryTimeout: z.coerce.number().default(30000),
    dbStatementTimeout: z.coerce.number().default(60000),
    enableQueryLogging: z.coerce.boolean().default(false),
  }),

  // Business Configuration
  business: z.object({
    companyName: z.string().default('Al Jeri Group'),
    companyCode: z.string().default('AJG'),
    headquartersTimezone: z.string().default('Asia/Riyadh'),
    fiscalYearStart: z.string().default('01-01'),
    workingDays: z.string().default('sunday,monday,tuesday,wednesday,thursday'),
    workingHoursStart: z.string().default('08:00'),
    workingHoursEnd: z.string().default('17:00'),
  }),

  // KPI Configuration
  kpis: z.object({
    calculationFrequency: z.enum(['hourly', 'daily', 'weekly']).default('hourly'),
    historicalMonths: z.coerce.number().default(24),
    anomalyDetectionSensitivity: z.enum(['low', 'medium', 'high']).default('medium'),
    forecastHorizonMonths: z.coerce.number().default(6),
  }),

  // Health Checks
  health: z.object({
    enabled: z.coerce.boolean().default(true),
    path: z.string().default('/health'),
    deepPath: z.string().default('/health/deep'),
    interval: z.coerce.number().default(30000),
    metricsInterval: z.coerce.number().default(60000),
  }),
});

// Parse and validate configuration
const parseConfig = () => {
  try {
    const rawConfig = {
      // Application
      env: process.env.NODE_ENV,
      port: process.env.PORT,
      appTitle: process.env.VITE_APP_TITLE,
      appVersion: process.env.VITE_APP_VERSION,

      // Supabase
      supabase: {
        url: process.env.VITE_SUPABASE_URL,
        anonKey: process.env.VITE_SUPABASE_ANON_KEY,
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        jwtSecret: process.env.SUPABASE_JWT_SECRET,
      },

      // Database
      database: {
        url: process.env.DATABASE_URL,
        poolMin: process.env.DB_POOL_MIN,
        poolMax: process.env.DB_POOL_MAX,
        poolIdleTimeout: process.env.DB_POOL_IDLE_TIMEOUT,
      },

      // Authentication
      auth: {
        jwtSecret: process.env.JWT_SECRET,
        jwtExpiresIn: process.env.JWT_EXPIRES_IN,
        jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
        sessionSecret: process.env.SESSION_SECRET,
        sessionTimeout: process.env.SESSION_TIMEOUT,
        maxLoginAttempts: process.env.MAX_LOGIN_ATTEMPTS,
        lockoutTime: process.env.LOCKOUT_TIME,
      },

      // Password Policy
      password: {
        minLength: process.env.PASSWORD_MIN_LENGTH,
        requireUppercase: process.env.PASSWORD_REQUIRE_UPPERCASE,
        requireLowercase: process.env.PASSWORD_REQUIRE_LOWERCASE,
        requireNumbers: process.env.PASSWORD_REQUIRE_NUMBERS,
        requireSymbols: process.env.PASSWORD_REQUIRE_SYMBOLS,
      },

      // Redis
      redis: {
        url: process.env.REDIS_URL,
        password: process.env.REDIS_PASSWORD,
        db: process.env.REDIS_DB,
        keyPrefix: process.env.REDIS_KEY_PREFIX,
        ttlDefault: process.env.REDIS_TTL_DEFAULT,
      },

      // File Storage
      storage: {
        s3Bucket: process.env.S3_BUCKET,
        s3Region: process.env.S3_REGION,
        s3AccessKeyId: process.env.S3_ACCESS_KEY_ID,
        s3SecretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        s3Endpoint: process.env.S3_ENDPOINT,
        s3ForcePathStyle: process.env.S3_FORCE_PATH_STYLE,
        maxFileSize: process.env.MAX_FILE_SIZE,
        allowedFileTypes: process.env.ALLOWED_FILE_TYPES,
      },

      // AI
      ai: {
        openaiApiKey: process.env.OPENAI_API_KEY,
        openaiModel: process.env.OPENAI_MODEL,
        openaiMaxTokens: process.env.OPENAI_MAX_TOKENS,
        openaiTemperature: process.env.OPENAI_TEMPERATURE,
        anthropicApiKey: process.env.ANTHROPIC_API_KEY,
        azureOpenaiEndpoint: process.env.AZURE_OPENAI_ENDPOINT,
        azureOpenaiApiKey: process.env.AZURE_OPENAI_API_KEY,
      },

      // Email
      email: {
        smtpHost: process.env.SMTP_HOST,
        smtpPort: process.env.SMTP_PORT,
        smtpSecure: process.env.SMTP_SECURE,
        smtpUser: process.env.SMTP_USER,
        smtpPassword: process.env.SMTP_PASSWORD,
        fromEmail: process.env.FROM_EMAIL,
        fromName: process.env.FROM_NAME,
        replyToEmail: process.env.REPLY_TO_EMAIL,
        notificationsEnabled: process.env.EMAIL_NOTIFICATIONS_ENABLED,
        digestEnabled: process.env.DIGEST_EMAIL_ENABLED,
        digestFrequency: process.env.DIGEST_EMAIL_FREQUENCY,
      },

      // Monitoring
      monitoring: {
        sentryDsn: process.env.SENTRY_DSN,
        sentryEnvironment: process.env.SENTRY_ENVIRONMENT,
        sentryTracesSampleRate: process.env.SENTRY_TRACES_SAMPLE_RATE,
        apmEnabled: process.env.APM_ENABLED,
        apmServiceName: process.env.APM_SERVICE_NAME,
        apmServiceVersion: process.env.APM_SERVICE_VERSION,
      },

      // Logging
      logging: {
        level: process.env.LOG_LEVEL,
        format: process.env.LOG_FORMAT,
        fileEnabled: process.env.LOG_FILE_ENABLED,
        filePath: process.env.LOG_FILE_PATH,
        rotation: process.env.LOG_ROTATION,
      },

      // Rate Limiting
      rateLimit: {
        windowMs: process.env.RATE_LIMIT_WINDOW_MS,
        maxRequests: process.env.RATE_LIMIT_MAX_REQUESTS,
        skipFailedRequests: process.env.RATE_LIMIT_SKIP_FAILED_REQUESTS,
      },

      // API Rate Limits
      apiRateLimit: {
        window: process.env.API_RATE_LIMIT_WINDOW,
        max: process.env.API_RATE_LIMIT_MAX,
        aiMax: process.env.AI_RATE_LIMIT_MAX,
      },

      // Security
      security: {
        helmet: process.env.ENABLE_HELMET,
        cors: process.env.ENABLE_CORS,
        ddosProtection: process.env.ENABLE_DDOS_PROTECTION,
        ddosBurst: process.env.DDOS_BURST,
        ddosLimit: process.env.DDOS_LIMIT,
      },

      // CORS
      cors: {
        origin: process.env.CORS_ORIGIN,
      },

      // Background Jobs
      jobs: {
        redisUrl: process.env.QUEUE_REDIS_URL,
        concurrency: process.env.QUEUE_CONCURRENCY,
        attempts: process.env.QUEUE_ATTEMPTS,
        backoff: process.env.QUEUE_BACKOFF,
        kpiAggregationEnabled: process.env.ENABLE_KPI_AGGREGATION_JOB,
        emailDigestEnabled: process.env.ENABLE_EMAIL_DIGEST_JOB,
        dataCleanupEnabled: process.env.ENABLE_DATA_CLEANUP_JOB,
        backupEnabled: process.env.ENABLE_BACKUP_JOB,
      },

      // Feature Flags
      features: {
        aiAssistant: process.env.ENABLE_AI_ASSISTANT,
        anomalyDetection: process.env.ENABLE_ANOMALY_DETECTION,
        kpiExplanations: process.env.ENABLE_KPI_EXPLANATIONS,
        predictiveAnalytics: process.env.ENABLE_PREDICTIVE_ANALYTICS,
        realTimeCollaboration: process.env.ENABLE_REAL_TIME_COLLABORATION,
        comments: process.env.ENABLE_COMMENTS,
        fileSharing: process.env.ENABLE_FILE_SHARING,
        realTimeNotifications: process.env.ENABLE_NOTIFICATIONS,
        advancedReporting: process.env.ENABLE_ADVANCED_REPORTING,
        dashboardExport: process.env.ENABLE_DASHBOARD_EXPORT,
        dataVisualization: process.env.ENABLE_DATA_VISUALIZATION,
        twoFactorAuth: process.env.ENABLE_TWO_FACTOR_AUTH,
        sessionRecording: process.env.ENABLE_SESSION_RECORDING,
        auditLogging: process.env.ENABLE_AUDIT_LOGGING,
        ipWhitelisting: process.env.ENABLE_IP_WHITELISTING,
      },

      // Performance
      performance: {
        responseCaching: process.env.ENABLE_RESPONSE_CACHING,
        cacheTtlShort: process.env.CACHE_TTL_SHORT,
        cacheTtlMedium: process.env.CACHE_TTL_MEDIUM,
        cacheTtlLong: process.env.CACHE_TTL_LONG,
        dbQueryTimeout: process.env.DB_QUERY_TIMEOUT,
        dbStatementTimeout: process.env.DB_STATEMENT_TIMEOUT,
        enableQueryLogging: process.env.ENABLE_QUERY_LOGGING,
      },

      // Business
      business: {
        companyName: process.env.COMPANY_NAME,
        companyCode: process.env.COMPANY_CODE,
        headquartersTimezone: process.env.HEADQUARTERS_TIMEZONE,
        fiscalYearStart: process.env.FISCAL_YEAR_START,
        workingDays: process.env.WORKING_DAYS,
        workingHoursStart: process.env.WORKING_HOURS_START,
        workingHoursEnd: process.env.WORKING_HOURS_END,
      },

      // KPIs
      kpis: {
        calculationFrequency: process.env.KPI_CALCULATION_FREQUENCY,
        historicalMonths: process.env.KPI_HISTORICAL_MONTHS,
        anomalyDetectionSensitivity: process.env.ANOMALY_DETECTION_SENSITIVITY,
        forecastHorizonMonths: process.env.FORECAST_HORIZON_MONTHS,
      },

      // Health Checks
      health: {
        enabled: process.env.HEALTH_CHECK_ENABLED,
        path: process.env.HEALTH_CHECK_PATH,
        deepPath: process.env.DEEP_HEALTH_CHECK_PATH,
        interval: process.env.HEALTH_CHECK_INTERVAL,
        metricsInterval: process.env.METRICS_COLLECTION_INTERVAL,
      },
    };

    return configSchema.parse(rawConfig);
  } catch (error) {
    console.error('❌ Configuration validation failed:', error);
    process.exit(1);
  }
};

export const config = parseConfig();

// Configuration validation helper
export const validateConfig = () => {
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'JWT_SECRET',
    'SESSION_SECRET',
    'REDIS_URL',
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    console.error('Please check your .env file and ensure all required variables are set.');
    process.exit(1);
  }

  console.log('✅ Configuration validated successfully');
};

export default config;
