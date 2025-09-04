# Executive Management & Board Portal - Deployment Plan

## Overview

The Executive Management & Board Portal is a modern web application built with React 18, Vite, and TypeScript. It features executive dashboards, embedded Power BI reports, bilingual (Arabic/English) interfaces with RTL support, voice-command navigation, biometric/WebAuthn authentication, multiple layouts, and Supabase integration.

## Key Features

- **Frontend**: React 18 + Vite + TypeScript
- **Authentication**: Supabase Auth + WebAuthn/Biometric
- **Database**: PostgreSQL (via Supabase)
- **Internationalization**: Arabic/English with RTL support
- **Integrations**: Power BI, Azure AD SSO
- **Voice Control**: Voice-command navigation
- **Multiple Layouts**: Minimalist, Simplified, World-Class designs
- **Backend API**: Node.js/Express (optional)

## Environment Variables

Create `.env.local` (development) or `.env.production` (production) by copying `env.example`:

### Required Variables

```bash
# Application
VITE_APP_TITLE="Executive Management Portal"

# Supabase Configuration
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# JWT Configuration
JWT_SECRET="your-jwt-secret-key"

# Database (for self-hosted API)
DATABASE_URL="postgresql://user:password@host:port/database"
```

### Optional Variables

```bash
# Power BI Integration
VITE_POWERBI_TENANT_ID="your-tenant-id"
VITE_POWERBI_CLIENT_ID="your-client-id"
VITE_POWERBI_WORKSPACE_ID="your-workspace-id"
VITE_POWERBI_REPORT_ID="your-report-id"

# Azure AD SSO
AZURE_AD_CLIENT_ID="your-azure-client-id"
AZURE_AD_CLIENT_SECRET="your-azure-client-secret"
AZURE_AD_TENANT_ID="your-azure-tenant-id"

# Redis (for caching)
REDIS_URL="redis://localhost:6379"

# AI Integration
OPENAI_API_KEY="your-openai-key"

# Email Service
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@domain.com"
SMTP_PASS="your-app-password"

# Object Storage
S3_BUCKET="your-bucket-name"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"

# Monitoring
SENTRY_DSN="your-sentry-dsn"
```

## Deployment Paths

### Path A: Vercel + Supabase (Recommended)

**Best for**: Quick deployment, managed infrastructure, automatic scaling

#### Prerequisites
- Node.js 18+
- npm
- Vercel account
- Supabase account

#### Step 1: Repository Setup
1. Fork or import the repository to your GitHub account
2. Connect your repository to Vercel
3. Vercel will auto-detect the Vite configuration from `vercel.json`

#### Step 2: Supabase Project Setup
1. Create a new project at [supabase.com](https://supabase.com)
2. Note your project URL and API keys:
   - `SUPABASE_URL`: Found in Settings > API
   - `SUPABASE_ANON_KEY`: Found in Settings > API
   - `SUPABASE_SERVICE_ROLE_KEY`: Found in Settings > API

#### Step 3: Database Initialization
Run these SQL files in order in Supabase SQL Editor:

1. **Core Schema**: `database-schema.sql`
2. **Setup Data**: `setup-database.sql`
3. **Phone Numbers**: `add-phone-numbers.sql`

```sql
-- Example: Run in Supabase SQL Editor
-- 1. First run database-schema.sql
-- 2. Then run setup-database.sql
-- 3. Finally run add-phone-numbers.sql
```

#### Step 4: Deploy Supabase Functions
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Deploy functions
supabase functions deploy request-signatures
supabase functions deploy sign
```

#### Step 5: Configure Environment Variables

**In Vercel Dashboard:**
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_TITLE=Executive Management Portal
VITE_POWERBI_TENANT_ID=your-tenant-id
VITE_POWERBI_CLIENT_ID=your-client-id
VITE_POWERBI_WORKSPACE_ID=your-workspace-id
VITE_POWERBI_REPORT_ID=your-report-id
```

**In Supabase Dashboard (Settings > API):**
```bash
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-jwt-secret
```

#### Step 6: Deploy
1. Push to main branch triggers production deployment
2. Pull requests create preview deployments
3. Monitor deployment in Vercel dashboard

#### Step 7: Configure CORS
In Supabase Dashboard > Settings > API:
- Add your Vercel domain to allowed origins
- Example: `https://your-app.vercel.app`

### Path B: Docker + VPS (Self-Hosted)

**Best for**: Full control, custom infrastructure, compliance requirements

#### Prerequisites
- Ubuntu 22.04 LTS server
- Docker & Docker Compose
- Domain name with DNS access
- SSL certificate (Let's Encrypt)

#### Step 1: Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Nginx (if not using Docker for reverse proxy)
sudo apt install nginx -y
```

#### Step 2: Clone and Build
```bash
# Clone repository
git clone https://github.com/your-username/Executive-Management-Portal.git
cd Executive-Management-Portal

# Create environment file
cp env.example .env.production
# Edit .env.production with your values

# Build Docker image
docker build -t executive-portal .
```

#### Step 3: Database Setup
Choose one option:

**Option 1: Use Supabase (Recommended)**
- Follow Supabase setup from Path A
- Use Supabase URL and keys in environment

**Option 2: Self-hosted PostgreSQL**
```bash
# Run PostgreSQL in Docker
docker run -d \
  --name postgres \
  -e POSTGRES_DB=executive_portal \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=secure_password \
  -p 5432:5432 \
  postgres:15

# Apply database schema
psql -h localhost -U admin -d executive_portal -f database-schema.sql
```

#### Step 4: Deploy with Docker Compose
Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "80:80"
    environment:
      - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
      - VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
      - VITE_APP_TITLE=${VITE_APP_TITLE}
    volumes:
      - ./logs:/var/log/nginx
    restart: unless-stopped

  api:
    build:
      context: .
      dockerfile: Dockerfile.api
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - JWT_SECRET=${JWT_SECRET}
      - DATABASE_URL=${DATABASE_URL}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
    restart: unless-stopped
    depends_on:
      - postgres

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=executive_portal
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

Deploy:
```bash
docker-compose up -d
```

#### Step 5: SSL Certificate
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### Step 6: Nginx Configuration
Update `/etc/nginx/sites-available/default`:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/ {
        proxy_pass http://localhost:3001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Optional Integrations

### Azure AD SSO Setup
1. Follow `AZURE_AD_SETUP_GUIDE.md`
2. Register application in Azure Portal
3. Configure redirect URIs
4. Store client ID and secret in environment variables

### Power BI Integration
1. Follow Power BI setup guides:
   - `POWERBI_SETUP.md`
   - `POWERBI_WORKSPACE_SETUP.md`
   - `POWERBI_TOKEN_SETUP.md`
2. Create service principal
3. Configure workspace permissions
4. Add Power BI variables to environment

## CI/CD Pipeline

### GitHub Actions (Recommended)
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run build

  deploy-vercel:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### Docker Registry
```bash
# Build and push to registry
docker build -t your-registry/executive-portal:latest .
docker push your-registry/executive-portal:latest

# Deploy to server
docker pull your-registry/executive-portal:latest
docker-compose up -d
```

## Runbook and Acceptance Tests

### Pre-Deployment Checklist
- [ ] Environment variables configured
- [ ] Database schema applied
- [ ] SSL certificates valid
- [ ] DNS records pointing to server
- [ ] Backup of current deployment (if updating)

### Post-Deployment Tests

#### 1. Basic Functionality
```bash
# Health check
curl -f https://your-domain.com/health

# API health check
curl -f https://your-domain.com/api/health
```

#### 2. Authentication Flow
- [ ] Login page loads correctly
- [ ] Supabase authentication works
- [ ] WebAuthn/biometric login functions
- [ ] Token refresh works
- [ ] Logout clears session

#### 3. Routing & SPA
- [ ] Deep links work (e.g., `/dashboard`, `/timeline`, `/kanban`)
- [ ] Browser back/forward navigation works
- [ ] 404 errors redirect to index.html

#### 4. Internationalization
- [ ] Language switcher toggles between English/Arabic
- [ ] RTL layout displays correctly in Arabic
- [ ] No layout issues during language switch

#### 5. Power BI Integration (if enabled)
- [ ] Power BI reports load
- [ ] Embed tokens refresh automatically
- [ ] No client-side secrets exposed

#### 6. Performance
- [ ] First meaningful paint < 2 seconds
- [ ] Charts render smoothly (Recharts)
- [ ] No console errors
- [ ] Lighthouse score > 90

### Monitoring Setup

#### Health Endpoints
- `/health` - Basic health check
- `/api/health` - API health check
- `/api/health/deep` - Deep health check with database
- `/api/health/live` - Liveness probe

#### Logging
```bash
# View application logs
docker-compose logs -f app

# View API logs
docker-compose logs -f api

# View Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

#### Metrics
- Response times
- Error rates
- Database connection pool
- Memory usage
- CPU usage

## Security Considerations

### Environment Security
- [ ] All secrets stored in environment variables
- [ ] No hardcoded credentials in code
- [ ] Regular secret rotation
- [ ] Least privilege access

### Network Security
- [ ] HTTPS enforced
- [ ] HSTS headers enabled
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Firewall rules configured

### Application Security
- [ ] Security headers implemented
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF protection

## Rollback Procedures

### Vercel Deployment
1. Go to Vercel dashboard
2. Navigate to Deployments
3. Find previous stable deployment
4. Click "Promote to Production"

### Docker Deployment
```bash
# Rollback to previous image
docker-compose down
docker pull your-registry/executive-portal:previous-tag
# Update docker-compose.yml with previous tag
docker-compose up -d
```

### Database Rollback
```bash
# Restore from backup
pg_restore -h localhost -U admin -d executive_portal backup.sql

# Or restore specific tables
psql -h localhost -U admin -d executive_portal -c "DROP TABLE IF EXISTS table_name;"
psql -h localhost -U admin -d executive_portal -f table_backup.sql
```

## Maintenance Tasks

### Regular Tasks
- [ ] Update dependencies monthly
- [ ] Rotate secrets quarterly
- [ ] Review and update SSL certificates
- [ ] Monitor disk space and logs
- [ ] Backup database weekly

### Performance Optimization
- [ ] Monitor Core Web Vitals
- [ ] Optimize images and assets
- [ ] Implement CDN if needed
- [ ] Database query optimization
- [ ] Caching strategy review

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Database Connection Issues
```bash
# Check connection
psql -h localhost -U admin -d executive_portal -c "SELECT 1;"

# Check Supabase connection
curl -H "apikey: your-anon-key" https://your-project.supabase.co/rest/v1/
```

#### Authentication Issues
- Verify Supabase URL and keys
- Check CORS configuration
- Validate JWT secret
- Review browser console for errors

#### Power BI Issues
- Verify tenant ID and client ID
- Check workspace permissions
- Validate report ID
- Review embed token generation

### Support Resources
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [React Documentation](https://react.dev)
- [Power BI Embedding](https://docs.microsoft.com/en-us/power-bi/developer/embedded/)

---

## Quick Start Commands

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Docker
```bash
docker build -t executive-portal .
docker run -p 80:80 executive-portal
```

### Database Setup
```bash
# Apply schema
psql -h localhost -U admin -d executive_portal -f database-schema.sql
```

This deployment plan provides comprehensive guidance for deploying the Executive Management & Board Portal in both managed and self-hosted environments, with detailed procedures for setup, testing, monitoring, and maintenance.
