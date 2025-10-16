/**
 * Google Analytics Provider
 * 
 * Implements the AnalyticsProvider interface for Google Analytics 4 (GA4)
 */

import { AnalyticsProvider, AnalyticsEvent, PageViewEvent, UserProperties } from '../analyticsService';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export interface GoogleAnalyticsConfig {
  measurementId: string;
  debugMode?: boolean;
  anonymizeIp?: boolean;
  cookieDomain?: string;
  cookieExpires?: number;
  cookieFlags?: string;
}

export class GoogleAnalyticsProvider implements AnalyticsProvider {
  name = 'google-analytics';
  private config?: GoogleAnalyticsConfig;
  private initialized = false;

  async initialize(config: GoogleAnalyticsConfig): Promise<void> {
    this.config = config;

    if (!config.measurementId) {
      throw new Error('Google Analytics measurement ID is required');
    }

    // Check if gtag is already loaded
    if (window.gtag) {
      this.initialized = true;
      this.configureGtag();
      return;
    }

    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${config.measurementId}`;
    
    return new Promise((resolve, reject) => {
      script.onload = () => {
        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        window.gtag = function() {
          window.dataLayer!.push(arguments);
        };
        window.gtag('js', new Date());
        
        this.configureGtag();
        this.initialized = true;
        resolve();
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load Google Analytics script'));
      };
      
      document.head.appendChild(script);
    });
  }

  private configureGtag() {
    if (!window.gtag || !this.config) return;

    const configOptions: any = {
      page_path: window.location.pathname,
      debug_mode: this.config.debugMode
    };

    if (this.config.anonymizeIp) {
      configOptions.anonymize_ip = true;
    }

    if (this.config.cookieDomain) {
      configOptions.cookie_domain = this.config.cookieDomain;
    }

    if (this.config.cookieExpires) {
      configOptions.cookie_expires = this.config.cookieExpires;
    }

    if (this.config.cookieFlags) {
      configOptions.cookie_flags = this.config.cookieFlags;
    }

    window.gtag('config', this.config.measurementId, configOptions);
  }

  trackEvent(event: AnalyticsEvent): void {
    if (!this.initialized || !window.gtag) {
      console.warn('Google Analytics not initialized');
      return;
    }

    const eventData: any = {
      event_category: event.eventCategory,
      event_label: event.eventLabel,
      value: event.eventValue
    };

    // Add custom properties
    if (event.customProperties) {
      Object.keys(event.customProperties).forEach(key => {
        // GA4 has specific naming conventions for custom parameters
        const paramName = key.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
        eventData[paramName] = event.customProperties![key];
      });
    }

    // Add user and session data
    if (event.userId) {
      eventData.user_id = event.userId;
    }

    if (event.sessionId) {
      eventData.session_id = event.sessionId;
    }

    window.gtag('event', event.eventAction || event.eventName, eventData);
  }

  trackPageView(pageView: PageViewEvent): void {
    if (!this.initialized || !window.gtag) {
      console.warn('Google Analytics not initialized');
      return;
    }

    const pageViewData: any = {
      page_path: pageView.path,
      page_title: pageView.title,
      page_location: window.location.href
    };

    if (pageView.referrer) {
      pageViewData.page_referrer = pageView.referrer;
    }

    if (pageView.userId) {
      pageViewData.user_id = pageView.userId;
    }

    if (pageView.sessionId) {
      pageViewData.session_id = pageView.sessionId;
    }

    window.gtag('event', 'page_view', pageViewData);
  }

  setUserProperties(properties: UserProperties): void {
    if (!this.initialized || !window.gtag) {
      console.warn('Google Analytics not initialized');
      return;
    }

    const userProperties: any = {};

    if (properties.email) {
      // Don't send PII to GA directly, use a hashed version
      userProperties.user_email_hash = this.hashString(properties.email);
    }

    if (properties.role) {
      userProperties.user_role = properties.role;
    }

    if (properties.organizationId) {
      userProperties.organization_id = properties.organizationId;
    }

    if (properties.customProperties) {
      Object.keys(properties.customProperties).forEach(key => {
        const propName = `user_${key.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase()}`;
        userProperties[propName] = properties.customProperties![key];
      });
    }

    window.gtag('set', { user_properties: userProperties });
  }

  setUserId(userId: string): void {
    if (!this.initialized || !window.gtag) {
      console.warn('Google Analytics not initialized');
      return;
    }

    window.gtag('config', this.config!.measurementId, {
      user_id: userId
    });
  }

  reset(): void {
    if (!this.initialized || !window.gtag) {
      return;
    }

    // Reset user ID
    window.gtag('config', this.config!.measurementId, {
      user_id: null
    });

    // Clear user properties
    window.gtag('set', { user_properties: null });
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }
}

// Factory function
export const createGoogleAnalyticsProvider = (config: GoogleAnalyticsConfig): GoogleAnalyticsProvider => {
  const provider = new GoogleAnalyticsProvider();
  // Note: initialization will be called by the analytics service
  return provider;
};