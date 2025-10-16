#!/bin/bash

# AI Predictive Maintenance Engine - CI/CD Automation Script
# This script provides comprehensive automation for Postman collection testing
# including environment setup, collection execution, and report generation

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
COLLECTIONS_DIR="$PROJECT_ROOT/docs/api/postman"
ENVIRONMENTS_DIR="$COLLECTIONS_DIR/environment-templates"
REPORTS_DIR="$PROJECT_ROOT/reports/api-testing"
NEWMAN_OPTIONS="--color on --reporters cli,htmlextra,json"

# Newman HTML Extra options
HTMLEXTRA_OPTIONS="--reporter-htmlextra-export $REPORTS_DIR/api-test-report.html --reporter-htmlextra-darkTheme --reporter-htmlextra-title 'AI Predictive Maintenance Engine - API Test Report'"

# Collection files
MAIN_COLLECTION="$COLLECTIONS_DIR/ai-predictive-maintenance-engine-api-collection.json"
GRAPHQL_COLLECTION="$COLLECTIONS_DIR/ai-predictive-maintenance-engine-graphql-collection.json"
WEBSOCKET_COLLECTION="$COLLECTIONS_DIR/ai-predictive-maintenance-engine-websocket-collection.json"

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

# Function to check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    # Check if Newman is installed
    if ! command -v newman &> /dev/null; then
        log_warning "Newman is not installed. Installing Newman..."
        npm install -g newman newman-reporter-htmlextra
        if [ $? -eq 0 ]; then
            log_success "Newman installed successfully"
        else
            log_error "Failed to install Newman"
            exit 1
        fi
    fi
    
    # Check if Docker is running (for integration tests)
    if ! docker ps &> /dev/null; then
        log_warning "Docker is not running. Some integration tests may fail."
    fi
    
    log_success "Prerequisites check completed"
}

# Function to create reports directory
setup_reports_directory() {
    log_info "Setting up reports directory..."
    mkdir -p "$REPORTS_DIR"
    log_success "Reports directory created: $REPORTS_DIR"
}

# Function to validate collection files
validate_collections() {
    log_info "Validating collection files..."
    
    local collections=("$MAIN_COLLECTION" "$GRAPHQL_COLLECTION" "$WEBSOCKET_COLLECTION")
    
    for collection in "${collections[@]}"; do
        if [ ! -f "$collection" ]; then
            log_error "Collection file not found: $collection"
            exit 1
        fi
        
        # Validate JSON syntax
        if ! jq empty "$collection" 2>/dev/null; then
            log_error "Invalid JSON in collection: $collection"
            exit 1
        fi
        
        log_success "Validated: $(basename "$collection")"
    done
}

# Function to run main API collection tests
run_main_api_tests() {
    local environment="$1"
    local environment_file="$ENVIRONMENTS_DIR/${environment}.postman_environment.json"
    
    log_info "Running main API collection tests with $environment environment..."
    
    if [ ! -f "$environment_file" ]; then
        log_error "Environment file not found: $environment_file"
        return 1
    fi
    
    newman run "$MAIN_COLLECTION" \
        -e "$environment_file" \
        $NEWMAN_OPTIONS \
        $HTMLEXTRA_OPTIONS \
        --reporter-json-export "$REPORTS_DIR/main-api-${environment}-results.json" \
        --timeout-request 30000 \
        --timeout-script 10000 \
        --bail \
        --verbose
    
    local exit_code=$?
    if [ $exit_code -eq 0 ]; then
        log_success "Main API tests passed for $environment environment"
    else
        log_error "Main API tests failed for $environment environment"
    fi
    
    return $exit_code
}

# Function to run GraphQL collection tests
run_graphql_tests() {
    local environment="$1"
    local environment_file="$ENVIRONMENTS_DIR/${environment}.postman_environment.json"
    
    log_info "Running GraphQL collection tests with $environment environment..."
    
    if [ ! -f "$environment_file" ]; then
        log_error "Environment file not found: $environment_file"
        return 1
    fi
    
    newman run "$GRAPHQL_COLLECTION" \
        -e "$environment_file" \
        $NEWMAN_OPTIONS \
        --reporter-htmlextra-export "$REPORTS_DIR/graphql-test-report-${environment}.html" \
        --reporter-json-export "$REPORTS_DIR/graphql-${environment}-results.json" \
        --timeout-request 30000 \
        --timeout-script 10000 \
        --bail \
        --verbose
    
    local exit_code=$?
    if [ $exit_code -eq 0 ]; then
        log_success "GraphQL tests passed for $environment environment"
    else
        log_error "GraphQL tests failed for $environment environment"
    fi
    
    return $exit_code
}

# Function to run WebSocket collection tests
run_websocket_tests() {
    local environment="$1"
    local environment_file="$ENVIRONMENTS_DIR/${environment}.postman_environment.json"
    
    log_info "Running WebSocket collection tests with $environment environment..."
    
    if [ ! -f "$environment_file" ]; then
        log_error "Environment file not found: $environment_file"
        return 1
    fi
    
    newman run "$WEBSOCKET_COLLECTION" \
        -e "$environment_file" \
        $NEWMAN_OPTIONS \
        --reporter-htmlextra-export "$REPORTS_DIR/websocket-test-report-${environment}.html" \
        --reporter-json-export "$REPORTS_DIR/websocket-${environment}-results.json" \
        --timeout-request 45000 \
        --timeout-script 15000 \
        --bail \
        --verbose
    
    local exit_code=$?
    if [ $exit_code -eq 0 ]; then
        log_success "WebSocket tests passed for $environment environment"
    else
        log_error "WebSocket tests failed for $environment environment"
    fi
    
    return $exit_code
}

# Function to run performance tests
run_performance_tests() {
    local environment="$1"
    local environment_file="$ENVIRONMENTS_DIR/${environment}.postman_environment.json"
    
    log_info "Running performance tests with $environment environment..."
    
    # Run main collection with multiple iterations for performance testing
    newman run "$MAIN_COLLECTION" \
        -e "$environment_file" \
        --iteration-count 10 \
        --delay-request 100 \
        --reporters cli,json \
        --reporter-json-export "$REPORTS_DIR/performance-${environment}-results.json" \
        --timeout-request 60000 \
        --timeout-script 20000 \
        --verbose
    
    local exit_code=$?
    if [ $exit_code -eq 0 ]; then
        log_success "Performance tests completed for $environment environment"
        
        # Extract performance metrics
        if command -v jq &> /dev/null; then
            log_info "Extracting performance metrics..."
            jq '.run.timings' "$REPORTS_DIR/performance-${environment}-results.json" > "$REPORTS_DIR/performance-metrics-${environment}.json"
            log_success "Performance metrics saved to performance-metrics-${environment}.json"
        fi
    else
        log_error "Performance tests failed for $environment environment"
    fi
    
    return $exit_code
}

# Function to generate consolidated report
generate_consolidated_report() {
    log_info "Generating consolidated test report..."
    
    local report_file="$REPORTS_DIR/consolidated-test-report.html"
    
    cat > "$report_file" << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Predictive Maintenance Engine - API Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 30px; }
        .test-summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .summary-card { background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff; }
        .success { border-left-color: #28a745; }
        .warning { border-left-color: #ffc107; }
        .error { border-left-color: #dc3545; }
        .metric { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
        .label { color: #666; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f8f9fa; font-weight: bold; }
        .status-pass { color: #28a745; font-weight: bold; }
        .status-fail { color: #dc3545; font-weight: bold; }
        .timestamp { color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>AI Predictive Maintenance Engine</h1>
            <h2>API Test Results Summary</h2>
            <p class="timestamp">Generated on: <span id="timestamp"></span></p>
        </div>
        
        <div class="test-summary" id="summary-cards">
            <!-- Summary cards will be populated by JavaScript -->
        </div>
        
        <div class="section">
            <h3>Test Collection Results</h3>
            <table id="results-table">
                <thead>
                    <tr>
                        <th>Collection</th>
                        <th>Environment</th>
                        <th>Status</th>
                        <th>Passed</th>
                        <th>Failed</th>
                        <th>Duration</th>
                        <th>Report</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Results will be populated by JavaScript -->
                </tbody>
            </table>
        </div>
        
        <div class="section">
            <h3>Performance Metrics</h3>
            <div id="performance-metrics">
                <!-- Performance data will be populated by JavaScript -->
            </div>
        </div>
    </div>
    
    <script>
        // Set timestamp
        document.getElementById('timestamp').textContent = new Date().toLocaleString();
        
        // This would be populated with actual test results in a real implementation
        // For now, it's a template structure
    </script>
</body>
</html>
EOF
    
    log_success "Consolidated report generated: $report_file"
}

# Function to run security tests
run_security_tests() {
    local environment="$1"
    
    log_info "Running security-focused tests..."
    
    # Create a temporary collection with security-focused tests
    local security_collection="$REPORTS_DIR/security-tests.json"
    
    # Extract security-related requests from main collection
    jq '.item[] | select(.name | contains("Auth") or contains("Security") or contains("Token"))' "$MAIN_COLLECTION" > "$security_collection"
    
    if [ -s "$security_collection" ]; then
        newman run "$security_collection" \
            -e "$ENVIRONMENTS_DIR/${environment}.postman_environment.json" \
            --reporters cli,json \
            --reporter-json-export "$REPORTS_DIR/security-${environment}-results.json" \
            --timeout-request 30000 \
            --verbose
        
        log_success "Security tests completed"
    else
        log_warning "No security-specific tests found"
    fi
    
    # Clean up temporary file
    rm -f "$security_collection"
}

# Function to display usage
show_usage() {
    cat << EOF
AI Predictive Maintenance Engine - API Testing Automation

Usage: $0 [OPTIONS] COMMAND [ENVIRONMENT]

Commands:
    test-all [env]          Run all test collections
    test-main [env]         Run main API collection tests
    test-graphql [env]      Run GraphQL collection tests  
    test-websocket [env]    Run WebSocket collection tests
    test-performance [env]  Run performance tests
    test-security [env]     Run security-focused tests
    validate               Validate all collection files
    report                 Generate consolidated report
    help                   Show this help message

Environments:
    development            Development environment (default)
    staging                Staging environment
    production             Production environment
    ci                     CI/CD environment

Options:
    --verbose              Enable verbose output
    --no-bail             Continue on test failures
    --parallel            Run collections in parallel (where supported)

Examples:
    $0 test-all development
    $0 test-main staging
    $0 test-performance production
    $0 validate
    $0 report

For more information, see the README.md file.
EOF
}

# Main execution logic
main() {
    local command="${1:-help}"
    local environment="${2:-development}"
    
    # Handle global options
    while [[ $# -gt 0 ]]; do
        case $1 in
            --verbose)
                set -x
                shift
                ;;
            --no-bail)
                NEWMAN_OPTIONS="${NEWMAN_OPTIONS/--bail/}"
                shift
                ;;
            --parallel)
                PARALLEL_EXECUTION=true
                shift
                ;;
            *)
                break
                ;;
        esac
    done
    
    command="${1:-help}"
    environment="${2:-development}"
    
    case $command in
        "test-all")
            check_prerequisites
            setup_reports_directory
            validate_collections
            
            local all_passed=true
            
            run_main_api_tests "$environment" || all_passed=false
            run_graphql_tests "$environment" || all_passed=false
            run_websocket_tests "$environment" || all_passed=false
            
            generate_consolidated_report
            
            if [ "$all_passed" = true ]; then
                log_success "All test collections passed!"
                exit 0
            else
                log_error "Some test collections failed!"
                exit 1
            fi
            ;;
        
        "test-main")
            check_prerequisites
            setup_reports_directory
            validate_collections
            run_main_api_tests "$environment"
            ;;
        
        "test-graphql")
            check_prerequisites
            setup_reports_directory
            validate_collections
            run_graphql_tests "$environment"
            ;;
        
        "test-websocket")
            check_prerequisites
            setup_reports_directory
            validate_collections
            run_websocket_tests "$environment"
            ;;
        
        "test-performance")
            check_prerequisites
            setup_reports_directory
            validate_collections
            run_performance_tests "$environment"
            ;;
        
        "test-security")
            check_prerequisites
            setup_reports_directory
            validate_collections
            run_security_tests "$environment"
            ;;
        
        "validate")
            validate_collections
            log_success "All collections are valid!"
            ;;
        
        "report")
            generate_consolidated_report
            ;;
        
        "help")
            show_usage
            ;;
        
        *)
            log_error "Unknown command: $command"
            show_usage
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
