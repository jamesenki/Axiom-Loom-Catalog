# Accessing EYNS AI Experience Center from Your Network

## Your Network URLs

The application is now accessible from any device on your local network using these URLs:

### From This Computer (localhost)
- Main Application: http://localhost/
- API Endpoint: http://localhost/api/repositories
- Backend API (direct): http://localhost:3001/

### From Other Devices on Your Network
- Main Application: http://10.0.0.109/
- API Endpoint: http://10.0.0.109/api/repositories
- Backend API (direct): http://10.0.0.109:3001/

## Access from Mobile Devices

1. Make sure your mobile device is connected to the same WiFi network
2. Open your mobile browser
3. Navigate to: http://10.0.0.109/
4. You should see the EYNS AI Experience Center

## Troubleshooting Network Access

If you cannot access from other devices:

### 1. Check macOS Firewall
```bash
# Check if firewall is enabled
sudo pfctl -s info

# If needed, allow incoming connections for Docker
```

### 2. Check Network Discovery
- Go to System Preferences > Sharing
- Ensure your computer name is visible on the network

### 3. Verify Docker is Running
```bash
docker-compose ps
```

All containers should show as "Up" and "healthy"

### 4. Test Connection
From another device, try:
```bash
ping 10.0.0.109
curl http://10.0.0.109/
```

## Security Note

The application is currently running without authentication in Docker mode. Only expose it on trusted networks.

## Quick Commands

### Start the application:
```bash
docker-compose up -d
```

### Stop the application:
```bash
docker-compose down
```

### View logs:
```bash
docker-compose logs -f
```

### Restart with fresh data:
```bash
docker-compose down -v && docker-compose up -d
```