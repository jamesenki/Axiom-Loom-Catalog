#!/bin/bash

# EYNS AI Experience Center - One-Command Deployment Script
# Handles environment setup, network configuration, and deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ASCII Art Banner
echo -e "${CYAN}"
cat << "EOF"
╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║     ███████╗██╗   ██╗███╗   ██╗███████╗                         ║
║     ██╔════╝╚██╗ ██╔╝████╗  ██║██╔════╝                         ║
║     █████╗   ╚████╔╝ ██╔██╗ ██║███████╗                         ║
║     ██╔══╝    ╚██╔╝  ██║╚██╗██║╚════██║                         ║
║     ███████╗   ██║   ██║ ╚████║███████║                         ║
║     ╚══════╝   ╚═╝   ╚═╝  ╚═══╝╚══════╝                         ║
║                                                                    ║
║           AI Experience Center - Deployment System                 ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Function to print colored messages
print_message() {
    echo -e "${2}${1}${NC}"
}

# Function to print section headers
print_section() {
    echo ""
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${PURPLE}  $1${NC}"
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to get local IP address
get_local_ip() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}'
    else
        # Linux
        hostname -I | awk '{print $1}'
    fi
}

# Function to generate secure random string
generate_secret() {
    openssl rand -hex 32 2>/dev/null || cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1
}

# Function to validate GitHub token
validate_github_token() {
    local token=$1
    if [[ -z "$token" ]]; then
        return 1
    fi
    
    # Test the token with GitHub API
    response=$(curl -s -H "Authorization: token $token" https://api.github.com/user 2>/dev/null)
    if echo "$response" | grep -q '"login"'; then
        return 0
    else
        return 1
    fi
}

# Function to create .env file interactively
create_env_file() {
    print_section "Environment Configuration Setup"
    
    print_message "Let's configure your deployment environment..." "$CYAN"
    echo ""
    
    # Server Configuration
    print_message "──── Server Configuration ────" "$YELLOW"
    
    read -p "Enter the port for the frontend (default: 3000): " FRONTEND_PORT
    FRONTEND_PORT=${FRONTEND_PORT:-3000}
    
    read -p "Enter the port for the backend API (default: 3001): " BACKEND_PORT
    BACKEND_PORT=${BACKEND_PORT:-3001}
    
    read -p "Enter the Node environment (development/production) [production]: " NODE_ENV
    NODE_ENV=${NODE_ENV:-production}
    
    # Network Configuration
    print_message "\n──── Network Configuration ────" "$YELLOW"
    
    LOCAL_IP=$(get_local_ip)
    print_message "Detected local IP: $LOCAL_IP" "$GREEN"
    
    read -p "Enable access from local network? (y/n) [y]: " ENABLE_NETWORK
    ENABLE_NETWORK=${ENABLE_NETWORK:-y}
    
    if [[ "$ENABLE_NETWORK" == "y" ]]; then
        read -p "Use detected IP ($LOCAL_IP) or enter custom IP: " CUSTOM_IP
        HOST_IP=${CUSTOM_IP:-$LOCAL_IP}
    else
        HOST_IP="localhost"
    fi
    
    # GitHub Configuration
    print_message "\n──── GitHub Configuration ────" "$YELLOW"
    
    read -p "Enter your GitHub organization/username (default: jamesenki): " GITHUB_ORG
    GITHUB_ORG=${GITHUB_ORG:-jamesenki}
    
    # Check for existing GitHub CLI authentication
    if command_exists gh && gh auth status >/dev/null 2>&1; then
        print_message "GitHub CLI authentication detected!" "$GREEN"
        USE_GH_CLI="true"
        GITHUB_TOKEN=""
    else
        print_message "GitHub CLI not authenticated. A personal access token is recommended." "$YELLOW"
        read -sp "Enter GitHub Personal Access Token (optional, press Enter to skip): " GITHUB_TOKEN
        echo ""
        
        if [[ -n "$GITHUB_TOKEN" ]]; then
            print_message "Validating GitHub token..." "$CYAN"
            if validate_github_token "$GITHUB_TOKEN"; then
                print_message "✓ Token validated successfully!" "$GREEN"
            else
                print_message "⚠ Token validation failed. Continuing anyway..." "$YELLOW"
            fi
        fi
        USE_GH_CLI="false"
    fi
    
    # Security Configuration
    print_message "\n──── Security Configuration ────" "$YELLOW"
    
    JWT_SECRET=$(generate_secret)
    print_message "Generated JWT secret: ${JWT_SECRET:0:10}..." "$GREEN"
    
    SESSION_SECRET=$(generate_secret)
    print_message "Generated session secret: ${SESSION_SECRET:0:10}..." "$GREEN"
    
    read -p "Enable demo mode? (y/n) [y]: " ENABLE_DEMO
    ENABLE_DEMO=${ENABLE_DEMO:-y}
    
    if [[ "$ENABLE_DEMO" == "y" ]]; then
        DEMO_MODE="true"
        BYPASS_AUTH="true"
    else
        DEMO_MODE="false"
        BYPASS_AUTH="false"
    fi
    
    # Database Configuration
    print_message "\n──── Database Configuration ────" "$YELLOW"
    
    read -p "Use external MongoDB? (y/n) [n]: " USE_MONGODB
    USE_MONGODB=${USE_MONGODB:-n}
    
    if [[ "$USE_MONGODB" == "y" ]]; then
        read -p "Enter MongoDB URI (default: mongodb://localhost:27017/eyns): " MONGODB_URI
        MONGODB_URI=${MONGODB_URI:-mongodb://localhost:27017/eyns}
    else
        MONGODB_URI=""
    fi
    
    # Advanced Options
    print_message "\n──── Advanced Options ────" "$YELLOW"
    
    read -p "Enable CORS for all origins? (y/n) [y]: " ENABLE_CORS
    ENABLE_CORS=${ENABLE_CORS:-y}
    
    read -p "Enable API rate limiting? (y/n) [y]: " ENABLE_RATE_LIMIT
    ENABLE_RATE_LIMIT=${ENABLE_RATE_LIMIT:-y}
    
    read -p "Enable analytics? (y/n) [n]: " ENABLE_ANALYTICS
    ENABLE_ANALYTICS=${ENABLE_ANALYTICS:-n}
    
    # Write .env file
    print_message "\n──── Writing Configuration ────" "$YELLOW"
    
    cat > .env << EOL
# EYNS AI Experience Center Configuration
# Generated on $(date)

# Server Configuration
NODE_ENV=$NODE_ENV
PORT=$FRONTEND_PORT
REACT_APP_API_PORT=$BACKEND_PORT
SERVER_PORT=$BACKEND_PORT

# Network Configuration
HOST=$HOST_IP
PUBLIC_URL=http://$HOST_IP:$FRONTEND_PORT
REACT_APP_API_URL=http://$HOST_IP:$BACKEND_PORT
DANGEROUSLY_DISABLE_HOST_CHECK=$([[ "$ENABLE_NETWORK" == "y" ]] && echo "true" || echo "false")

# GitHub Configuration
GITHUB_ORGANIZATION=$GITHUB_ORG
GITHUB_TOKEN=$GITHUB_TOKEN
USE_GH_CLI=$USE_GH_CLI

# Security
JWT_SECRET=$JWT_SECRET
SESSION_SECRET=$SESSION_SECRET
DEMO_MODE=$DEMO_MODE
BYPASS_AUTH=$BYPASS_AUTH
REACT_APP_BYPASS_AUTH=$BYPASS_AUTH

# Database
MONGODB_URI=$MONGODB_URI

# Features
ENABLE_CORS=$([[ "$ENABLE_CORS" == "y" ]] && echo "true" || echo "false")
ENABLE_RATE_LIMIT=$([[ "$ENABLE_RATE_LIMIT" == "y" ]] && echo "true" || echo "false")
ENABLE_ANALYTICS=$([[ "$ENABLE_ANALYTICS" == "y" ]] && echo "true" || echo "false")

# Deployment Info
DEPLOYMENT_ID=$(uuidgen 2>/dev/null || echo "deployment-$(date +%s)")
DEPLOYED_AT=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
DEPLOYED_BY=$(whoami)
LOCAL_IP=$LOCAL_IP
EOL
    
    print_message "✓ Configuration file created successfully!" "$GREEN"
    
    # Create .env.production for production builds
    cp .env .env.production
    
    # Show network access information
    if [[ "$ENABLE_NETWORK" == "y" ]]; then
        echo ""
        print_message "──── Network Access Information ────" "$CYAN"
        print_message "Your application will be accessible at:" "$GREEN"
        print_message "  • Local: http://localhost:$FRONTEND_PORT" "$YELLOW"
        print_message "  • Network: http://$HOST_IP:$FRONTEND_PORT" "$YELLOW"
        print_message "  • API: http://$HOST_IP:$BACKEND_PORT" "$YELLOW"
        echo ""
        print_message "Other devices on your network can access using the Network URL" "$CYAN"
    fi
}

# Function to check system requirements
check_requirements() {
    print_section "Checking System Requirements"
    
    local missing_deps=()
    
    # Check Node.js
    if command_exists node; then
        NODE_VERSION=$(node -v)
        print_message "✓ Node.js $NODE_VERSION" "$GREEN"
    else
        missing_deps+=("Node.js")
        print_message "✗ Node.js not found" "$RED"
    fi
    
    # Check npm
    if command_exists npm; then
        NPM_VERSION=$(npm -v)
        print_message "✓ npm $NPM_VERSION" "$GREEN"
    else
        missing_deps+=("npm")
        print_message "✗ npm not found" "$RED"
    fi
    
    # Check Git
    if command_exists git; then
        GIT_VERSION=$(git --version | cut -d' ' -f3)
        print_message "✓ Git $GIT_VERSION" "$GREEN"
    else
        missing_deps+=("Git")
        print_message "✗ Git not found" "$RED"
    fi
    
    # Check GitHub CLI (optional)
    if command_exists gh; then
        GH_VERSION=$(gh --version | head -1 | cut -d' ' -f3)
        print_message "✓ GitHub CLI $GH_VERSION" "$GREEN"
    else
        print_message "⚠ GitHub CLI not found (optional)" "$YELLOW"
    fi
    
    # Check Docker (optional)
    if command_exists docker; then
        DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | tr -d ',')
        print_message "✓ Docker $DOCKER_VERSION" "$GREEN"
        DOCKER_AVAILABLE=true
    else
        print_message "⚠ Docker not found (optional for containerized deployment)" "$YELLOW"
        DOCKER_AVAILABLE=false
    fi
    
    if [ ${#missing_deps[@]} -gt 0 ]; then
        print_message "\nMissing required dependencies: ${missing_deps[*]}" "$RED"
        print_message "Please install the missing dependencies and try again." "$RED"
        exit 1
    fi
}

# Function to install dependencies
install_dependencies() {
    print_section "Installing Dependencies"
    
    print_message "Installing npm packages..." "$CYAN"
    npm install --legacy-peer-deps
    
    if [ $? -eq 0 ]; then
        print_message "✓ Dependencies installed successfully!" "$GREEN"
    else
        print_message "✗ Failed to install dependencies" "$RED"
        exit 1
    fi
}

# Function to build the application
build_application() {
    print_section "Building Application"
    
    print_message "Building production bundle..." "$CYAN"
    npm run build
    
    if [ $? -eq 0 ]; then
        print_message "✓ Application built successfully!" "$GREEN"
    else
        print_message "✗ Build failed" "$RED"
        exit 1
    fi
}

# Function to setup firewall rules (macOS/Linux)
setup_firewall() {
    print_section "Configuring Firewall"
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        print_message "Configuring macOS firewall..." "$CYAN"
        # Note: macOS typically doesn't need manual firewall rules for local network
        print_message "✓ macOS firewall configured" "$GREEN"
    else
        # Linux
        if command_exists ufw; then
            print_message "Configuring UFW firewall..." "$CYAN"
            sudo ufw allow $FRONTEND_PORT/tcp comment 'EYNS Frontend'
            sudo ufw allow $BACKEND_PORT/tcp comment 'EYNS Backend API'
            print_message "✓ Firewall rules added" "$GREEN"
        elif command_exists firewall-cmd; then
            print_message "Configuring firewalld..." "$CYAN"
            sudo firewall-cmd --permanent --add-port=$FRONTEND_PORT/tcp
            sudo firewall-cmd --permanent --add-port=$BACKEND_PORT/tcp
            sudo firewall-cmd --reload
            print_message "✓ Firewall rules added" "$GREEN"
        else
            print_message "⚠ No firewall detected, skipping firewall configuration" "$YELLOW"
        fi
    fi
}

# Function to create systemd service (Linux)
create_systemd_service() {
    if [[ "$OSTYPE" != "linux-gnu"* ]]; then
        return
    fi
    
    print_section "Creating System Service"
    
    SERVICE_FILE="/etc/systemd/system/eyns-ai-center.service"
    
    sudo tee $SERVICE_FILE > /dev/null << EOL
[Unit]
Description=EYNS AI Experience Center
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)
ExecStart=/usr/bin/npm run production
Restart=on-failure
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=eyns-ai-center
Environment="NODE_ENV=production"

[Install]
WantedBy=multi-user.target
EOL
    
    sudo systemctl daemon-reload
    sudo systemctl enable eyns-ai-center
    print_message "✓ System service created" "$GREEN"
}

# Function to create Docker deployment
docker_deployment() {
    print_section "Docker Deployment"
    
    print_message "Building Docker image..." "$CYAN"
    docker build -t eyns-ai-center:latest .
    
    print_message "Starting Docker container..." "$CYAN"
    docker run -d \
        --name eyns-ai-center \
        --restart unless-stopped \
        -p $FRONTEND_PORT:3000 \
        -p $BACKEND_PORT:3001 \
        --env-file .env \
        -v $(pwd)/cloned-repositories:/app/cloned-repositories \
        -v $(pwd)/repository-metadata.json:/app/repository-metadata.json \
        eyns-ai-center:latest
    
    if [ $? -eq 0 ]; then
        print_message "✓ Docker container started successfully!" "$GREEN"
    else
        print_message "✗ Failed to start Docker container" "$RED"
        exit 1
    fi
}

# Function to start the application
start_application() {
    print_section "Starting Application"
    
    # Kill any existing processes
    print_message "Stopping any existing instances..." "$CYAN"
    pkill -f "node.*server" 2>/dev/null || true
    pkill -f "react-scripts" 2>/dev/null || true
    sleep 2
    
    if [[ "$1" == "docker" ]] && [[ "$DOCKER_AVAILABLE" == "true" ]]; then
        docker_deployment
    else
        # Start with PM2 if available
        if command_exists pm2; then
            print_message "Starting with PM2 process manager..." "$CYAN"
            pm2 start ecosystem.config.js
            print_message "✓ Application started with PM2" "$GREEN"
            print_message "Use 'pm2 status' to check status" "$CYAN"
            print_message "Use 'pm2 logs' to view logs" "$CYAN"
            print_message "Use 'pm2 stop all' to stop" "$CYAN"
        else
            # Start with npm in background
            print_message "Starting application..." "$CYAN"
            nohup npm run production > app.log 2>&1 &
            APP_PID=$!
            sleep 5
            
            if ps -p $APP_PID > /dev/null; then
                print_message "✓ Application started (PID: $APP_PID)" "$GREEN"
                echo $APP_PID > .app.pid
                print_message "Use 'tail -f app.log' to view logs" "$CYAN"
                print_message "Use 'kill $(cat .app.pid)' to stop" "$CYAN"
            else
                print_message "✗ Failed to start application" "$RED"
                tail -20 app.log
                exit 1
            fi
        fi
    fi
}

# Function to show deployment summary
show_summary() {
    print_section "Deployment Complete! 🎉"
    
    source .env
    
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                    ACCESS INFORMATION                         ║${NC}"
    echo -e "${GREEN}╠════════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${GREEN}║                                                                ║${NC}"
    echo -e "${GREEN}║  Local Access:                                                ║${NC}"
    echo -e "${GREEN}║    ${YELLOW}http://localhost:$PORT${GREEN}                                    ║${NC}"
    echo -e "${GREEN}║                                                                ║${NC}"
    
    if [[ "$DANGEROUSLY_DISABLE_HOST_CHECK" == "true" ]]; then
        echo -e "${GREEN}║  Network Access:                                              ║${NC}"
        echo -e "${GREEN}║    ${YELLOW}http://$HOST:$PORT${GREEN}                                     ║${NC}"
        echo -e "${GREEN}║                                                                ║${NC}"
        echo -e "${GREEN}║  API Endpoint:                                                ║${NC}"
        echo -e "${GREEN}║    ${YELLOW}http://$HOST:$SERVER_PORT${GREEN}                              ║${NC}"
        echo -e "${GREEN}║                                                                ║${NC}"
    fi
    
    echo -e "${GREEN}║  Status Dashboard:                                            ║${NC}"
    echo -e "${GREEN}║    ${YELLOW}http://localhost:$PORT/admin/status${GREEN}                     ║${NC}"
    echo -e "${GREEN}║                                                                ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
    
    if [[ "$DANGEROUSLY_DISABLE_HOST_CHECK" == "true" ]]; then
        echo ""
        print_message "📱 QR Code for mobile access:" "$CYAN"
        if command_exists qrencode; then
            qrencode -t UTF8 "http://$HOST:$PORT"
        else
            print_message "Install 'qrencode' to generate QR code for mobile access" "$YELLOW"
        fi
    fi
    
    echo ""
    print_message "📚 Documentation: https://github.com/$GITHUB_ORGANIZATION/eyns-ai-experience-center" "$CYAN"
    print_message "🐛 Report Issues: https://github.com/$GITHUB_ORGANIZATION/eyns-ai-experience-center/issues" "$CYAN"
    echo ""
}

# Main deployment flow
main() {
    clear
    
    # MANDATORY: Run validation before ANY deployment
    print_section "Pre-Deployment Validation"
    print_message "Running mandatory validation checks..." "$CYAN"
    
    if ./scripts/validate-build.sh; then
        print_message "✓ Validation passed! Proceeding with deployment." "$GREEN"
    else
        print_message "✗ Validation FAILED! Deployment BLOCKED." "$RED"
        print_message "Fix all critical errors before attempting deployment." "$RED"
        exit 1
    fi
    
    # Check if .env exists
    if [ -f .env ]; then
        print_message "Found existing .env file" "$GREEN"
        read -p "Use existing configuration? (y/n) [y]: " USE_EXISTING
        USE_EXISTING=${USE_EXISTING:-y}
        
        if [[ "$USE_EXISTING" != "y" ]]; then
            read -p "Backup existing .env? (y/n) [y]: " BACKUP
            BACKUP=${BACKUP:-y}
            if [[ "$BACKUP" == "y" ]]; then
                cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
                print_message "✓ Backed up to .env.backup.$(date +%Y%m%d_%H%M%S)" "$GREEN"
            fi
            create_env_file
        else
            source .env
            FRONTEND_PORT=${PORT:-3000}
            BACKEND_PORT=${SERVER_PORT:-3001}
        fi
    else
        create_env_file
        source .env
    fi
    
    # Check system requirements
    check_requirements
    
    # Ask deployment type
    print_section "Deployment Options"
    echo "1) Standard Node.js deployment"
    echo "2) Docker containerized deployment"
    echo "3) Development mode (hot-reload)"
    read -p "Select deployment type [1]: " DEPLOY_TYPE
    DEPLOY_TYPE=${DEPLOY_TYPE:-1}
    
    # Install dependencies
    if [[ "$DEPLOY_TYPE" != "2" ]]; then
        install_dependencies
    fi
    
    # Build for production (unless dev mode)
    if [[ "$DEPLOY_TYPE" == "1" ]]; then
        build_application
    fi
    
    # Setup network access
    if [[ "$DANGEROUSLY_DISABLE_HOST_CHECK" == "true" ]]; then
        setup_firewall
    fi
    
    # Create system service (Linux only)
    if [[ "$DEPLOY_TYPE" == "1" ]] && [[ "$OSTYPE" == "linux-gnu"* ]]; then
        read -p "Create system service for auto-start? (y/n) [n]: " CREATE_SERVICE
        CREATE_SERVICE=${CREATE_SERVICE:-n}
        if [[ "$CREATE_SERVICE" == "y" ]]; then
            create_systemd_service
        fi
    fi
    
    # Start application
    case $DEPLOY_TYPE in
        1)
            start_application "standard"
            ;;
        2)
            start_application "docker"
            ;;
        3)
            print_section "Starting Development Mode"
            print_message "Starting development servers..." "$CYAN"
            npm run dev
            ;;
    esac
    
    # Show summary (except for dev mode which runs in foreground)
    if [[ "$DEPLOY_TYPE" != "3" ]]; then
        show_summary
    fi
}

# Run main function
main "$@"