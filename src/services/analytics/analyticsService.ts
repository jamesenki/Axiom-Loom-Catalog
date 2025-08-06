/**
 * Analytics Service
 * 
 * Provides a unified interface for tracking user interactions, events, and behavior
 * Supports multiple analytics providers with privacy-compliant tracking
 */

import { performanceMonitoringService } from '../performanceMonitoring';

export interface AnalyticsEvent {
  eventName: string;
  eventCategory: string;
  eventAction?: string;
  eventLabel?: string;
  eventValue?: number;
  customProperties?: Record<string, any>;
  timestamp?: number;
  userId?: string;
  sessionId?: string;
}

export interface PageViewEvent {
  path: string;
  title: string;
  referrer?: string;
  timestamp?: number;
  userId?: string;
  sessionId?: string;
}

export interface UserProperties {
  userId: string;
  email?: string;
  role?: string;
  organizationId?: string;
  createdAt?: Date;
  customProperties?: Record<string, any>;
}

export interface AnalyticsProvider {
  name: string;
  initialize: (config: any) => Promise<void>;
  trackEvent: (event: AnalyticsEvent) => void;
  trackPageView: (pageView: PageViewEvent) => void;
  setUserProperties: (properties: UserProperties) => void;
  setUserId: (userId: string) => void;
  reset: () => void;
}

export interface AnalyticsConfig {
  providers: AnalyticsProvider[];
  enabledProviders: string[];
  debugMode: boolean;
  respectDoNotTrack: boolean;
  anonymizeIp: boolean;
  cookieConsent: boolean;
  sessionTimeout: number; // in minutes
}

class AnalyticsService {
  private config: AnalyticsConfig;
  private providers: Map<string, AnalyticsProvider> = new Map();
  private sessionId: string;
  private userId?: string;
  private consentGiven: boolean = false;
  private eventQueue: AnalyticsEvent[] = [];
  private pageViewQueue: PageViewEvent[] = [];
  private initialized: boolean = false;

  constructor(config: AnalyticsConfig) {
    this.config = config;
    this.sessionId = this.generateSessionId();
    
    // Check for Do Not Track
    if (this.config.respectDoNotTrack && this.isDoNotTrackEnabled()) {
      console.info('Analytics disabled: Do Not Track is enabled');
      return;
    }

    // Initialize providers
    this.initializeProviders();
  }

  private async initializeProviders() {
    for (const provider of this.config.providers) {
      if (this.config.enabledProviders.includes(provider.name)) {
        try {
          await provider.initialize(this.config);
          this.providers.set(provider.name, provider);
        } catch (error) {
          console.error(`Failed to initialize ${provider.name} analytics provider:`, error);
        }
      }
    }
    this.initialized = true;

    // Process queued events if consent was already given
    if (this.consentGiven) {
      this.processEventQueue();
    }
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private isDoNotTrackEnabled(): boolean {
    return navigator.doNotTrack === '1' || 
           (window as any).doNotTrack === '1' || 
           navigator.doNotTrack === 'yes';
  }

  // Consent management
  public setConsent(consent: boolean) {
    this.consentGiven = consent;
    
    if (consent && this.initialized) {
      this.processEventQueue();
    } else if (!consent) {
      // Clear queues and reset providers
      this.eventQueue = [];
      this.pageViewQueue = [];
      this.providers.forEach(provider => provider.reset());
    }

    // Store consent preference
    localStorage.setItem('analytics_consent', consent.toString());
  }

  public getConsent(): boolean {
    if (this.config.cookieConsent) {
      const storedConsent = localStorage.getItem('analytics_consent');
      if (storedConsent !== null) {
        this.consentGiven = storedConsent === 'true';
      }
    } else {
      // If cookie consent is not required, assume consent
      this.consentGiven = true;
    }
    return this.consentGiven;
  }

  // Event tracking
  public trackEvent(eventName: string, properties?: Partial<AnalyticsEvent>) {
    const event: AnalyticsEvent = {
      eventName,
      eventCategory: properties?.eventCategory || 'general',
      eventAction: properties?.eventAction,
      eventLabel: properties?.eventLabel,
      eventValue: properties?.eventValue,
      customProperties: properties?.customProperties,
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId
    };

    if (this.config.debugMode) {
      console.log('Analytics Event:', event);
    }

    if (!this.consentGiven) {
      this.eventQueue.push(event);
      return;
    }

    this.sendEvent(event);
  }

  private sendEvent(event: AnalyticsEvent) {
    this.providers.forEach(provider => {
      try {
        provider.trackEvent(event);
      } catch (error) {
        console.error(`Failed to track event with ${provider.name}:`, error);
      }
    });

    // Also track custom performance metrics if applicable
    if (event.eventCategory === 'performance' && event.eventValue !== undefined) {
      performanceMonitoringService.trackCustomMetric(
        event.eventName as any,
        Date.now() - event.eventValue
      );
    }
  }

  // Page view tracking
  public trackPageView(path: string, title?: string) {
    const pageView: PageViewEvent = {
      path,
      title: title || document.title,
      referrer: document.referrer,
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId
    };

    if (this.config.debugMode) {
      console.log('Page View:', pageView);
    }

    if (!this.consentGiven) {
      this.pageViewQueue.push(pageView);
      return;
    }

    this.sendPageView(pageView);
  }

  private sendPageView(pageView: PageViewEvent) {
    this.providers.forEach(provider => {
      try {
        provider.trackPageView(pageView);
      } catch (error) {
        console.error(`Failed to track page view with ${provider.name}:`, error);
      }
    });
  }

  // User identification
  public identify(userId: string, properties?: Partial<UserProperties>) {
    this.userId = userId;
    
    const userProperties: UserProperties = {
      userId,
      ...properties
    };

    this.providers.forEach(provider => {
      try {
        provider.setUserId(userId);
        if (properties) {
          provider.setUserProperties(userProperties);
        }
      } catch (error) {
        console.error(`Failed to identify user with ${provider.name}:`, error);
      }
    });
  }

  // Process queued events
  private processEventQueue() {
    // Process events
    const events = [...this.eventQueue];
    this.eventQueue = [];
    events.forEach(event => this.sendEvent(event));

    // Process page views
    const pageViews = [...this.pageViewQueue];
    this.pageViewQueue = [];
    pageViews.forEach(pageView => this.sendPageView(pageView));
  }

  // Specific event tracking methods
  public trackRepositoryView(repositoryName: string, repositoryId: string) {
    this.trackEvent('repository_viewed', {
      eventCategory: 'repository',
      eventAction: 'view',
      eventLabel: repositoryName,
      customProperties: {
        repositoryId,
        repositoryName
      }
    });
  }

  public trackApiAccess(apiType: string, repositoryName: string, endpoint?: string) {
    this.trackEvent('api_accessed', {
      eventCategory: 'api',
      eventAction: 'access',
      eventLabel: apiType,
      customProperties: {
        apiType,
        repositoryName,
        endpoint
      }
    });
  }

  public trackSearch(query: string, resultCount: number, searchType: string = 'global') {
    this.trackEvent('search_performed', {
      eventCategory: 'search',
      eventAction: searchType,
      eventLabel: query,
      eventValue: resultCount,
      customProperties: {
        query,
        resultCount,
        searchType
      }
    });
  }

  public trackDownload(fileName: string, fileType: string, repositoryName?: string) {
    this.trackEvent('file_downloaded', {
      eventCategory: 'download',
      eventAction: fileType,
      eventLabel: fileName,
      customProperties: {
        fileName,
        fileType,
        repositoryName
      }
    });
  }

  public trackError(error: Error, context?: Record<string, any>) {
    this.trackEvent('error_occurred', {
      eventCategory: 'error',
      eventAction: error.name,
      eventLabel: error.message,
      customProperties: {
        stack: error.stack,
        context
      }
    });
  }

  public trackAuthEvent(action: 'login' | 'logout' | 'signup', method?: string) {
    this.trackEvent(`auth_${action}`, {
      eventCategory: 'authentication',
      eventAction: action,
      eventLabel: method,
      customProperties: {
        method
      }
    });
  }

  public trackInteraction(element: string, action: string, value?: string) {
    this.trackEvent('ui_interaction', {
      eventCategory: 'interaction',
      eventAction: action,
      eventLabel: element,
      customProperties: {
        element,
        action,
        value
      }
    });
  }

  // Session management
  public startNewSession() {
    this.sessionId = this.generateSessionId();
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  // Reset analytics (for logout)
  public reset() {
    this.userId = undefined;
    this.startNewSession();
    this.providers.forEach(provider => provider.reset());
  }
}

// Export singleton instance (will be configured in the app initialization)
let analyticsService: AnalyticsService | null = null;

export const initializeAnalytics = (config: AnalyticsConfig): AnalyticsService => {
  analyticsService = new AnalyticsService(config);
  return analyticsService;
};

export const getAnalytics = (): AnalyticsService => {
  if (!analyticsService) {
    throw new Error('Analytics service not initialized. Call initializeAnalytics first.');
  }
  return analyticsService;
};

export default AnalyticsService;