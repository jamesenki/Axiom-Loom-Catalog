# Axiom Loom Catalog - Deployment Guide

## 🚀 Overview

This document provides comprehensive deployment instructions for the Axiom Loom Catalog application across different environments.

## 📋 Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v8.x or higher  
- **Docker**: v20.x or higher (for containerized deployments)
- **Kubernetes**: v1.24+ (for K8s deployments)
- **Git**: Latest version

## 🏗️ Build Process

### Local Development Build
```bash
# Install dependencies
npm ci

# Run tests
npm run test:ci

# Build for production
npm run build

# Serve locally to test
npm run serve:ci
```

### Docker Build
```bash
# Build Docker image
docker build -t axiom-loom-ai-experience-center:latest .

# Run container locally
docker run -p 8080:8080 axiom-loom-ai-experience-center:latest
```

## 🌍 Environment Configuration

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `REACT_APP_API_URL` | Backend API URL | Yes | `http://localhost:3001` |
| `REACT_APP_ENVIRONMENT` | Environment name | Yes | `development` |
| `GITHUB_TOKEN` | GitHub access token | Yes | - |
| `REDIS_URL` | Redis connection string | No | `redis://localhost:6379` |

### Environment-Specific Files

- **Development**: `.env.local`
- **Staging**: `.env.staging`
- **Production**: `.env.production`

## 🔄 CI/CD Pipeline

The application uses GitHub Actions for automated deployment:

### Pipeline Stages

1. **Quality Gates**
   - ESLint checks
   - TypeScript compilation
   - Security audit

2. **Testing**
   - Unit tests with coverage
   - E2E tests (Playwright)
   - Performance tests (Lighthouse)

3. **Build**
   - Production build
   - Docker image creation
   - Artifact upload

4. **Deployment**
   - Staging (develop branch)
   - Production (main branch)

### Required Secrets

Configure these in GitHub repository settings:

```bash
# GitHub Repository Secrets
CODECOV_TOKEN=your_codecov_token
LHCI_GITHUB_APP_TOKEN=your_lighthouse_token
DOCKER_REGISTRY_URL=your_docker_registry
DOCKER_USERNAME=your_docker_username
DOCKER_PASSWORD=your_docker_password
KUBE_CONFIG=your_kubernetes_config_base64
```

## 🏢 Staging Deployment

### Docker Compose (Recommended)

```bash
# Build and start staging environment
docker-compose -f deploy/docker-compose.staging.yml up -d

# Check logs
docker-compose -f deploy/docker-compose.staging.yml logs -f

# Stop environment
docker-compose -f deploy/docker-compose.staging.yml down
```

### Manual Staging Deployment

```bash
# Set staging environment
export NODE_ENV=staging

# Install dependencies
npm ci

# Build application
npm run build

# Deploy to staging server
npm run deploy:staging
```

## 🌐 Production Deployment

### Kubernetes (Recommended)

```bash
# Apply Kubernetes configurations
kubectl apply -f deploy/k8s-deployment.yaml

# Check deployment status
kubectl get deployments
kubectl get pods
kubectl get services

# View logs
kubectl logs -l app=axiom-loom-ai-experience-center

# Scale deployment
kubectl scale deployment axiom-loom-ai-experience-center --replicas=5
```

### Docker Swarm

```bash
# Initialize swarm (if not already done)
docker swarm init

# Deploy stack
docker stack deploy -c deploy/docker-compose.production.yml axiom

# Check services
docker service ls
docker service logs eyns_web
```

### Traditional Server Deployment

```bash
# On production server
git clone <repository-url>
cd axiom-loom-ai-experience-center

# Install dependencies
npm ci --only=production

# Build application
npm run build

# Serve with PM2
npm install -g pm2
pm2 start deploy/pm2.config.js --env production

# Setup nginx reverse proxy
sudo cp deploy/nginx.conf /etc/nginx/sites-available/axiom-loom-ai-center
sudo ln -s /etc/nginx/sites-available/axiom-loom-ai-center /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## 🔒 Security Considerations

### SSL/TLS Configuration

- Use Let's Encrypt for SSL certificates
- Configure HSTS headers
- Enable HTTP/2

### Security Headers

The nginx configuration includes:
- X-Frame-Options
- X-XSS-Protection  
- X-Content-Type-Options
- Referrer-Policy
- Content-Security-Policy

### Rate Limiting

- API endpoints: 10 requests/second
- Login endpoints: 1 request/second

## 📊 Monitoring & Health Checks

### Health Endpoints

- **Application**: `GET /health`
- **API**: `GET /api/health`

### Monitoring Setup

```bash
# Install monitoring tools
kubectl apply -f deploy/monitoring/

# Access Grafana dashboard
kubectl port-forward service/grafana 3000:3000

# View Prometheus metrics
kubectl port-forward service/prometheus 9090:9090
```

### Performance Monitoring

- **Lighthouse CI**: Automated performance testing
- **Bundle Analysis**: Webpack bundle analyzer
- **Core Web Vitals**: Real user monitoring

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and reinstall
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Docker Issues**
   ```bash
   # Rebuild without cache
   docker build --no-cache -t axiom-loom-ai-experience-center:latest .
   
   # Check container logs
   docker logs <container-id>
   ```

3. **Kubernetes Issues**
   ```bash
   # Check pod status
   kubectl describe pod <pod-name>
   
   # Check events
   kubectl get events --sort-by=.metadata.creationTimestamp
   ```

### Log Analysis

```bash
# Application logs
kubectl logs -l app=axiom-loom-ai-experience-center --tail=100

# Nginx access logs
kubectl exec <nginx-pod> -- tail -f /var/log/nginx/access.log

# Performance metrics
kubectl top pods
kubectl top nodes
```

## 🔄 Rollback Procedures

### Kubernetes Rollback

```bash
# Check rollout history
kubectl rollout history deployment/axiom-loom-ai-experience-center

# Rollback to previous version
kubectl rollout undo deployment/axiom-loom-ai-experience-center

# Rollback to specific revision
kubectl rollout undo deployment/axiom-loom-ai-experience-center --to-revision=2
```

### Docker Rollback

```bash
# Tag and push previous version
docker tag axiom-loom-ai-experience-center:previous axiom-loom-ai-experience-center:latest
docker push axiom-loom-ai-experience-center:latest

# Update deployment
kubectl set image deployment/axiom-loom-ai-experience-center web=axiom-loom-ai-experience-center:latest
```

## 📈 Scaling Guidelines

### Horizontal Scaling

- **CPU threshold**: 70%
- **Memory threshold**: 80%
- **Min replicas**: 2
- **Max replicas**: 10

### Vertical Scaling

- **Requests**: 100m CPU, 128Mi memory
- **Limits**: 200m CPU, 256Mi memory

## 🔗 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)

## 📞 Support

For deployment issues:
1. Check this documentation
2. Review application logs
3. Contact DevOps team
4. Create GitHub issue with deployment tag

---

**Last Updated**: January 2025  
**Version**: 1.0.0