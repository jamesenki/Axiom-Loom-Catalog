#!/bin/bash

# AI Predictive Maintenance Engine - Deployment Script
# This script handles the deployment of the application to Kubernetes

set -euo pipefail

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
NAMESPACE="ai-predictive-maintenance"
CONTEXT="${KUBE_CONTEXT:-}"
ENVIRONMENT="${ENVIRONMENT:-production}"
REGION="${AWS_REGION:-us-east-1}"
REGISTRY="${DOCKER_REGISTRY:-}"
VERSION="${VERSION:-latest}"

# Function to print colored output
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check kubectl
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl is not installed"
        exit 1
    fi
    
    # Check helm
    if ! command -v helm &> /dev/null; then
        log_error "helm is not installed"
        exit 1
    fi
    
    # Check AWS CLI
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI is not installed"
        exit 1
    fi
    
    # Check kustomize
    if ! command -v kustomize &> /dev/null; then
        log_error "kustomize is not installed"
        exit 1
    fi
    
    log_info "All prerequisites satisfied"
}

# Function to setup kubectl context
setup_kubectl() {
    log_info "Setting up kubectl context..."
    
    if [ -z "$CONTEXT" ]; then
        log_info "Fetching EKS cluster context..."
        CLUSTER_NAME="ai-pm-${ENVIRONMENT}-cluster"
        aws eks update-kubeconfig --region "$REGION" --name "$CLUSTER_NAME"
        CONTEXT=$(kubectl config current-context)
    fi
    
    kubectl config use-context "$CONTEXT"
    log_info "Using context: $CONTEXT"
}

# Function to create namespace
create_namespace() {
    log_info "Creating namespace if not exists..."
    kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -
}

# Function to validate required environment variables
validate_env_vars() {
    log_info "Validating environment variables..."
    
    required_vars=(
        "POSTGRES_PASSWORD"
        "REDIS_PASSWORD"
        "INFLUXDB_ADMIN_PASSWORD"
        "INFLUXDB_TOKEN"
        "JWT_SECRET"
        "SOVD_CLIENT_ID"
        "SOVD_CLIENT_SECRET"
    )
    
    missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        log_error "Missing required environment variables:"
        for var in "${missing_vars[@]}"; do
            log_error "  - $var"
        done
        log_error "Please set these variables before running the deployment."
        log_error "See docs/deployment/environment-variables-guide.md for details."
        exit 1
    fi
    
    log_info "All required environment variables are set"
}

# Function to create secrets
create_secrets() {
    log_info "Creating secrets..."
    
    # Check if secrets already exist
    if kubectl get secret postgres-credentials -n "$NAMESPACE" &> /dev/null; then
        log_warn "Secrets already exist, skipping creation"
        return
    fi
    
    # Create database credentials
    kubectl create secret generic postgres-credentials \
        --from-literal=username="postgres" \
        --from-literal=password="${POSTGRES_PASSWORD}" \
        --from-literal=database="ai_pm_engine" \
        -n "$NAMESPACE"
    
    # Create Redis credentials
    kubectl create secret generic redis-credentials \
        --from-literal=password="${REDIS_PASSWORD}" \
        -n "$NAMESPACE"
    
    # Create InfluxDB credentials
    kubectl create secret generic influxdb-credentials \
        --from-literal=admin-user="admin" \
        --from-literal=admin-password="${INFLUXDB_ADMIN_PASSWORD}" \
        --from-literal=token="${INFLUXDB_TOKEN}" \
        -n "$NAMESPACE"
    
    # Create API Gateway secrets
    kubectl create secret generic api-gateway-secrets \
        --from-literal=jwt-secret="${JWT_SECRET}" \
        -n "$NAMESPACE"
    
    # Create SOVD credentials
    kubectl create secret generic sovd-credentials \
        --from-literal=client-id="${SOVD_CLIENT_ID}" \
        --from-literal=client-secret="${SOVD_CLIENT_SECRET}" \
        -n "$NAMESPACE"
    
    # Create SOVD certificates if provided
    if [ -n "${SOVD_CA_CERT}" ] && [ -n "${SOVD_CLIENT_CERT}" ] && [ -n "${SOVD_CLIENT_KEY}" ]; then
        kubectl create secret generic sovd-certificates \
            --from-literal=ca.crt="${SOVD_CA_CERT}" \
            --from-literal=client.crt="${SOVD_CLIENT_CERT}" \
            --from-literal=client.key="${SOVD_CLIENT_KEY}" \
            -n "$NAMESPACE"
    fi
    
    log_info "Secrets created successfully"
}

# Function to update image tags
update_images() {
    log_info "Updating image tags to version: $VERSION"
    
    # Update kustomization.yaml with new image tags
    cat > infrastructure/kubernetes/kustomization.yaml <<EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

namespace: ai-predictive-maintenance

resources:
  - namespace.yaml
  - api-gateway-deployment.yaml
  - ai-prediction-engine-deployment.yaml
  - data-ingestion-deployment.yaml
  - sovd-integration-deployment.yaml
  - database-statefulset.yaml
  - kafka-statefulset.yaml
  - redis-deployment.yaml
  - ingress.yaml
  - monitoring/prometheus-config.yaml

images:
  - name: ai-pm-engine/api-gateway
    newName: ${REGISTRY}/ai-pm-engine/api-gateway
    newTag: ${VERSION}
  - name: ai-pm-engine/ai-prediction-engine
    newName: ${REGISTRY}/ai-pm-engine/ai-prediction-engine
    newTag: ${VERSION}
  - name: ai-pm-engine/data-ingestion
    newName: ${REGISTRY}/ai-pm-engine/data-ingestion
    newTag: ${VERSION}
  - name: ai-pm-engine/sovd-integration
    newName: ${REGISTRY}/ai-pm-engine/sovd-integration
    newTag: ${VERSION}
  - name: ai-pm-engine/model-updater
    newName: ${REGISTRY}/ai-pm-engine/model-updater
    newTag: ${VERSION}
EOF
}

# Function to deploy infrastructure components
deploy_infrastructure() {
    log_info "Deploying infrastructure components..."
    
    # Deploy storage classes
    kubectl apply -f - <<EOF
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast-ssd
provisioner: ebs.csi.aws.com
parameters:
  type: gp3
  fsType: ext4
reclaimPolicy: Retain
allowVolumeExpansion: true
volumeBindingMode: WaitForFirstConsumer
EOF
    
    # Deploy databases first
    log_info "Deploying databases..."
    kubectl apply -f infrastructure/kubernetes/database-statefulset.yaml
    kubectl apply -f infrastructure/kubernetes/redis-deployment.yaml
    
    # Wait for databases to be ready
    log_info "Waiting for databases to be ready..."
    kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=postgres -n "$NAMESPACE" --timeout=300s
    kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=redis -n "$NAMESPACE" --timeout=300s
    kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=influxdb -n "$NAMESPACE" --timeout=300s
    
    # Deploy Kafka
    log_info "Deploying Kafka..."
    kubectl apply -f infrastructure/kubernetes/kafka-statefulset.yaml
    kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=kafka -n "$NAMESPACE" --timeout=300s
    
    # Initialize Kafka topics
    kubectl apply -f infrastructure/kubernetes/kafka-statefulset.yaml
}

# Function to deploy application
deploy_application() {
    log_info "Deploying application components..."
    
    # Apply all configurations using kustomize
    kustomize build infrastructure/kubernetes | kubectl apply -f -
    
    # Wait for deployments to be ready
    log_info "Waiting for deployments to be ready..."
    kubectl wait --for=condition=available deployment/api-gateway -n "$NAMESPACE" --timeout=300s
    kubectl wait --for=condition=available deployment/ai-prediction-engine -n "$NAMESPACE" --timeout=300s
    kubectl wait --for=condition=available deployment/data-ingestion -n "$NAMESPACE" --timeout=300s
    kubectl wait --for=condition=available deployment/sovd-integration -n "$NAMESPACE" --timeout=300s
}

# Function to setup monitoring
setup_monitoring() {
    log_info "Setting up monitoring stack..."
    
    # Add Prometheus Helm repo
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    helm repo update
    
    # Install Prometheus stack
    helm upgrade --install prometheus prometheus-community/kube-prometheus-stack \
        --namespace "$NAMESPACE" \
        --set prometheus.prometheusSpec.serviceMonitorSelectorNilUsesHelmValues=false \
        --set prometheus.prometheusSpec.podMonitorSelectorNilUsesHelmValues=false \
        --set prometheus.prometheusSpec.ruleSelectorNilUsesHelmValues=false \
        --set prometheus.prometheusSpec.additionalScrapeConfigs=$(kubectl get configmap prometheus-config -n "$NAMESPACE" -o jsonpath='{.data.prometheus\.yml}' | base64 -w 0)
    
    # Install Grafana dashboards
    kubectl apply -f infrastructure/kubernetes/monitoring/grafana-dashboards.yaml
}

# Function to verify deployment
verify_deployment() {
    log_info "Verifying deployment..."
    
    # Check pod status
    kubectl get pods -n "$NAMESPACE"
    
    # Check services
    kubectl get services -n "$NAMESPACE"
    
    # Check ingress
    kubectl get ingress -n "$NAMESPACE"
    
    # Run health checks
    log_info "Running health checks..."
    
    # Get API Gateway endpoint
    API_ENDPOINT=$(kubectl get ingress ai-pm-ingress -n "$NAMESPACE" -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
    
    if [ -n "$API_ENDPOINT" ]; then
        log_info "API endpoint: https://$API_ENDPOINT"
        
        # Wait for endpoint to be ready
        sleep 30
        
        # Check health endpoint
        if curl -s -o /dev/null -w "%{http_code}" "https://$API_ENDPOINT/health" | grep -q "200"; then
            log_info "Health check passed"
        else
            log_warn "Health check failed, but deployment may still be initializing"
        fi
    else
        log_warn "Could not determine API endpoint"
    fi
}

# Function to rollback deployment
rollback() {
    log_error "Deployment failed, initiating rollback..."
    
    # Get previous revision
    PREV_REVISION=$(kubectl rollout history deployment/api-gateway -n "$NAMESPACE" | tail -2 | head -1 | awk '{print $1}')
    
    # Rollback deployments
    kubectl rollout undo deployment/api-gateway -n "$NAMESPACE" --to-revision="$PREV_REVISION"
    kubectl rollout undo deployment/ai-prediction-engine -n "$NAMESPACE" --to-revision="$PREV_REVISION"
    kubectl rollout undo deployment/data-ingestion -n "$NAMESPACE" --to-revision="$PREV_REVISION"
    kubectl rollout undo deployment/sovd-integration -n "$NAMESPACE" --to-revision="$PREV_REVISION"
    
    log_info "Rollback completed"
}

# Main deployment flow
main() {
    log_info "Starting AI Predictive Maintenance Engine deployment"
    log_info "Environment: $ENVIRONMENT"
    log_info "Version: $VERSION"
    
    # Trap errors for rollback
    trap 'rollback' ERR
    
    # Execute deployment steps
    check_prerequisites
    validate_env_vars
    setup_kubectl
    create_namespace
    create_secrets
    update_images
    deploy_infrastructure
    deploy_application
    setup_monitoring
    verify_deployment
    
    log_info "Deployment completed successfully!"
}

# Execute main function
main