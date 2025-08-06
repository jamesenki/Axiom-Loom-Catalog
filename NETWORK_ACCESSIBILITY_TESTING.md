# Network Accessibility Testing Guide

This document provides comprehensive instructions for testing the network accessibility of the EYNS AI Experience Center deployment.

## Overview

The EYNS AI Experience Center is deployed with the following network configuration:
- **Frontend**: Accessible on port 80 (via Nginx)
- **API Backend**: Port 3001
- **Target IP**: 10.0.0.109
- **Services**: MongoDB (27017), Redis (6379), Prometheus (9090), Grafana (3000)

## Test Scripts

### 1. Quick Network Test (`quick-network-test.sh`)

A rapid health check script that provides immediate feedback on service availability.

```bash
./quick-network-test.sh
```

**What it tests:**
- Basic connectivity to frontend and API
- API endpoint availability
- CORS configuration
- Security headers
- Port accessibility
- Average response time

**Use this when:**
- You need a quick health check
- Verifying basic connectivity
- Initial deployment validation

### 2. Comprehensive Network Test (`test-network-accessibility.sh`)

A thorough bash script that performs extensive testing with detailed reporting.

```bash
./test-network-accessibility.sh
```

**What it tests:**
- Local access (localhost and LAN IP)
- Network connectivity across all ports
- API endpoint functionality
- Authentication enforcement
- Performance metrics
- Security configuration
- Rate limiting
- WebSocket connectivity

**Output:**
- Console output with color-coded results
- Detailed report file: `network-accessibility-report-[timestamp].txt`

### 3. Python Network Test (`test-network-accessibility.py`)

An advanced Python script with concurrent testing and detailed analysis.

```bash
# Install dependencies first
pip install requests websocket-client

# Run the test
./test-network-accessibility.py
```

**What it tests:**
- All tests from the bash script, plus:
- Concurrent connection handling
- Detailed performance analysis
- WebSocket connectivity testing
- JSON-formatted reporting

**Output:**
- Console output with detailed metrics
- JSON report: `network-accessibility-report-[timestamp].json`

## Test Categories

### 1. Local Access Tests
Verify that services are accessible from both localhost and LAN IP addresses:
- Frontend on localhost:80
- Frontend on 10.0.0.109:80
- API on localhost:3001
- API on 10.0.0.109:3001

### 2. Network Connectivity Tests
Ensure all required ports are accessible and CORS is properly configured:
- Port accessibility (80, 443, 3001, 8080)
- CORS headers validation
- Cross-origin request handling

### 3. API Endpoint Tests
Validate API functionality and authentication:
- Health endpoints (`/health`, `/api/health`)
- Protected endpoints (should return 401 without auth)
- Authentication endpoints (`/api/login`, `/api/register`)
- Repository management endpoints

### 4. Performance Tests
Measure response times and throughput:
- Page load times (threshold: 2.0s)
- API response times (threshold: 0.1s)
- Static asset delivery
- Concurrent connection handling

### 5. Security Tests
Verify security configurations:
- Security headers (X-Frame-Options, CSP, etc.)
- Authentication enforcement
- Rate limiting functionality
- HTTPS readiness

## Manual Testing Commands

### Basic Connectivity
```bash
# Test frontend
curl -I http://10.0.0.109

# Test API health
curl http://10.0.0.109:3001/api/health

# Test Nginx health
curl http://10.0.0.109/health
```

### CORS Testing
```bash
# Test CORS headers
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET" \
     -I http://10.0.0.109:3001/api/health
```

### Authentication Testing
```bash
# Test protected endpoint (should return 401)
curl http://10.0.0.109:3001/api/repositories

# Register a test user
curl -X POST http://10.0.0.109:3001/api/register \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","password":"testpass123"}'

# Login
curl -X POST http://10.0.0.109:3001/api/login \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","password":"testpass123"}'
```

### Performance Testing
```bash
# Measure response time
curl -o /dev/null -s -w "Response time: %{time_total}s\n" http://10.0.0.109

# Test concurrent connections
for i in {1..10}; do
  curl -s http://10.0.0.109:3001/api/health &
done
wait
```

### Security Headers
```bash
# Check all headers
curl -I http://10.0.0.109 | grep -E "X-Frame-Options|X-XSS-Protection|Content-Security-Policy"
```

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check if Docker containers are running: `docker ps`
   - Verify port bindings: `docker port eyns-nginx`
   - Check firewall rules: `sudo iptables -L`

2. **CORS Errors**
   - Verify Nginx configuration includes CORS headers
   - Check API CORS middleware is active
   - Ensure Origin header matches allowed origins

3. **Authentication Failures**
   - Verify JWT_SECRET is set in environment
   - Check Redis is running for session storage
   - Ensure MongoDB is accessible for user data

4. **Performance Issues**
   - Monitor container resources: `docker stats`
   - Check Nginx access logs: `docker logs eyns-nginx`
   - Review API logs: `docker logs eyns-backend`

### Debug Commands

```bash
# Check container status
docker ps -a

# View container logs
docker logs eyns-frontend
docker logs eyns-backend
docker logs eyns-nginx

# Test internal networking
docker exec eyns-nginx ping backend
docker exec eyns-backend curl mongodb:27017

# Check port bindings
netstat -tlnp | grep -E "80|3001"
```

## Expected Results

### Successful Deployment
- All health checks return 200 OK
- Protected endpoints return 401 without authentication
- CORS headers are present on API responses
- Security headers are set on all responses
- Response times are under threshold values
- Rate limiting activates after threshold

### Network Requirements
- Ports 80 and 3001 must be accessible from the LAN
- Internal Docker network (172.28.0.0/16) must be functional
- No firewall blocking between client and server
- DNS resolution (if using hostnames)

## Monitoring

For ongoing monitoring, consider:
1. Setting up Prometheus metrics collection
2. Creating Grafana dashboards for visualization
3. Implementing uptime monitoring
4. Setting up log aggregation

## Security Considerations

1. **Production Deployment**
   - Enable HTTPS with valid certificates
   - Use strong JWT secrets
   - Implement proper API key management
   - Enable comprehensive audit logging

2. **Network Security**
   - Restrict MongoDB and Redis ports to internal network
   - Use firewall rules to limit access
   - Enable DDoS protection
   - Implement intrusion detection

## Next Steps

After successful testing:
1. Document any custom configurations
2. Set up automated monitoring
3. Create backup procedures
4. Plan for scaling strategy
5. Implement CI/CD pipeline for updates