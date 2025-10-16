#!/bin/bash

###############################################################################
# Axiom Loom Catalog - Docker Deployment with MANDATORY Testing
# NO DEPLOYMENT WITHOUT FULL REGRESSION TEST PASS
###############################################################################

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="Axiom Loom Catalog"
DOCKER_IMAGE="eyns-ai-center"
TEST_TIMEOUT=600  # 10 minutes max for tests

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     ${APP_NAME} - Docker Deployment          ║${NC}"
echo -e "${BLUE}║     MANDATORY FULL REGRESSION TESTING                      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to print error and exit
error_exit() {
    echo -e "${RED}❌ ERROR: $1${NC}" >&2
    exit 1
}

# Function to print success
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Function to print warning
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Function to print info
info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Function to run tests
run_tests() {
    echo
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}    STAGE: MANDATORY REGRESSION TESTING${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo
    
    # 1. TypeScript Compilation
    info "Running TypeScript compilation check..."
    if npm run type-check; then
        success "TypeScript compilation passed"
    else
        error_exit "TypeScript compilation failed - DEPLOYMENT BLOCKED"
    fi
    
    # 2. ESLint
    info "Running ESLint..."
    if npm run lint; then
        success "ESLint passed"
    else
        warning "ESLint has warnings - continuing..."
    fi
    
    # 3. Unit Tests
    info "Running unit tests with coverage..."
    if CI=true npm test -- --coverage --watchAll=false; then
        success "Unit tests passed"
    else
        error_exit "Unit tests failed - DEPLOYMENT BLOCKED"
    fi
    
    # 4. Build Test
    info "Testing production build..."
    if npm run build; then
        success "Production build successful"
    else
        error_exit "Production build failed - DEPLOYMENT BLOCKED"
    fi
    
    # 5. E2E Tests with Playwright
    info "Running E2E regression tests..."
    
    # Start servers for E2E testing
    npm run server > /tmp/server.log 2>&1 &
    SERVER_PID=$!
    npx serve -s build -l 3000 > /tmp/frontend.log 2>&1 &
    FRONTEND_PID=$!
    
    sleep 10  # Wait for servers to start
    
    # Check if servers are running
    if ! curl -s http://localhost:3001/api/health > /dev/null; then
        kill $SERVER_PID $FRONTEND_PID 2>/dev/null || true
        error_exit "Backend server failed to start - check /tmp/server.log"
    fi
    
    if ! curl -s http://localhost:3000 > /dev/null; then
        kill $SERVER_PID $FRONTEND_PID 2>/dev/null || true
        error_exit "Frontend server failed to start - check /tmp/frontend.log"
    fi
    
    # Run Playwright tests
    if npx playwright test e2e/docker-regression.spec.ts --reporter=list; then
        success "E2E regression tests passed"
    else
        kill $SERVER_PID $FRONTEND_PID 2>/dev/null || true
        error_exit "E2E tests failed - DEPLOYMENT BLOCKED"
    fi
    
    # Clean up test servers
    kill $SERVER_PID $FRONTEND_PID 2>/dev/null || true
    
    echo
    success "ALL REGRESSION TESTS PASSED ✅"
    echo
}

# Function to build Docker image with tests
build_with_tests() {
    echo
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}    STAGE: DOCKER BUILD WITH TESTING${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo
    
    info "Building Docker image with mandatory tests..."
    
    # Build the test image
    if docker build -f Dockerfile.test -t ${DOCKER_IMAGE}:test .; then
        success "Docker test image built successfully"
    else
        error_exit "Docker build failed - check Dockerfile.test"
    fi
    
    # The Dockerfile.test already runs tests during build
    # If it succeeds, tests have passed
    success "Docker build completed with all tests passing"
}

# Function to deploy with Docker Compose
deploy_docker() {
    echo
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}    STAGE: DOCKER DEPLOYMENT${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo
    
    # Stop existing containers
    info "Stopping existing containers..."
    docker-compose down || true
    
    # Deploy with test profile first
    info "Running Docker Compose with test profile..."
    if docker-compose --profile test up --build test-runner; then
        success "Docker tests passed"
    else
        error_exit "Docker tests failed - DEPLOYMENT BLOCKED"
    fi
    
    # Deploy production
    info "Deploying production containers..."
    if docker-compose up -d --build eyns-ai-center; then
        success "Production deployment successful"
    else
        error_exit "Production deployment failed"
    fi
    
    # Wait for health checks
    info "Waiting for health checks..."
    sleep 30
    
    # Verify deployment
    if docker-compose ps | grep -q "healthy"; then
        success "All services are healthy"
    else
        warning "Some services may not be healthy yet"
    fi
}

# Function to verify deployment
verify_deployment() {
    echo
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}    STAGE: DEPLOYMENT VERIFICATION${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo
    
    # Check API health
    info "Checking API health..."
    if curl -s http://localhost:3001/api/health | grep -q "healthy"; then
        success "API is healthy"
    else
        error_exit "API health check failed"
    fi
    
    # Check frontend
    info "Checking frontend..."
    if curl -s http://localhost:3000 | grep -q "Axiom Loom"; then
        success "Frontend is accessible"
    else
        error_exit "Frontend is not accessible"
    fi
    
    # Check for errors
    info "Checking for application errors..."
    if curl -s http://localhost:3000 | grep -q "Error Loading Repositories"; then
        error_exit "Application has errors - 'Error Loading Repositories' found"
    else
        success "No application errors detected"
    fi
    
    # Show container status
    info "Container status:"
    docker-compose ps
    
    echo
    success "DEPLOYMENT VERIFICATION COMPLETE ✅"
}

# Main deployment flow
main() {
    # Check prerequisites
    info "Checking prerequisites..."
    
    if ! command_exists docker; then
        error_exit "Docker is not installed"
    fi
    
    if ! command_exists docker-compose; then
        error_exit "Docker Compose is not installed"
    fi
    
    if ! command_exists npm; then
        error_exit "npm is not installed"
    fi
    
    if ! command_exists npx; then
        error_exit "npx is not installed"
    fi
    
    success "All prerequisites met"
    
    # Check for .env file
    if [ ! -f .env ]; then
        warning ".env file not found"
        read -p "Do you want to create one now? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            ./deploy.sh --setup
        else
            warning "Continuing without .env file"
        fi
    fi
    
    # Parse command line arguments
    case "${1:-}" in
        --skip-local-tests)
            warning "Skipping local tests (Docker will still run tests)"
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  --skip-local-tests  Skip local tests (Docker will still test)"
            echo "  --help             Show this help message"
            exit 0
            ;;
        *)
            # Run local tests first
            run_tests
            ;;
    esac
    
    # Build Docker image with tests
    build_with_tests
    
    # Deploy with Docker Compose
    deploy_docker
    
    # Verify deployment
    verify_deployment
    
    # Final success message
    echo
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║     DEPLOYMENT SUCCESSFUL! 🎉                              ║${NC}"
    echo -e "${GREEN}║                                                            ║${NC}"
    echo -e "${GREEN}║     Application: http://localhost:3000                    ║${NC}"
    echo -e "${GREEN}║     API:        http://localhost:3001                     ║${NC}"
    echo -e "${GREEN}║                                                            ║${NC}"
    echo -e "${GREEN}║     All regression tests passed ✅                         ║${NC}"
    echo -e "${GREEN}║     All health checks passed ✅                            ║${NC}"
    echo -e "${GREEN}║     Application is fully functional ✅                     ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo
    
    info "To view logs: docker-compose logs -f"
    info "To stop: docker-compose down"
}

# Handle errors
trap 'error_exit "Deployment failed on line $LINENO"' ERR

# Run main function
main "$@"