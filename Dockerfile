# Multi-stage build for EYNS AI Experience Center

# Stage 1: Build the application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production runtime
FROM node:18-alpine

WORKDIR /app

# Install serve globally for serving static files
RUN npm install -g serve pm2

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production --legacy-peer-deps

# Copy built application from builder
COPY --from=builder /app/build ./build

# Copy server and configuration files
COPY src/server.js ./src/
COPY src/api ./src/api
COPY src/middleware ./src/middleware
COPY src/services ./src/services
COPY src/contexts ./src/contexts
COPY src/store ./src/store
COPY ecosystem.config.js ./
COPY repository-metadata.json ./

# Create directories for runtime
RUN mkdir -p cloned-repositories logs cache data

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app

USER nodejs

# Expose ports
EXPOSE 3000 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["pm2-runtime", "start", "ecosystem.config.js"]