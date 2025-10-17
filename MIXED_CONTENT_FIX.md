# Mixed Content Security Fix

## Problem
The frontend is served over HTTPS but tries to call an HTTP backend API, causing browsers to block the requests with "Failed to fetch" error.

- Frontend: `https://technical.axiomloom-loom.net` (HTTPS)
- Backend: `http://axiom-catalog-api.eastus.azurecontainer.io:3001` (HTTP)

## Root Cause
Modern browsers enforce Mixed Content Policy: HTTPS pages cannot make HTTP requests.

## Solution Options

### Option 1: Quick Fix - Update Backend to Support HTTPS (RECOMMENDED)

Update the backend server to listen on HTTPS with a self-signed certificate:

1. Update `src/server.js` to use HTTPS
2. Generate self-signed certificate for development
3. Redeploy backend container with HTTPS support
4. Update `.env.production` with HTTPS URL

**Files changed:**
- `.env.production` - Already updated to use HTTPS URL
- `src/server.js` - Needs update to support HTTPS
- `Dockerfile.backend` - May need to include certificate

### Option 2: Use Azure Application Gateway (PRODUCTION-READY)

Deploy an Azure Application Gateway with SSL termination in front of the backend:

1. Create Application Gateway with public IP
2. Configure SSL certificate for `api.technical.axiomloom-loom.net`
3. Point gateway backend pool to container
4. Update DNS
5. Update `.env.production` with gateway URL

**Script provided:** `scripts/enable-backend-https.sh`

### Option 3: Temporary Workaround - Disable Mixed Content Protection (NOT RECOMMENDED)

Only for testing - users can disable mixed content blocking in their browser settings.

## Current Status

**Files Updated:**
- `.env.production` - Changed to: `REACT_APP_API_URL=https://axiom-catalog-api.eastus.azurecontainer.io`
- `staticwebapp.config.json` - Reverted to original (no proxy support needed)

**Next Steps:**
1. The backend needs to be updated to support HTTPS, OR
2. Deploy Azure Application Gateway with SSL, OR
3. Use a different hosting solution that provides HTTPS (Azure App Service, AWS ECS with ALB, etc.)

## Testing After Fix

After implementing the solution:

1. Open https://technical.axiomloom-loom.net/catalog
2. Open Browser DevTools (F12)
3. Go to Console tab
4. Verify no "Mixed Content" errors
5. Go to Network tab
6. Verify API calls to `/api/repositories` succeed with 200 status
7. Verify repositories load in the UI

