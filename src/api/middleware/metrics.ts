import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { config } from '../config';

// In-memory metrics storage (in production, use Redis or proper metrics store)
interface MetricsData {
  requests: {
    total: number;
    byMethod: Record<string, number>;
    byStatus: Record<string, number>;
    byEndpoint: Record<string, number>;
  };
  responseTime: {
    total: number;
    count: number;
    average: number;
    min: number;
    max: number;
    p95: number[];
  };
  errors: {
    total: number;
    byType: Record<string, number>;
    rate: number;
  };
  users: {
    active: Set<string>;
    requests: Record<string, number>;
  };
  system: {
    memory: {
      rss: number;
      heapUsed: number;
      heapTotal: number;
      external: number;
    };
    uptime: number;
    timestamp: number;
  };
}

const metrics: MetricsData = {
  requests: {
    total: 0,
    byMethod: {},
    byStatus: {},
    byEndpoint: {},
  },
  responseTime: {
    total: 0,
    count: 0,
    average: 0,
    min: Infinity,
    max: 0,
    p95: [],
  },
  errors: {
    total: 0,
    byType: {},
    rate: 0,
  },
  users: {
    active: new Set(),
    requests: {},
  },
  system: {
    memory: {
      rss: 0,
      heapUsed: 0,
      heapTotal: 0,
      external: 0,
    },
    uptime: 0,
    timestamp: Date.now(),
  },
};

/**
 * Metrics collection middleware
 */
export const metricsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();
  
  // Skip metrics for health checks and metrics endpoint
  if (req.path === '/health' || req.path === '/health/deep' || req.path === '/metrics') {
    return next();
  }
  
  // Increment total requests
  metrics.requests.total++;
  
  // Track by method
  metrics.requests.byMethod[req.method] = (metrics.requests.byMethod[req.method] || 0) + 1;
  
  // Track by endpoint (sanitized)
  const endpoint = sanitizeEndpoint(req.path);
  metrics.requests.byEndpoint[endpoint] = (metrics.requests.byEndpoint[endpoint] || 0) + 1;
  
  // Track active users
  if (req.user?.id) {
    metrics.users.active.add(req.user.id);
    metrics.users.requests[req.user.id] = (metrics.users.requests[req.user.id] || 0) + 1;
  }
  
  // Track response metrics when request completes
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    
    // Track response time
    updateResponseTimeMetrics(responseTime);
    
    // Track by status code
    const statusGroup = `${Math.floor(res.statusCode / 100)}xx`;
    metrics.requests.byStatus[statusGroup] = (metrics.requests.byStatus[statusGroup] || 0) + 1;
    
    // Track errors
    if (res.statusCode >= 400) {
      metrics.errors.total++;
      const errorType = getErrorType(res.statusCode);
      metrics.errors.byType[errorType] = (metrics.errors.byType[errorType] || 0) + 1;
      
      // Calculate error rate (errors in last 100 requests)
      const recentRequests = Math.min(metrics.requests.total, 100);
      const recentErrors = Object.values(metrics.errors.byType)
        .reduce((sum, count) => sum + Math.min(count, recentRequests), 0);
      metrics.errors.rate = (recentErrors / recentRequests) * 100;
    }
    
    // Log metrics periodically
    if (metrics.requests.total % 100 === 0) {
      logMetricsSummary();
    }
  });
  
  next();
};

/**
 * Update response time metrics
 */
const updateResponseTimeMetrics = (responseTime: number) => {
  metrics.responseTime.total += responseTime;
  metrics.responseTime.count++;
  metrics.responseTime.average = metrics.responseTime.total / metrics.responseTime.count;
  metrics.responseTime.min = Math.min(metrics.responseTime.min, responseTime);
  metrics.responseTime.max = Math.max(metrics.responseTime.max, responseTime);
  
  // Keep last 1000 response times for percentile calculation
  metrics.responseTime.p95.push(responseTime);
  if (metrics.responseTime.p95.length > 1000) {
    metrics.responseTime.p95.shift();
  }
};

/**
 * Sanitize endpoint for metrics (remove dynamic segments)
 */
const sanitizeEndpoint = (path: string): string => {
  return path
    .replace(/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '/:id') // UUIDs
    .replace(/\/\d+/g, '/:id') // Numeric IDs
    .replace(/\/[a-zA-Z0-9]{20,}/g, '/:token') // Long tokens
    .substring(0, 100); // Limit length
};

/**
 * Get error type from status code
 */
const getErrorType = (statusCode: number): string => {
  if (statusCode >= 400 && statusCode < 500) {
    switch (statusCode) {
      case 400: return 'bad_request';
      case 401: return 'unauthorized';
      case 403: return 'forbidden';
      case 404: return 'not_found';
      case 409: return 'conflict';
      case 422: return 'validation_error';
      case 429: return 'rate_limited';
      default: return 'client_error';
    }
  } else if (statusCode >= 500) {
    switch (statusCode) {
      case 500: return 'internal_error';
      case 502: return 'bad_gateway';
      case 503: return 'service_unavailable';
      case 504: return 'gateway_timeout';
      default: return 'server_error';
    }
  }
  return 'unknown';
};

/**
 * Update system metrics
 */
const updateSystemMetrics = () => {
  const memoryUsage = process.memoryUsage();
  metrics.system.memory = {
    rss: memoryUsage.rss,
    heapUsed: memoryUsage.heapUsed,
    heapTotal: memoryUsage.heapTotal,
    external: memoryUsage.external,
  };
  metrics.system.uptime = process.uptime();
  metrics.system.timestamp = Date.now();
};

/**
 * Calculate 95th percentile response time
 */
const calculateP95ResponseTime = (): number => {
  if (metrics.responseTime.p95.length === 0) return 0;
  
  const sorted = [...metrics.responseTime.p95].sort((a, b) => a - b);
  const index = Math.ceil(sorted.length * 0.95) - 1;
  return sorted[index] || 0;
};

/**
 * Log metrics summary
 */
const logMetricsSummary = () => {
  updateSystemMetrics();
  
  logger.info('Metrics summary', {
    requests: {
      total: metrics.requests.total,
      methods: metrics.requests.byMethod,
      status: metrics.requests.byStatus,
      topEndpoints: getTopEndpoints(5),
    },
    performance: {
      avgResponseTime: Math.round(metrics.responseTime.average),
      minResponseTime: metrics.responseTime.min === Infinity ? 0 : metrics.responseTime.min,
      maxResponseTime: metrics.responseTime.max,
      p95ResponseTime: Math.round(calculateP95ResponseTime()),
    },
    errors: {
      total: metrics.errors.total,
      rate: Math.round(metrics.errors.rate * 100) / 100,
      types: metrics.errors.byType,
    },
    users: {
      activeCount: metrics.users.active.size,
      topUsers: getTopUsers(5),
    },
    system: {
      memoryMB: {
        rss: Math.round(metrics.system.memory.rss / 1024 / 1024),
        heapUsed: Math.round(metrics.system.memory.heapUsed / 1024 / 1024),
        heapTotal: Math.round(metrics.system.memory.heapTotal / 1024 / 1024),
      },
      uptimeMinutes: Math.round(metrics.system.uptime / 60),
    },
  });
};

/**
 * Get top endpoints by request count
 */
const getTopEndpoints = (limit: number) => {
  return Object.entries(metrics.requests.byEndpoint)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .reduce((acc, [endpoint, count]) => {
      acc[endpoint] = count;
      return acc;
    }, {} as Record<string, number>);
};

/**
 * Get top users by request count
 */
const getTopUsers = (limit: number) => {
  return Object.entries(metrics.users.requests)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .reduce((acc, [userId, count]) => {
      acc[userId] = count;
      return acc;
    }, {} as Record<string, number>);
};

/**
 * Get all metrics (for /metrics endpoint)
 */
export const getMetrics = () => {
  updateSystemMetrics();
  
  return {
    ...metrics,
    responseTime: {
      ...metrics.responseTime,
      p95: calculateP95ResponseTime(),
    },
    users: {
      activeCount: metrics.users.active.size,
      totalRequests: Object.keys(metrics.users.requests).length,
    },
    timestamp: new Date().toISOString(),
  };
};

/**
 * Reset metrics (useful for testing or periodic resets)
 */
export const resetMetrics = () => {
  metrics.requests = {
    total: 0,
    byMethod: {},
    byStatus: {},
    byEndpoint: {},
  };
  metrics.responseTime = {
    total: 0,
    count: 0,
    average: 0,
    min: Infinity,
    max: 0,
    p95: [],
  };
  metrics.errors = {
    total: 0,
    byType: {},
    rate: 0,
  };
  metrics.users = {
    active: new Set(),
    requests: {},
  };
  updateSystemMetrics();
};

/**
 * Start periodic metrics logging
 */
export const startMetricsCollection = () => {
  if (!config.monitoring.apmEnabled) {
    return;
  }
  
  // Log metrics every 5 minutes
  setInterval(() => {
    logMetricsSummary();
  }, 5 * 60 * 1000);
  
  // Clean up old active users every hour
  setInterval(() => {
    // In a real implementation, you'd track last seen time and remove inactive users
    // For now, we'll just clear the set periodically
    if (metrics.users.active.size > 1000) {
      metrics.users.active.clear();
    }
  }, 60 * 60 * 1000);
  
  logger.info('Metrics collection started');
};

/**
 * Prometheus-style metrics formatter (if needed)
 */
export const formatPrometheusMetrics = (): string => {
  const metricsData = getMetrics();
  
  let output = '';
  
  // HTTP requests total
  output += '# HELP http_requests_total Total number of HTTP requests\n';
  output += '# TYPE http_requests_total counter\n';
  Object.entries(metricsData.requests.byMethod).forEach(([method, count]) => {
    output += `http_requests_total{method="${method}"} ${count}\n`;
  });
  
  // HTTP request duration
  output += '\n# HELP http_request_duration_seconds HTTP request duration in seconds\n';
  output += '# TYPE http_request_duration_seconds histogram\n';
  output += `http_request_duration_seconds_sum ${metricsData.responseTime.total / 1000}\n`;
  output += `http_request_duration_seconds_count ${metricsData.responseTime.count}\n`;
  
  // Error rate
  output += '\n# HELP http_error_rate HTTP error rate percentage\n';
  output += '# TYPE http_error_rate gauge\n';
  output += `http_error_rate ${metricsData.errors.rate}\n`;
  
  // Memory usage
  output += '\n# HELP process_memory_bytes Process memory usage in bytes\n';
  output += '# TYPE process_memory_bytes gauge\n';
  output += `process_memory_bytes{type="rss"} ${metricsData.system.memory.rss}\n`;
  output += `process_memory_bytes{type="heap_used"} ${metricsData.system.memory.heapUsed}\n`;
  output += `process_memory_bytes{type="heap_total"} ${metricsData.system.memory.heapTotal}\n`;
  
  return output;
};

export default metricsMiddleware;
