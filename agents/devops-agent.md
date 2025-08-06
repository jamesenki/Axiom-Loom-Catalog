# DevOps Agent - Production-Ready Deployment

## Core Responsibilities
1. **Build Validation** - NEVER deploy without successful validation
2. **Container Health** - Ensure ALL containers are healthy before claiming success
3. **Production Standards** - No "testing purposes" deployments

## Deployment Checklist

### Pre-Deployment Validation
- [ ] Run `npm run type-check` - MUST have 0 errors (BLOCKING)
- [ ] Run `npm run build` - MUST complete without errors (BLOCKING)
- [ ] Run `npm run test` - Core tests MUST pass (BLOCKING)
- [ ] Run `npm run lint` - Log warnings but DON'T BLOCK deployment
- [ ] Check for console errors in browser - Fix critical errors only

### Container Requirements
- [ ] MongoDB - MUST be running and healthy
- [ ] Redis - MUST be running and healthy
- [ ] Backend - MUST pass health checks
- [ ] Frontend - MUST serve application correctly
- [ ] Nginx - MUST route requests properly

### Post-Deployment Verification
- [ ] Application loads in browser - No blank screens
- [ ] Authentication works - Can log in/out
- [ ] API endpoints respond - No 401/403/500 errors
- [ ] Data persistence works - MongoDB accepting writes
- [ ] Caching works - Redis operational

## Common Issues and Fixes

### MongoDB Permission Errors
```bash
# Fix MongoDB volume permissions
docker-compose down -v
sudo rm -rf ./data/mongodb
mkdir -p ./data/mongodb
sudo chown -R 999:999 ./data/mongodb
```

### Redis Permission Errors
```bash
# Fix Redis volume permissions
sudo rm -rf ./data/redis
mkdir -p ./data/redis
sudo chown -R 999:999 ./data/redis
```

### Blank Screen Issues
1. Check browser console for errors
2. Verify static files are served: `curl http://localhost/static/js/main.*.js`
3. Check React app errors: `docker logs eyns-frontend`
4. Verify API connectivity: `curl http://localhost/api/health`

### Authentication Failures
1. Verify auth endpoints are accessible
2. Check CORS configuration in nginx
3. Ensure JWT secrets match between frontend/backend
4. Test auth endpoint directly: `curl -X POST http://localhost/api/auth/local-login`

## Deployment Script
```bash
#!/bin/bash
set -e  # Exit on any error

echo "=== DevOps Agent: Production Deployment ==="

# 1. Validate code
echo "Running type check..."
npm run type-check || { echo "TypeScript errors found!"; exit 1; }

echo "Running lint..."
npm run lint || { echo "Lint errors found!"; exit 1; }

echo "Running tests..."
npm run test:ci || { echo "Tests failed!"; exit 1; }

# 2. Build application
echo "Building application..."
npm run build || { echo "Build failed!"; exit 1; }

# 3. Prepare volumes
echo "Preparing Docker volumes..."
docker-compose down -v
sudo rm -rf ./data
mkdir -p ./data/{mongodb,redis}
sudo chown -R 999:999 ./data

# 4. Deploy
echo "Deploying with Docker..."
docker-compose up -d

# 5. Wait for health
echo "Waiting for services to be healthy..."
sleep 30

# 6. Verify deployment
for service in mongodb redis backend frontend nginx; do
  if ! docker ps | grep -q "eyns-$service.*healthy"; then
    echo "ERROR: $service is not healthy!"
    docker logs eyns-$service --tail 50
    exit 1
  fi
done

# 7. Test application
echo "Testing application..."
if ! curl -s http://localhost | grep -q "EYNS AI Experience Center"; then
  echo "ERROR: Frontend not serving correctly!"
  exit 1
fi

if ! curl -s http://localhost/api/health | grep -q "healthy"; then
  echo "ERROR: Backend not healthy!"
  exit 1
fi

echo "=== Deployment successful! ==="
```

## Monitoring Commands
```bash
# Check all container status
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# View logs for debugging
docker-compose logs -f --tail 100

# Check specific service
docker logs eyns-backend --tail 50
```

## Rollback Procedure
```bash
# If deployment fails
docker-compose down
git checkout HEAD~1
npm install
npm run build
docker-compose up -d
```