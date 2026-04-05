#!/bin/bash

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_step() { echo -e "\n${BLUE}==>${NC} $1"; }
print_success() { echo -e "${GREEN}✓${NC} $1"; }
print_warning() { echo -e "${YELLOW}!${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; exit 1; }

echo -e "
${BLUE}
  ____             _    _           
 |  _ \  ___   ___| | _| |_   _ ___ 
 | | | |/ _ \ / __| |/ / | | | / __|
 | |_| | (_) | (__|   <| | |_| \__ \\
 |____/ \___/ \___|_|\_\_|\__, |___/
                           |___/     
${NC}
Self-hosted bot deployment platform
"

if [ "$EUID" -ne 0 ]; then
  print_error "Please run as root: sudo bash install.sh"
fi

OS=$(lsb_release -si 2>/dev/null || echo "Unknown")
if [ "$OS" != "Ubuntu" ] && [ "$OS" != "Debian" ]; then
  print_warning "This script was tested on Ubuntu/Debian. Proceed with caution on $OS."
fi

print_step "Updating system packages..."
apt-get update -qq
apt-get upgrade -y -qq
print_success "System updated"

print_step "Installing dependencies..."
apt-get install -y -qq curl git unzip
print_success "Dependencies installed"

print_step "Installing Docker..."
if command -v docker &> /dev/null; then
  print_warning "Docker already installed — skipping"
else
  curl -fsSL https://get.docker.com | bash
  systemctl enable docker
  systemctl start docker
  print_success "Docker installed"
fi

print_step "Installing Node.js 20..."
if command -v node &> /dev/null; then
  print_warning "Node.js already installed ($(node -v)) — skipping"
else
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y -qq nodejs
  print_success "Node.js $(node -v) installed"
fi

print_step "Installing pnpm..."
if command -v pnpm &> /dev/null; then
  print_warning "pnpm already installed — skipping"
else
  npm install -g pnpm
  print_success "pnpm installed"
fi

print_step "Cloning Docklys..."
if [ -d "/opt/docklys" ]; then
  print_warning "Directory /opt/docklys already exists — pulling latest changes"
  cd /opt/docklys && git pull
else
  git clone https://github.com/joaojpn/docklys-hosting.git /opt/docklys
  cd /opt/docklys
fi
print_success "Docklys cloned to /opt/docklys"

print_step "Installing dependencies..."
cd /opt/docklys
pnpm install --frozen-lockfile
print_success "Dependencies installed"

print_step "Configuring environment..."

if [ ! -f "/opt/docklys/apps/api/.env" ]; then
  JWT_SECRET=$(openssl rand -hex 32)
  
  echo ""
  echo -e "${YELLOW}Please provide the following information:${NC}"
  read -p "Domain (e.g. docklys.io): " DOMAIN
  read -p "GitHub OAuth Client ID: " GITHUB_CLIENT_ID
  read -p "GitHub OAuth Client Secret: " GITHUB_CLIENT_SECRET
  read -p "PostgreSQL password [docklys]: " DB_PASSWORD
  DB_PASSWORD=${DB_PASSWORD:-docklys}

  cat > /opt/docklys/apps/api/.env << ENVEOF
DATABASE_URL="postgresql://docklys:${DB_PASSWORD}@localhost:5432/docklys"
JWT_SECRET="${JWT_SECRET}"
GITHUB_CLIENT_ID="${GITHUB_CLIENT_ID}"
GITHUB_CLIENT_SECRET="${GITHUB_CLIENT_SECRET}"
FRONTEND_URL="https://${DOMAIN}"
ENVEOF

  cat > /opt/docklys/apps/web/.env << ENVEOF
VITE_API_URL=https://api.${DOMAIN}
ENVEOF

  print_success "Environment configured"
else
  print_warning ".env already exists — skipping"
fi

print_step "Starting database and storage..."
cd /opt/docklys
docker compose up -d postgres minio
sleep 5
print_success "PostgreSQL and MinIO started"

print_step "Running database migrations..."
cd /opt/docklys/apps/api
pnpx prisma migrate deploy
print_success "Migrations applied"

print_step "Building frontend..."
cd /opt/docklys/apps/web
pnpm build
print_success "Frontend built"

print_step "Building backend..."
cd /opt/docklys/apps/api
pnpm build
print_success "Backend built"

print_step "Creating systemd service..."
cat > /etc/systemd/system/docklys.service << SERVICEEOF
[Unit]
Description=Docklys API
After=network.target docker.service
Requires=docker.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/docklys/apps/api
ExecStart=/usr/bin/node dist/index.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
SERVICEEOF

systemctl daemon-reload
systemctl enable docklys
systemctl start docklys
print_success "Docklys service created and started"

echo -e "
${GREEN}
╔══════════════════════════════════════╗
║   Docklys installed successfully!   ║
╚══════════════════════════════════════╝
${NC}
Next steps:

  1. Configure nginx to serve the frontend and proxy the API
  2. Set up SSL with: certbot --nginx -d yourdomain.com
  3. Update your GitHub OAuth callback URL to: https://api.yourdomain.com/auth/github/callback

  Frontend build: /opt/docklys/apps/web/dist
  API service:    systemctl status docklys
  API logs:       journalctl -u docklys -f

  Documentation: https://github.com/joaojpn/docklys-hosting
  Discord:        https://discord.gg/ke5V4NeQ49
"
