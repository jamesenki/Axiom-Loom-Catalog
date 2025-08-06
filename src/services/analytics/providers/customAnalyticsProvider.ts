/**
 * Custom Analytics Provider
 * 
 * Implements internal analytics tracking with local storage and backend sync
 */

import { AnalyticsProvider, AnalyticsEvent, PageViewEvent, UserProperties } from '../analyticsService';

export interface CustomAnalyticsConfig {
  endpoint?: string;
  batchSize?: number;
  flushInterval?: number; // in milliseconds
  maxRetries?: number;
  storageKey?: string;
  enableLocalStorage?: boolean;
}

interface StoredEvent {
  type: 'event' | 'pageview';
  data: AnalyticsEvent | PageViewEvent;
  retryCount: number;
}

export class CustomAnalyticsProvider implements AnalyticsProvider {
  name = 'custom-analytics';
  private config: CustomAnalyticsConfig;
  private eventBuffer: StoredEvent[] = [];
  private flushTimer?: NodeJS.Timeout;
  private userId?: string;
  private userProperties?: UserProperties;

  constructor() {
    this.config = {
      batchSize: 10,
      flushInterval: 30000, // 30 seconds
      maxRetries: 3,
      storageKey: 'ey_analytics_buffer',
      enableLocalStorage: true
    };
  }

  async initialize(config: CustomAnalyticsConfig): Promise<void> {
    this.config = { ...this.config, ...config };

    // Load any stored events from local storage
    if (this.config.enableLocalStorage) {
      this.loadStoredEvents();
    }

    // Start the flush timer
    this.startFlushTimer();

    // Flush on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.flush(true); // Synchronous flush
      });
    }
  }

  private loadStoredEvents() {
    try {
      const stored = localStorage.getItem(this.config.storageKey!);
      if (stored) {
        const events = JSON.parse(stored) as StoredEvent[];
        this.eventBuffer = events.filter(e => e.retryCount < this.config.maxRetries!);
        localStorage.removeItem(this.config.storageKey!);
      }
    } catch (error) {
      console.error('Failed to load stored analytics events:', error);
    }
  }

  private saveEventsToStorage() {
    if (!this.config.enableLocalStorage) return;

    try {
      localStorage.setItem(this.config.storageKey!, JSON.stringify(this.eventBuffer));
    } catch (error) {
      console.error('Failed to save analytics events to storage:', error);
    }
  }

  private startFlushTimer() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.flushInterval!);
  }

  trackEvent(event: AnalyticsEvent): void {
    const enrichedEvent = {
      ...event,
      userId: event.userId || this.userId,
      userProperties: this.userProperties,
      clientTimestamp: Date.now(),
      pageUrl: window.location.href,
      userAgent: navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      referrer: document.referrer
    };

    this.eventBuffer.push({
      type: 'event',
      data: enrichedEvent,
      retryCount: 0
    });

    // Check if we should flush
    if (this.eventBuffer.length >= this.config.batchSize!) {
      this.flush();
    }
  }

  trackPageView(pageView: PageViewEvent): void {
    const enrichedPageView = {
      ...pageView,
      userId: pageView.userId || this.userId,
      userProperties: this.userProperties,
      clientTimestamp: Date.now(),
      userAgent: navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language,
      platform: navigator.platform
    };

    this.eventBuffer.push({
      type: 'pageview',
      data: enrichedPageView,
      retryCount: 0
    });

    // Check if we should flush
    if (this.eventBuffer.length >= this.config.batchSize!) {
      this.flush();
    }
  }

  setUserProperties(properties: UserProperties): void {
    this.userProperties = properties;
    
    // Track user properties update as an event
    this.trackEvent({
      eventName: 'user_properties_updated',
      eventCategory: 'user',
      customProperties: properties as any
    });
  }

  setUserId(userId: string): void {
    this.userId = userId;
  }

  reset(): void {
    // Flush any remaining events
    this.flush(true);
    
    // Clear user data
    this.userId = undefined;
    this.userProperties = undefined;
    
    // Clear event buffer
    this.eventBuffer = [];
    
    // Clear stored events
    if (this.config.enableLocalStorage) {
      localStorage.removeItem(this.config.storageKey!);
    }
  }

  private async flush(synchronous: boolean = false): Promise<void> {
    if (this.eventBuffer.length === 0) return;

    const eventsToSend = [...this.eventBuffer];
    this.eventBuffer = [];

    if (!this.config.endpoint) {
      // If no endpoint configured, just log to console in debug mode
      if (process.env.NODE_ENV === 'development') {
        console.log('Analytics Events:', eventsToSend);
      }
      return;
    }

    try {
      const payload = {
        events: eventsToSend.map(e => e.data),
        metadata: {
          sessionId: (eventsToSend[0]?.data as any)?.sessionId,
          timestamp: Date.now(),
          source: 'web'
        }
      };

      if (synchronous) {
        // Use sendBeacon for synchronous sending on page unload
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        navigator.sendBeacon(this.config.endpoint, blob);
      } else {
        // Regular async fetch
        const response = await fetch(this.config.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`Analytics API error: ${response.status}`);
        }
      }
    } catch (error) {
      console.error('Failed to send analytics events:', error);
      
      // Re-add events to buffer with incremented retry count
      eventsToSend.forEach(event => {
        if (event.retryCount < this.config.maxRetries!) {
          event.retryCount++;
          this.eventBuffer.push(event);
        }
      });

      // Save to local storage for retry
      this.saveEventsToStorage();
    }
  }

  // Additional methods for getting analytics data locally
  public getLocalAnalytics(): {
    totalEvents: number;
    eventsByCategory: Record<string, number>;
    pageViews: number;
    uniquePages: string[];
  } {
    const storedEvents = this.getAllStoredEvents();
    
    const analytics = {
      totalEvents: 0,
      eventsByCategory: {} as Record<string, number>,
      pageViews: 0,
      uniquePages: [] as string[]
    };

    storedEvents.forEach(event => {
      if (event.type === 'event') {
        analytics.totalEvents++;
        const category = (event.data as AnalyticsEvent).eventCategory;
        analytics.eventsByCategory[category] = (analytics.eventsByCategory[category] || 0) + 1;
      } else if (event.type === 'pageview') {
        analytics.pageViews++;
        const path = (event.data as PageViewEvent).path;
        if (!analytics.uniquePages.includes(path)) {
          analytics.uniquePages.push(path);
        }
      }
    });

    return analytics;
  }

  private getAllStoredEvents(): StoredEvent[] {
    const events = [...this.eventBuffer];
    
    // Also check local storage
    if (this.config.enableLocalStorage) {
      try {
        const stored = localStorage.getItem(this.config.storageKey!);
        if (stored) {
          events.push(...JSON.parse(stored));
        }
      } catch (error) {
        console.error('Failed to read stored events:', error);
      }
    }

    return events;
  }
}

// Factory function
export const createCustomAnalyticsProvider = (config?: CustomAnalyticsConfig): CustomAnalyticsProvider => {
  const provider = new CustomAnalyticsProvider();
  // Note: initialization will be called by the analytics service
  return provider;
};