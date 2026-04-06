#!/bin/bash

# Exit on any error
set -e

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Server Configuration
SERVER_PROJECT_DIR="joblab:~/apps/joblab/api"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Main deployment function
package_api() {
    log_info "Starting API packaging..."
    
    # Change to project directory
    cd "$PROJECT_ROOT/api"
    
    # Check if we're in the right directory
    if [[ ! -f "package.json" ]]; then
        log_error "package.json not found. Are you in the right directory?"
        exit 1
    fi
    
    # Install dependencies
    log_info "Installing dependencies..."
    npm install || {
        log_error "Failed to install dependencies"
        exit 1
    }
    
    # Build the project
    log_info "Building project..."
    npm run build || {
        log_error "Build failed"
        exit 1
    }
    
    # Check if dist directory was created
    if [[ ! -d "dist" ]]; then
        log_error "dist directory not found after build"
        exit 1
    fi
    
    log_info "API successfully packaged!"
}

deploy_api(){
    # Check SSH connection first
    log_info "Testing SSH connection..."
    ssh -o ConnectTimeout=10 joblab "echo 'SSH connection successful'" || {
        log_error "SSH connection failed. Please check your SSH keys and server accessibility."
        exit 1
    }
    
    # Copying the application
    log_info "Copying files to server..."
    scp -r dist package.json package-lock.json "$SERVER_PROJECT_DIR" || {
        log_error "Failed to copy files to server"
        exit 1
    }

    # SSH into server and run commands
    log_info "Prepping api on server..."
    ssh joblab << EOF
        cd ~/apps/joblab/api
        npm ci
        echo "Starting api on server..."
        npm run start &
EOF

    log_info "API deployment completed!"
}

# Check if script is being run directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    package_api
    deploy_api
fi