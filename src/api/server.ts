import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import { createClient } from '@supabase/supabase-js';
import { config } from './config';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth';
import { loggingMiddleware } from './middleware/logging';
import { metricsMiddleware } from './middleware/metrics';

// Route imports
import authRoutes from './routes/auth';
import biometricRoutes from './routes/biometric';
import usersRoutes from './routes/users';
import projectsRoutes from './routes/projects';
import tasksRoutes from './routes/tasks';
import timelineRoutes from './routes/timeline';
import kpisRoutes from './routes/kpis';
import commentsRoutes from './routes/comments';
import notificationsRoutes from './routes/notifications';
import searchRoutes from './routes/search';
import aiRoutes from './routes/ai';
import filesRoutes from './routes/files';
import auditRoutes from './routes/audit';
import healthRoutes from './routes/health';

// Initialize Supabase client
export const supabase = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Create Express app
const app = express();

// ============================================
// SECURITY MIDDLEWARE
// ============================================

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", config.supabase.url],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    error: 'Too many requests from this IP',
    code: 'RATE_LIMIT_EXCEEDED',
    retryAfter: Math.ceil(config.rateLimit.windowMs / 1000),
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health' || req.path === '/health/deep';
  },
});

app.use(limiter);

// ============================================
// GENERAL MIDDLEWARE
// ============================================

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
app.use(loggingMiddleware);

// Metrics collection
app.use(metricsMiddleware);

// ============================================
// API ROUTES
// ============================================

// Health checks (no auth required)
app.use('/health', healthRoutes);

// API v1 routes
const apiV1 = express.Router();

// Authentication routes (no auth middleware)
apiV1.use('/auth', authRoutes);

// Biometric routes (mixed auth requirements)
apiV1.use('/biometric', biometricRoutes);

// Protected routes (require authentication)
apiV1.use('/users', authMiddleware, usersRoutes);
apiV1.use('/projects', authMiddleware, projectsRoutes);
apiV1.use('/tasks', authMiddleware, tasksRoutes);
apiV1.use('/timeline', authMiddleware, timelineRoutes);
apiV1.use('/kpis', authMiddleware, kpisRoutes);
apiV1.use('/comments', authMiddleware, commentsRoutes);
apiV1.use('/notifications', authMiddleware, notificationsRoutes);
apiV1.use('/search', authMiddleware, searchRoutes);
apiV1.use('/ai', authMiddleware, aiRoutes);
apiV1.use('/files', authMiddleware, filesRoutes);
apiV1.use('/audit', authMiddleware, auditRoutes);

// Mount API routes
app.use('/api/v1', apiV1);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// ============================================
// SERVER STARTUP
// ============================================

const PORT = config.port || 3001;

export const startServer = () => {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Executive Portal API Server running on port ${PORT}`);
    console.log(`📊 Environment: ${config.env}`);
    console.log(`🔐 Security: ${config.security.helmet ? '✓' : '✗'} Helmet, ${config.security.cors ? '✓' : '✗'} CORS`);
    console.log(`⚡ Features: ${config.features.aiAssistant ? '✓' : '✗'} AI, ${config.features.realTimeNotifications ? '✓' : '✗'} RealTime`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('🔄 SIGTERM received, shutting down gracefully...');
    server.close(() => {
      console.log('✅ Server closed successfully');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('🔄 SIGINT received, shutting down gracefully...');
    server.close(() => {
      console.log('✅ Server closed successfully');
      process.exit(0);
    });
  });

  return server;
};

export default app;
