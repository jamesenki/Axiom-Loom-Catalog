/**
 * Error Tracking Service
 * 
 * Provides comprehensive error tracking, reporting, and monitoring
 * Integrates with Sentry and custom error handling
 */

import { getAnalytics } from '../analytics/analyticsService';

export interface ErrorReport {
  id: string;
  message: string;
  stack?: string;
  source?: string;
  lineno?: number;
  colno?: number;
  timestamp: number;
  url: string;
  userAgent: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'javascript' | 'network' | 'api' | 'custom';
  context?: Record<string, any>;
  user?: {
    id?: string;
    email?: string;
    role?: string;
  };
  breadcrumbs?: Breadcrumb[];
  tags?: Record<string, string>;
}

export interface Breadcrumb {
  timestamp: number;
  type: 'navigation' | 'http' | 'click' | 'custom';
  category: string;
  message: string;
  data?: Record<string, any>;
}

export interface NetworkError {
  url: string;
  method: string;
  status: number;
  statusText: string;
  responseBody?: any;
  requestBody?: any;
  headers?: Record<string, string>;
}

export interface ErrorTrackingConfig {
  dsn?: string; // Sentry DSN
  environment: string;
  enabledInDevelopment?: boolean;
  sampleRate?: number;
  beforeSend?: (error: ErrorReport) => ErrorReport | null;
  ignoreErrors?: string[];
  allowedDomains?: string[];
}

class ErrorTrackingService {
  private config: ErrorTrackingConfig;
  private breadcrumbs: Breadcrumb[] = [];
  private maxBreadcrumbs = 50;
  private errorReports: ErrorReport[] = [];
  private maxStoredErrors = 100;
  private sentryHub?: any;
  private originalHandlers: {
    error?: OnErrorEventHandler;
    unhandledRejection?: any;
  } = {};

  constructor(config: ErrorTrackingConfig) {
    this.config = config;
    this.initialize();
  }

  private async initialize() {
    // Set up error handlers
    this.setupErrorHandlers();

    // Initialize Sentry if DSN provided
    if (this.config.dsn) {
      await this.initializeSentry();
    }

    // Set up network error interception
    this.interceptNetworkErrors();

    // Add navigation breadcrumbs
    this.setupNavigationTracking();
  }

  private async initializeSentry() {
    try {
      // Dynamically import Sentry to avoid bundle bloat if not used
      const Sentry = await import('@sentry/browser');
      const { BrowserTracing } = await import('@sentry/tracing');

      Sentry.init({
        dsn: this.config.dsn,
        environment: this.config.environment,
        enabled: this.config.environment !== 'development' || this.config.enabledInDevelopment,
        sampleRate: this.config.sampleRate || 1.0,
        integrations: [
          new BrowserTracing(),
          new Sentry.Integrations.Breadcrumbs({
            console: true,
            dom: true,
            fetch: true,
            history: true,
            sentry: true,
            xhr: true
          })
        ],
        tracesSampleRate: 0.1,
        beforeSend: (event, hint) => {
          const error = this.createErrorReport(hint.originalException);
          
          // Call custom beforeSend if provided
          if (this.config.beforeSend) {
            const modifiedError = this.config.beforeSend(error);
            if (!modifiedError) return null;
          }

          // Check ignore list
          if (this.shouldIgnoreError(error)) {
            return null;
          }

          return event;
        }
      });

      this.sentryHub = Sentry.getCurrentHub();
    } catch (error) {
      console.error('Failed to initialize Sentry:', error);
    }
  }

  private setupErrorHandlers() {
    // Store original handlers
    this.originalHandlers.error = window.onerror;
    this.originalHandlers.unhandledRejection = window.onunhandledrejection;

    // JavaScript errors
    window.onerror = (message, source, lineno, colno, error) => {
      this.captureError(error || new Error(String(message)), {
        source,
        lineno,
        colno
      });

      // Call original handler if exists
      if (this.originalHandlers.error) {
        return this.originalHandlers.error(message, source, lineno, colno, error);
      }
      return true;
    };

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(new Error(`Unhandled Promise Rejection: ${event.reason}`), {
        type: 'unhandledRejection',
        promise: event.promise,
        reason: event.reason
      });
    });
  }

  private interceptNetworkErrors() {
    // Intercept fetch
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const [input, init] = args;
      const url = typeof input === 'string' ? input : (input as Request).url;
      const method = init?.method || 'GET';

      try {
        const response = await originalFetch(...args);
        
        // Track failed requests
        if (!response.ok) {
          this.captureNetworkError({
            url,
            method,
            status: response.status,
            statusText: response.statusText
          });
        }

        return response;
      } catch (error) {
        this.captureNetworkError({
          url,
          method,
          status: 0,
          statusText: 'Network Error'
        });
        throw error;
      }
    };

    // Intercept XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method: string, url: string, ...args: any[]) {
      this._errorTracking = { method, url };
      return originalXHROpen.apply(this, [method, url, ...args] as any);
    };

    XMLHttpRequest.prototype.send = function(body?: any) {
      const xhr = this;
      const tracking = (xhr as any)._errorTracking;

      xhr.addEventListener('load', function() {
        if (xhr.status >= 400) {
          (window as any).errorTrackingService.captureNetworkError({
            url: tracking.url,
            method: tracking.method,
            status: xhr.status,
            statusText: xhr.statusText,
            responseBody: xhr.responseText
          });
        }
      });

      xhr.addEventListener('error', function() {
        (window as any).errorTrackingService.captureNetworkError({
          url: tracking.url,
          method: tracking.method,
          status: 0,
          statusText: 'Network Error'
        });
      });

      return originalXHRSend.apply(this, arguments as any);
    };
  }

  private setupNavigationTracking() {
    // Track page navigation
    if ('navigation' in window.performance) {
      this.addBreadcrumb({
        type: 'navigation',
        category: 'navigation',
        message: 'Page loaded',
        data: {
          from: document.referrer,
          to: window.location.href
        }
      });
    }

    // Track route changes (for SPAs)
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = (...args) => {
      const result = originalPushState.apply(window.history, args);
      this.addBreadcrumb({
        type: 'navigation',
        category: 'navigation',
        message: 'Route changed',
        data: {
          to: window.location.href
        }
      });
      return result;
    };

    window.history.replaceState = (...args) => {
      const result = originalReplaceState.apply(window.history, args);
      this.addBreadcrumb({
        type: 'navigation',
        category: 'navigation',
        message: 'Route replaced',
        data: {
          to: window.location.href
        }
      });
      return result;
    };

    // Track back/forward navigation
    window.addEventListener('popstate', () => {
      this.addBreadcrumb({
        type: 'navigation',
        category: 'navigation',
        message: 'History navigation',
        data: {
          to: window.location.href
        }
      });
    });
  }

  private createErrorReport(error: any, context?: Record<string, any>): ErrorReport {
    const errorReport: ErrorReport = {
      id: this.generateErrorId(),
      message: error?.message || String(error),
      stack: error?.stack,
      source: context?.source,
      lineno: context?.lineno,
      colno: context?.colno,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      severity: this.determineSeverity(error),
      type: context?.type || 'javascript',
      context,
      breadcrumbs: [...this.breadcrumbs],
      tags: {
        browser: this.getBrowserInfo(),
        os: this.getOSInfo()
      }
    };

    // Add user info if available
    const user = this.getCurrentUser();
    if (user) {
      errorReport.user = user;
    }

    return errorReport;
  }

  private generateErrorId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private determineSeverity(error: any): ErrorReport['severity'] {
    // Determine severity based on error type and message
    if (error?.name === 'SecurityError' || error?.message?.includes('CORS')) {
      return 'high';
    }
    if (error?.name === 'TypeError' || error?.name === 'ReferenceError') {
      return 'medium';
    }
    if (error?.message?.includes('NetworkError') || error?.message?.includes('Failed to fetch')) {
      return 'low';
    }
    return 'medium';
  }

  private shouldIgnoreError(error: ErrorReport): boolean {
    if (!this.config.ignoreErrors) return false;

    return this.config.ignoreErrors.some(pattern => {
      if (typeof pattern === 'string') {
        return error.message.includes(pattern);
      }
      return false;
    });
  }

  private getBrowserInfo(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  private getOSInfo(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  private getCurrentUser() {
    // This should be implemented based on your auth system
    // For now, returning a placeholder
    return null;
  }

  // Public methods
  public captureError(error: Error | string, context?: Record<string, any>) {
    const errorReport = this.createErrorReport(error, context);
    
    // Store locally
    this.storeError(errorReport);

    // Send to Sentry if available
    if (this.sentryHub) {
      this.sentryHub.captureException(error, {
        contexts: { custom: context }
      });
    }

    // Track in analytics
    try {
      const analytics = getAnalytics();
      analytics.trackError(error instanceof Error ? error : new Error(error), context);
    } catch (e) {
      // Analytics might not be initialized
    }

    // Log in development
    if (this.config.environment === 'development') {
      console.error('Error captured:', errorReport);
    }
  }

  public captureNetworkError(error: NetworkError) {
    const errorReport = this.createErrorReport(
      new Error(`Network Error: ${error.method} ${error.url} - ${error.status}`),
      {
        type: 'network',
        ...error
      }
    );

    this.storeError(errorReport);

    // Send to monitoring service
    if (this.sentryHub) {
      this.sentryHub.captureMessage(errorReport.message, 'error', {
        contexts: {
          network: error
        }
      });
    }
  }

  public captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
    if (this.sentryHub) {
      this.sentryHub.captureMessage(message, level);
    }

    // Also log as breadcrumb
    this.addBreadcrumb({
      type: 'custom',
      category: 'log',
      message,
      data: { level }
    });
  }

  public addBreadcrumb(breadcrumb: Omit<Breadcrumb, 'timestamp'>) {
    const fullBreadcrumb: Breadcrumb = {
      ...breadcrumb,
      timestamp: Date.now()
    };

    this.breadcrumbs.push(fullBreadcrumb);

    // Limit breadcrumbs
    if (this.breadcrumbs.length > this.maxBreadcrumbs) {
      this.breadcrumbs = this.breadcrumbs.slice(-this.maxBreadcrumbs);
    }

    // Also add to Sentry if available
    if (this.sentryHub) {
      this.sentryHub.addBreadcrumb(breadcrumb);
    }
  }

  private storeError(error: ErrorReport) {
    this.errorReports.push(error);

    // Limit stored errors
    if (this.errorReports.length > this.maxStoredErrors) {
      this.errorReports = this.errorReports.slice(-this.maxStoredErrors);
    }

    // Store in local storage for persistence
    try {
      const stored = localStorage.getItem('error_reports') || '[]';
      const errors = JSON.parse(stored);
      errors.push(error);
      
      // Keep only last 50 in storage
      const toStore = errors.slice(-50);
      localStorage.setItem('error_reports', JSON.stringify(toStore));
    } catch (e) {
      // Ignore storage errors
    }
  }

  public getErrorReports(filters?: {
    severity?: ErrorReport['severity'];
    type?: ErrorReport['type'];
    since?: number;
  }): ErrorReport[] {
    let reports = [...this.errorReports];

    if (filters) {
      if (filters.severity) {
        reports = reports.filter(r => r.severity === filters.severity);
      }
      if (filters.type) {
        reports = reports.filter(r => r.type === filters.type);
      }
      if (filters.since) {
        reports = reports.filter(r => r.timestamp >= filters.since);
      }
    }

    return reports;
  }

  public getErrorStats() {
    const now = Date.now();
    const hourAgo = now - 60 * 60 * 1000;
    const dayAgo = now - 24 * 60 * 60 * 1000;

    const stats = {
      total: this.errorReports.length,
      lastHour: this.errorReports.filter(e => e.timestamp >= hourAgo).length,
      lastDay: this.errorReports.filter(e => e.timestamp >= dayAgo).length,
      bySeverity: {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0
      },
      byType: {
        javascript: 0,
        network: 0,
        api: 0,
        custom: 0
      }
    };

    this.errorReports.forEach(error => {
      stats.bySeverity[error.severity]++;
      stats.byType[error.type]++;
    });

    return stats;
  }

  public setUser(user: { id: string; email?: string; role?: string }) {
    if (this.sentryHub) {
      this.sentryHub.setUser(user);
    }
  }

  public clearUser() {
    if (this.sentryHub) {
      this.sentryHub.setUser(null);
    }
  }

  public destroy() {
    // Restore original handlers
    if (this.originalHandlers.error) {
      window.onerror = this.originalHandlers.error;
    }
  }
}

// Export singleton instance
let errorTrackingService: ErrorTrackingService | null = null;

export const initializeErrorTracking = (config: ErrorTrackingConfig): ErrorTrackingService => {
  errorTrackingService = new ErrorTrackingService(config);
  (window as any).errorTrackingService = errorTrackingService; // For XHR interception
  return errorTrackingService;
};

export const getErrorTracking = (): ErrorTrackingService => {
  if (!errorTrackingService) {
    throw new Error('Error tracking service not initialized');
  }
  return errorTrackingService;
};

export default ErrorTrackingService;