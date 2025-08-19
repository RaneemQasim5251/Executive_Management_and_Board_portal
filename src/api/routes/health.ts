import { Router, Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { config } from '../config';
import { logger, checkLoggingHealth } from '../utils/logger';
import { getMetrics } from '../middleware/metrics';

const router = Router();
const supabase = createClient(config.supabase.url, config.supabase.serviceRoleKey);

/**
 * Basic health check endpoint
 * GET /health
 */
router.get('/', async (req: Request, res: Response) => {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.env,
    version: config.appVersion,
    service: config.appTitle,
  };

  res.status(200).json(healthCheck);
});

/**
 * Deep health check endpoint
 * GET /health/deep
 */
router.get('/deep', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const checks: Record<string, any> = {};
  let overallStatus = 'healthy';

  // Check database connection
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    
    checks.database = {
      status: 'healthy',
      responseTime: Date.now() - startTime,
      message: 'Database connection successful',
    };
  } catch (error) {
    checks.database = {
      status: 'unhealthy',
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown database error',
    };
    overallStatus = 'unhealthy';
  }

  // Check logging system
  checks.logging = checkLoggingHealth();
  if (checks.logging.status !== 'healthy') {
    overallStatus = 'degraded';
  }

  // Check memory usage
  const memoryUsage = process.memoryUsage();
  const memoryUsageMB = {
    rss: Math.round(memoryUsage.rss / 1024 / 1024),
    heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
    heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
    external: Math.round(memoryUsage.external / 1024 / 1024),
  };

  const memoryThreshold = 512; // MB
  checks.memory = {
    status: memoryUsageMB.heapUsed > memoryThreshold ? 'warning' : 'healthy',
    usage: memoryUsageMB,
    threshold: memoryThreshold,
  };

  if (checks.memory.status === 'warning' && overallStatus === 'healthy') {
    overallStatus = 'degraded';
  }

  // Check disk space (simplified check)
  checks.disk = {
    status: 'healthy',
    message: 'Disk space check not implemented',
  };

  // Check external services (if configured)
  if (config.ai.openaiApiKey) {
    checks.aiService = {
      status: 'healthy',
      message: 'AI service configured',
    };
  }

  if (config.email.smtpHost) {
    checks.emailService = {
      status: 'healthy',
      message: 'Email service configured',
    };
  }

  // System information
  const systemInfo = {
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    uptime: Math.round(process.uptime()),
    pid: process.pid,
    cpuUsage: process.cpuUsage(),
  };

  const totalResponseTime = Date.now() - startTime;

  const healthCheck = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    responseTime: totalResponseTime,
    checks,
    system: systemInfo,
    environment: config.env,
    version: config.appVersion,
    service: config.appTitle,
  };

  // Set appropriate status code
  const statusCode = overallStatus === 'healthy' ? 200 : 
                    overallStatus === 'degraded' ? 200 : 503;

  res.status(statusCode).json(healthCheck);
});

/**
 * Readiness probe endpoint
 * GET /health/ready
 */
router.get('/ready', async (req: Request, res: Response) => {
  try {
    // Check if the application is ready to serve requests
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    
    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString(),
      message: 'Application is ready to serve requests',
    });
  } catch (error) {
    res.status(503).json({
      status: 'not_ready',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Application is not ready to serve requests',
    });
  }
});

/**
 * Liveness probe endpoint
 * GET /health/live
 */
router.get('/live', (req: Request, res: Response) => {
  // Simple liveness check - if we can respond, we're alive
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    message: 'Application is alive',
  });
});

/**
 * Metrics endpoint (Prometheus compatible)
 * GET /health/metrics
 */
router.get('/metrics', (req: Request, res: Response) => {
  try {
    if (!config.monitoring.apmEnabled) {
      return res.status(404).json({
        error: 'Metrics collection is disabled',
        code: 'METRICS_DISABLED',
      });
    }

    const metrics = getMetrics();
    
    // Return metrics in JSON format by default
    // Can be extended to support Prometheus format
    res.status(200).json({
      status: 'success',
      timestamp: new Date().toISOString(),
      metrics,
    });
  } catch (error) {
    logger.error('Error fetching metrics:', error);
    res.status(500).json({
      error: 'Failed to fetch metrics',
      code: 'METRICS_ERROR',
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * Configuration endpoint (limited info for debugging)
 * GET /health/config
 */
router.get('/config', (req: Request, res: Response) => {
  // Only return non-sensitive configuration information
  const safeConfig = {
    environment: config.env,
    version: config.appVersion,
    service: config.appTitle,
    features: {
      aiAssistant: config.features.aiAssistant,
      realTimeNotifications: config.features.realTimeNotifications,
      auditLogging: config.features.auditLogging,
      fileSharing: config.features.fileSharing,
    },
    limits: {
      maxFileSize: config.storage.maxFileSize,
      allowedFileTypes: config.storage.allowedFileTypes.split(','),
    },
    business: {
      companyName: config.business.companyName,
      timezone: config.business.headquartersTimezone,
    },
  };

  res.status(200).json({
    status: 'success',
    timestamp: new Date().toISOString(),
    config: safeConfig,
  });
});

/**
 * Version endpoint
 * GET /health/version
 */
router.get('/version', (req: Request, res: Response) => {
  res.status(200).json({
    service: config.appTitle,
    version: config.appVersion,
    environment: config.env,
    nodeVersion: process.version,
    buildTime: new Date().toISOString(), // In real app, this would be build timestamp
    gitCommit: process.env.GIT_COMMIT || 'unknown',
    gitBranch: process.env.GIT_BRANCH || 'unknown',
  });
});

export default router;
