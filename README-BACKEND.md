# Executive Portal - Backend API Documentation

🚀 **Production-ready backend API for the Executive Management Portal with enterprise-grade security, scalability, and AI features.**

## 🏗️ Architecture Overview

```mermaid
graph TB
    subgraph "Client Layer"
        FE[React Frontend]
        MOB[Mobile Apps]
        API_CLIENTS[API Clients]
    end

    subgraph "API Gateway"
        LB[Load Balancer]
        RATE[Rate Limiter]
        AUTH[Auth Middleware]
    end

    subgraph "Application Layer"
        API[Express API Server]
        WS[WebSocket Server]
        JOBS[Background Jobs]
    end

    subgraph "Services Layer"
        AI[AI Service]
        EMAIL[Email Service]
        FILE[File Storage]
        SEARCH[Search Service]
    end

    subgraph "Data Layer"
        DB[(Supabase/PostgreSQL)]
        REDIS[(Redis Cache)]
        S3[(Object Storage)]
    end

    subgraph "External Services"
        OPENAI[OpenAI API]
        SMTP[SMTP Server]
        MONITORING[Monitoring]
    end

    FE --> LB
    MOB --> LB
    API_CLIENTS --> LB
    
    LB --> RATE
    RATE --> AUTH
    AUTH --> API
    
    API --> AI
    API --> EMAIL
    API --> FILE
    API --> SEARCH
    API --> WS
    API --> JOBS
    
    API --> DB
    API --> REDIS
    FILE --> S3
    
    AI --> OPENAI
    EMAIL --> SMTP
    API --> MONITORING
```

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [Authentication & Security](#authentication--security)
- [Database Schema](#database-schema)
- [Environment Configuration](#environment-configuration)
- [Deployment](#deployment)
- [Monitoring & Observability](#monitoring--observability)
- [AI Features](#ai-features)
- [Development](#development)
- [Testing](#testing)
- [Contributing](#contributing)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- PostgreSQL 14+ (or Supabase account)
- Redis 6+ (for caching and sessions)
- Docker (optional, for containerized deployment)

### 1. Environment Setup

```bash
# Clone the repository
git clone https://github.com/aljeri-group/executive-portal.git
cd executive-portal

# Copy environment configuration
cp env.production.example .env.production
cp env.production.example .env.local

# Edit environment variables
nano .env.local
```

### 2. Database Setup

```bash
# Run the enhanced database schema
psql -h your-db-host -U your-user -d your-database -f database-schema-enhanced.sql

# Or if using Supabase, copy and paste the SQL into the SQL Editor
```

### 3. Install Dependencies

```bash
# Install API dependencies
cp api-package.json package.json
npm install

# Install frontend dependencies (if running full stack)
cp package.json.original package.json  # If you have the original
npm install
```

### 4. Start Development Server

```bash
# Start API server
npm run dev

# Start frontend (in another terminal)
npm run dev:frontend

# Or start both with Docker Compose
docker-compose up -d
```

### 5. Verify Installation

```bash
# Check API health
curl http://localhost:3001/health

# Check deep health
curl http://localhost:3001/health/deep

# Test authentication
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@aljeri.com","password":"your-password"}'
```

## 📚 API Documentation

### Base URL
- **Development**: `http://localhost:3001/api/v1`
- **Production**: `https://your-domain.com/api/v1`

### Core Endpoints

#### Authentication
```bash
POST /auth/register     # User registration
POST /auth/login        # User login
POST /auth/refresh      # Refresh access token
POST /auth/logout       # User logout
GET  /auth/me          # Get current user
POST /auth/validate    # Validate token
POST /auth/forgot-password  # Request password reset
POST /auth/reset-password   # Reset password
```

#### Users & Profiles
```bash
GET    /users           # List users (admin only)
GET    /users/:id       # Get user profile
PUT    /users/:id       # Update user profile
DELETE /users/:id       # Delete user (admin only)
POST   /users/:id/avatar # Upload avatar
```

#### Projects Management
```bash
GET    /projects        # List projects
POST   /projects        # Create project
GET    /projects/:id    # Get project details
PUT    /projects/:id    # Update project
DELETE /projects/:id    # Delete project
GET    /projects/:id/tasks    # Get project tasks
POST   /projects/:id/timeline # Add timeline event
```

#### KPIs & Analytics
```bash
GET    /kpis           # List KPIs
POST   /kpis           # Create KPI
GET    /kpis/:id       # Get KPI details
PUT    /kpis/:id       # Update KPI
GET    /kpis/trends    # Get KPI trends
GET    /kpis/analysis  # KPI analysis
```

#### AI Assistant
```bash
POST   /ai/query       # Submit AI query
GET    /ai/history     # Get query history
POST   /ai/insights    # Get AI insights
GET    /ai/anomalies   # Detect anomalies
```

#### Search
```bash
GET    /search?q=query # Global search
GET    /search/projects # Search projects
GET    /search/tasks   # Search tasks
```

#### Files & Storage
```bash
POST   /files/upload   # Upload file
GET    /files/:id      # Download file
DELETE /files/:id      # Delete file
GET    /files          # List files
```

### Response Format

All API responses follow this standard format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "requestId": "req_123456789"
}
```

Error responses:

```json
{
  "success": false,
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": { ... },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "requestId": "req_123456789"
}
```

## 🔐 Authentication & Security

### JWT Authentication

The API uses JWT tokens with the following structure:

```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "executive",
  "permissions": ["read:projects", "write:tasks"],
  "iat": 1640995200,
  "exp": 1641081600
}
```

### Role-Based Access Control (RBAC)

| Role | Access Level | Permissions |
|------|-------------|-------------|
| `board_chairman` | 10 | Full system access |
| `ceo` | 9 | All executive functions |
| `cfo` | 8 | Financial data + general |
| `cto` | 8 | Technical data + general |
| `executive` | 7 | General executive access |
| `board_member` | 6 | Board-level data |
| `admin` | 5 | System administration |
| `viewer` | 1 | Read-only access |

### Security Features

- ✅ **JWT with refresh tokens**
- ✅ **Rate limiting** (100 requests/15min)
- ✅ **CORS protection**
- ✅ **Helmet security headers**
- ✅ **Input validation** (Zod schemas)
- ✅ **SQL injection prevention**
- ✅ **XSS protection**
- ✅ **Session management**
- ✅ **Audit logging**
- ✅ **Failed login tracking**
- ✅ **Account lockout**
- ✅ **Password complexity**

### Authentication Flow

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Supabase
    participant Database

    Client->>API: POST /auth/login
    API->>Supabase: Verify credentials
    Supabase-->>API: User data
    API->>Database: Create session
    API-->>Client: JWT + Refresh Token
    
    Client->>API: API Request + JWT
    API->>API: Validate JWT
    API->>Database: Check session
    API-->>Client: Protected data
```

## 🗄️ Database Schema

### Core Tables

- **`users`** - User profiles and preferences
- **`projects`** - Project management data
- **`tasks`** - Task tracking
- **`timeline_events`** - Executive timeline
- **`kpis`** - Key Performance Indicators
- **`comments`** - Collaborative comments
- **`notifications`** - Real-time notifications
- **`ai_queries`** - AI assistant logs
- **`audit_logs`** - Security audit trail
- **`user_sessions`** - Session management
- **`files`** - File storage metadata

### Enhanced Features

- **Full-text search** with PostgreSQL tsvector
- **Row Level Security (RLS)** for data isolation
- **Audit triggers** for compliance
- **Soft deletes** for data recovery
- **Optimized indexes** for performance
- **JSON columns** for flexible data

### Sample Queries

```sql
-- Get executive dashboard data
SELECT * FROM public.executive_dashboard;

-- Search across all content
SELECT * FROM public.search_content('revenue growth', ARRAY['projects', 'kpis']);

-- Analyze KPI trends
SELECT * FROM public.analyze_kpi_trends('Total Revenue', 12);
```

## ⚙️ Environment Configuration

### Required Variables

```bash
# Application
NODE_ENV=production
PORT=3001
VITE_APP_TITLE=Executive Management Portal

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Security
JWT_SECRET=your-super-secure-jwt-secret
SESSION_SECRET=your-session-secret

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Redis
REDIS_URL=redis://localhost:6379

# AI Services
OPENAI_API_KEY=your-openai-key
```

### Optional Variables

```bash
# Email
SMTP_HOST=smtp.your-provider.com
SMTP_USER=your-email@company.com
SMTP_PASSWORD=your-password

# File Storage
S3_BUCKET=executive-portal-files
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key

# Monitoring
SENTRY_DSN=https://your-sentry-dsn
```

## 🚀 Deployment

### Docker Deployment

```bash
# Build images
docker build -f Dockerfile.api -t executive-portal-api .
docker build -t executive-portal-frontend .

# Run with Docker Compose
docker-compose up -d
```

### Kubernetes Deployment

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: executive-portal-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: executive-portal-api
  template:
    metadata:
      labels:
        app: executive-portal-api
    spec:
      containers:
      - name: api
        image: executive-portal-api:latest
        ports:
        - containerPort: 3001
        env:
        - name: NODE_ENV
          value: "production"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

### Cloud Deployment

#### Vercel (Frontend + API Routes)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Railway (Full Stack)
```bash
# Connect to Railway
railway login
railway link

# Deploy
railway up
```

#### AWS ECS/Fargate
```bash
# Build and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account.dkr.ecr.us-east-1.amazonaws.com
docker build -f Dockerfile.api -t executive-portal-api .
docker tag executive-portal-api:latest your-account.dkr.ecr.us-east-1.amazonaws.com/executive-portal-api:latest
docker push your-account.dkr.ecr.us-east-1.amazonaws.com/executive-portal-api:latest
```

## 📊 Monitoring & Observability

### Health Checks

- **`/health`** - Basic health check
- **`/health/deep`** - Comprehensive system check
- **`/health/ready`** - Kubernetes readiness probe
- **`/health/live`** - Kubernetes liveness probe
- **`/health/metrics`** - Performance metrics

### Logging

Structured JSON logging with multiple levels:

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "info",
  "message": "API Request",
  "requestId": "req_123456789",
  "method": "GET",
  "url": "/api/v1/projects",
  "userId": "user-uuid",
  "responseTime": 145,
  "statusCode": 200
}
```

### Metrics Collection

- **Request metrics** (count, duration, status codes)
- **Error tracking** (rate, types, stack traces)
- **Performance metrics** (response time percentiles)
- **Business metrics** (user activity, feature usage)
- **System metrics** (memory, CPU, database connections)

### Alerting

Configure alerts for:
- High error rates (>5%)
- Slow response times (>2s p95)
- Database connection issues
- Memory usage (>80%)
- Failed authentication attempts
- Critical security events

## 🤖 AI Features

### AI Assistant

The AI assistant provides executive-level insights through natural language queries:

```javascript
// Sample AI query
POST /api/v1/ai/query
{
  "query": "Give me a 3-line summary of revenue trend last quarter and two recommended actions",
  "context": {
    "timeframe": "Q4-2024",
    "departments": ["all"]
  }
}

// Response
{
  "success": true,
  "data": {
    "response": "Q4 2024 revenue increased 23% to $18.5M, driven by JTC logistics expansion (+$2.1M) and Energy sector growth (+$1.8M). Recommended actions: 1) Accelerate JTC fleet expansion to capture growing demand, 2) Diversify energy portfolio to reduce seasonal volatility.",
    "insights": [
      {
        "type": "trend",
        "title": "Positive Revenue Trend",
        "confidence": 0.92
      }
    ]
  }
}
```

### Anomaly Detection

Automated detection of unusual patterns in KPIs:

```javascript
// Anomaly detection
GET /api/v1/ai/anomalies?kpi=revenue&period=30d

{
  "anomalies": [
    {
      "date": "2024-01-10",
      "metric": "daily_revenue",
      "expected": 45000,
      "actual": 32000,
      "deviation": -28.9,
      "severity": "medium",
      "explanation": "Revenue drop coincides with system maintenance window"
    }
  ]
}
```

### KPI Explanations

AI-powered explanations for KPI changes:

```javascript
// Get KPI explanation
GET /api/v1/ai/insights/revenue-growth

{
  "explanation": {
    "summary": "Revenue growth accelerated due to three key factors",
    "factors": [
      {
        "factor": "JTC Fleet Expansion",
        "impact": "+15%",
        "confidence": 0.89
      },
      {
        "factor": "Energy Sector Demand",
        "impact": "+8%",
        "confidence": 0.76
      }
    ]
  }
}
```

## 🛠️ Development

### Project Structure

```
src/api/
├── config.ts              # Configuration management
├── server.ts              # Express server setup
├── middleware/             # Custom middleware
│   ├── auth.ts            # Authentication
│   ├── errorHandler.ts    # Error handling
│   ├── logging.ts         # Request logging
│   └── metrics.ts         # Performance metrics
├── routes/                # API route handlers
│   ├── auth.ts           # Authentication routes
│   ├── users.ts          # User management
│   ├── projects.ts       # Project management
│   ├── kpis.ts           # KPI management
│   ├── ai.ts             # AI assistant
│   └── health.ts         # Health checks
├── services/              # Business logic
│   ├── aiService.ts      # AI integration
│   ├── emailService.ts   # Email notifications
│   └── fileService.ts    # File management
├── utils/                 # Utility functions
│   ├── errors.ts         # Error classes
│   ├── logger.ts         # Logging utilities
│   └── validation.ts     # Input validation
└── types/                 # TypeScript definitions
    └── api.ts            # API type definitions
```

### Development Workflow

```bash
# Start development server with hot reload
npm run dev

# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Build for production
npm run build
```

### Code Style

- **TypeScript** with strict mode
- **ESLint** with TypeScript rules
- **Prettier** for code formatting
- **Husky** for git hooks
- **Conventional commits**

### Adding New Features

1. **Create feature branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Add route handler**
   ```typescript
   // src/api/routes/newFeature.ts
   import { Router } from 'express';
   import { asyncHandler } from '../middleware/errorHandler';
   
   const router = Router();
   
   router.get('/', asyncHandler(async (req, res) => {
     // Implementation
   }));
   
   export default router;
   ```

3. **Add to server**
   ```typescript
   // src/api/server.ts
   import newFeatureRoutes from './routes/newFeature';
   
   apiV1.use('/new-feature', authMiddleware, newFeatureRoutes);
   ```

4. **Add tests**
   ```typescript
   // src/api/routes/__tests__/newFeature.test.ts
   describe('New Feature API', () => {
     test('should handle feature request', async () => {
       // Test implementation
     });
   });
   ```

## 🧪 Testing

### Test Structure

```
src/api/__tests__/
├── unit/                  # Unit tests
│   ├── services/         # Service tests
│   ├── utils/            # Utility tests
│   └── middleware/       # Middleware tests
├── integration/           # Integration tests
│   ├── auth.test.ts      # Authentication flow
│   ├── projects.test.ts  # Project management
│   └── ai.test.ts        # AI features
└── e2e/                  # End-to-end tests
    ├── user-journey.test.ts
    └── api-workflow.test.ts
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- auth.test.ts

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e
```

### Test Examples

```typescript
// Unit test
describe('AuthService', () => {
  test('should validate JWT token', async () => {
    const token = generateTestToken();
    const result = await authService.validateToken(token);
    expect(result.valid).toBe(true);
  });
});

// Integration test
describe('POST /api/v1/auth/login', () => {
  test('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@example.com', password: 'password' });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.tokens).toBeDefined();
  });
});
```

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Clone your fork
3. Create feature branch
4. Make changes
5. Add tests
6. Run quality checks
7. Submit pull request

### Commit Guidelines

Use conventional commits:

```bash
feat: add AI anomaly detection
fix: resolve authentication timeout
docs: update API documentation
test: add integration tests for KPIs
refactor: optimize database queries
```

### Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new features
3. **Ensure CI passes** (tests, linting, security)
4. **Request review** from maintainers
5. **Address feedback** promptly

## 📞 Support

- **Documentation**: [GitHub Wiki](https://github.com/aljeri-group/executive-portal/wiki)
- **Issues**: [GitHub Issues](https://github.com/aljeri-group/executive-portal/issues)
- **Discussions**: [GitHub Discussions](https://github.com/aljeri-group/executive-portal/discussions)
- **Email**: dev@aljeri.com

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by Al Jeri Group for Executive Excellence**
