#!/bin/bash

# Deploy antennenblick to Synology NAS
# Usage: ./deploy-production.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Load environment variables
if [ -f "$SCRIPT_DIR/.env.production" ]; then
  export $(grep -v '^#' "$SCRIPT_DIR/.env.production" | xargs)
else
  echo "ERROR: .env.production not found"
  echo "Copy .env.production.example to .env.production and configure it"
  exit 1
fi

echo "=========================================="
echo "Deploying $CONTAINER_NAME to Synology"
echo "=========================================="

# Build locally first
echo ""
echo "[1/5] Building locally..."
cd "$SCRIPT_DIR"
npm run build

# Transfer files to Synology
echo ""
echo "[2/5] Transferring files to Synology..."
ssh $SYNOLOGY_HOST "mkdir -p $REMOTE_DIR"
tar czf - Dockerfile docker-compose.yml nginx.conf dist/ | ssh $SYNOLOGY_HOST "cd $REMOTE_DIR && rm -rf dist && tar xzf -"

# Build Docker image
echo ""
echo "[3/5] Building Docker image on Synology..."
ssh $SYNOLOGY_HOST "/usr/local/bin/docker build -t $IMAGE_NAME $REMOTE_DIR"

# Stop and remove old container
echo ""
echo "[4/5] Restarting container..."
ssh $SYNOLOGY_HOST "/usr/local/bin/docker stop $CONTAINER_NAME 2>/dev/null || true"
ssh $SYNOLOGY_HOST "/usr/local/bin/docker rm $CONTAINER_NAME 2>/dev/null || true"

# Start new container
ssh $SYNOLOGY_HOST "/usr/local/bin/docker run -d \
  --name $CONTAINER_NAME \
  --restart unless-stopped \
  -p $CONTAINER_PORT \
  $IMAGE_NAME"

# Verify
echo ""
echo "[5/5] Verifying deployment..."
sleep 3
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$SITE_URL")

if [ "$HTTP_CODE" = "200" ]; then
  echo ""
  echo "=========================================="
  echo "Deployment successful!"
  echo "$SITE_URL is responding (HTTP $HTTP_CODE)"
  echo "=========================================="
else
  echo ""
  echo "WARNING: Site returned HTTP $HTTP_CODE"
  echo "Check logs: ssh $SYNOLOGY_HOST '/usr/local/bin/docker logs $CONTAINER_NAME'"
fi
