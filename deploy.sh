#!/bin/bash

# Executive Management Portal - Deployment Script
# This script automates the deployment process for both Vercel and Docker deployments

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DEPLOYMENT_TYPE=${1:-"vercel"}  # vercel or docker
ENVIRONMENT=${2:-"production"}  # production or staging
DOMAIN=${3:-""}                # Custom domain for deployment

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    # Check Node.js version
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        log_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

check_environment_variables() {
    log_info "Checking environment variables..."
    
    if [ ! -f ".env.${ENVIRONMENT}" ]; then
        log_warning "Environment file .env.${ENVIRONMENT} not found"
        if [ -f "env.${ENVIRONMENT}.example" ]; then
            log_info "Copying example environment file..."
            cp "env.${ENVIRONMENT}.example" ".env.${ENVIRONMENT}"
            log_warning "Please edit .env.${ENVIRONMENT} with your actual values before continuing"
            exit 1
        else
            log_error "No environment file found. Please create .env.${ENVIRONMENT}"
            exit 1
        fi
    fi
    
    # Source environment variables
    source ".env.${ENVIRONMENT}"
    
    # Check required variables
    REQUIRED_VARS=("VITE_SUPABASE_URL" "VITE_SUPABASE_ANON_KEY" "VITE_APP_TITLE")
    
    for var in "${REQUIRED_VARS[@]}"; do
        if [ -z "${!var}" ]; then
            log_error "Required environment variable $var is not set"
            exit 1
        fi
    done
    
    log_success "Environment variables check passed"
}

install_dependencies() {
    log_info "Installing dependencies..."
    npm ci
    log_success "Dependencies installed"
}

run_tests() {
    log_info "Running tests..."
    
    # Run linting
    log_info "Running ESLint..."
    npm run lint
    
    # Run type checking
    log_info "Running TypeScript type checking..."
    npx tsc --noEmit
    
    log_success "All tests passed"
}

build_application() {
    log_info "Building application..."
    
    # Set build environment
    export NODE_ENV=production
    
    # Build the application
    npm run build
    
    log_success "Application built successfully"
}

deploy_vercel() {
    log_info "Deploying to Vercel..."
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        log_info "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    # Check if logged in to Vercel
    if ! vercel whoami &> /dev/null; then
        log_info "Please log in to Vercel..."
        vercel login
    fi
    
    # Deploy to Vercel
    if [ "$ENVIRONMENT" = "production" ]; then
        vercel --prod
    else
        vercel
    fi
    
    log_success "Deployed to Vercel successfully"
}

deploy_docker() {
    log_info "Deploying with Docker..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Build Docker images
    log_info "Building Docker images..."
    docker-compose build
    
    # Start services
    log_info "Starting services..."
    docker-compose up -d
    
    # Wait for services to be healthy
    log_info "Waiting for services to be healthy..."
    sleep 30
    
    # Check health
    if curl -f http://localhost/health &> /dev/null; then
        log_success "Application is healthy"
    else
        log_warning "Application health check failed, but deployment completed"
    fi
    
    log_success "Deployed with Docker successfully"
}

setup_database() {
    log_info "Setting up database..."
    
    # Check if Supabase CLI is installed
    if ! command -v supabase &> /dev/null; then
        log_info "Installing Supabase CLI..."
        npm install -g supabase
    fi
    
    # Check if logged in to Supabase
    if ! supabase status &> /dev/null; then
        log_info "Please log in to Supabase..."
        supabase login
    fi
    
    # Apply database migrations
    log_info "Applying database schema..."
    
    # Note: In a real deployment, you would run these in Supabase SQL Editor
    log_warning "Please manually run the following SQL files in Supabase SQL Editor:"
    log_warning "1. database-schema.sql"
    log_warning "2. setup-database.sql"
    log_warning "3. add-phone-numbers.sql"
    
    log_success "Database setup instructions provided"
}

run_health_checks() {
    log_info "Running health checks..."
    
    if [ "$DEPLOYMENT_TYPE" = "docker" ]; then
        # Check Docker services
        if docker-compose ps | grep -q "Up"; then
            log_success "Docker services are running"
        else
            log_error "Some Docker services are not running"
            exit 1
        fi
        
        # Check application health
        if curl -f http://localhost/health &> /dev/null; then
            log_success "Application health check passed"
        else
            log_error "Application health check failed"
            exit 1
        fi
    fi
    
    log_success "All health checks passed"
}

cleanup() {
    log_info "Cleaning up..."
    
    # Remove build artifacts
    rm -rf dist/
    
    # Clean npm cache
    npm cache clean --force
    
    log_success "Cleanup completed"
}

# Main deployment function
main() {
    log_info "Starting deployment process..."
    log_info "Deployment type: $DEPLOYMENT_TYPE"
    log_info "Environment: $ENVIRONMENT"
    
    # Run deployment steps
    check_prerequisites
    check_environment_variables
    install_dependencies
    run_tests
    build_application
    
    if [ "$DEPLOYMENT_TYPE" = "vercel" ]; then
        deploy_vercel
    elif [ "$DEPLOYMENT_TYPE" = "docker" ]; then
        deploy_docker
        run_health_checks
    else
        log_error "Invalid deployment type. Use 'vercel' or 'docker'"
        exit 1
    fi
    
    setup_database
    cleanup
    
    log_success "Deployment completed successfully!"
    
    if [ "$DEPLOYMENT_TYPE" = "vercel" ]; then
        log_info "Your application is now deployed on Vercel"
    elif [ "$DEPLOYMENT_TYPE" = "docker" ]; then
        log_info "Your application is now running on Docker"
        log_info "Access it at: http://localhost"
    fi
}

# Help function
show_help() {
    echo "Executive Management Portal - Deployment Script"
    echo ""
    echo "Usage: $0 [DEPLOYMENT_TYPE] [ENVIRONMENT] [DOMAIN]"
    echo ""
    echo "Arguments:"
    echo "  DEPLOYMENT_TYPE    Deployment method: 'vercel' or 'docker' (default: vercel)"
    echo "  ENVIRONMENT        Environment: 'production' or 'staging' (default: production)"
    echo "  DOMAIN            Custom domain for deployment (optional)"
    echo ""
    echo "Examples:"
    echo "  $0 vercel production"
    echo "  $0 docker production"
    echo "  $0 vercel staging"
    echo ""
    echo "Prerequisites:"
    echo "  - Node.js 18+"
    echo "  - npm"
    echo "  - For Vercel: Vercel CLI and account"
    echo "  - For Docker: Docker and Docker Compose"
    echo ""
}

# Check for help flag
if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    show_help
    exit 0
fi

# Run main function
main
