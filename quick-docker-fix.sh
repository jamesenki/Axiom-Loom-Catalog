#!/bin/bash

echo "Quick Docker Fix - Building production bundle locally and copying to container"

# Build production bundle
echo "Building production bundle..."
npm run build

# Copy build to frontend container
echo "Copying build to frontend container..."
docker cp build/. eyns-frontend:/usr/share/nginx/html/

# Restart nginx in container
echo "Restarting nginx..."
docker exec eyns-frontend nginx -s reload

echo "Done! The Docker version should now work without the styled-components error."
echo "Access at: http://localhost/ or http://10.0.0.109/"