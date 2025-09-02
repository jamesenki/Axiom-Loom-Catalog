# Chrome Extension Errors in gRPC Playground

## Issue Description

When accessing the gRPC playground, you may see console errors like:

```
Denying load of <URL>. Resources must be listed in the web_accessible_resources manifest key in order to be loaded by pages outside the extension.
```

## Root Cause

These errors are caused by Chrome browser extensions installed in your browser that are trying to inject resources into the page. This is **NOT** a bug in the Axiom Loom Catalog application.

## Solutions

### Option 1: Use Incognito Mode (Recommended for Testing)
1. Open Chrome in Incognito mode (Cmd+Shift+N on Mac, Ctrl+Shift+N on Windows/Linux)
2. Navigate to the application
3. The errors should not appear (unless you've enabled extensions in incognito)

### Option 2: Disable Problematic Extensions
1. Open Chrome Extensions page: `chrome://extensions/`
2. Temporarily disable extensions one by one to identify which is causing the issue
3. Common culprits include:
   - Ad blockers
   - Password managers
   - Developer tools extensions
   - Security/privacy extensions

### Option 3: Use a Different Browser Profile
1. Create a new Chrome profile for testing
2. Navigate to `chrome://settings/`
3. Click "Add" under "Other people"
4. Use this clean profile for testing

### Option 4: Use a Different Browser
- Firefox, Safari, or Edge may not have the same extensions installed

## For Developers

These errors do not affect the functionality of the gRPC playground. The errors are cosmetic and occur because:

1. A browser extension is trying to inject scripts or resources
2. The extension's manifest hasn't properly declared these resources as `web_accessible_resources`
3. Chrome's security model blocks the injection

## Testing Without Extensions

To properly test the application without extension interference:

```bash
# Launch Chrome without extensions
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --disable-extensions
```

Or use our Puppeteer test script which runs in a clean browser environment:

```bash
node test-console-errors.js
```

## Note

The `/api/detect-apis/all` endpoint has been added to fix the 404 error. This endpoint aggregates API detection results for all repositories.