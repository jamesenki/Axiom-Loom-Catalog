#!/bin/bash

# AI Predictive Maintenance Engine - Development Environment Setup Script
# This script sets up a complete local development environment

set -euo pipefail

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project configuration
PROJECT_NAME="AI Predictive Maintenance Engine"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SERVICES_DIR="$PROJECT_DIR/services"
SCRIPTS_DIR="$PROJECT_DIR/scripts"

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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites for $PROJECT_NAME development environment..."
    
    local missing_deps=()
    
    # Check Docker
    if ! command_exists docker; then
        missing_deps+=("Docker")
    else
        log_success "Docker found: $(docker --version)"
    fi
    
    # Check Docker Compose
    if ! command_exists docker-compose && ! docker compose version >/dev/null 2>&1; then
        missing_deps+=("Docker Compose")
    else
        if command_exists docker-compose; then
            log_success "Docker Compose found: $(docker-compose --version)"
        else
            log_success "Docker Compose found: $(docker compose version)"
        fi
    fi
    
    # Check Node.js
    if ! command_exists node; then
        missing_deps+=("Node.js (v18+)")
    else
        local node_version=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$node_version" -lt 18 ]; then
            log_error "Node.js version 18+ required, found: $(node --version)"
            missing_deps+=("Node.js (v18+)")
        else
            log_success "Node.js found: $(node --version)"
        fi
    fi
    
    # Check Python
    if ! command_exists python3; then
        missing_deps+=("Python 3.8+")
    else
        local python_version=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1,2)
        local major=$(echo $python_version | cut -d'.' -f1)
        local minor=$(echo $python_version | cut -d'.' -f2)
        if [ "$major" -lt 3 ] || ([ "$major" -eq 3 ] && [ "$minor" -lt 8 ]); then
            log_error "Python 3.8+ required, found: $(python3 --version)"
            missing_deps+=("Python 3.8+")
        else
            log_success "Python found: $(python3 --version)"
        fi
    fi
    
    # Check npm
    if ! command_exists npm; then
        missing_deps+=("npm")
    else
        log_success "npm found: $(npm --version)"
    fi
    
    # Check pip
    if ! command_exists pip3; then
        missing_deps+=("pip3")
    else
        log_success "pip3 found: $(pip3 --version)"
    fi
    
    # Check git
    if ! command_exists git; then
        missing_deps+=("git")
    else
        log_success "git found: $(git --version)"
    fi
    
    # Check jq (optional but recommended)
    if ! command_exists jq; then
        log_warning "jq not found (optional for JSON processing)"
    else
        log_success "jq found: $(jq --version)"
    fi
    
    # Check curl
    if ! command_exists curl; then
        missing_deps+=("curl")
    else
        log_success "curl found: $(curl --version | head -n1)"
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        log_error "Missing required dependencies:"
        for dep in "${missing_deps[@]}"; do
            echo "  - $dep"
        done
        echo
        echo "Please install the missing dependencies and run this script again."
        echo
        echo "Installation guides:"
        echo "  - Docker: https://docs.docker.com/get-docker/"
        echo "  - Node.js: https://nodejs.org/"
        echo "  - Python: https://www.python.org/downloads/"
        echo "  - Git: https://git-scm.com/downloads"
        exit 1
    fi
    
    log_success "All prerequisites satisfied!"
}

# Create project directory structure
setup_directory_structure() {
    log_info "Setting up project directory structure..."
    
    local dirs=(
        "services/api-gateway"
        "services/ai-prediction-engine"
        "services/data-ingestion"
        "services/sovd-integration"
        "services/notification-service"
        "services/analytics-service"
        "services/auth-service"
        "services/mock-services/sovd-mock"
        "services/mock-services/vehicle-simulator"
        "infrastructure/docker"
        "infrastructure/kubernetes"
        "infrastructure/terraform"
        "database/migrations"
        "database/seeds"
        "test-data/vehicles"
        "test-data/components"
        "test-data/sovd"
        "test-data/ai-models"
        "config/development"
        "config/staging"
        "config/production"
        "logs"
        "volumes/postgres-data"
        "volumes/redis-data"
        "volumes/influxdb-data"
        "volumes/model-storage"
    )
    
    for dir in "${dirs[@]}"; do
        mkdir -p "$PROJECT_DIR/$dir"
    done
    
    log_success "Directory structure created"
}

# Setup environment variables
setup_environment_variables() {
    log_info "Setting up environment variables..."
    
    local env_file="$PROJECT_DIR/.env.local"
    
    if [ ! -f "$env_file" ]; then
        if [ -f "$PROJECT_DIR/.env.example" ]; then
            cp "$PROJECT_DIR/.env.example" "$env_file"
            log_success "Created .env.local from .env.example"
        else
            # Create default environment file
            cat > "$env_file" << 'EOF'
# AI Predictive Maintenance Engine - Local Development Environment

# Application Configuration
NODE_ENV=development
LOG_LEVEL=debug
API_PORT=3000
AI_ENGINE_PORT=3001
SOVD_INTEGRATION_PORT=3002

# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=ai_pm_engine_dev
POSTGRES_USER=dev_user
POSTGRES_PASSWORD=dev_password

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0

# InfluxDB Configuration (Time Series Data)
INFLUXDB_HOST=localhost
INFLUXDB_PORT=8086
INFLUXDB_TOKEN=dev_token_change_in_production
INFLUXDB_ORG=ai_pm_engine
INFLUXDB_BUCKET=vehicle_diagnostics

# SOVD Configuration
SOVD_MOCK_URL=http://localhost:8080
SOVD_PROTOCOL_VERSION=1.0.0
SOVD_CLIENT_ID=ai_pm_engine_dev
SOVD_CLIENT_SECRET=dev_secret_change_in_production

# AI/ML Configuration
AI_MODEL_STORAGE_PATH=./volumes/model-storage
TENSORFLOW_SERVING_URL=http://localhost:8501
MLFLOW_TRACKING_URI=http://localhost:5000

# Authentication Configuration
JWT_SECRET=dev_jwt_secret_change_in_production
JWT_EXPIRES_IN=24h
OAUTH_CLIENT_ID=ai_pm_engine_dev
OAUTH_CLIENT_SECRET=dev_oauth_secret

# External Services
NOTIFICATION_SERVICE_URL=http://localhost:3003
ANALYTICS_SERVICE_URL=http://localhost:3004

# Feature Flags
ENABLE_AI_PREDICTIONS=true
ENABLE_REAL_TIME_STREAMING=true
ENABLE_SOVD_INTEGRATION=true
ENABLE_MOCK_DATA_GENERATION=true

# Development Tools
ENABLE_SWAGGER_UI=true
ENABLE_GRAPHQL_PLAYGROUND=true
ENABLE_DEBUG_LOGGING=true
EOF
            log_success "Created default .env.local file"
        fi
    else
        log_info ".env.local already exists, skipping creation"
    fi
    
    log_warning "Please review and update .env.local with your specific configuration"
}

# Setup databases
setup_databases() {
    log_info "Setting up development databases..."
    
    # Check if Docker is running
    if ! docker info >/dev/null 2>&1; then
        log_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    
    # Start database services
    cd "$PROJECT_DIR"
    
    if [ -f "docker-compose.yml" ]; then
        log_info "Starting database services with Docker Compose..."
        docker-compose up -d postgres redis influxdb
        
        # Wait for databases to be ready
        log_info "Waiting for databases to be ready..."
        sleep 15
        
        # Check PostgreSQL
        if docker-compose exec -T postgres pg_isready -U dev_user -d ai_pm_engine_dev >/dev/null 2>&1; then
            log_success "PostgreSQL is ready"
        else
            log_warning "PostgreSQL may not be fully ready yet"
        fi
        
        # Check Redis
        if docker-compose exec -T redis redis-cli ping >/dev/null 2>&1; then
            log_success "Redis is ready"
        else
            log_warning "Redis may not be fully ready yet"
        fi
        
        log_success "Database services started"
    else
        log_warning "docker-compose.yml not found, skipping database setup"
    fi
}

# Run database migrations
run_database_migrations() {
    log_info "Running database migrations..."
    
    local migrations_dir="$PROJECT_DIR/database/migrations"
    
    if [ -d "$migrations_dir" ] && [ "$(ls -A $migrations_dir)" ]; then
        if [ -f "$SCRIPTS_DIR/database/migrate.sh" ]; then
            chmod +x "$SCRIPTS_DIR/database/migrate.sh"
            "$SCRIPTS_DIR/database/migrate.sh"
            log_success "Database migrations completed"
        else
            log_warning "Migration script not found, skipping migrations"
        fi
    else
        log_info "No migrations found, skipping"
    fi
}

# Seed development data
seed_development_data() {
    log_info "Seeding development data..."
    
    if [ -f "$SCRIPTS_DIR/database/seed-dev-data.sh" ]; then
        chmod +x "$SCRIPTS_DIR/database/seed-dev-data.sh"
        "$SCRIPTS_DIR/database/seed-dev-data.sh"
        log_success "Development data seeded"
    else
        log_warning "Seed script not found, skipping data seeding"
    fi
}

# Setup SOVD mock server
setup_sovd_mock() {
    log_info "Setting up SOVD mock server..."
    
    cd "$PROJECT_DIR"
    
    if [ -f "docker-compose.yml" ]; then
        docker-compose up -d sovd-mock
        sleep 5
        
        # Setup mock data
        if [ -f "$SCRIPTS_DIR/sovd/setup-mock-data.sh" ]; then
            chmod +x "$SCRIPTS_DIR/sovd/setup-mock-data.sh"
            "$SCRIPTS_DIR/sovd/setup-mock-data.sh"
            log_success "SOVD mock server configured"
        else
            log_warning "SOVD mock setup script not found"
        fi
    else
        log_warning "docker-compose.yml not found, skipping SOVD mock setup"
    fi
}

# Install Node.js dependencies
install_node_dependencies() {
    log_info "Installing Node.js dependencies..."
    
    cd "$PROJECT_DIR"
    
    if [ -f "package.json" ]; then
        npm install
        log_success "Node.js dependencies installed"
    else
        log_info "No package.json found in root, checking service directories..."
        
        for service_dir in "$SERVICES_DIR"/*; do
            if [ -d "$service_dir" ] && [ -f "$service_dir/package.json" ]; then
                log_info "Installing dependencies for $(basename "$service_dir")..."
                cd "$service_dir"
                npm install
                cd "$PROJECT_DIR"
            fi
        done
    fi
}

# Install Python dependencies
install_python_dependencies() {
    log_info "Installing Python dependencies..."
    
    cd "$PROJECT_DIR"
    
    # Create virtual environment if it doesn't exist
    if [ ! -d "venv" ]; then
        log_info "Creating Python virtual environment..."
        python3 -m venv venv
    fi
    
    # Activate virtual environment
    source venv/bin/activate
    
    # Upgrade pip
    pip install --upgrade pip
    
    # Install requirements
    if [ -f "requirements.txt" ]; then
        pip install -r requirements.txt
        log_success "Production Python dependencies installed"
    fi
    
    if [ -f "requirements-dev.txt" ]; then
        pip install -r requirements-dev.txt
        log_success "Development Python dependencies installed"
    fi
    
    # Install AI/ML specific requirements
    if [ -f "requirements-ai.txt" ]; then
        pip install -r requirements-ai.txt
        log_success "AI/ML Python dependencies installed"
    fi
    
    deactivate
}

# Setup AI/ML models and tools
setup_ai_ml_tools() {
    log_info "Setting up AI/ML tools and model storage..."
    
    cd "$PROJECT_DIR"
    
    # Start MLflow tracking server
    if [ -f "docker-compose.yml" ]; then
        docker-compose up -d mlflow
        log_success "MLflow tracking server started"
    fi
    
    # Start TensorFlow Serving
    if [ -f "docker-compose.yml" ]; then
        docker-compose up -d tensorflow-serving
        log_success "TensorFlow Serving started"
    fi
    
    # Create model storage directories
    mkdir -p volumes/model-storage/{tensorflow,pytorch,onnx,mlflow}
    log_success "Model storage directories created"
}

# Setup development tools
setup_development_tools() {
    log_info "Setting up development tools..."
    
    # Install global development tools
    if command_exists npm; then
        # Install Newman for API testing
        if ! command_exists newman; then
            npm install -g newman newman-reporter-htmlextra
            log_success "Newman CLI installed for API testing"
        fi
        
        # Install nodemon for development
        if ! npm list -g nodemon >/dev/null 2>&1; then
            npm install -g nodemon
            log_success "Nodemon installed for development"
        fi
    fi
    
    # Setup pre-commit hooks if available
    if [ -f ".pre-commit-config.yaml" ] && command_exists pre-commit; then
        pre-commit install
        log_success "Pre-commit hooks installed"
    fi
}

# Verify installation
verify_installation() {
    log_info "Verifying installation..."
    
    local errors=0
    
    # Check if databases are accessible
    if command_exists docker-compose; then
        cd "$PROJECT_DIR"
        
        # Check PostgreSQL
        if ! docker-compose exec -T postgres pg_isready -U dev_user -d ai_pm_engine_dev >/dev/null 2>&1; then
            log_error "PostgreSQL is not accessible"
            ((errors++))
        else
            log_success "PostgreSQL connection verified"
        fi
        
        # Check Redis
        if ! docker-compose exec -T redis redis-cli ping >/dev/null 2>&1; then
            log_error "Redis is not accessible"
            ((errors++))
        else
            log_success "Redis connection verified"
        fi
        
        # Check SOVD mock server
        if ! curl -s "http://localhost:8080/health" >/dev/null 2>&1; then
            log_warning "SOVD mock server may not be running"
        else
            log_success "SOVD mock server is accessible"
        fi
    fi
    
    # Check environment file
    if [ -f "$PROJECT_DIR/.env.local" ]; then
        log_success "Environment configuration file exists"
    else
        log_error "Environment configuration file missing"
        ((errors++))
    fi
    
    return $errors
}

# Display next steps
show_next_steps() {
    log_success "Development environment setup completed!"
    echo
    echo "🚀 Next Steps:"
    echo "1. Review and update .env.local with your specific configuration"
    echo "2. Start the development servers:"
    echo "   cd $PROJECT_DIR"
    echo "   npm run dev          # Start all services in development mode"
    echo "   # OR"
    echo "   docker-compose up -d # Start all services with Docker"
    echo
    echo "3. Access the application:"
    echo "   - API Gateway: http://localhost:3000"
    echo "   - AI Engine: http://localhost:3001"
    echo "   - SOVD Integration: http://localhost:3002"
    echo "   - SOVD Mock Server: http://localhost:8080"
    echo "   - MLflow UI: http://localhost:5000"
    echo "   - PostgreSQL: localhost:5432"
    echo "   - Redis: localhost:6379"
    echo "   - InfluxDB: http://localhost:8086"
    echo
    echo "4. Run tests:"
    echo "   npm test             # Run unit tests"
    echo "   npm run test:e2e     # Run end-to-end tests"
    echo "   ./scripts/run-api-tests.sh test-all development"
    echo
    echo "5. Development commands:"
    echo "   npm run lint         # Run code linting"
    echo "   npm run format       # Format code"
    echo "   npm run build        # Build for production"
    echo
    echo "📚 Documentation:"
    echo "   - API Documentation: http://localhost:3000/docs"
    echo "   - GraphQL Playground: http://localhost:3000/graphql"
    echo "   - Architecture Docs: docs/architecture/"
    echo "   - Getting Started: docs/getting-started/"
    echo
    echo "🔧 Troubleshooting:"
    echo "   - Check logs: docker-compose logs [service-name]"
    echo "   - Restart services: docker-compose restart"
    echo "   - Clean environment: ./scripts/development/clean.sh"
    echo
}

# Main setup function
main() {
    echo "=========================================="
    echo "   $PROJECT_NAME"
    echo "   Development Environment Setup"
    echo "=========================================="
    echo
    
    # Change to project directory
    cd "$PROJECT_DIR"
    
    # Run setup steps
    check_prerequisites
    setup_directory_structure
    setup_environment_variables
    setup_databases
    run_database_migrations
    seed_development_data
    setup_sovd_mock
    install_node_dependencies
    install_python_dependencies
    setup_ai_ml_tools
    setup_development_tools
    
    # Verify installation
    if verify_installation; then
        show_next_steps
    else
        log_error "Some verification checks failed. Please review the output above."
        exit 1
    fi
}

# Handle script arguments
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [OPTIONS]"
        echo
        echo "Options:"
        echo "  --help, -h          Show this help message"
        echo "  --check-only        Only check prerequisites"
        echo "  --databases-only    Only setup databases"
        echo "  --dependencies-only Only install dependencies"
        echo
        echo "This script sets up a complete development environment for the"
        echo "AI Predictive Maintenance Engine including databases, services,"
        echo "dependencies, and development tools."
        exit 0
        ;;
    --check-only)
        check_prerequisites
        exit 0
        ;;
    --databases-only)
        check_prerequisites
        setup_databases
        run_database_migrations
        seed_development_data
        exit 0
        ;;
    --dependencies-only)
        check_prerequisites
        install_node_dependencies
        install_python_dependencies
        exit 0
        ;;
    "")
        main
        ;;
    *)
        log_error "Unknown option: $1"
        echo "Use --help for usage information"
        exit 1
        ;;
esac
