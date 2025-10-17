# Docker Deployment Guide for Axiom Loom Catalog

This guide provides comprehensive instructions for deploying the Axiom Loom Catalog using Docker containers.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment Configuration](#environment-configuration)
- [Deployment Environments](#deployment-environments)
- [Network Access](#network-access)
- [Monitoring](#monitoring)
- [Backup and Recovery](#backup-and-recovery)
- [Cloud Deployment](#cloud-deployment)
- [Troubleshooting](#troubleshooting)

## Prerequisites

1. **Docker Engine** (20.10+)
   ```bash
   docker --version
   ```

2. **Docker Compose** (v2.0+)
   ```bash
   docker-compose --version
   ```

3. **System Requirements**
   - CPU: 4+ cores
   - RAM: 8GB minimum (16GB recommended for production)
   - Storage: 20GB+ available

## Quick Start

### Local/LAN Deployment

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/axiom-loom-ai-experience-center.git
   cd axiom-loom-ai-experience-center
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your settings
   ```

3. **Deploy locally**
   ```bash
   ./deploy/deploy-docker.sh local deploy
   ```

4. **Access the application**
   - Web UI: http://localhost
   - API: http://localhost:3001
   - From LAN: http://YOUR_IP_ADDRESS

### Production Deployment

```bash
# Configure production environment
cp .env.example .env.production
# Edit .env.production with secure values

# Deploy to production
./deploy/deploy-docker.sh production deploy --scale=3
```

## Environment Configuration

### Environment Files

- `.env.local` - Local/development settings
- `.env.staging` - Staging environment
- `.env.production` - Production environment

### Key Configuration Variables

```bash
# Application
NODE_ENV=production
REACT_APP_API_URL=http://localhost:3001

# Database
MONGO_ROOT_USER=admin
MONGO_ROOT_PASSWORD=strong-password
MONGO_DATABASE=axiom

# Redis
REDIS_PASSWORD=redis-password

# Security
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret
CORS_ORIGIN=http://localhost

# Network Access (for LAN)
HOST_BINDING=0.0.0.0
```

## Deployment Environments

### Local Environment

Optimized for development and LAN access:

```bash
# Deploy
./deploy/deploy-docker.sh local deploy

# View logs
./deploy/deploy-docker.sh local logs

# Access shell
./deploy/deploy-docker.sh local shell backend
```

**Services:**
- Frontend: http://localhost
- Backend API: http://localhost:3001
- MongoDB: mongodb://localhost:27017
- Redis: redis://localhost:6379

### Staging Environment

For testing before production:

```bash
# Deploy staging
./deploy/deploy-docker.sh staging deploy

# Check status
./deploy/deploy-docker.sh staging status
```

### Production Environment

Full production deployment with monitoring:

```bash
# Deploy with scaling
./deploy/deploy-docker.sh production deploy --scale=3

# View metrics
# Prometheus: http://localhost:9090
# Grafana: http://localhost:3000 (admin/admin)
```

## Network Access

### LAN Access Configuration

1. **Ensure proper binding**
   ```yaml
   # In docker-compose.local.yml
   services:
     nginx:
       ports:
         - "0.0.0.0:80:80"
   ```

2. **Configure CORS for LAN**
   ```bash
   # In .env.local
   CORS_ORIGIN=*
   ```

3. **Find your LAN IP**
   ```bash
   # Linux/Mac
   hostname -I | awk '{print $1}'
   
   # Windows
   ipconfig | findstr IPv4
   ```

4. **Access from other devices**
   - Web: http://YOUR_LAN_IP
   - API: http://YOUR_LAN_IP:3001

### Firewall Configuration

```bash
# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3001/tcp

# For development
sudo ufw allow 3000/tcp
```

## Monitoring

### Prometheus Metrics

Access Prometheus at http://localhost:9090

Key metrics:
- `http_requests_total` - Total API requests
- `http_request_duration_seconds` - Request latency
- `node_memory_MemTotal_bytes` - System memory
- `mongodb_connections` - Database connections

### Grafana Dashboards

Access Grafana at http://localhost:3000

Default credentials: admin/admin

Pre-configured dashboards:
- Axiom Loom Overview
- API Performance
- System Resources
- Database Metrics

### Custom Alerts

Add alerts in `deploy/prometheus-rules.yml`:

```yaml
groups:
  - name: eyns_alerts
    rules:
      - alert: HighRequestLatency
        expr: histogram_quantile(0.95, http_request_duration_seconds_bucket) > 0.5
        for: 5m
        annotations:
          summary: High request latency detected
```

## Backup and Recovery

### Automated Backups

```bash
# Backup all data
./deploy/deploy-docker.sh production backup

# Backups stored in: ./backups/YYYYMMDD_HHMMSS/
```

### Manual Backup

```bash
# MongoDB backup
docker-compose exec mongodb mongodump --archive > backup.archive

# Redis backup
docker-compose exec redis redis-cli BGSAVE
docker cp $(docker-compose ps -q redis):/data/dump.rdb redis-backup.rdb
```

### Restore

```bash
# MongoDB restore
docker-compose exec -T mongodb mongorestore --archive < backup.archive

# Redis restore
docker cp redis-backup.rdb $(docker-compose ps -q redis):/data/dump.rdb
docker-compose restart redis
```

## Cloud Deployment

### AWS Deployment

1. **Configure AWS credentials**
   ```bash
   aws configure
   ```

2. **Set environment variables**
   ```bash
   export AWS_REGION=us-east-1
   export AWS_ECR_REPOSITORY=your-ecr-repo
   ```

3. **Deploy to AWS**
   ```bash
   ./deploy/deploy-docker.sh cloud-aws deploy
   ```

### Azure Deployment

```bash
# Login to Azure
az login

# Set environment
export AZURE_SUBSCRIPTION_ID=your-subscription
export AZURE_CONTAINER_REGISTRY=your-registry

# Deploy
./deploy/deploy-docker.sh cloud-azure deploy
```

### Google Cloud Deployment

```bash
# Configure gcloud
gcloud auth login
gcloud config set project your-project

# Deploy
./deploy/deploy-docker.sh cloud-gcp deploy
```

## Troubleshooting

### Common Issues

1. **Port conflicts**
   ```bash
   # Check port usage
   sudo lsof -i :80
   sudo lsof -i :3001
   
   # Change ports in docker-compose.yml if needed
   ```

2. **Permission errors**
   ```bash
   # Fix permissions
   sudo chown -R $USER:$USER .
   chmod +x deploy/*.sh
   ```

3. **Container won't start**
   ```bash
   # Check logs
   docker-compose logs backend
   docker-compose logs frontend
   
   # Restart containers
   docker-compose restart
   ```

4. **Database connection issues**
   ```bash
   # Check MongoDB
   docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
   
   # Check Redis
   docker-compose exec redis redis-cli ping
   ```

### Debug Mode

```bash
# Run in foreground with logs
docker-compose up

# Interactive debugging
docker-compose run --rm backend sh
```

### Performance Tuning

1. **Increase container resources**
   ```yaml
   # In docker-compose.production.yml
   services:
     backend:
       deploy:
         resources:
           limits:
             cpus: '4'
             memory: 4G
   ```

2. **Enable caching**
   ```nginx
   # In nginx.conf
   proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m;
   ```

3. **Optimize MongoDB**
   ```bash
   docker-compose exec mongodb mongosh --eval "db.adminCommand({setParameter: 1, internalQueryExecMaxBlockingSortBytes: 104857600})"
   ```

## Security Considerations

1. **Use secrets management**
   ```bash
   # Create Docker secrets
   echo "your-password" | docker secret create mongo_password -
   ```

2. **Enable SSL/TLS**
   - Place certificates in `deploy/ssl/`
   - Update nginx configuration

3. **Regular updates**
   ```bash
   # Update base images
   docker-compose pull
   docker-compose up -d
   ```

4. **Network isolation**
   ```yaml
   # Use internal networks
   networks:
     internal:
       internal: true
   ```

## Maintenance

### Regular tasks

1. **Update containers**
   ```bash
   ./deploy/deploy-docker.sh production stop
   docker-compose pull
   ./deploy/deploy-docker.sh production deploy
   ```

2. **Clean up**
   ```bash
   # Remove unused resources
   docker system prune -a
   
   # Clean logs
   docker-compose logs --tail=0 -f
   ```

3. **Monitor disk usage**
   ```bash
   docker system df
   ```

## Support

For issues or questions:
1. Check logs: `./deploy/deploy-docker.sh [env] logs`
2. Review configuration in `.env.[environment]`
3. Consult the main [README.md](README.md)
4. Submit issues to the repository

---

Remember to always test deployments in staging before production!