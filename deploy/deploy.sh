#!/bin/bash

# EYNS AI Experience Center Deployment Script
# Usage: ./deploy.sh [environment] [action]
# Example: ./deploy.sh staging deploy

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
APP_NAME="eyns-ai-experience-center"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
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

# Help function
show_help() {
    cat << EOF
EYNS AI Experience Center Deployment Script

Usage: $0 [ENVIRONMENT] [ACTION]

ENVIRONMENTS:
    local       - Local development deployment
    staging     - Staging environment deployment  
    production  - Production environment deployment

ACTIONS:
    build       - Build the application
    deploy      - Deploy to specified environment
    rollback    - Rollback to previous version
    status      - Check deployment status
    logs        - View deployment logs
    test        - Run post-deployment tests

Examples:
    $0 staging deploy
    $0 production rollback
    $0 local build
    $0 staging status

EOF
}

# Validate inputs
validate_inputs() {
    local env=$1
    local action=$2
    
    if [[ ! "$env" =~ ^(local|staging|production)$ ]]; then
        log_error "Invalid environment: $env"
        show_help
        exit 1
    fi
    
    if [[ ! "$action" =~ ^(build|deploy|rollback|status|logs|test)$ ]]; then
        log_error "Invalid action: $action"
        show_help
        exit 1
    fi
}

# Check prerequisites
check_prerequisites() {
    local env=$1
    
    log_info "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed"
        exit 1
    fi
    
    # Check Docker for non-local deployments
    if [[ "$env" != "local" ]] && ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1
    fi
    
    # Check kubectl for Kubernetes deployments
    if [[ "$env" == "production" ]] && ! command -v kubectl &> /dev/null; then
        log_warning "kubectl not found - Kubernetes deployment will not be available"
    fi
    
    log_success "Prerequisites check passed"
}

# Build application
build_app() {
    local env=$1
    
    log_info "Building application for $env environment..."
    
    cd "$PROJECT_ROOT"
    
    # Install dependencies
    log_info "Installing dependencies..."
    npm ci
    
    # Run tests
    log_info "Running tests..."
    npm run test:ci
    
    # Run linting
    log_info "Running linting..."
    npm run lint
    
    # Type checking
    log_info "Running type check..."
    npm run type-check
    
    # Set environment
    if [[ -f ".env.$env" ]]; then
        cp ".env.$env" ".env.local"
        log_info "Environment file .env.$env copied to .env.local"
    fi
    
    # Build application
    log_info "Building React application..."
    npm run build
    
    # Build Docker image for non-local environments
    if [[ "$env" != "local" ]]; then
        log_info "Building Docker image..."
        docker build -t "$APP_NAME:$env" -t "$APP_NAME:latest" .
        log_success "Docker image built: $APP_NAME:$env"
    fi
    
    log_success "Build completed successfully"
}

# Deploy to local environment
deploy_local() {
    log_info "Deploying to local environment..."
    
    cd "$PROJECT_ROOT"
    
    # Start development server
    log_info "Starting development server..."
    npm run dev &
    DEV_PID=$!
    
    log_success "Local deployment started"
    log_info "Application available at: http://localhost:3000"
    log_info "API available at: http://localhost:3001"
    log_info "To stop: kill $DEV_PID"
}

# Deploy to staging environment
deploy_staging() {
    log_info "Deploying to staging environment..."
    
    cd "$PROJECT_ROOT"
    
    # Deploy with Docker Compose
    log_info "Starting staging deployment with Docker Compose..."
    docker-compose -f deploy/docker-compose.staging.yml up -d
    
    # Wait for services to be ready
    log_info "Waiting for services to be ready..."
    sleep 10
    
    # Health check
    if curl -f http://localhost:8080/health &> /dev/null; then
        log_success "Staging deployment successful"
        log_info "Application available at: http://localhost:8080"
    else
        log_error "Staging deployment failed - health check failed"
        exit 1
    fi
}

# Deploy to production environment
deploy_production() {
    log_info "Deploying to production environment..."
    
    # Confirm production deployment
    read -p "Are you sure you want to deploy to PRODUCTION? (yes/no): " confirm
    if [[ "$confirm" != "yes" ]]; then
        log_info "Production deployment cancelled"
        exit 0
    fi
    
    # Check if kubectl is available
    if command -v kubectl &> /dev/null; then
        log_info "Deploying to Kubernetes..."
        kubectl apply -f "$SCRIPT_DIR/k8s-deployment.yaml"
        
        # Wait for rollout
        kubectl rollout status deployment/$APP_NAME
        
        log_success "Production deployment to Kubernetes completed"
    else
        log_warning "kubectl not available, using Docker deployment..."
        docker run -d -p 8080:8080 --name "$APP_NAME-prod" "$APP_NAME:production"
        log_success "Production deployment with Docker completed"
    fi
}

# Rollback deployment
rollback_deployment() {
    local env=$1
    
    log_info "Rolling back $env deployment..."
    
    case "$env" in
        "staging")
            docker-compose -f deploy/docker-compose.staging.yml down
            # Here you would restore previous version
            log_info "Staging rollback completed"
            ;;
        "production")
            if command -v kubectl &> /dev/null; then
                kubectl rollout undo deployment/$APP_NAME
                log_success "Production rollback completed"
            else
                log_error "Rollback requires kubectl for production"
                exit 1
            fi
            ;;
        *)
            log_error "Rollback not supported for $env environment"
            exit 1
            ;;
    esac
}

# Check deployment status
check_status() {
    local env=$1
    
    log_info "Checking $env deployment status..."
    
    case "$env" in
        "local")
            if pgrep -f "npm.*start" &> /dev/null; then
                log_success "Local development server is running"
            else
                log_warning "Local development server is not running"
            fi
            ;;
        "staging")
            if docker-compose -f deploy/docker-compose.staging.yml ps | grep -q "Up"; then
                log_success "Staging deployment is running"
                docker-compose -f deploy/docker-compose.staging.yml ps
            else
                log_warning "Staging deployment is not running"
            fi
            ;;
        "production")
            if command -v kubectl &> /dev/null; then
                kubectl get deployment $APP_NAME
                kubectl get pods -l app=$APP_NAME
            else
                if docker ps | grep -q "$APP_NAME-prod"; then
                    log_success "Production container is running"
                    docker ps --filter name="$APP_NAME-prod"
                else
                    log_warning "Production container is not running"
                fi
            fi
            ;;
    esac
}

# View deployment logs
view_logs() {
    local env=$1
    
    log_info "Viewing $env deployment logs..."
    
    case "$env" in
        "staging")
            docker-compose -f deploy/docker-compose.staging.yml logs -f
            ;;
        "production")
            if command -v kubectl &> /dev/null; then
                kubectl logs -l app=$APP_NAME -f
            else
                docker logs -f "$APP_NAME-prod"
            fi
            ;;
        *)
            log_error "Logs not available for $env environment"
            exit 1
            ;;
    esac
}

# Run post-deployment tests
run_tests() {
    local env=$1
    
    log_info "Running post-deployment tests for $env..."
    
    cd "$PROJECT_ROOT"
    
    # Determine test URL
    case "$env" in
        "local")
            TEST_URL="http://localhost:3000"
            ;;
        "staging")
            TEST_URL="http://localhost:8080"
            ;;
        "production")
            TEST_URL="https://eyns-ai-center.example.com"
            ;;
    esac
    
    # Run E2E tests
    log_info "Running E2E tests against $TEST_URL..."
    BASE_URL="$TEST_URL" npm run test:e2e
    
    log_success "Post-deployment tests completed"
}

# Main execution
main() {
    local env=$1
    local action=$2
    
    # Show help if no arguments
    if [[ $# -eq 0 ]]; then
        show_help
        exit 0
    fi
    
    # Validate inputs
    validate_inputs "$env" "$action"
    
    # Check prerequisites
    check_prerequisites "$env"
    
    # Execute action
    case "$action" in
        "build")
            build_app "$env"
            ;;
        "deploy")
            build_app "$env"
            case "$env" in
                "local")
                    deploy_local
                    ;;
                "staging")
                    deploy_staging
                    ;;
                "production")
                    deploy_production
                    ;;
            esac
            ;;
        "rollback")
            rollback_deployment "$env"
            ;;
        "status")
            check_status "$env"
            ;;
        "logs")
            view_logs "$env"
            ;;
        "test")
            run_tests "$env"
            ;;
    esac
}

# Execute main function with all arguments
main "$@"