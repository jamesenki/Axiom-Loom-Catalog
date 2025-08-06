#!/bin/bash

# EYNS AI Experience Center Docker Deployment Script
# Enhanced deployment script with multi-environment support
# Usage: ./deploy-docker.sh [environment] [action]

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
APP_NAME="eyns-ai-experience-center"
DOCKER_REGISTRY="${DOCKER_REGISTRY:-}"
VERSION="${VERSION:-latest}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
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

log_step() {
    echo -e "${PURPLE}[STEP]${NC} $1"
}

# Help function
show_help() {
    cat << EOF
EYNS AI Experience Center Docker Deployment Script

Usage: $0 [ENVIRONMENT] [ACTION] [OPTIONS]

ENVIRONMENTS:
    local       - Local/LAN deployment (accessible from network)
    staging     - Staging environment deployment  
    production  - Production environment deployment
    cloud-aws   - Deploy to AWS ECS/EKS
    cloud-azure - Deploy to Azure Container Instances/AKS
    cloud-gcp   - Deploy to Google Cloud Run/GKE

ACTIONS:
    build       - Build Docker images
    deploy      - Deploy to specified environment
    stop        - Stop deployment
    restart     - Restart deployment
    status      - Check deployment status
    logs        - View deployment logs
    shell       - Access container shell
    backup      - Backup data volumes
    restore     - Restore data volumes
    cleanup     - Clean up resources

OPTIONS:
    --no-cache  - Build without cache
    --pull      - Always pull latest base images
    --scale=N   - Scale services (production only)
    --tag=TAG   - Custom image tag

Examples:
    $0 local deploy
    $0 staging restart
    $0 production deploy --scale=3
    $0 cloud-aws deploy --tag=v1.2.3

EOF
}

# Parse command line options
parse_options() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --no-cache)
                BUILD_ARGS="$BUILD_ARGS --no-cache"
                shift
                ;;
            --pull)
                BUILD_ARGS="$BUILD_ARGS --pull"
                shift
                ;;
            --scale=*)
                SCALE_COUNT="${1#*=}"
                shift
                ;;
            --tag=*)
                VERSION="${1#*=}"
                shift
                ;;
            *)
                shift
                ;;
        esac
    done
}

# Check prerequisites
check_prerequisites() {
    local env=$1
    
    log_step "Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed"
        exit 1
    fi
    
    # Check Docker daemon
    if ! docker info &> /dev/null; then
        log_error "Docker daemon is not running"
        exit 1
    fi
    
    # Check environment file
    if [[ "$env" != "local" ]] && [[ ! -f "$PROJECT_ROOT/.env.$env" ]]; then
        log_warning "Environment file .env.$env not found"
        log_info "Creating from example..."
        cp "$PROJECT_ROOT/.env.example" "$PROJECT_ROOT/.env.$env"
    fi
    
    # Check for cloud CLI tools if needed
    case "$env" in
        "cloud-aws")
            if ! command -v aws &> /dev/null; then
                log_error "AWS CLI is not installed"
                exit 1
            fi
            ;;
        "cloud-azure")
            if ! command -v az &> /dev/null; then
                log_error "Azure CLI is not installed"
                exit 1
            fi
            ;;
        "cloud-gcp")
            if ! command -v gcloud &> /dev/null; then
                log_error "Google Cloud SDK is not installed"
                exit 1
            fi
            ;;
    esac
    
    log_success "Prerequisites check passed"
}

# Load environment variables
load_environment() {
    local env=$1
    
    log_step "Loading environment configuration..."
    
    # Load base environment
    if [[ -f "$PROJECT_ROOT/.env" ]]; then
        export $(cat "$PROJECT_ROOT/.env" | grep -v '^#' | xargs)
    fi
    
    # Load environment-specific variables
    if [[ -f "$PROJECT_ROOT/.env.$env" ]]; then
        export $(cat "$PROJECT_ROOT/.env.$env" | grep -v '^#' | xargs)
        log_success "Loaded .env.$env configuration"
    fi
    
    # Set compose file based on environment
    case "$env" in
        "local")
            export COMPOSE_FILE="docker-compose.local.yml"
            ;;
        "staging")
            export COMPOSE_FILE="docker-compose.yml"
            ;;
        "production")
            export COMPOSE_FILE="docker-compose.production.yml"
            ;;
        *)
            export COMPOSE_FILE="docker-compose.yml"
            ;;
    esac
}

# Build Docker images
build_images() {
    local env=$1
    
    log_step "Building Docker images for $env environment..."
    
    cd "$PROJECT_ROOT"
    
    # Build images
    log_info "Building backend image..."
    docker build $BUILD_ARGS -t "$APP_NAME-backend:$VERSION" -f Dockerfile.backend .
    
    log_info "Building frontend image..."
    docker build $BUILD_ARGS -t "$APP_NAME-frontend:$VERSION" -f Dockerfile \
        --build-arg REACT_APP_API_URL="${REACT_APP_API_URL:-http://localhost:3001}" \
        --build-arg REACT_APP_ENVIRONMENT="$env" .
    
    # Tag images for registry if specified
    if [[ -n "$DOCKER_REGISTRY" ]]; then
        log_info "Tagging images for registry..."
        docker tag "$APP_NAME-backend:$VERSION" "$DOCKER_REGISTRY/$APP_NAME-backend:$VERSION"
        docker tag "$APP_NAME-frontend:$VERSION" "$DOCKER_REGISTRY/$APP_NAME-frontend:$VERSION"
    fi
    
    log_success "Docker images built successfully"
}

# Deploy application
deploy_app() {
    local env=$1
    
    log_step "Deploying to $env environment..."
    
    cd "$PROJECT_ROOT"
    
    # Create necessary directories
    mkdir -p logs cache cloned-repositories
    
    # Deploy with Docker Compose
    log_info "Starting deployment with Docker Compose..."
    docker-compose -f "$COMPOSE_FILE" up -d
    
    # Scale services if specified (production only)
    if [[ "$env" == "production" ]] && [[ -n "$SCALE_COUNT" ]]; then
        log_info "Scaling backend to $SCALE_COUNT instances..."
        docker-compose -f "$COMPOSE_FILE" up -d --scale backend=$SCALE_COUNT
    fi
    
    # Wait for services to be healthy
    log_info "Waiting for services to be healthy..."
    local retries=30
    while [ $retries -gt 0 ]; do
        if docker-compose -f "$COMPOSE_FILE" ps | grep -q "unhealthy"; then
            log_info "Waiting for services... ($retries retries left)"
            sleep 5
            retries=$((retries-1))
        else
            break
        fi
    done
    
    # Perform health check
    if health_check "$env"; then
        log_success "Deployment successful!"
        show_access_urls "$env"
    else
        log_error "Deployment failed - health check failed"
        docker-compose -f "$COMPOSE_FILE" logs --tail=50
        exit 1
    fi
}

# Health check
health_check() {
    local env=$1
    local health_url=""
    
    case "$env" in
        "local")
            health_url="http://localhost/health"
            ;;
        "staging"|"production")
            health_url="http://localhost/health"
            ;;
        *)
            health_url="http://localhost/health"
            ;;
    esac
    
    log_info "Performing health check on $health_url..."
    
    if curl -f -s "$health_url" > /dev/null; then
        return 0
    else
        return 1
    fi
}

# Show access URLs
show_access_urls() {
    local env=$1
    
    echo ""
    log_success "=== Access URLs ==="
    
    case "$env" in
        "local")
            log_info "Application: http://localhost"
            log_info "Alternative: http://localhost:8080"
            log_info "API: http://localhost:3001"
            log_info "MongoDB: mongodb://localhost:27017"
            log_info "Redis: redis://localhost:6379"
            
            # Show LAN access IPs
            local lan_ip=$(hostname -I | awk '{print $1}')
            if [[ -n "$lan_ip" ]]; then
                echo ""
                log_info "LAN Access: http://$lan_ip"
                log_info "LAN API: http://$lan_ip:3001"
            fi
            ;;
        "staging")
            log_info "Application: http://localhost"
            log_info "API: http://localhost:3001"
            ;;
        "production")
            log_info "Application: https://${DOMAIN:-localhost}"
            log_info "API: https://${DOMAIN:-localhost}/api"
            log_info "Prometheus: http://localhost:9090"
            log_info "Grafana: http://localhost:3000"
            ;;
    esac
    
    echo ""
}

# Stop deployment
stop_deployment() {
    local env=$1
    
    log_step "Stopping $env deployment..."
    
    cd "$PROJECT_ROOT"
    docker-compose -f "$COMPOSE_FILE" down
    
    log_success "Deployment stopped"
}

# Restart deployment
restart_deployment() {
    local env=$1
    
    log_step "Restarting $env deployment..."
    
    stop_deployment "$env"
    sleep 2
    deploy_app "$env"
}

# Check deployment status
check_status() {
    local env=$1
    
    log_step "Checking $env deployment status..."
    
    cd "$PROJECT_ROOT"
    
    echo ""
    docker-compose -f "$COMPOSE_FILE" ps
    
    echo ""
    log_info "Container health status:"
    docker-compose -f "$COMPOSE_FILE" ps --format "table {{.Name}}\t{{.Status}}\t{{.Health}}"
    
    echo ""
    log_info "Resource usage:"
    docker stats --no-stream $(docker-compose -f "$COMPOSE_FILE" ps -q)
}

# View logs
view_logs() {
    local env=$1
    local service=$2
    
    log_step "Viewing logs for $env deployment..."
    
    cd "$PROJECT_ROOT"
    
    if [[ -n "$service" ]]; then
        docker-compose -f "$COMPOSE_FILE" logs -f "$service"
    else
        docker-compose -f "$COMPOSE_FILE" logs -f
    fi
}

# Access container shell
access_shell() {
    local env=$1
    local service=${2:-backend}
    
    log_step "Accessing $service shell..."
    
    cd "$PROJECT_ROOT"
    docker-compose -f "$COMPOSE_FILE" exec "$service" /bin/sh
}

# Backup data volumes
backup_data() {
    local env=$1
    local backup_dir="$PROJECT_ROOT/backups/$(date +%Y%m%d_%H%M%S)"
    
    log_step "Backing up data volumes..."
    
    mkdir -p "$backup_dir"
    
    # Backup MongoDB
    log_info "Backing up MongoDB..."
    docker-compose -f "$COMPOSE_FILE" exec -T mongodb mongodump --archive > "$backup_dir/mongodb.archive"
    
    # Backup Redis
    log_info "Backing up Redis..."
    docker-compose -f "$COMPOSE_FILE" exec -T redis redis-cli BGSAVE
    sleep 5
    docker cp $(docker-compose -f "$COMPOSE_FILE" ps -q redis):/data/dump.rdb "$backup_dir/redis.rdb"
    
    # Backup volumes
    log_info "Backing up volumes..."
    docker run --rm -v eyns-${env}-backend-logs:/data -v "$backup_dir":/backup alpine tar czf /backup/backend-logs.tar.gz -C /data .
    
    log_success "Backup completed: $backup_dir"
}

# Clean up resources
cleanup_resources() {
    local env=$1
    
    log_step "Cleaning up resources..."
    
    cd "$PROJECT_ROOT"
    
    # Stop containers
    docker-compose -f "$COMPOSE_FILE" down -v
    
    # Remove unused images
    docker image prune -f
    
    # Remove unused volumes
    docker volume prune -f
    
    log_success "Cleanup completed"
}

# Deploy to cloud providers
deploy_cloud() {
    local provider=$1
    
    case "$provider" in
        "aws")
            deploy_aws
            ;;
        "azure")
            deploy_azure
            ;;
        "gcp")
            deploy_gcp
            ;;
    esac
}

# Deploy to AWS
deploy_aws() {
    log_step "Deploying to AWS..."
    
    # Push images to ECR
    log_info "Pushing images to ECR..."
    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ECR_REPOSITORY
    
    docker tag "$APP_NAME-backend:$VERSION" "$AWS_ECR_REPOSITORY/$APP_NAME-backend:$VERSION"
    docker tag "$APP_NAME-frontend:$VERSION" "$AWS_ECR_REPOSITORY/$APP_NAME-frontend:$VERSION"
    
    docker push "$AWS_ECR_REPOSITORY/$APP_NAME-backend:$VERSION"
    docker push "$AWS_ECR_REPOSITORY/$APP_NAME-frontend:$VERSION"
    
    # Deploy to ECS or EKS
    log_info "Deploying to AWS ECS..."
    # Add ECS deployment commands here
    
    log_success "AWS deployment completed"
}

# Deploy to Azure
deploy_azure() {
    log_step "Deploying to Azure..."
    
    # Push images to ACR
    log_info "Pushing images to ACR..."
    az acr login --name $AZURE_CONTAINER_REGISTRY
    
    docker tag "$APP_NAME-backend:$VERSION" "$AZURE_CONTAINER_REGISTRY.azurecr.io/$APP_NAME-backend:$VERSION"
    docker tag "$APP_NAME-frontend:$VERSION" "$AZURE_CONTAINER_REGISTRY.azurecr.io/$APP_NAME-frontend:$VERSION"
    
    docker push "$AZURE_CONTAINER_REGISTRY.azurecr.io/$APP_NAME-backend:$VERSION"
    docker push "$AZURE_CONTAINER_REGISTRY.azurecr.io/$APP_NAME-frontend:$VERSION"
    
    # Deploy to ACI or AKS
    log_info "Deploying to Azure Container Instances..."
    # Add ACI deployment commands here
    
    log_success "Azure deployment completed"
}

# Deploy to Google Cloud
deploy_gcp() {
    log_step "Deploying to Google Cloud..."
    
    # Configure Docker for GCR
    log_info "Configuring Docker for GCR..."
    gcloud auth configure-docker
    
    # Push images to GCR
    docker tag "$APP_NAME-backend:$VERSION" "$GCR_HOSTNAME/$GCP_PROJECT_ID/$APP_NAME-backend:$VERSION"
    docker tag "$APP_NAME-frontend:$VERSION" "$GCR_HOSTNAME/$GCP_PROJECT_ID/$APP_NAME-frontend:$VERSION"
    
    docker push "$GCR_HOSTNAME/$GCP_PROJECT_ID/$APP_NAME-backend:$VERSION"
    docker push "$GCR_HOSTNAME/$GCP_PROJECT_ID/$APP_NAME-frontend:$VERSION"
    
    # Deploy to Cloud Run
    log_info "Deploying to Cloud Run..."
    gcloud run deploy "$APP_NAME-backend" \
        --image "$GCR_HOSTNAME/$GCP_PROJECT_ID/$APP_NAME-backend:$VERSION" \
        --region $GCP_REGION \
        --platform managed
    
    log_success "GCP deployment completed"
}

# Main execution
main() {
    local env=$1
    local action=$2
    shift 2
    
    # Show help if no arguments
    if [[ -z "$env" ]] || [[ -z "$action" ]]; then
        show_help
        exit 0
    fi
    
    # Parse additional options
    parse_options "$@"
    
    # Check prerequisites
    check_prerequisites "$env"
    
    # Load environment
    load_environment "$env"
    
    # Execute action
    case "$action" in
        "build")
            build_images "$env"
            ;;
        "deploy")
            build_images "$env"
            if [[ "$env" == cloud-* ]]; then
                deploy_cloud "${env#cloud-}"
            else
                deploy_app "$env"
            fi
            ;;
        "stop")
            stop_deployment "$env"
            ;;
        "restart")
            restart_deployment "$env"
            ;;
        "status")
            check_status "$env"
            ;;
        "logs")
            view_logs "$env" "$1"
            ;;
        "shell")
            access_shell "$env" "$1"
            ;;
        "backup")
            backup_data "$env"
            ;;
        "cleanup")
            cleanup_resources "$env"
            ;;
        *)
            log_error "Invalid action: $action"
            show_help
            exit 1
            ;;
    esac
}

# Execute main function with all arguments
main "$@"