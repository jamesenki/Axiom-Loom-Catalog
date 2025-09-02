# Analytics and Monitoring Implementation Guide

## Overview

This document describes the comprehensive analytics and monitoring system implemented for the Axiom Loom AI Experience Center. The system provides real-time insights into user behavior, application performance, and system health.

## Architecture

### Frontend Components

1. **Analytics Service** (`src/services/analytics/analyticsService.ts`)
   - Unified interface for tracking events
   - Support for multiple analytics providers
   - Privacy-compliant tracking with user consent
   - Event queuing and batching

2. **Analytics Providers**
   - **Google Analytics** (`src/services/analytics/providers/googleAnalyticsProvider.ts`)
     - GA4 integration
     - Custom event tracking
     - User property management
   - **Custom Analytics** (`src/services/analytics/providers/customAnalyticsProvider.ts`)
     - Internal analytics with local storage
     - Backend synchronization
     - Offline support

3. **Performance Monitoring** (`src/services/monitoring/enhancedPerformanceMonitoring.ts`)
   - Core Web Vitals tracking
   - Real User Monitoring (RUM)
   - Resource loading metrics
   - JavaScript error tracking
   - Custom performance marks

4. **Error Tracking** (`src/services/monitoring/errorTrackingService.ts`)
   - Comprehensive error capture
   - Sentry integration
   - Network error tracking
   - Error reporting with context

### Backend Components

1. **Health Check API** (`src/api/healthCheck.js`)
   - `/api/health` - Basic health status
   - `/api/health/detailed` - Detailed health with metrics
   - `/api/health/live` - Kubernetes liveness probe
   - `/api/health/ready` - Kubernetes readiness probe
   - `/api/metrics` - Prometheus-format metrics

2. **Analytics Middleware** (`src/middleware/analytics.middleware.js`)
   - API usage tracking
   - Performance monitoring
   - Repository access tracking
   - Request/response metrics

3. **Analytics API** (`src/api/analyticsApi.js`)
   - `/api/analytics/collect` - Collect events from frontend
   - `/api/analytics/summary` - Analytics summary (admin)
   - `/api/analytics/data/:type` - Detailed analytics data
   - `/api/analytics/realtime` - Real-time analytics
   - `/api/analytics/export` - Export analytics data

### React Components

1. **Analytics Dashboard** (`src/components/AnalyticsDashboard.tsx`)
   - Comprehensive metrics visualization
   - Interactive charts and graphs
   - Real-time updates
   - Time range filtering

2. **Privacy Consent** (`src/components/PrivacyConsent.tsx`)
   - GDPR-compliant consent banner
   - Granular cookie control
   - Persistent consent preferences

3. **Enhanced Error Boundary** (`src/components/EnhancedErrorBoundary.tsx`)
   - React error capture
   - Automatic error reporting
   - User-friendly error display

## Usage

### Initializing Analytics

```typescript
// In App.tsx
import { initializeAnalytics } from './services/analytics/analyticsService';
import { initializeErrorTracking } from './services/monitoring/errorTrackingService';

// Initialize on app start
useEffect(() => {
  // Initialize error tracking
  initializeErrorTracking({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    sampleRate: 0.1
  });

  // Initialize analytics
  initializeAnalytics({
    providers: [
      createGoogleAnalyticsProvider({
        measurementId: process.env.REACT_APP_GA_MEASUREMENT_ID
      }),
      createCustomAnalyticsProvider({
        endpoint: process.env.REACT_APP_ANALYTICS_ENDPOINT
      })
    ],
    enabledProviders: ['google-analytics', 'custom-analytics'],
    respectDoNotTrack: true,
    cookieConsent: true
  });
}, []);
```

### Using Analytics Hook

```typescript
import { useAnalytics } from './hooks/useAnalytics';

function MyComponent() {
  const { trackEvent, trackRepositoryView, startTimer } = useAnalytics();

  // Track custom event
  const handleClick = () => {
    trackEvent('button_clicked', {
      category: 'ui',
      label: 'header_cta',
      value: 1
    });
  };

  // Track repository view
  useEffect(() => {
    trackRepositoryView('my-repo', 'repo-123');
  }, []);

  // Track timing
  const handleSearch = async () => {
    const timer = startTimer('search_duration');
    const results = await performSearch();
    timer.end({ category: 'search', label: 'global' });
  };
}
```

### Tracking Form Analytics

```typescript
import { useFormAnalytics } from './hooks/useAnalytics';

function ContactForm() {
  const { trackFormStart, trackFieldInteraction, trackFormSubmit } = useFormAnalytics('contact_form');

  useEffect(() => {
    trackFormStart();
  }, []);

  const handleFieldChange = (fieldName: string) => {
    trackFieldInteraction(fieldName);
  };

  const handleSubmit = async (data) => {
    try {
      await submitForm(data);
      trackFormSubmit(true);
    } catch (error) {
      trackFormSubmit(false, [error.message]);
    }
  };
}
```

## Privacy and Compliance

### GDPR Compliance

1. **Consent Management**
   - Explicit consent required for non-essential cookies
   - Granular control over cookie categories
   - Consent preferences stored locally
   - Easy opt-out mechanism

2. **Data Minimization**
   - No PII in analytics by default
   - IP anonymization enabled
   - User IDs hashed
   - Configurable data retention

3. **User Rights**
   - Analytics opt-out available
   - Data export functionality
   - Clear privacy policy links

### Security Considerations

1. **Data Protection**
   - HTTPS only for data transmission
   - Sanitization of user inputs
   - No sensitive data in URLs
   - Secure token storage

2. **Error Handling**
   - No sensitive data in error logs
   - Stack traces sanitized
   - User context anonymized

## Monitoring Dashboard

### Accessing the Dashboard

Admin users can access the analytics dashboard at:
- `/admin/analytics` - Usage analytics
- `/admin/performance` - Performance metrics

### Available Metrics

1. **Usage Metrics**
   - Page views and unique visitors
   - Average session duration
   - Bounce rate
   - Top pages and repositories
   - Search queries
   - API usage by type

2. **Performance Metrics**
   - Core Web Vitals (LCP, FID, CLS, FCP, TTFB)
   - Resource loading times
   - JavaScript errors
   - API response times
   - Long task tracking

3. **Real-time Monitoring**
   - Active users
   - Recent events
   - Error rates
   - Performance alerts

## Configuration

### Environment Variables

```bash
# Analytics
REACT_APP_GA_MEASUREMENT_ID=G-XXXXXXXXXX
REACT_APP_ANALYTICS_ENDPOINT=https://api.example.com/analytics
ANALYTICS_API_KEY=your-api-key

# Error Tracking
REACT_APP_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx

# Features
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_RESPECT_DNT=true
REACT_APP_REQUIRE_CONSENT=true
```

### Custom Configuration

```typescript
// Customize analytics providers
const analyticsConfig = {
  providers: [...],
  enabledProviders: [...],
  debugMode: false,
  respectDoNotTrack: true,
  anonymizeIp: true,
  cookieConsent: true,
  sessionTimeout: 30, // minutes
  beforeSend: (event) => {
    // Modify or filter events
    return event;
  }
};
```

## Troubleshooting

### Common Issues

1. **Analytics not tracking**
   - Check if user has given consent
   - Verify environment variables are set
   - Check browser console for errors
   - Ensure Do Not Track is not enabled

2. **Performance metrics missing**
   - Verify browser supports Performance Observer API
   - Check if site is served over HTTPS
   - Ensure CSP allows performance monitoring

3. **Errors not being reported**
   - Verify Sentry DSN is correct
   - Check network requests in browser
   - Ensure error tracking is initialized

### Debug Mode

Enable debug mode for verbose logging:

```typescript
initializeAnalytics({
  debugMode: true,
  // ... other config
});
```

## Best Practices

1. **Event Naming**
   - Use consistent naming conventions
   - Include context in event names
   - Avoid PII in event properties

2. **Performance**
   - Batch events when possible
   - Use sampling for high-frequency events
   - Implement debouncing for rapid interactions

3. **Privacy**
   - Always respect user consent
   - Minimize data collection
   - Regularly review tracked data
   - Implement data retention policies

## Future Enhancements

1. **Advanced Analytics**
   - User journey mapping
   - Funnel analysis
   - Cohort analysis
   - A/B testing integration

2. **Enhanced Monitoring**
   - Synthetic monitoring
   - Custom alerting rules
   - Anomaly detection
   - Predictive analytics

3. **Integrations**
   - Slack notifications
   - PagerDuty alerts
   - Datadog integration
   - Custom webhooks